
import os, json, numpy as np, torch, torch.nn as nn, torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import rasterio
from rasterio.windows import Window
import segmentation_models_pytorch as smp
import albumentations as A
from tqdm.auto import tqdm
import random, gc, time, shutil, multiprocessing, warnings
from concurrent.futures import ThreadPoolExecutor, as_completed

# ==================== CONFIG ====================
INPUT_FOLDER  = "/workspace/Minesight_5k"
OUTPUT_FOLDER = "/workspace/MineSight_Dataset"
MODEL_FOLDER  = f"{OUTPUT_FOLDER}/models"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

PATCH_SIZE = 320
STRIDE = 160
FEATURE_BANDS = 16
MASK_BAND = 17
MIN_COAL_PIXELS = 50
MAX_COAL_PATCHES, MAX_NONCOAL_PATCHES = 2500, 2500
TOTAL_TARGET_PATCHES = 5000
BATCH_SIZE_STAGE1, BATCH_SIZE_STAGE2 = 20, 10
EPOCHS_STAGE1, EPOCHS_STAGE2 = 15, 25
LR_STAGE1, LR_STAGE2 = 3e-3, 1e-4
USE_AMP, NUM_WORKERS = True, 4
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

print(f"\n{'='*70}\nMineSight-AI | 18-Band Optimized | RTX 6000 Ada\n{'='*70}")
print(f"Device: {DEVICE} | Patch size: {PATCH_SIZE} | Overlap: 50%\n")

# ==================== OPTIMIZATION SETUP ====================
print("⚙️  Applying GDAL & RasterIO optimizations...")
os.environ["GDAL_CACHEMAX"] = "2048"
os.environ["GDAL_NUM_THREADS"] = "ALL_CPUS"
os.environ["OMP_NUM_THREADS"] = str(multiprocessing.cpu_count())
warnings.filterwarnings("ignore", category=UserWarning, module="rasterio")
os.environ["CPL_LOG"] = "/dev/null"

tif_files_input = sorted([
    os.path.join(INPUT_FOLDER, f)
    for f in os.listdir(INPUT_FOLDER)
    if f.endswith('.tif')
])
print(f"✓ Found {len(tif_files_input)} GeoTIFFs\n")

# ==================== PATCH EXTRACTION (THREAD-SAFE) ====================
def extract_patches_targeted(tif_path, patch_size=320, stride=160,
                             feature_bands=16, mask_band=17, min_coal_pixels=50):
    coal_patches, noncoal_patches = [], []
    try:
        with rasterio.open(tif_path) as src:
            height, width = src.height, src.width
            for y in range(0, height - patch_size + 1, stride):
                for x in range(0, width - patch_size + 1, stride):
                    window = Window(x, y, patch_size, patch_size)
                    mask = src.read(mask_band, window=window)
                    coal_pixels = (mask > 0).sum()
                    if coal_pixels >= min_coal_pixels:
                        img = src.read(list(range(1, feature_bands + 1)), window=window)
                        coal_patches.append({
                            'img': img, 'mask': mask, 'has_coal': True,
                            'coal_pixels': int(coal_pixels),
                            'source': os.path.basename(tif_path), 'x': x, 'y': y
                        })
                    elif np.random.rand() < 0.12:
                        img = src.read(list(range(1, feature_bands + 1)), window=window)
                        noncoal_patches.append({
                            'img': img, 'mask': mask, 'has_coal': False,
                            'coal_pixels': int(coal_pixels),
                            'source': os.path.basename(tif_path), 'x': x, 'y': y
                        })
    except Exception as e:
        print(f"⚠️  Error in {tif_path}: {e}")
    return coal_patches, noncoal_patches


print("🚀 Running parallel patch extraction (Thread-safe mode)...")

all_coal, all_noncoal = [], []
with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(extract_patches_targeted, tif): tif for tif in tif_files_input}
    for f in tqdm(as_completed(futures), total=len(futures), desc="Extracting GeoTIFFs"):
        coal, noncoal = f.result()
        all_coal.extend(coal)
        all_noncoal.extend(noncoal)

print(f"\n✓ Extracted {len(all_coal)} coal and {len(all_noncoal)} non-coal patches")

# Balance dataset
all_coal = random.sample(all_coal, min(len(all_coal), MAX_COAL_PATCHES))
all_noncoal = random.sample(all_noncoal, min(len(all_noncoal), MAX_NONCOAL_PATCHES))
balanced_patches = all_coal + all_noncoal
random.shuffle(balanced_patches)
print(f"✓ Final dataset: {len(balanced_patches)} (coal={len(all_coal)}, non-coal={len(all_noncoal)})")

# ==================== PATCH SAVING ====================
metadata = {'patches': []}
print("\n💾 Saving patches to disk (fast mode)...")

for idx, p in enumerate(tqdm(balanced_patches)):
    name = f"patch_{idx:05d}.tif"
    path = os.path.join(OUTPUT_FOLDER, name)
    with rasterio.open(tif_files_input[0]) as src:
        profile = src.profile.copy()
    profile.update({
        'height': PATCH_SIZE,
        'width': PATCH_SIZE,
        'count': FEATURE_BANDS + 1,
        'compress': None,
        'tiled': True
    })
    with rasterio.open(path, 'w', **profile) as dst:
        for b in range(FEATURE_BANDS):
            dst.write(p['img'][b, :, :], b + 1)
        dst.write(p['mask'], FEATURE_BANDS + 1)
    metadata['patches'].append({
        'filename': name,
        'has_coal': p['has_coal'],
        'coal_pixels': p['coal_pixels'],
        'source': p['source'],
        'x': p['x'],
        'y': p['y']
    })

with open(f"{OUTPUT_FOLDER}/patches_metadata.json", 'w') as f:
    json.dump(metadata, f, indent=2)

# ==================== BAND STATS ====================
print("\n📊 Computing band statistics...")
subset = random.sample(balanced_patches, min(500, len(balanced_patches)))
means = np.mean([p['img'] for p in subset], axis=(0, 2, 3))
stds = np.std([p['img'] for p in subset], axis=(0, 2, 3))
with open(f"{OUTPUT_FOLDER}/band_statistics.json", 'w') as f:
    json.dump({'means': means.tolist(), 'stds': stds.tolist()}, f, indent=2)

# ==================== CLEANUP ====================
print("\n🧹 Cleaning raw dataset to save space...")
try:
    shutil.rmtree(INPUT_FOLDER)
    print(f"✓ Deleted raw dataset: {INPUT_FOLDER}")
except Exception as e:
    print("⚠ Could not delete dataset:", e)
gc.collect(); torch.cuda.empty_cache()

# ==================== DATASET & TRAINING ====================
class FastCoalDataset(Dataset):
    def _init_(self, tif_files, means, stds, augment=False):
        self.files, self.means, self.stds, self.augment = tif_files, means, stds, augment
        self.transform = A.Compose([
            A.RandomRotate90(p=0.5), A.HorizontalFlip(p=0.5),
            A.VerticalFlip(p=0.5), A.RandomBrightnessContrast(0.15, 0.15, p=0.3)
        ]) if augment else None
    def _len_(self): return len(self.files)
    def _getitem_(self, idx):
        with rasterio.open(self.files[idx]) as src:
            img = src.read()
        mask = img[FEATURE_BANDS]; img = img[:FEATURE_BANDS]
        img = np.moveaxis(img, 0, -1).astype('float32')
        img = (img - self.means) / (self.stds + 1e-8)
        mask = (mask > 0).astype('float32')
        if self.transform:
            out = self.transform(image=img, mask=mask)
            img, mask = out['image'], out['mask']
        img = torch.from_numpy(np.moveaxis(img, -1, 0))
        mask = torch.from_numpy(mask).unsqueeze(0)
        return img, mask


def build_fast_model():
    return smp.Unet("efficientnet-b0", encoder_weights="imagenet",
                    in_channels=FEATURE_BANDS, classes=1, activation=None)


def train_stage_ultra(tif_files, means, stds, stage_name, batch_size, epochs, lr, model=None):
    print(f"\n{'='*70}\nTRAINING: {stage_name.upper()}\n{'='*70}")
    random.shuffle(tif_files)
    split = int(0.85 * len(tif_files))
    train_ds = FastCoalDataset(tif_files[:split], means, stds, True)
    val_ds = FastCoalDataset(tif_files[split:], means, stds)
    train_loader = DataLoader(train_ds, batch_size, shuffle=True, num_workers=NUM_WORKERS, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size, shuffle=False, num_workers=NUM_WORKERS, pin_memory=True)
    if model is None: model = build_fast_model()
    model = model.to(DEVICE)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.OneCycleLR(optimizer, max_lr=lr, epochs=epochs, steps_per_epoch=len(train_loader))
    scaler = torch.cuda.amp.GradScaler()
    best_iou, best_ckpt = 0, None
    for epoch in range(epochs):
        model.train(); train_loss = 0
        for imgs, masks in tqdm(train_loader, desc=f"{stage_name} E{epoch+1}/{epochs}"):
            imgs, masks = imgs.to(DEVICE), masks.to(DEVICE)
            optimizer.zero_grad(set_to_none=True)
            with torch.cuda.amp.autocast():
                preds = model(imgs)
                loss = criterion(preds, masks)
            scaler.scale(loss).backward()
            scaler.step(optimizer); scaler.update(); scheduler.step()
            train_loss += loss.item()
        if (epoch+1)%3==0 or epoch==epochs-1:
            model.eval(); val_iou = 0
            with torch.no_grad():
                for imgs, masks in val_loader:
                    imgs, masks = imgs.to(DEVICE), masks.to(DEVICE)
                    with torch.cuda.amp.autocast():
                        preds = torch.sigmoid(model(imgs))
                    preds_bin = (preds>0.5).float()
                    inter = (preds_bin*masks).sum(); union = (preds_bin+masks).clamp(0,1).sum()
                    val_iou += (inter/(union+1e-7)).item()
            val_iou /= len(val_loader)
            print(f"Epoch {epoch+1}: Loss={train_loss/len(train_loader):.4f}, IoU={val_iou:.4f}")
            if val_iou>best_iou:
                best_iou=val_iou; best_ckpt=f"{MODEL_FOLDER}/{stage_name}_best.pt"
                torch.save({'model':model.state_dict(),'iou':val_iou}, best_ckpt)
                print(f"✓ New best model (IoU={val_iou:.4f})")
    return model,best_ckpt,best_iou


# ==================== TRAINING EXECUTION ====================
with open(f"{OUTPUT_FOLDER}/patches_metadata.json") as f: meta=json.load(f)
with open(f"{OUTPUT_FOLDER}/band_statistics.json") as f: stats=json.load(f)
tif_files=[os.path.join(OUTPUT_FOLDER,p['filename']) for p in meta['patches']]
means,stds=np.array(stats['means']),np.array(stats['stds'])

model,ckpt1,iou1=train_stage_ultra(tif_files,means,stds,"stage1",BATCH_SIZE_STAGE1,EPOCHS_STAGE1,LR_STAGE1)
model.load_state_dict(torch.load(ckpt1)['model'])
model,ckpt2,iou2=train_stage_ultra(tif_files,means,stds,"stage2",BATCH_SIZE_STAGE2,EPOCHS_STAGE2,LR_STAGE2,model)

print(f"\n✅ Training complete | Stage1 IoU={iou1:.4f} | Stage2 IoU={iou2:.4f}")