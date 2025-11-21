
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { Layer } from 'leaflet';
import type { ExistingMineFeatureCollection, PredictedZoneFeatureCollection, ExistingMineFeature, PredictedZoneFeature, FilterOptions } from '../types';
import { INDIA_CENTER, INITIAL_ZOOM } from '../constants';
import Legend from './Legend';
import { indiaStatesGeoJSON } from '../services/mineDataService';

interface MapComponentProps {
  existingMines: ExistingMineFeatureCollection | null;
  predictedZones: PredictedZoneFeatureCollection | null;
  visibleLayers: {
    existing: boolean;
    predictedSurface: boolean;
    predictedUnderground: boolean;
  };
  filters: FilterOptions;
}

const MapComponent: React.FC<MapComponentProps> = ({ existingMines, predictedZones, visibleLayers, filters }) => {
  console.log('MapComponent rendered with:', { existingMines, predictedZones, visibleLayers, filters });

  const onEachExistingMine = (feature: ExistingMineFeature, layer: Layer) => {
    const { name, state, district, owner, status } = feature.properties;
    const popupContent = `
      <div class="space-y-1 text-sm">
        <h3 class="font-bold text-base text-cyan-300">${name}</h3>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>District:</strong> ${district}</p>
        <p><strong>Owner:</strong> ${owner}</p>
        <p><strong>Status:</strong> <span class="font-semibold ${status === 'Operating' ? 'text-green-400' : 'text-yellow-400'}">${status}</span></p>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  const onEachPredictedZone = (feature: PredictedZoneFeature, layer: Layer) => {
    const { type, confidence, state, district, area_sqkm, avg_thermal_anomaly } = feature.properties;
    const popupContent = `
      <div class="space-y-1 text-sm">
        <h3 class="font-bold text-base ${type === 'surface' ? 'text-red-400' : 'text-orange-400'}">Predicted ${type} Zone</h3>
        <p><strong>Confidence:</strong> ${(confidence * 100).toFixed(1)}%</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>District:</strong> ${district}</p>
        <p><strong>Area:</strong> ${area_sqkm.toFixed(2)} sq. km</p>
        <p><strong>Avg. Thermal Anomaly:</strong> ${avg_thermal_anomaly.toFixed(2)}°C</p>
      </div>
    `;
    layer.bindPopup(popupContent);
  };
  
  const predictedZoneStyle = (feature: PredictedZoneFeature) => {
    const type = feature.properties.type;
    const confidence = feature.properties.confidence;
    const color = type === 'surface' ? '#F56565' : '#ED8936'; // red for surface, orange for underground
    return {
      fillColor: color,
      fillOpacity: 0.2 + (confidence * 0.4), // Opacity based on confidence
      color: color,
      weight: 1,
      opacity: 0.6,
    };
  };

  const indiaStateStyle = {
      fillColor: "transparent",
      color: "#4A5568", // gray-600
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.1
  };

  const existingMinesKey = `existing-${filters.state}-${existingMines?.features.length}`;
  const predictedZonesKey = `predicted-${filters.state}-${filters.confidence}-${predictedZones?.features.length}-${visibleLayers.predictedSurface}-${visibleLayers.predictedUnderground}`;

  return (
    <MapContainer center={INDIA_CENTER} zoom={INITIAL_ZOOM} scrollWheelZoom={true} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <GeoJSON data={indiaStatesGeoJSON} style={indiaStateStyle} />

      {visibleLayers.existing && existingMines && (
         <GeoJSON 
            key={existingMinesKey}
            data={existingMines}
            onEachFeature={(feature, layer) => onEachExistingMine(feature as ExistingMineFeature, layer)}
            pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "#4299E1", // blue-400
                    color: "#EBF8FF", // blue-100
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }}
         />
      )}

      {predictedZones && (
        <GeoJSON
          key={predictedZonesKey}
          data={predictedZones}
          filter={(feature) => {
            const props = (feature as PredictedZoneFeature).properties;
            return (
              (visibleLayers.predictedSurface && props.type === 'surface') ||
              (visibleLayers.predictedUnderground &&
                props.type === 'underground')
            );
          }}
          style={(feature) => predictedZoneStyle(feature as PredictedZoneFeature)}
          onEachFeature={(feature, layer) =>
            onEachPredictedZone(feature as PredictedZoneFeature, layer)
          }
        />
      )}
      <Legend />
    </MapContainer>
  );
};

export default MapComponent;
