/**
 * ML Model API Service
 * Connects the frontend to the Python Flask backend (model.py)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface ModelInfo {
  model_name: string;
  architecture: string;
  input_bands: number;
  patch_size: number;
  device: string;
  trained_on: string;
  accuracy: string;
  status: string;
}

export interface PredictionRequest {
  confidence?: number;
  num_predictions?: number;
}

export interface PredictionMetadata {
  total_predictions: number;
  confidence_threshold: number;
  model_version: string;
  timestamp: string;
}

/**
 * Check if the ML model backend is available
 */
export async function checkModelHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Model backend health:', data);
    return data.status === 'healthy';
  } catch (error) {
    console.warn('⚠️ Model backend not available:', error);
    return false;
  }
}

/**
 * Get information about the ML model
 */
export async function getModelInfo(): Promise<ModelInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/model/info`);
    if (!response.ok) throw new Error('Failed to fetch model info');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching model info:', error);
    return null;
  }
}

/**
 * Request predictions from the ML model
 */
export async function requestPredictions(
  params: PredictionRequest = {}
): Promise<any> {
  try {
    console.log('🔮 Requesting predictions from ML model...');
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confidence: params.confidence || 0.5,
        num_predictions: params.num_predictions || 50,
      }),
    });

    if (!response.ok) {
      throw new Error(`Prediction request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Received ${data.features.length} predictions from model`);
    return data;
  } catch (error) {
    console.error('Error requesting predictions:', error);
    throw error;
  }
}

/**
 * Get analytics from the backend
 */
export async function getAnalyticsFromModel(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

/**
 * Get list of states from backend
 */
export async function getStatesFromModel(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/states`);
    if (!response.ok) throw new Error('Failed to fetch states');
    const data = await response.json();
    return data.states;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}
