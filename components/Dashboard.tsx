import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts';
import type { AnalyticsData, FilterOptions, ExistingMineFeatureCollection, PredictedZoneFeatureCollection } from '../types';
import { DEFAULT_CONFIDENCE_THRESHOLD } from '../constants';
import { generateCoalMineReport } from '../services/pdfReportService';

interface DashboardProps {
  analytics: AnalyticsData | null;
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  visibleLayers: {
    existing: boolean;
    predictedSurface: boolean;
    predictedUnderground: boolean;
  };
  onLayerToggle: (layer: keyof DashboardProps['visibleLayers']) => void;
  states: string[];
  isLoading: boolean;
  filteredMineCount: number;
  filteredZoneCount: number;
  existingMines: ExistingMineFeatureCollection | null;
  predictedZones: PredictedZoneFeatureCollection | null;
}

const StatCard: React.FC<{ title: string, value: string | number, description: string }> = ({ title, value, description }) => (
  <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg shadow-md border border-blue-100">
    <h3 className="text-sm font-medium text-blue-600">{title}</h3>
    <p className="text-2xl font-bold text-blue-900">{value}</p>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
    <div className="h-10 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
    <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
    <div className="h-48 bg-gray-200 rounded-lg"></div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ 
  analytics, filters, onFilterChange, visibleLayers, onLayerToggle, states, isLoading, filteredMineCount, filteredZoneCount,
  existingMines, predictedZones
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting PDF generation...');
      console.log('Data:', { existingMines, predictedZones, analytics });
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure state updates
      
      generateCoalMineReport({
        existingMines,
        predictedZones,
        analytics
      });
      
      console.log('PDF generation completed successfully');
      
      // Show success message
      setTimeout(() => {
        alert('Report downloaded successfully! Check your Downloads folder.');
      }, 500);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert(`Failed to generate PDF report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="p-2"><SkeletonLoader /></div>;
  }

  if (!analytics) {
    return <div className="text-center text-red-600 p-4">Failed to load analytics data.</div>;
  }
  
  const layerToggles = [
    { id: 'existing', label: 'Existing Mines' },
    { id: 'predictedSurface', label: 'Predicted Surface Zones' },
    { id: 'predictedUnderground', label: 'Predicted Underground Zones' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900 border-b-2 border-blue-500 pb-2 flex-1">Analytics Dashboard</h2>
      </div>

      {/* PDF Download Button */}
      <button
        onClick={handleDownloadReport}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating Report...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Full Report (PDF)</span>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Filtered Mines" value={filteredMineCount} description="Known coal mines in view" />
        <StatCard title="Filtered Zones" value={filteredZoneCount} description="AI-predicted zones in view" />
        <StatCard title="Overlap" value={`${analytics.overlapStatistics.percentageOverlap}%`} description="Predicted zones with known mines" />
        <StatCard title="Avg. Thermal Anomaly" value={`${analytics.avgThermalAnomaly.toFixed(2)}°C`} description="In predicted zones" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Filters &amp; Layers</h3>
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div>
              <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1">State / Union Territory</label>
              <select
                id="state-filter"
                value={filters.state}
                onChange={(e) => onFilterChange({ state: e.target.value })}
                className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {states.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="confidence-slider" className="block text-sm font-medium text-gray-700">
                Confidence Threshold: <span className="font-bold text-blue-600">{(filters.confidence * 100).toFixed(0)}%</span>
              </label>
              <input
                id="confidence-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={filters.confidence}
                onChange={(e) => onFilterChange({ confidence: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
             <div className="pt-2">
               <h4 className="text-sm font-medium text-gray-700 mb-2">Map Layers</h4>
               <div className="space-y-2">
                 {layerToggles.map(layer => (
                    <label key={layer.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleLayers[layer.id as keyof typeof visibleLayers]}
                        onChange={() => onLayerToggle(layer.id as keyof typeof visibleLayers)}
                        className="h-4 w-4 rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 text-sm">{layer.label}</span>
                    </label>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-900">State-wise Distribution</h3>
        <div className="w-full h-64 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.stateDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#374151' }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }} 
                    labelStyle={{ color: '#1F2937' }}
                />
                <RechartsLegend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                <Bar dataKey="known" fill="#3B82F6" name="Known Mines" />
                <Bar dataKey="predicted" fill="#60A5FA" name="Predicted Zones" />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

       <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Confidence Distribution</h3>
        <div className="w-full h-64 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.confidenceHistogram} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="confidence" tickFormatter={(val) => `${val * 100}%`} tick={{ fontSize: 10, fill: '#374151' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }} 
                    labelStyle={{ color: '#1F2937' }}
                    formatter={(value, name, props) => [`${value} zones`, `Confidence`]}
                    labelFormatter={(label) => `>${label*100}% Confidence`}
                />
                <RechartsLegend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="count" fill="#3B82F6" name="Predicted Zones" />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
