import React from 'react'
import { motion } from 'framer-motion'


export default function ResultModal({ value, onClose }){
return (
<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center">
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
<motion.div initial={{scale:0.8}} animate={{scale:1}} className="relative bg-white/5 border border-[#00bfff] text-white rounded-2xl p-8 w-96 shadow-2xl">
<h3 className="text-xl font-bold">Estimated Price</h3>
<p className="mt-4 text-3xl font-extrabold">₹ {value}</p>
<p className="mt-2 text-sm text-slate-300">Predicted by RandomForest — R² ≈ 0.93</p>
<button onClick={onClose} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#00dffb] to-[#007bff] text-black font-bold">Close</button>
</motion.div>
</motion.div>
)
}