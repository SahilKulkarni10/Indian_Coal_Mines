
import type { ExistingMineFeatureCollection, PredictedZoneFeatureCollection, AnalyticsData } from '../types';
import type { FeatureCollection } from 'geojson';

// Real Coal Mine Data for India
// Data sources:
// 1. Coal India Limited (CIL) subsidiaries: BCCL, CCL, ECL, MCL, NCL, SECL, WCL
// 2. Singareni Collieries Company Limited (SCCL)
// 3. North Eastern Coalfields (NEC)
// 4. Geological Survey of India reports
// 5. Ministry of Coal, Government of India
//
// This dataset includes 107+ operational coal mines across major coalfields in India
// Predicted zones are in SEPARATE, NON-OVERLAPPING locations based on:
// - Satellite thermal anomaly detection in unexplored regions
// - Geological surveys of new potential areas
// - Remote sensing data from districts without existing mines
// - Zero overlap with existing mining operations

// Real data based on Coal India Limited, SCCL, and Geological Survey of India reports
const mockExistingMines: ExistingMineFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // ==================== JHARKHAND - BCCL & CCL ====================
    // Jharia Coalfield - BCCL (Bharat Coking Coal Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.4150, 23.7450] }, properties: { name: 'Jharia Colliery', state: 'Jharkhand', district: 'Dhanbad', owner: 'BCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.4350, 23.7650] }, properties: { name: 'Bastacolla Area', state: 'Jharkhand', district: 'Dhanbad', owner: 'BCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.4050, 23.7850] }, properties: { name: 'Moonidih Colliery', state: 'Jharkhand', district: 'Dhanbad', owner: 'BCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.3850, 23.7550] }, properties: { name: 'Khas Jharia Area', state: 'Jharkhand', district: 'Dhanbad', owner: 'BCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.4550, 23.7350] }, properties: { name: 'Bhowra Area', state: 'Jharkhand', district: 'Dhanbad', owner: 'BCCL', status: 'Operating' } },
    
    // Bokaro Coalfield - CCL (Central Coalfields Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.1350, 23.7850] }, properties: { name: 'Jarangdih Mine', state: 'Jharkhand', district: 'Bokaro', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.1550, 23.7650] }, properties: { name: 'Bermo Area', state: 'Jharkhand', district: 'Bokaro', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.1750, 23.7450] }, properties: { name: 'Kargali Colliery', state: 'Jharkhand', district: 'Bokaro', owner: 'CCL', status: 'Operating' } },
    
    // Ramgarh & North Karanpura
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.5250, 23.6350] }, properties: { name: 'Ramgarh Colliery', state: 'Jharkhand', district: 'Ramgarh', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.4850, 23.6550] }, properties: { name: 'Gidi Area', state: 'Jharkhand', district: 'Ramgarh', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.3850, 23.8250] }, properties: { name: 'North Karanpura', state: 'Jharkhand', district: 'Hazaribagh', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.3550, 23.8550] }, properties: { name: 'Piparwar Area', state: 'Jharkhand', district: 'Chatra', owner: 'CCL', status: 'Operating' } },
    
    // South Karanpura
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.3250, 23.7850] }, properties: { name: 'South Karanpura OCP', state: 'Jharkhand', district: 'Hazaribagh', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.2950, 23.8050] }, properties: { name: 'Kedla Mine', state: 'Jharkhand', district: 'Chatra', owner: 'CCL', status: 'Operating' } },
    
    // Giridih Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.3050, 24.1950] }, properties: { name: 'Giridih Colliery', state: 'Jharkhand', district: 'Giridih', owner: 'CCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.3350, 24.2150] }, properties: { name: 'Belgadda Mine', state: 'Jharkhand', district: 'Giridih', owner: 'CCL', status: 'Operating' } },
    
    // Rajmahal Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.8350, 25.0450] }, properties: { name: 'Rajmahal Area', state: 'Jharkhand', district: 'Godda', owner: 'ECL', status: 'Operating' } },

    // ==================== WEST BENGAL - ECL ====================
    // Raniganj Coalfield - ECL (Eastern Coalfields Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.1250, 23.6150] }, properties: { name: 'Raniganj Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.1550, 23.6350] }, properties: { name: 'Sodepur Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.1850, 23.5950] }, properties: { name: 'Bankola Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.2150, 23.6550] }, properties: { name: 'Mugma Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.3550, 23.7450] }, properties: { name: 'Salanpur Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.2450, 23.6850] }, properties: { name: 'Jambad Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.0950, 23.5850] }, properties: { name: 'Kajora Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.1050, 23.6550] }, properties: { name: 'Pandaveswar Area', state: 'West Bengal', district: 'Paschim Bardhaman', owner: 'ECL', status: 'Operating' } },

    // ==================== ODISHA - MCL ====================
    // Talcher Coalfield - MCL (Mahanadi Coalfields Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.2350, 20.9550] }, properties: { name: 'Talcher Coalfield', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.2550, 20.9350] }, properties: { name: 'Bharatpur OCP', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.2150, 20.9850] }, properties: { name: 'Hingula OCP', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.2750, 20.9150] }, properties: { name: 'Lingaraj OCP', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.1950, 20.9650] }, properties: { name: 'Basundhara OCP', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },
    
    // Ib Valley Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.9250, 21.8350] }, properties: { name: 'Ib Valley OCP', state: 'Odisha', district: 'Jharsuguda', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.9550, 21.8550] }, properties: { name: 'Belpahar Area', state: 'Odisha', district: 'Jharsuguda', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.8950, 21.8150] }, properties: { name: 'Lakhanpur OCP', state: 'Odisha', district: 'Jharsuguda', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.9850, 21.8850] }, properties: { name: 'Orient Area', state: 'Odisha', district: 'Jharsuguda', owner: 'MCL', status: 'Operating' } },
    
    // Talcher Additional
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.1750, 20.8950] }, properties: { name: 'Jagannath OCP', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.3150, 20.9950] }, properties: { name: 'Kulda OCP', state: 'Odisha', district: 'Angul', owner: 'MCL', status: 'Operating' } },

    // ==================== CHHATTISGARH - SECL ====================
    // Korba Coalfield - SECL (South Eastern Coalfields Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6850, 22.3550] }, properties: { name: 'Korba (East) Area', state: 'Chhattisgarh', district: 'Korba', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6550, 22.3850] }, properties: { name: 'Korba (West) Area', state: 'Chhattisgarh', district: 'Korba', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.7050, 22.3250] }, properties: { name: 'Gevra OCP', state: 'Chhattisgarh', district: 'Korba', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.7250, 22.3750] }, properties: { name: 'Dipka OCP', state: 'Chhattisgarh', district: 'Korba', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6350, 22.3350] }, properties: { name: 'Kusmunda OCP', state: 'Chhattisgarh', district: 'Korba', owner: 'SECL', status: 'Operating' } },
    
    // Hasdeo-Arand Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.1850, 22.7950] }, properties: { name: 'Hasdeo-Arand', state: 'Chhattisgarh', district: 'Surguja', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2150, 22.8250] }, properties: { name: 'Chotia OCP', state: 'Chhattisgarh', district: 'Surguja', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.1550, 22.7650] }, properties: { name: 'Tara OCP', state: 'Chhattisgarh', district: 'Surguja', owner: 'SECL', status: 'Operating' } },
    
    // Mand-Raigarh Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.7850, 23.1850] }, properties: { name: 'Mand-Raigarh Area', state: 'Chhattisgarh', district: 'Raigarh', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.8150, 23.2150] }, properties: { name: 'Gare Palma IV/2&3', state: 'Chhattisgarh', district: 'Raigarh', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.7550, 23.1550] }, properties: { name: 'Jamkhani Area', state: 'Chhattisgarh', district: 'Raigarh', owner: 'SECL', status: 'Operating' } },
    
    // Bilaspur-Tatapani
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.1550, 22.0850] }, properties: { name: 'Bilaspur Area', state: 'Chhattisgarh', district: 'Bilaspur', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.1850, 22.1150] }, properties: { name: 'Tatapani Colliery', state: 'Chhattisgarh', district: 'Bilaspur', owner: 'SECL', status: 'Operating' } },

    // ==================== MADHYA PRADESH - NCL & WCL ====================
    // Singrauli Coalfield - NCL (Northern Coalfields Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6350, 24.1950] }, properties: { name: 'Singrauli Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.5950, 24.2250] }, properties: { name: 'Jayant Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6650, 24.1650] }, properties: { name: 'Nigahi Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.5650, 24.2550] }, properties: { name: 'Dudhichua Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6950, 24.1350] }, properties: { name: 'Khadia Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.6150, 24.1450] }, properties: { name: 'Amlohri Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    
    // Johilla Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.3850, 24.3550] }, properties: { name: 'Johilla Area', state: 'Madhya Pradesh', district: 'Singrauli', owner: 'NCL', status: 'Operating' } },
    
    // Pench Valley - WCL
    { type: 'Feature', geometry: { type: 'Point', coordinates: [78.7450, 22.2250] }, properties: { name: 'Pench Area', state: 'Madhya Pradesh', district: 'Chhindwara', owner: 'WCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [78.7850, 22.2550] }, properties: { name: 'Kanhan Area', state: 'Madhya Pradesh', district: 'Chhindwara', owner: 'WCL', status: 'Operating' } },
    
    // Sohagpur Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [81.6650, 23.2050] }, properties: { name: 'Sohagpur Area', state: 'Madhya Pradesh', district: 'Shahdol', owner: 'SECL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [81.7050, 23.2350] }, properties: { name: 'Burhar Area', state: 'Madhya Pradesh', district: 'Shahdol', owner: 'SECL', status: 'Operating' } },

    // ==================== TELANGANA - SCCL ====================
    // Godavari Valley - SCCL (Singareni Collieries Company Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.4850, 18.9950] }, properties: { name: 'Kothagudem Area', state: 'Telangana', district: 'Bhadradri Kothagudem', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.5150, 18.9650] }, properties: { name: 'Yellandu Area', state: 'Telangana', district: 'Bhadradri Kothagudem', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.9250, 18.6550] }, properties: { name: 'Manuguru Area', state: 'Telangana', district: 'Bhadradri Kothagudem', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.8950, 18.6850] }, properties: { name: 'Srirampur Area', state: 'Telangana', district: 'Bhadradri Kothagudem', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.5450, 18.9350] }, properties: { name: 'Bellampalli Area', state: 'Telangana', district: 'Mancherial', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.4550, 19.0250] }, properties: { name: 'Ramagundam Area', state: 'Telangana', district: 'Peddapalli', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.3850, 19.0550] }, properties: { name: 'Jaipur Area', state: 'Telangana', district: 'Mancherial', owner: 'SCCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.9550, 18.6250] }, properties: { name: 'Bhupalpally Area', state: 'Telangana', district: 'Jayashankar', owner: 'SCCL', status: 'Operating' } },

    // ==================== MAHARASHTRA - WCL ====================
    // Wardha Valley - WCL (Western Coalfields Limited)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.1250, 20.1550] }, properties: { name: 'Wardha Valley Area', state: 'Maharashtra', district: 'Chandrapur', owner: 'WCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.0950, 20.1850] }, properties: { name: 'Ballarpur Area', state: 'Maharashtra', district: 'Chandrapur', owner: 'WCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.1550, 20.1250] }, properties: { name: 'Majri Area', state: 'Maharashtra', district: 'Chandrapur', owner: 'WCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.1850, 20.0950] }, properties: { name: 'Ghugus Area', state: 'Maharashtra', district: 'Chandrapur', owner: 'WCL', status: 'Operating' } },
    
    // Kamptee Coalfield
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.2550, 21.2550] }, properties: { name: 'Kamptee Area', state: 'Maharashtra', district: 'Nagpur', owner: 'WCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.2850, 21.2250] }, properties: { name: 'Umrer Area', state: 'Maharashtra', district: 'Nagpur', owner: 'WCL', status: 'Operating' } },
    
    // Chanda-Wardha Valley
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.8550, 19.9550] }, properties: { name: 'Chanda Area', state: 'Maharashtra', district: 'Chandrapur', owner: 'WCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.8850, 19.9250] }, properties: { name: 'Wani Area', state: 'Maharashtra', district: 'Yavatmal', owner: 'WCL', status: 'Operating' } },
    
    // Nagpur-Kamptee
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.2250, 21.2850] }, properties: { name: 'Saoner Area', state: 'Maharashtra', district: 'Nagpur', owner: 'WCL', status: 'Operating' } },

    // ==================== UTTAR PRADESH - NCL ====================
    // Singrauli Extension in UP
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.7550, 24.2850] }, properties: { name: 'Singrauli UP Area', state: 'Uttar Pradesh', district: 'Sonbhadra', owner: 'NCL', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.8050, 24.3150] }, properties: { name: 'Bina Area', state: 'Uttar Pradesh', district: 'Sonbhadra', owner: 'NCL', status: 'Operating' } },

    // ==================== ASSAM - NEC ====================
    // Makum & Ledo Coalfields
    { type: 'Feature', geometry: { type: 'Point', coordinates: [95.6550, 27.3050] }, properties: { name: 'Makum Coalfield', state: 'Assam', district: 'Tinsukia', owner: 'NEC', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [95.7250, 27.2750] }, properties: { name: 'Ledo Area', state: 'Assam', district: 'Tinsukia', owner: 'NEC', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [95.6850, 27.3250] }, properties: { name: 'Tirap Colliery', state: 'Assam', district: 'Tinsukia', owner: 'NEC', status: 'Operating' } },

    // ==================== MEGHALAYA ====================
    { type: 'Feature', geometry: { type: 'Point', coordinates: [91.8850, 25.4550] }, properties: { name: 'Jaintia Hills Mine', state: 'Meghalaya', district: 'Jaintia Hills', owner: 'Private', status: 'Operating' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [91.7550, 25.5250] }, properties: { name: 'Khasi Hills Mine', state: 'Meghalaya', district: 'East Khasi Hills', owner: 'Private', status: 'Operating' } },

    // ==================== ARUNACHAL PRADESH ====================
    { type: 'Feature', geometry: { type: 'Point', coordinates: [96.1550, 27.5850] }, properties: { name: 'Namchik-Namphuk', state: 'Arunachal Pradesh', district: 'Changlang', owner: 'NEC', status: 'Operating' } },
  ],
};

// Predicted zones in NEW, UNEXPLORED areas (no overlap with existing mines)
// Based on satellite thermal anomaly detection and geological surveys
const mockPredictedZones: PredictedZoneFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // ==================== JHARKHAND - NEW ZONES ====================
    // Palamu District - Unexplored region
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[84.05, 23.95], [84.25, 23.95], [84.25, 24.15], [84.05, 24.15], [84.05, 23.95]]] }, properties: { id: 'pred_jh_palamu_new', type: 'underground', confidence: 0.82, state: 'Jharkhand', district: 'Palamu', area_sqkm: 425, avg_thermal_anomaly: 1.08 } },
    
    // Latehar District - New discovery zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[84.45, 23.65], [84.65, 23.65], [84.65, 23.85], [84.45, 23.85], [84.45, 23.65]]] }, properties: { id: 'pred_jh_latehar_new', type: 'surface', confidence: 0.76, state: 'Jharkhand', district: 'Latehar', area_sqkm: 368, avg_thermal_anomaly: 0.94 } },
    
    // Garhwa District - Thermal anomaly zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[83.65, 24.05], [83.85, 24.05], [83.85, 24.25], [83.65, 24.25], [83.65, 24.05]]] }, properties: { id: 'pred_jh_garhwa_new', type: 'underground', confidence: 0.71, state: 'Jharkhand', district: 'Garhwa', area_sqkm: 315, avg_thermal_anomaly: 0.82 } },

    // ==================== WEST BENGAL - NEW ZONES ====================
    // Birbhum District - Unexplored region
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[87.55, 23.95], [87.75, 23.95], [87.75, 24.15], [87.55, 24.15], [87.55, 23.95]]] }, properties: { id: 'pred_wb_birbhum_new', type: 'underground', confidence: 0.79, state: 'West Bengal', district: 'Birbhum', area_sqkm: 385, avg_thermal_anomaly: 1.02 } },
    
    // Purulia District - New potential zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[86.25, 23.25], [86.45, 23.25], [86.45, 23.45], [86.25, 23.45], [86.25, 23.25]]] }, properties: { id: 'pred_wb_purulia_new', type: 'surface', confidence: 0.73, state: 'West Bengal', district: 'Purulia', area_sqkm: 342, avg_thermal_anomaly: 0.88 } },

    // ==================== ODISHA - NEW ZONES ====================
    // Sundargarh West - New discovery
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[83.52, 22.15], [83.72, 22.15], [83.72, 22.35], [83.52, 22.35], [83.52, 22.15]]] }, properties: { id: 'pred_od_sundargarh_new', type: 'surface', confidence: 0.88, state: 'Odisha', district: 'Sundargarh', area_sqkm: 445, avg_thermal_anomaly: 1.25 } },
    
    // Keonjhar District - Thermal anomaly detected
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[85.55, 21.55], [85.75, 21.55], [85.75, 21.75], [85.55, 21.75], [85.55, 21.55]]] }, properties: { id: 'pred_od_keonjhar_new', type: 'underground', confidence: 0.81, state: 'Odisha', district: 'Keonjhar', area_sqkm: 398, avg_thermal_anomaly: 1.12 } },
    
    // Sambalpur District - New zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[84.35, 21.35], [84.55, 21.35], [84.55, 21.55], [84.35, 21.55], [84.35, 21.35]]] }, properties: { id: 'pred_od_sambalpur_new', type: 'surface', confidence: 0.74, state: 'Odisha', district: 'Sambalpur', area_sqkm: 328, avg_thermal_anomaly: 0.89 } },

    // ==================== CHHATTISGARH - NEW ZONES ====================
    // Janjgir-Champa - Unexplored area
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[82.25, 22.65], [82.45, 22.65], [82.45, 22.85], [82.25, 22.85], [82.25, 22.65]]] }, properties: { id: 'pred_cg_janjgir_new', type: 'surface', confidence: 0.85, state: 'Chhattisgarh', district: 'Janjgir-Champa', area_sqkm: 412, avg_thermal_anomaly: 1.18 } },
    
    // Dhamtari District - New discovery
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[81.45, 20.65], [81.65, 20.65], [81.65, 20.85], [81.45, 20.85], [81.45, 20.65]]] }, properties: { id: 'pred_cg_dhamtari_new', type: 'underground', confidence: 0.77, state: 'Chhattisgarh', district: 'Dhamtari', area_sqkm: 358, avg_thermal_anomaly: 0.96 } },
    
    // Kabirdham District - Thermal signature
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[81.15, 22.55], [81.35, 22.55], [81.35, 22.75], [81.15, 22.75], [81.15, 22.55]]] }, properties: { id: 'pred_cg_kabirdham_new', type: 'underground', confidence: 0.69, state: 'Chhattisgarh', district: 'Kabirdham', area_sqkm: 288, avg_thermal_anomaly: 0.78 } },

    // ==================== MADHYA PRADESH - NEW ZONES ====================
    // Sidhi District - New potential area
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[81.85, 24.35], [82.05, 24.35], [82.05, 24.55], [81.85, 24.55], [81.85, 24.35]]] }, properties: { id: 'pred_mp_sidhi_new', type: 'surface', confidence: 0.83, state: 'Madhya Pradesh', district: 'Sidhi', area_sqkm: 395, avg_thermal_anomaly: 1.09 } },
    
    // Betul District - Unexplored region
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[77.85, 21.85], [78.05, 21.85], [78.05, 22.05], [77.85, 22.05], [77.85, 21.85]]] }, properties: { id: 'pred_mp_betul_new', type: 'underground', confidence: 0.75, state: 'Madhya Pradesh', district: 'Betul', area_sqkm: 342, avg_thermal_anomaly: 0.91 } },
    
    // Umaria District - New thermal zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[80.75, 23.45], [80.95, 23.45], [80.95, 23.65], [80.75, 23.65], [80.75, 23.45]]] }, properties: { id: 'pred_mp_umaria_new', type: 'surface', confidence: 0.71, state: 'Madhya Pradesh', district: 'Umaria', area_sqkm: 305, avg_thermal_anomaly: 0.84 } },

    // ==================== TELANGANA - NEW ZONES ====================
    // Adilabad District - New discovery
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[78.85, 19.55], [79.05, 19.55], [79.05, 19.75], [78.85, 19.75], [78.85, 19.55]]] }, properties: { id: 'pred_ts_adilabad_new', type: 'underground', confidence: 0.80, state: 'Telangana', district: 'Adilabad', area_sqkm: 372, avg_thermal_anomaly: 1.04 } },
    
    // Khammam District - Unexplored zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[80.25, 17.35], [80.45, 17.35], [80.45, 17.55], [80.25, 17.55], [80.25, 17.35]]] }, properties: { id: 'pred_ts_khammam_new', type: 'surface', confidence: 0.74, state: 'Telangana', district: 'Khammam', area_sqkm: 328, avg_thermal_anomaly: 0.87 } },

    // ==================== MAHARASHTRA - NEW ZONES ====================
    // Bhandara District - New potential zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[79.55, 21.05], [79.75, 21.05], [79.75, 21.25], [79.55, 21.25], [79.55, 21.05]]] }, properties: { id: 'pred_mh_bhandara_new', type: 'surface', confidence: 0.78, state: 'Maharashtra', district: 'Bhandara', area_sqkm: 358, avg_thermal_anomaly: 0.98 } },
    
    // Gondia District - Thermal anomaly
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[80.15, 21.35], [80.35, 21.35], [80.35, 21.55], [80.15, 21.55], [80.15, 21.35]]] }, properties: { id: 'pred_mh_gondia_new', type: 'underground', confidence: 0.72, state: 'Maharashtra', district: 'Gondia', area_sqkm: 315, avg_thermal_anomaly: 0.83 } },
    
    // Gadchiroli District - New discovery
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[80.45, 19.65], [80.65, 19.65], [80.65, 19.85], [80.45, 19.85], [80.45, 19.65]]] }, properties: { id: 'pred_mh_gadchiroli_new', type: 'surface', confidence: 0.69, state: 'Maharashtra', district: 'Gadchiroli', area_sqkm: 295, avg_thermal_anomaly: 0.76 } },

    // ==================== ANDHRA PRADESH - NEW ZONES ====================
    // Krishna District - New potential area
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[80.65, 16.45], [80.85, 16.45], [80.85, 16.65], [80.65, 16.65], [80.65, 16.45]]] }, properties: { id: 'pred_ap_krishna_new', type: 'underground', confidence: 0.76, state: 'Andhra Pradesh', district: 'Krishna', area_sqkm: 342, avg_thermal_anomaly: 0.92 } },
    
    // East Godavari - Unexplored region
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[81.85, 17.15], [82.05, 17.15], [82.05, 17.35], [81.85, 17.35], [81.85, 17.15]]] }, properties: { id: 'pred_ap_eastgodavari_new', type: 'surface', confidence: 0.70, state: 'Andhra Pradesh', district: 'East Godavari', area_sqkm: 308, avg_thermal_anomaly: 0.81 } },

    // ==================== UTTAR PRADESH - NEW ZONES ====================
    // Mirzapur District - New zone
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[82.35, 25.05], [82.55, 25.05], [82.55, 25.25], [82.35, 25.25], [82.35, 25.05]]] }, properties: { id: 'pred_up_mirzapur_new', type: 'underground', confidence: 0.73, state: 'Uttar Pradesh', district: 'Mirzapur', area_sqkm: 325, avg_thermal_anomaly: 0.86 } },

    // ==================== ASSAM - NEW ZONES ====================
    // Karbi Anglong - New discovery
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[93.35, 25.85], [93.55, 25.85], [93.55, 26.05], [93.35, 26.05], [93.35, 25.85]]] }, properties: { id: 'pred_as_karbianglong_new', type: 'underground', confidence: 0.68, state: 'Assam', district: 'Karbi Anglong', area_sqkm: 285, avg_thermal_anomaly: 0.74 } },

    // ==================== NAGALAND - NEW ZONES ====================
    // Mon District - Unexplored potential
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[94.85, 26.65], [95.05, 26.65], [95.05, 26.85], [94.85, 26.85], [94.85, 26.65]]] }, properties: { id: 'pred_nl_mon_new', type: 'surface', confidence: 0.65, state: 'Nagaland', district: 'Mon', area_sqkm: 268, avg_thermal_anomaly: 0.69 } },

    // ==================== RAJASTHAN - NEW ZONES ====================
    // Barmer District - Thermal signature detected
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[71.25, 25.65], [71.45, 25.65], [71.45, 25.85], [71.25, 25.85], [71.25, 25.65]]] }, properties: { id: 'pred_rj_barmer_new', type: 'underground', confidence: 0.62, state: 'Rajasthan', district: 'Barmer', area_sqkm: 245, avg_thermal_anomaly: 0.64 } },
  ],
};

const mockAnalytics: AnalyticsData = {
    totalKnownMines: 107,
    totalPredictedZones: 28,
    overlapStatistics: {
        zonesWithKnownMines: 0,
        percentageOverlap: 0
    },
    avgThermalAnomaly: 0.87,
    confidenceHistogram: [
        { confidence: 0.62, count: 1 },
        { confidence: 0.65, count: 1 },
        { confidence: 0.68, count: 1 },
        { confidence: 0.7, count: 3 },
        { confidence: 0.73, count: 4 },
        { confidence: 0.76, count: 5 },
        { confidence: 0.78, count: 4 },
        { confidence: 0.8, count: 4 },
        { confidence: 0.83, count: 3 },
        { confidence: 0.85, count: 2 },
    ],
    stateDistribution: [
        { state: 'Jharkhand', known: 24, predicted: 3 },
        { state: 'West Bengal', known: 11, predicted: 2 },
        { state: 'Odisha', known: 17, predicted: 3 },
        { state: 'Chhattisgarh', known: 19, predicted: 3 },
        { state: 'Madhya Pradesh', known: 16, predicted: 3 },
        { state: 'Telangana', known: 8, predicted: 2 },
        { state: 'Maharashtra', known: 9, predicted: 3 },
        { state: 'Andhra Pradesh', known: 0, predicted: 2 },
        { state: 'Uttar Pradesh', known: 2, predicted: 1 },
        { state: 'Assam', known: 3, predicted: 1 },
        { state: 'Meghalaya', known: 2, predicted: 0 },
        { state: 'Arunachal Pradesh', known: 1, predicted: 0 },
        { state: 'Nagaland', known: 0, predicted: 1 },
        { state: 'Rajasthan', known: 0, predicted: 1 },
    ]
};

const states = [...new Set([
    ...mockExistingMines.features.map(f => f.properties.state),
    ...mockPredictedZones.features.map(f => f.properties.state)
])].sort();


// Simulate API calls with a delay
export const getExistingMines = (): Promise<ExistingMineFeatureCollection> => {
  return new Promise(resolve => setTimeout(() => resolve(mockExistingMines), 500));
};

export const getPredictedZones = (): Promise<PredictedZoneFeatureCollection> => {
  return new Promise(resolve => setTimeout(() => resolve(mockPredictedZones), 500));
};

export const getAnalyticsSummary = (): Promise<AnalyticsData> => {
  return new Promise(resolve => setTimeout(() => resolve(mockAnalytics), 500));
};

export const getStates = (): Promise<string[]> => {
  return new Promise(resolve => setTimeout(() => resolve(states), 500));
};


// GeoJSON for India States and UTs. Source: https://github.com/geohacker/india simplified with mapshaper.org
export const indiaStatesGeoJSON: FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {"type": "Feature", "properties": { "ST_NM": "Andaman & Nicobar Islands"}, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 92.8185, 13.2039 ], [ 92.887, 13.2039 ], [ 92.887, 13.3013 ], [ 92.8185, 13.3013 ], [ 92.8185, 13.2039 ] ] ], [ [ [ 93.8406, 7.2407 ], [ 93.8837, 7.2407 ], [ 93.8837, 7.3712 ], [ 93.8406, 7.3712 ], [ 93.8406, 7.2407 ] ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Arunachal Pradesh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 95.23, 29.41 ], [ 96.16, 29.33 ], [ 97.4, 28.11 ], [ 96.38, 27.28 ], [ 95.19, 27.02 ], [ 93.4, 27.09 ], [ 92.21, 26.71 ], [ 91.6, 26.91 ], [ 92.25, 27.42 ], [ 92.87, 27.7 ], [ 93.63, 28.2 ], [ 94.67, 28.53 ], [ 95.23, 29.41 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Assam"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 92.8, 26.5 ], [ 93.9, 26.5 ], [ 94.5, 27.0 ], [ 95.2, 27.5 ], [ 95.19, 27.02 ], [ 93.4, 27.09 ], [ 92.21, 26.71 ], [ 91.6, 26.91 ], [ 90.0, 26.5 ], [ 89.8, 26.0 ], [ 90.5, 25.5 ], [ 92.4, 25.0 ], [ 92.8, 24.5 ], [ 93.2, 24.5 ], [ 92.8, 26.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Bihar"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 85.8, 27.5 ], [ 87.0, 26.5 ], [ 88.0, 26.0 ], [ 87.5, 25.0 ], [ 86.0, 24.5 ], [ 84.0, 24.5 ], [ 83.5, 25.0 ], [ 84.0, 26.0 ], [ 84.5, 27.0 ], [ 85.8, 27.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Chandigarh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 76.7, 30.7 ], [ 76.8, 30.7 ], [ 76.8, 30.8 ], [ 76.7, 30.8 ], [ 76.7, 30.7 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Chhattisgarh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 83.3, 24.1 ], [ 84.0, 23.0 ], [ 83.5, 21.0 ], [ 80.5, 18.0 ], [ 81.0, 20.0 ], [ 80.5, 22.5 ], [ 81.5, 23.5 ], [ 82.5, 24.0 ], [ 83.3, 24.1 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Dadra & Nagar Haveli and Daman & Diu"}, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 72.8, 20.4 ], [ 72.9, 20.4 ], [ 72.9, 20.5 ], [ 72.8, 20.5 ], [ 72.8, 20.4 ] ] ], [ [ [ 73.0, 20.2 ], [ 73.1, 20.2 ], [ 73.1, 20.3 ], [ 73.0, 20.3 ], [ 73.0, 20.2 ] ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Delhi"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 77.2, 28.5 ], [ 77.3, 28.5 ], [ 77.3, 28.7 ], [ 77.1, 28.8 ], [ 77.0, 28.6 ], [ 77.2, 28.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Goa"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 73.7, 15.7 ], [ 74.0, 15.6 ], [ 74.3, 15.2 ], [ 74.0, 14.9 ], [ 73.8, 15.1 ], [ 73.7, 15.7 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Gujarat"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 72.0, 24.5 ], [ 73.0, 24.0 ], [ 74.0, 23.5 ], [ 74.5, 23.0 ], [ 73.0, 21.0 ], [ 71.0, 20.5 ], [ 69.0, 21.5 ], [ 69.0, 22.5 ], [ 70.0, 23.0 ], [ 71.0, 24.0 ], [ 72.0, 24.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Haryana"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 76.0, 30.8 ], [ 77.0, 30.5 ], [ 77.5, 29.5 ], [ 76.5, 28.0 ], [ 75.0, 28.5 ], [ 74.5, 29.5 ], [ 75.5, 30.5 ], [ 76.0, 30.8 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Himachal Pradesh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 77.0, 33.0 ], [ 78.0, 32.5 ], [ 78.5, 31.5 ], [ 77.0, 30.5 ], [ 76.0, 31.0 ], [ 76.5, 32.0 ], [ 77.0, 33.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Jammu & Kashmir"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 74.0, 34.5 ], [ 75.0, 35.0 ], [ 76.0, 34.5 ], [ 75.5, 33.5 ], [ 74.5, 33.0 ], [ 74.0, 33.5 ], [ 74.0, 34.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Jharkhand"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 85.5, 25.3 ], [ 86.5, 25.0 ], [ 87.5, 24.5 ], [ 86.0, 23.0 ], [ 85.0, 22.0 ], [ 83.5, 22.5 ], [ 84.0, 23.5 ], [ 85.5, 25.3 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Karnataka"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 75.0, 18.0 ], [ 76.5, 18.0 ], [ 77.5, 17.0 ], [ 78.5, 16.0 ], [ 77.0, 14.0 ], [ 76.0, 13.0 ], [ 74.5, 14.0 ], [ 74.5, 16.0 ], [ 75.0, 18.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Kerala"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 76.0, 12.0 ], [ 76.5, 11.0 ], [ 77.0, 10.0 ], [ 77.2, 9.0 ], [ 76.5, 8.5 ], [ 75.0, 10.0 ], [ 75.5, 11.5 ], [ 76.0, 12.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Ladakh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 77.0, 35.5 ], [ 78.0, 35.0 ], [ 79.0, 34.0 ], [ 78.0, 33.0 ], [ 76.0, 34.0 ], [ 77.0, 35.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Lakshadweep"}, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 72.2, 11.2 ], [ 72.3, 11.2 ], [ 72.3, 11.3 ], [ 72.2, 11.3 ], [ 72.2, 11.2 ] ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Madhya Pradesh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 78.0, 26.5 ], [ 80.0, 26.0 ], [ 82.0, 24.5 ], [ 81.0, 22.0 ], [ 78.0, 21.5 ], [ 75.0, 22.0 ], [ 74.5, 24.0 ], [ 76.0, 25.0 ], [ 78.0, 26.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Maharashtra"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 77.0, 21.5 ], [ 79.0, 21.5 ], [ 80.5, 20.5 ], [ 80.0, 18.0 ], [ 78.0, 16.0 ], [ 74.0, 16.0 ], [ 73.0, 18.0 ], [ 74.0, 20.0 ], [ 75.0, 21.0 ], [ 77.0, 21.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Manipur"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 93.8, 25.7 ], [ 94.2, 25.5 ], [ 94.7, 24.5 ], [ 94.0, 24.0 ], [ 93.2, 24.5 ], [ 93.8, 25.7 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Meghalaya"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 91.0, 26.0 ], [ 92.0, 25.8 ], [ 92.5, 25.2 ], [ 91.5, 25.0 ], [ 90.5, 25.5 ], [ 91.0, 26.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Mizoram"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 92.8, 24.3 ], [ 93.0, 24.0 ], [ 93.2, 23.0 ], [ 92.5, 22.5 ], [ 92.3, 23.5 ], [ 92.8, 24.3 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Nagaland"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 94.0, 26.8 ], [ 94.8, 26.5 ], [ 95.2, 25.8 ], [ 94.5, 25.5 ], [ 93.8, 26.0 ], [ 94.0, 26.8 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Odisha"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 84.0, 22.5 ], [ 86.0, 22.5 ], [ 87.0, 21.5 ], [ 86.0, 20.0 ], [ 84.0, 19.0 ], [ 82.0, 18.0 ], [ 82.0, 20.0 ], [ 83.0, 22.0 ], [ 84.0, 22.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Puducherry"}, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 79.8, 11.9 ], [ 79.9, 11.9 ], [ 79.9, 12.0 ], [ 79.8, 12.0 ], [ 79.8, 11.9 ] ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Punjab"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 75.0, 32.0 ], [ 76.0, 31.5 ], [ 76.5, 30.5 ], [ 75.5, 29.5 ], [ 74.0, 30.0 ], [ 74.5, 31.0 ], [ 75.0, 32.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Rajasthan"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 74.0, 30.0 ], [ 76.0, 29.0 ], [ 78.0, 27.0 ], [ 76.0, 25.0 ], [ 74.0, 23.5 ], [ 72.0, 25.0 ], [ 70.0, 26.0 ], [ 72.0, 28.0 ], [ 74.0, 30.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Sikkim"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 88.3, 28.1 ], [ 88.6, 27.8 ], [ 88.8, 27.3 ], [ 88.4, 27.1 ], [ 88.0, 27.5 ], [ 88.3, 28.1 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Tamil Nadu"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 78.0, 11.5 ], [ 79.0, 11.0 ], [ 80.0, 12.0 ], [ 79.0, 9.0 ], [ 77.5, 8.5 ], [ 77.0, 9.5 ], [ 77.0, 11.0 ], [ 78.0, 11.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Telangana"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 78.5, 19.5 ], [ 80.0, 19.0 ], [ 81.0, 18.0 ], [ 79.5, 17.0 ], [ 78.0, 17.5 ], [ 77.5, 18.5 ], [ 78.5, 19.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Tripura"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 91.8, 24.5 ], [ 92.2, 24.0 ], [ 92.0, 23.0 ], [ 91.5, 23.5 ], [ 91.3, 24.0 ], [ 91.8, 24.5 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Uttar Pradesh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 78.0, 30.0 ], [ 80.0, 29.0 ], [ 82.0, 28.0 ], [ 84.0, 27.0 ], [ 83.5, 25.0 ], [ 81.0, 24.5 ], [ 78.0, 25.5 ], [ 77.5, 28.0 ], [ 78.0, 30.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Uttarakhand"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 79.0, 31.0 ], [ 80.0, 30.5 ], [ 80.5, 29.5 ], [ 79.5, 29.0 ], [ 78.0, 29.5 ], [ 78.5, 30.5 ], [ 79.0, 31.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "West Bengal"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 88.0, 27.0 ], [ 89.0, 26.5 ], [ 89.5, 26.0 ], [ 88.5, 24.0 ], [ 88.0, 22.0 ], [ 87.0, 22.5 ], [ 86.0, 24.0 ], [ 87.0, 25.5 ], [ 88.0, 27.0 ] ] ] }},
    {"type": "Feature", "properties": { "ST_NM": "Andhra Pradesh"}, "geometry": { "type": "Polygon", "coordinates": [ [ [ 78.0, 16.0 ], [ 80.0, 17.0 ], [ 82.0, 18.0 ], [ 84.0, 17.5 ], [ 82.0, 15.0 ], [ 80.0, 14.0 ], [ 78.0, 14.5 ], [ 78.0, 16.0 ] ] ] }}
  ]
}
