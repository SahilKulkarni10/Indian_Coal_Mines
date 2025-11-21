# 🪨 CoalSight AI: Platform for Resource Mapping in Indian Coal Mines.

<div align="center">

![CoalSight AI](https://img.shields.io/badge/CoalSight-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch)

**An intelligent web application that visualizes existing coal mines and AI-predicted coal deposit zones across India using deep learning and satellite imagery analysis.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [ML Model](#-ml-model) • [API](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [ML Model](#-ml-model)
- [API Reference](#-api-reference)
- [Components](#-components)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CoalSight AI** is a comprehensive geospatial intelligence platform that combines:
- **Interactive Mapping**: Visualize existing coal mines and AI-predicted zones on an interactive map
- **Deep Learning**: U-Net based segmentation model trained on 18-band satellite imagery
- **Real-time Analytics**: Dashboard with statistics, confidence histograms, and state-wise distributions
- **AI Chatbot**: Natural language interface powered by Google Gemini AI for querying mine data
- **Carbon Credit Trading**: Integrated marketplace for carbon credit transactions
- **PDF Reports**: Generate detailed analytical reports with maps and statistics

The system processes multi-spectral satellite imagery to identify potential coal deposits with high accuracy, helping in resource exploration and environmental planning.

---

## ✨ Features

### 🗺️ Interactive Map Visualization
- **Leaflet-based mapping** with OpenStreetMap tiles
- **Dual-layer system**: Existing mines (markers) and predicted zones (polygons)
- **Color-coded confidence levels**: Visual representation of prediction certainty
- **State and district filtering**: Narrow down to specific regions
- **Confidence threshold slider**: Adjust minimum confidence for displayed predictions
- **Layer toggles**: Show/hide existing mines, surface deposits, and underground deposits

### 🤖 AI-Powered Features
- **Deep Learning Model**: U-Net architecture with EfficientNet-B0 encoder
- **18-band Satellite Analysis**: Processes multi-spectral imagery including thermal bands
- **Confidence Scoring**: Each prediction includes a confidence score (0-1)
- **Gemini AI Chatbot**: Natural language queries about mines and deposits
  - "Show me coal mines in Jharkhand"
  - "What's the confidence level for underground deposits?"
  - "Filter by high confidence predictions"

### 📊 Analytics Dashboard
- **Real-time Statistics**:
  - Total known mines count
  - Total predicted zones count
  - Overlap statistics between known and predicted
  - Average thermal anomaly readings
- **Confidence Histogram**: Distribution of prediction confidence levels
- **State Distribution Chart**: Comparative analysis of known vs predicted deposits by state
- **Filtered Counts**: Dynamic updates based on active filters

### 💰 Carbon Credit Trading Platform
- **Marketplace**: Buy and sell carbon credits from coal mine projects
- **Portfolio Management**: Track owned credits and transactions
- **Verification System**: Credits marked as verified, pending, or rejected
- **Transaction History**: Complete audit trail of all trades
- **Real-time Pricing**: Dynamic pricing based on market conditions

### 📄 PDF Report Generation
- **Comprehensive Reports**: Include maps, statistics, and analysis
- **Customizable**: Filter by state, confidence, and mine type
- **Professional Layout**: Charts, tables, and formatted data
- **Export Ready**: Download reports for presentations and documentation

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**: Modern UI library with hooks
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool and dev server
- **Leaflet 1.9.4**: Interactive mapping library
- **React-Leaflet 5.0.0**: React bindings for Leaflet
- **Recharts 3.3.0**: Data visualization and charting
- **jsPDF 3.0.3**: PDF generation
- **TailwindCSS**: Utility-first CSS framework (via inline styles)

### AI & Backend Services
- **GeoJSON 0.5.0**: Geographic data format

### Machine Learning (Python)
- **PyTorch 2.0+**: Deep learning framework
- **Segmentation Models PyTorch 0.3.3**: Pre-built segmentation architectures
- **Rasterio 1.3.0**: Geospatial raster data I/O
- **GDAL 3.6.0**: Geospatial data abstraction library
- **Albumentations 1.3.0**: Image augmentation
- **NumPy 1.24.0+**: Numerical computing

---

## 📁 Project Structure

```
indian-coal-mines/
├── 📄 App.tsx                      # Main application component
├── 📄 index.tsx                    # Application entry point
├── 📄 index.html                   # HTML template
├── 📄 types.ts                     # TypeScript type definitions
├── 📄 constants.ts                 # Application constants
├── 📄 vite.config.ts              # Vite configuration
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 package.json                # Node dependencies
├── 📄 .env                        # Environment variables (API keys)
│
├── 📂 components/                 # React components
│   ├── Header.tsx                # Application header
│   ├── MapComponent.tsx          # Interactive map
│   ├── Dashboard.tsx             # Analytics dashboard
│   ├── Legend.tsx                # Map legend
│   ├── Chatbot.tsx               # AI chatbot interface
│   └── CarbonCreditTrading.tsx   # Carbon credit marketplace
│
├── 📂 services/                   # Business logic & data services
│   ├── mineDataService.ts        # Mine data generation & filtering
│   ├── geminiService.ts          # Google Gemini AI integration
│   ├── carbonCreditService.ts    # Carbon credit data
│   └── pdfReportService.ts       # PDF report generation
│
├── 📂 ML Model/                   # Machine learning pipeline
│   ├── model.py                  # Training script
│   ├── indian-coal-mines.pt      # Trained model weights
│   └── requirements.txt          # Python dependencies
│
└── 📂 dist/                       # Production build output
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ (for ML model training)
- **Google Gemini API Key** (for chatbot features)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd indian-coal-mines
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### ML Model Setup (Optional)

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the model**
   ```bash
   python model.py
   ```

   **Note**: Training requires:
   - CUDA-compatible GPU (recommended: RTX 6000 Ada or similar)
   - 18-band GeoTIFF satellite imagery in `/workspace/Minesight_5k/`
   - ~50GB disk space for dataset processing

---

## 💻 Usage

### Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Using the Interface

#### Map Interaction
- **Pan**: Click and drag the map
- **Zoom**: Use mouse wheel or +/- buttons
- **Click markers**: View details of existing mines
- **Click polygons**: View details of predicted zones

#### Filtering Data
1. **State Filter**: Select a state from the dropdown
2. **Confidence Threshold**: Adjust slider to filter predictions
3. **Layer Toggles**: Show/hide different mine types

#### AI Chatbot
1. Click the chat icon in the bottom-right corner
2. Type natural language queries:
   - "Show coal mines in Odisha"
   - "Filter by confidence above 0.8"
   - "Show only underground deposits"
3. The chatbot will automatically update map filters

#### Carbon Credit Trading
1. Click "Carbon Credits" in the header
2. Browse available credits
3. View your portfolio and transaction history

#### Generate Reports
1. Apply desired filters on the dashboard
2. Click "Generate PDF Report"
3. Report will download automatically

---

## 🧠 ML Model

### Architecture

**U-Net with EfficientNet-B0 Encoder**
- **Input**: 18-band satellite imagery (320×320 patches)
- **Encoder**: Pre-trained EfficientNet-B0 (ImageNet weights)
- **Decoder**: U-Net upsampling path
- **Output**: Binary segmentation mask (coal/no-coal)

### Training Pipeline

#### Data Processing
1. **Patch Extraction**: 
   - 320×320 pixel patches with 50% overlap (stride=160)
   - Targeted sampling: coal patches + 12% random non-coal patches
   - Minimum 50 coal pixels per positive patch

2. **Data Augmentation**:
   - Random 90° rotations
   - Horizontal/vertical flips
   - Brightness/contrast adjustments (±15%)

3. **Normalization**:
   - Per-band mean/std normalization
   - Statistics computed from 500 random samples

#### Training Strategy

**Two-Stage Training**:

**Stage 1: Rapid Learning**
- Batch size: 20
- Epochs: 15
- Learning rate: 3e-3
- Optimizer: AdamW with OneCycleLR
- Goal: Quick convergence to good baseline

**Stage 2: Fine-tuning**
- Batch size: 10
- Epochs: 25
- Learning rate: 1e-4
- Optimizer: AdamW with OneCycleLR
- Goal: Refine predictions and improve IoU

**Loss Function**: Binary Cross-Entropy with Logits

**Evaluation Metric**: Intersection over Union (IoU)

### Model Performance

- **Best IoU**: Reported after Stage 2 completion
- **Inference**: Mixed precision (FP16) for faster predictions
- **Hardware**: Optimized for NVIDIA RTX 6000 Ada

### Prediction Output

Each predicted zone includes:
- **Confidence Score**: 0-1 (from sigmoid activation)
- **Zone Type**: Surface or underground (based on depth analysis)
- **Bounding Polygon**: GeoJSON coordinates
- **Thermal Anomaly**: Average thermal signature
- **Area**: Square kilometers

---

## 📚 API Reference

### Data Services

#### `mineDataService.ts`

```typescript
// Get all existing coal mines
getExistingMines(): Promise<ExistingMineFeatureCollection>

// Get AI-predicted zones
getPredictedZones(): Promise<PredictedZoneFeatureCollection>

// Get analytics summary
getAnalyticsSummary(): Promise<AnalyticsData>

// Get list of states
getStates(): Promise<string[]>
```

#### `geminiService.ts`

```typescript
// Send message to Gemini AI chatbot
sendMessage(
  message: string, 
  history: ChatMessage[]
): Promise<{ response: string; action?: AiAction }>
```

#### `carbonCreditService.ts`

```typescript
// Get available carbon credits
getCarbonCredits(): Promise<CarbonCredit[]>

// Get user portfolio
getUserPortfolio(): Promise<UserPortfolio>

// Purchase carbon credits
purchaseCredits(creditId: string, amount: number): Promise<Transaction>
```

#### `pdfReportService.ts`

```typescript
// Generate PDF report
generatePDFReport(
  analytics: AnalyticsData,
  filters: FilterOptions,
  existingMines: ExistingMineFeatureCollection,
  predictedZones: PredictedZoneFeatureCollection
): void
```

### Type Definitions

See `types.ts` for complete type definitions including:
- `ExistingMineProperties`
- `PredictedZoneProperties`
- `AnalyticsData`
- `FilterOptions`
- `CarbonCredit`
- `Transaction`
- `ChatMessage`
- `AiAction`

---

## 🧩 Components

### Core Components

#### `App.tsx`
Main application component managing:
- State management for mines, zones, and analytics
- Filter and layer visibility logic
- Data fetching and error handling
- AI action handling from chatbot

#### `MapComponent.tsx`
Interactive Leaflet map displaying:
- Existing mine markers with popups
- Predicted zone polygons with color-coded confidence
- Custom styling and interactions

#### `Dashboard.tsx`
Analytics sidebar featuring:
- Key statistics cards
- Filter controls (state, confidence)
- Layer toggles
- Confidence histogram
- State distribution chart
- PDF report generation



#### `CarbonCreditTrading.tsx`
Full-featured marketplace:
- Credit listings grid
- Portfolio overview
- Transaction history
- Buy/sell functionality

#### `Header.tsx`
Application header with:
- Branding and title
- Navigation to Carbon Credits

#### `Legend.tsx`
Map legend explaining:
- Existing mine markers
- Predicted zone color coding
- Confidence levels

---

## 🎨 Customization

### Modifying Default Values

Edit `constants.ts`:
```typescript
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.5; // Default: 0.5
```

### Changing Map Tiles

Edit `MapComponent.tsx`:
```typescript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Change to your preferred tile provider
/>
```

### Adjusting Model Parameters

Edit `model.py`:
```python
PATCH_SIZE = 320        # Patch dimensions
STRIDE = 160           # Overlap stride
BATCH_SIZE_STAGE1 = 20 # Training batch size
EPOCHS_STAGE1 = 15     # Number of epochs
```

---

## 🔐 Environment Variables

Create a `.env` file with:

```env
# Google Gemini AI API Key (required for chatbot)
VITE_GEMINI_API_KEY=your_api_key_here
```

**Getting a Gemini API Key**:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste into `.env` file

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain type safety
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenStreetMap** for map tiles
- **Google Gemini AI** for chatbot capabilities
- **Leaflet** for mapping library
- **PyTorch** and **Segmentation Models PyTorch** for ML framework
- **Recharts** for data visualization
- **React** and **Vite** communities

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

---

## 🗺️ Roadmap

- [ ] Real satellite imagery integration
- [ ] Real-time model inference API
- [ ] Multi-user authentication
- [ ] Advanced analytics (time-series analysis)
- [ ] Mobile app version
- [ ] 3D terrain visualization
- [ ] Export to GIS formats (Shapefile, KML)
- [ ] Integration with government databases

---

<div align="center">

**Built with ❤️ for sustainable resource management**

⭐ Star this repo if you find it useful!

</div>
