"""
 Flask API to connect model.py with the frontend
This simulates a real backend connection
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import json
from datetime import datetime

app = Flask(__name__)



INDIAN_STATES = [
    "Jharkhand", "Odisha", "Chhattisgarh", "West Bengal", 
    "Madhya Pradesh", "Telangana", "Maharashtra"
]

DISTRICTS = {
    "Jharkhand": ["Dhanbad", "Bokaro", "Ramgarh", "Giridih"],
    "Odisha": ["Angul", "Talcher", "Jharsuguda", "Sundargarh"],
    "Chhattisgarh": ["Korba", "Raigarh", "Surguja", "Bilaspur"],
    "West Bengal": ["Purulia", "Bardhaman", "Birbhum"],
    "Madhya Pradesh": ["Singrauli", "Shahdol", "Umaria"],
    "Telangana": ["Adilabad", "Khammam", "Karimnagar"],
    "Maharashtra": ["Chandrapur", "Nagpur", "Yavatmal"]
}

def generate_prediction(state, lat_base, lon_base):
    """Generate a prediction zone"""
    district = random.choice(DISTRICTS.get(state, ["Unknown"]))
    

    polygon_coords = []
    for i in range(5):
        angle = (i * 72) * 3.14159 / 180
        radius = random.uniform(0.05, 0.15)
        lat = lat_base + radius * random.uniform(-1, 1)
        lon = lon_base + radius * random.uniform(-1, 1)
        polygon_coords.append([lon, lat])
    polygon_coords.append(polygon_coords[0])  
    
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [polygon_coords]
        },
        "properties": {
            "id": f"pred_{random.randint(1000, 9999)}",
            "type": random.choice(["surface", "underground"]),
            "confidence": round(random.uniform(0.6, 0.98), 2),
            "state": state,
            "district": district,
            "area_sqkm": round(random.uniform(2, 50), 2),
            "avg_thermal_anomaly": round(random.uniform(15, 45), 2)
        }
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model": "MineSight-AI",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """
     prediction endpoint that simulates ML model inference
    Accepts: coordinates, confidence threshold
    Returns: predicted coal zones
    """
    data = request.json
    confidence_threshold = data.get('confidence', 0.5)
    num_predictions = data.get('num_predictions', 50)
    
    print(f"🔮 Running  prediction with confidence threshold: {confidence_threshold}")
    

    predictions = []
    

    state_coords = {
        "Jharkhand": [(23.5, 86.0), (23.8, 86.2), (24.0, 85.8)],
        "Odisha": [(21.5, 84.0), (21.8, 85.2), (22.0, 84.5)],
        "Chhattisgarh": [(22.0, 82.5), (22.5, 83.0), (23.0, 82.8)],
        "West Bengal": [(23.5, 87.0), (23.8, 87.2)],
        "Madhya Pradesh": [(23.8, 81.5), (24.0, 82.0)],
        "Telangana": [(18.5, 79.5), (19.0, 79.8)],
        "Maharashtra": [(19.5, 79.0), (20.0, 79.5)]
    }
    
    for state, coords_list in state_coords.items():
        for lat_base, lon_base in coords_list:
            for _ in range(random.randint(3, 8)):
                prediction = generate_prediction(state, lat_base, lon_base)
                if prediction["properties"]["confidence"] >= confidence_threshold:
                    predictions.append(prediction)
    
    # Limit to requested number
    predictions = predictions[:num_predictions]
    
    return jsonify({
        "type": "FeatureCollection",
        "features": predictions,
        "metadata": {
            "total_predictions": len(predictions),
            "confidence_threshold": confidence_threshold,
            "model_version": "v1.0.0",
            "timestamp": datetime.now().isoformat()
        }
    })

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Return  analytics data"""
    
    confidence_histogram = [
        {"confidence": 0.6, "count": random.randint(5, 15)},
        {"confidence": 0.7, "count": random.randint(10, 25)},
        {"confidence": 0.8, "count": random.randint(15, 35)},
        {"confidence": 0.9, "count": random.randint(8, 20)},
        {"confidence": 0.95, "count": random.randint(3, 10)}
    ]
    
    state_distribution = []
    for state in INDIAN_STATES:
        state_distribution.append({
            "state": state,
            "known": random.randint(10, 50),
            "predicted": random.randint(15, 60)
        })
    
    return jsonify({
        "totalKnownMines": 245,
        "totalPredictedZones": 178,
        "overlapStatistics": {
            "zonesWithKnownMines": 42,
            "percentageOverlap": 23.6
        },
        "avgThermalAnomaly": 28.7,
        "confidenceHistogram": confidence_histogram,
        "stateDistribution": state_distribution
    })

@app.route('/api/model/info', methods=['GET'])
def model_info():
    """Return model information"""
    return jsonify({
        "model_name": "MineSight-AI",
        "architecture": "U-Net with EfficientNet encoder",
        "input_bands": 16,
        "patch_size": 320,
        "device": "cuda",
        "trained_on": "18-band satellite imagery",
        "accuracy": "94.2%",
        "status": "ready"
    })

@app.route('/api/states', methods=['GET'])
def get_states():
    """Return list of Indian states with coal deposits"""
    return jsonify({
        "states": INDIAN_STATES
    })

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 MineSight-AI Flask API Server")
    print("="*70)
    print("📡 Starting backend connection...")
    print("🌐 API will be available at: http://localhost:5001")
    print("="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
