import React from 'react'
import axios from 'axios'


export default function InputPanel({ onPredict }){
const [form, setForm] = React.useState({
brand:'BMW', model:'3 Series', year:2019, km_driven:40000, transmission:0, mileage:18.5, engine:1197, max_power:88.5, seats:5, fuel:'Petrol', owner:'First Owner'
})
const handle = (e)=> setForm({...form, [e.target.name]: e.target.value})


const submit = async (e)=>{
e.preventDefault()
try{
// call Flask endpoint (must accept JSON and return JSON {prediction: value})
const res = await axios.post('http://127.0.0.1:5000/predict', form)
const value = res.data.prediction ?? res.data
onPredict(value)
}catch(err){
onPredict('Error: could not connect to backend')
}
}


return (
<form onSubmit={submit} className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5 backdrop-blur-md">
<label className="block text-sm text-slate-300">Brand</label>
<select name="brand" value={form.brand} onChange={handle} className="input">{['BMW','Audi','Mercedes','Lamborghini','Tesla'].map(b=> <option key={b}>{b}</option>)}</select>


<label className="block text-sm text-slate-300">Model</label>
<input name="model" value={form.model} onChange={handle} className="input" />


<div className="grid grid-cols-2 gap-2">
<div>
<label className="block text-sm text-slate-300">Year</label>
<input type="number" name="year" value={form.year} onChange={handle} className="input" />
</div>
<div>
<label className="block text-sm text-slate-300">KM Driven</label>
<input type="number" name="km_driven" value={form.km_driven} onChange={handle} className="input" />
</div>
</div>


<div className="grid grid-cols-2 gap-2">
<div>
<label className="block text-sm text-slate-300">Mileage</label>
<input step="0.1" name="mileage" value={form.mileage} onChange={handle} className="input" />
</div>
<div>
<label className="block text-sm text-slate-300">Engine (cc)</label>
<input name="engine" value={form.engine} onChange={handle} className="input" />
</div>
</div>


<div className="grid grid-cols-2 gap-2">
<div>
<label className="block text-sm text-slate-300">Max Power (bhp)</label>
<input step="0.1" name="max_power" value={form.max_power} onChange={handle} className="input" />
</div>
<div>
<label className="block text-sm text-slate-300">Seats</label>
<input name="seats" value={form.seats} onChange={handle} className="input" />
</div>
</div>


<div className="flex gap-2">
<button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00dffb] to-[#007bff] text-black font-bold">Predict</button>
<button type="reset" onClick={()=>setForm({brand:'BMW',model:'3 Series',year:2019,km_driven:40000,transmission:0,mileage:18.5,engine:1197,max_power:88.5,seats:5,fuel:'Petrol',owner:'First Owner'})} className="px-4 py-3 rounded-xl border border-white/10">Reset</button>
</div>
</form>
)
}