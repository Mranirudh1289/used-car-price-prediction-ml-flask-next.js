"use client";
import CarScene from "./components/CarScene";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState({
    modelYear: "",
    enginePower: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    topSpeed: "",
    brand: "",
    model: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    // ✅ Check if all fields are filled
    const allFilled = Object.values(inputs).every((v) => v.trim() !== "");
    if (!allFilled) {
      setPredictedPrice("⚠️ Please fill all the fields before predicting.");
      setShowPopup(true);
      return;
    }

    try {
      const payload = {
        year: parseInt(inputs.modelYear) || 0,
        km_driven: parseFloat(inputs.mileage) || 0,
        transmission: inputs.transmission === "Automatic" ? 1 : 0,
        mileage: parseFloat(inputs.mileage) || 0,
        engine: parseFloat(inputs.enginePower) || 0,
        max_power: parseFloat(inputs.topSpeed) || 0,
        seats: 5,
        fuel: inputs.fuelType,
        owner: "First Owner",
        brand: inputs.brand,
        model: inputs.model,
      };

      setPredictedPrice("Loading...");
      setShowPopup(true);

      const res = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });


      const data = await res.json();

      if (res.ok && data.price !== undefined) {
        setPredictedPrice(`💸 Estimated Price: ${data.price} ₹ `);
      } else if (data.error) {
        setPredictedPrice("❌ Error: " + data.error);
      } else {
        setPredictedPrice("❌ Prediction failed");
      }
    } catch (err) {
      console.error("Predict error:", err);
      setPredictedPrice("⚠️ Server error, please try again.");
      setShowPopup(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background blur when popup is shown */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 backdrop-blur-[10px] bg-black/40 z-20"
          />
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.h1
        className="absolute top-8 w-full text-center text-5xl font-bold text-white neon-glow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🚗 Used Car Price Prediction
      </motion.h1>

      {/* Car Scene + Inputs */}
      <motion.div
        className="relative w-full flex items-center justify-center transition-all duration-300"
        animate={{ opacity: showPopup ? 0.4 : 1 }}
      >
        <CarScene />

        {/* Left Inputs */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <input
            name="brand"
            value={inputs.brand}
            onChange={handleChange}
            type="text"
            placeholder="Brand"
            className="input-glow"
          />
          <input
            name="modelYear"
            value={inputs.modelYear}
            onChange={handleChange}
            type="text"
            placeholder="Model Year"
            className="input-glow"
          />
          <input
            name="enginePower"
            value={inputs.enginePower}
            onChange={handleChange}
            type="text"
            placeholder="Engine Power"
            className="input-glow"
          />
          <input
            name="mileage"
            value={inputs.mileage}
            onChange={handleChange}
            type="text"
            placeholder="Mileage (km driven)"
            className="input-glow"
          />
        </div>

        {/* Right Inputs */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <input
            name="model"
            value={inputs.model}
            onChange={handleChange}
            type="text"
            placeholder="Model"
            className="input-glow"
          />
          <input
            name="fuelType"
            value={inputs.fuelType}
            onChange={handleChange}
            type="text"
            placeholder="Fuel Type"
            className="input-glow"
          />
          <input
            name="transmission"
            value={inputs.transmission}
            onChange={handleChange}
            type="text"
            placeholder="Transmission (Automatic/Manual)"
            className="input-glow"
          />
          <input
            name="topSpeed"
            value={inputs.topSpeed}
            onChange={handleChange}
            type="text"
            placeholder="Max Power"
            className="input-glow"
          />
        </div>
      </motion.div>

      {/* Predict Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePredict}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-10 py-3 text-lg font-bold text-white 
                  bg-transparent border border-cyan-400 rounded-xl drop-shadow-[0_0_10px_rgba(0,191,255,0.6)] 
                  hover:drop-shadow-[0_0_20px_rgba(0,191,255,0.9)] hover:border-cyan-300 transition-all duration-300"
      >
        🚀 Predict
      </motion.button>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-6 rounded-2xl 
                       text-2xl font-bold text-cyan-300 bg-white/10 backdrop-blur-xl border border-cyan-400/20
                       shadow-[0_0_50px_rgba(0,255,255,0.4)] z-30"
            onClick={() => setShowPopup(false)} // click anywhere to close
          >
            {predictedPrice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
