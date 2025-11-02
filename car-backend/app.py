from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

# ✅ Allow both localhost and 127.0.0.1 for frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# ✅ Load all saved model files
model = joblib.load('used_car_price_model.pkl')
scaler = joblib.load('scaler.pkl')
brand_encoder = joblib.load('brand_encoder.pkl')
model_encoder = joblib.load('model_encoder.pkl')

@app.route('/')
def home():
    return jsonify({"message": "Car Price Prediction API is running successfully 🚀"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)

        # Extract input data
        year = int(data.get('year', 0))
        km_driven = int(data.get('km_driven', 0))
        transmission = int(data.get('transmission', 0))
        mileage = float(data.get('mileage', 0))
        engine = float(data.get('engine', 0))
        max_power = float(data.get('max_power', 0))
        seats = int(data.get('seats', 5))
        fuel = data.get('fuel', 'Petrol')
        owner = data.get('owner', 'First Owner')
        brand = data.get('brand', 'Unknown')
        model_name = data.get('model', 'Unknown')

        # Encode brand/model safely
        try:
            brand_encoded = brand_encoder.transform([brand])[0]
        except Exception:
            brand_encoded = 0  # Default if not found

        try:
            model_encoded = model_encoder.transform([model_name])[0]
        except Exception:
            model_encoded = 0  # Default if not found

        # One-hot encoding for categorical features
        fuel_diesel = 1 if fuel == 'Diesel' else 0
        fuel_lpg = 1 if fuel == 'LPG' else 0
        fuel_petrol = 1 if fuel == 'Petrol' else 0
        owner_second = 1 if owner == 'Second Owner' else 0
        owner_third = 1 if owner == 'Third Owner' else 0
        owner_fourth = 1 if owner == 'Fourth & Above Owner' else 0

        # Derived features
        engine_log = np.log1p(engine)
        max_power_log = np.log1p(max_power)

        # Final feature vector
        final_features = np.array([[year, km_driven, transmission, mileage, engine, max_power, seats,
                                    fuel_diesel, fuel_lpg, fuel_petrol, owner_fourth, owner_second, owner_third,
                                    brand_encoded, model_encoded, engine_log, max_power_log]])

        # Scale and predict
        final_scaled = scaler.transform(final_features)
        prediction = model.predict(final_scaled)[0]
        prediction = round(prediction, 2)

        return jsonify({"price": prediction})

    except Exception as e:
        print("❌ Prediction error:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)

