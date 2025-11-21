import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';

// Properties for an existing coal mine
export interface ExistingMineProperties {
  name: string;
  state: string;
  district: string;
  owner: string;
  status: string;
}

// Properties for an AI-predicted coal zone
export interface PredictedZoneProperties {
  id: string;
  type: 'surface' | 'underground';
  confidence: number; // A value between 0 and 1
  state: string;
  district: string;
  area_sqkm: number;
  avg_thermal_anomaly: number;
}

// GeoJSON Feature types
export type ExistingMineFeature = Feature<Point, ExistingMineProperties>;
export type PredictedZoneFeature = Feature<Polygon, PredictedZoneProperties>;

// GeoJSON FeatureCollection types
export type ExistingMineFeatureCollection = FeatureCollection<Point, ExistingMineProperties>;
export type PredictedZoneFeatureCollection = FeatureCollection<Polygon, PredictedZoneProperties>;

// Data for the analytics dashboard
export interface AnalyticsData {
  totalKnownMines: number;
  totalPredictedZones: number;
  overlapStatistics: {
    zonesWithKnownMines: number;
    percentageOverlap: number;
  };
  avgThermalAnomaly: number;
  confidenceHistogram: { confidence: number, count: number }[];
  stateDistribution: { state: string; known: number; predicted: number }[];
}

// Options for filtering the data
export interface FilterOptions {
    state: string;
    confidence: number;
}

// ---- CARBON CREDIT TYPES ----
export interface CarbonCredit {
  id: string;
  mineName: string;
  state: string;
  credits: number;
  pricePerCredit: number;
  totalValue: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  listingDate: string;
  expiryDate: string;
  seller: string;
  description: string;
}

export interface CarbonCreditListing extends CarbonCredit {
  type: 'buy' | 'sell';
}

export interface Transaction {
  id: string;
  creditId: string;
  buyer: string;
  seller: string;
  credits: number;
  pricePerCredit: number;
  totalAmount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface UserPortfolio {
  totalCreditsOwned: number;
  totalCreditsSold: number;
  totalValueUSD: number;
  activeListings: number;
  transactions: Transaction[];
}