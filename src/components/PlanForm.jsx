import { useState } from 'react'

const initialState = {
  name: '', age: 25, gender: 'Male', height_cm: 170, weight_kg: 70,
  goal: 'Weight Loss', level: 'Beginner', location: 'Home', diet: 'Any',
  medical_history: '', stress_level: 'Medium'
}

export default function PlanForm({ onGenerate }) {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      onGenerate?.(data)
    } catch (err) {
      console.error(err)
      alert('Failed to generate plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Name', name: 'name', type: 'text' },
        { label: 'Age', name: 'age', type: 'number' },
        { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { label: 'Height (cm)', name: 'height_cm', type: 'number' },
        { label: 'Weight (kg)', name: 'weight_kg', type: 'number' },
        { label: 'Goal', name: 'goal', type: 'select', options: ['Weight Loss','Muscle Gain','Maintenance','Endurance','Flexibility'] },
        { label: 'Level', name: 'level', type: 'select', options: ['Beginner','Intermediate','Advanced'] },
        { label: 'Location', name: 'location', type: 'select', options: ['Home','Gym','Outdoor'] },
        { label: 'Diet', name: 'diet', type: 'select', options: ['Veg','Non-Veg','Vegan','Keto','Paleo','Any'] },
      ].map((f) => (
        <div key={f.name} className="flex flex-col">
          <label className="text-sm text-blue-100 mb-1">{f.label}</label>
          {f.type === 'select' ? (
            <select name={f.name} value={form[f.name]} onChange={handleChange} className="bg-slate-800/50 text-white p-2 rounded border border-slate-700">
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange} className="bg-slate-800/50 text-white p-2 rounded border border-slate-700" />
          )}
        </div>
      ))}

      <div className="md:col-span-3">
        <label className="text-sm text-blue-100 mb-1 block">Medical History</label>
        <textarea name="medical_history" value={form.medical_history} onChange={handleChange} className="w-full bg-slate-800/50 text-white p-2 rounded border border-slate-700" />
      </div>

      <div className="md:col-span-3 flex justify-end">
        <button disabled={loading} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>
    </form>
  )
}
