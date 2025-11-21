
import React from 'react';

const Legend: React.FC = () => {
  const legendItems = [
    { color: '#4299E1', label: 'Existing Coal Mine' },
    { color: '#F56565', label: 'Predicted Surface Zone' },
    { color: '#ED8936', label: 'Predicted Underground Zone' },
  ];

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar bg-gray-800/80 backdrop-blur-sm border-gray-600 text-gray-200 p-2 rounded-md shadow-lg w-56">
        <h4 className="font-bold text-center mb-2 border-b border-gray-600 pb-1">Legend</h4>
        <ul className="space-y-2">
          {legendItems.map(item => (
            <li key={item.label} className="flex items-center">
              <span className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: item.color, opacity: 0.8 }}></span>
              <span className="text-xs">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Legend;
