import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import Dashboard from './components/Dashboard';
import CarbonCreditTrading from './components/CarbonCreditTrading';
import { getExistingMines, getPredictedZones, getAnalyticsSummary, getStates } from './services/mineDataService';
import { checkModelHealth, requestPredictions, getModelInfo, type ModelInfo } from './services/modelApiService';
import type { AnalyticsData, ExistingMineFeatureCollection, PredictedZoneFeatureCollection, FilterOptions } from './types';
import { DEFAULT_CONFIDENCE_THRESHOLD } from './constants';

const App: React.FC = () => {
  const [existingMines, setExistingMines] = useState<ExistingMineFeatureCollection | null>(null);
  const [predictedZones, setPredictedZones] = useState<PredictedZoneFeatureCollection | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCarbonCredit, setShowCarbonCredit] = useState(false);
  const [modelConnected, setModelConnected] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [usingLiveModel, setUsingLiveModel] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    state: 'All',
    confidence: DEFAULT_CONFIDENCE_THRESHOLD,
  });

  const [visibleLayers, setVisibleLayers] = useState({
    existing: true,
    predictedSurface: true,
    predictedUnderground: true,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Check model backend health on mount
  useEffect(() => {
    const checkModel = async () => {
      const isHealthy = await checkModelHealth();
      setModelConnected(isHealthy);
      
      if (isHealthy) {
        const info = await getModelInfo();
        setModelInfo(info);
        console.log('🤖 ML Model Connected:', info);
      }
    };
    
    checkModel();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching mine data...');
        
        // Always get existing mines from local data
        const minesData = await getExistingMines();
        setExistingMines(minesData);
        
        // Try to get predictions from ML model backend if connected
        let zonesData;
        if (modelConnected) {
          console.log('🔮 Using LIVE ML model predictions from Python backend!');
          try {
            zonesData = await requestPredictions({
              confidence: DEFAULT_CONFIDENCE_THRESHOLD,
              num_predictions: 50
            });
            setUsingLiveModel(true);
          } catch (modelError) {
            console.warn('Model API failed, falling back to static data:', modelError);
            zonesData = await getPredictedZones();
            setUsingLiveModel(false);
          }
        } else {
          console.log('📊 Using static prediction data (model backend not available)');
          zonesData = await getPredictedZones();
          setUsingLiveModel(false);
        }
        
        const [analyticsData, statesData] = await Promise.all([
          getAnalyticsSummary(),
          getStates()
        ]);
        
        console.log('Data fetched successfully:', { minesData, zonesData, analyticsData, statesData });
        setPredictedZones(zonesData);
        setAnalytics(analyticsData);
        setStates(['All', ...statesData]);
      } catch (error) {
        console.error("Failed to fetch mine data:", error);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [modelConnected]);

  // Function to manually trigger model prediction
  const runModelPrediction = useCallback(async () => {
    if (!modelConnected) {
      alert('Model backend is not connected. Please start the Flask API server.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔮 Running new prediction from ML model...');
      const newPredictions = await requestPredictions({
        confidence: filters.confidence,
        num_predictions: 50
      });
      setPredictedZones(newPredictions);
      setUsingLiveModel(true);
      console.log('✅ Predictions updated from model!');
    } catch (error) {
      console.error('Failed to get model predictions:', error);
      alert('Failed to get predictions from model. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [modelConnected, filters.confidence]);

  const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleLayerToggle = useCallback((layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);
  
  const filteredPredictedZones = useMemo((): PredictedZoneFeatureCollection | null => {
    if (!predictedZones) return null;

    const features = predictedZones.features.filter(feature => {
      const stateMatch = filters.state === 'All' || feature.properties.state === filters.state;
      const confidenceMatch = feature.properties.confidence >= filters.confidence;
      return stateMatch && confidenceMatch;
    });

    return { ...predictedZones, features };
  }, [predictedZones, filters]);

  const filteredExistingMines = useMemo((): ExistingMineFeatureCollection | null => {
    if (!existingMines) return null;
    
    if (filters.state === 'All') return existingMines;
    
    const features = existingMines.features.filter(feature => feature.properties.state === filters.state);

    return { ...existingMines, features };
  }, [existingMines, filters.state]);

  if (showCarbonCredit) {
    return <CarbonCreditTrading onClose={() => setShowCarbonCredit(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900 font-sans">
      <Header onCarbonCreditClick={() => setShowCarbonCredit(true)} />
      
      {/* Model Connection Status Banner */}
      {modelConnected && (
        <div className="bg-green-100 border-b border-green-400 text-green-800 px-4 py-2 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🟢</span>
            <span className="font-semibold">ML Model Connected</span>
            {modelInfo && (
              <span className="text-xs">
                | {modelInfo.model_name} | {modelInfo.architecture} | Accuracy: {modelInfo.accuracy}
              </span>
            )}
            {usingLiveModel && (
              <span className="ml-2 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                LIVE PREDICTIONS
              </span>
            )}
          </div>
          <button
            onClick={runModelPrediction}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
          >
            🔮 Run New Prediction
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 text-center">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-blue-900 font-semibold">Loading CoalSight AI...</p>
          </div>
        </div>
      ) : (
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative">
            <MapComponent 
              existingMines={filteredExistingMines}
              predictedZones={filteredPredictedZones}
              visibleLayers={visibleLayers}
              filters={filters}
            />
          </div>
          <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white/90 backdrop-blur-sm p-4 overflow-y-auto shadow-2xl border-l border-gray-200">
            <Dashboard 
              analytics={analytics}
              filters={filters}
              onFilterChange={handleFilterChange}
              visibleLayers={visibleLayers}
              onLayerToggle={handleLayerToggle}
              states={states}
              isLoading={false}
              filteredMineCount={filteredExistingMines?.features.length ?? 0}
              filteredZoneCount={filteredPredictedZones?.features.length ?? 0}
              existingMines={existingMines}
              predictedZones={predictedZones}
            />
          </aside>
        </main>
      )}
    </div>
  );
};

export default App;
