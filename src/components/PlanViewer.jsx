import { useState } from 'react'

export default function PlanViewer({ plan }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [audio, setAudio] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [saving, setSaving] = useState(false)

  if (!plan) return null

  const speak = async (section) => {
    const text = section === 'workout'
      ? JSON.stringify(plan.workout)
      : JSON.stringify(plan.diet)
    try {
      const res = await fetch(`${baseUrl}/api/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      const data = await res.json()
      const audioEl = new Audio(`data:audio/mpeg;base64,${data.audio}`)
      setAudio(audioEl)
      audioEl.play()
    } catch (e) {
      alert('TTS not configured. Set ELEVENLABS_API_KEY to enable voice.')
    }
  }

  const genImage = async (prompt) => {
    try {
      const res = await fetch(`${baseUrl}/api/image`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await res.json()
      const out = data?.output?.[0] || data?.urls?.get || null
      setImgUrl(out)
    } catch (e) {
      console.error(e)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${baseUrl}/api/save-plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile: plan.profile, plan }) })
      const data = await res.json()
      if (data.id) alert('Saved!')
    } catch (e) {
      alert('Save failed')
    } finally { setSaving(false) }
  }

  const exportPdf = async () => {
    window.print()
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Workout Plan</h3>
          <button onClick={() => speak('workout')} className="text-xs px-2 py-1 bg-blue-500 text-white rounded">Read</button>
        </div>
        <div className="space-y-3 max-h-96 overflow-auto pr-2">
          {plan.workout?.map((d, idx) => (
            <div key={idx} className="bg-slate-900/40 p-3 rounded border border-slate-700">
              <p className="text-blue-200 font-medium mb-1">{d.day}</p>
              <ul className="text-blue-100 text-sm space-y-1">
                {d.exercises?.map((ex, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span onClick={() => genImage(ex.name)} className="cursor-pointer hover:underline">{ex.name}</span>
                    <span className="opacity-80">{ex.sets ? `${ex.sets} x ${ex.reps}` : ex.duration} • rest {ex.rest || '—'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Diet Plan</h3>
          <button onClick={() => speak('diet')} className="text-xs px-2 py-1 bg-blue-500 text-white rounded">Read</button>
        </div>
        <div className="space-y-3 max-h-96 overflow-auto pr-2">
          {plan.diet?.map((d, idx) => (
            <div key={idx} className="bg-slate-900/40 p-3 rounded border border-slate-700">
              <p className="text-blue-200 font-medium mb-1">{d.day}</p>
              <ul className="text-blue-100 text-sm space-y-1">
                {d.meals?.map((m, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span onClick={() => genImage(m.name)} className="cursor-pointer hover:underline">{m.name}</span>
                    {m.calories && <span className="opacity-80">{m.calories} kcal</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <p className="text-white font-semibold mb-2">AI Tips & Motivation</p>
        <ul className="list-disc list-inside text-blue-100 space-y-1">
          {plan.tips?.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
        <div className="mt-4 flex gap-3">
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-500 text-white rounded">{saving ? 'Saving...' : 'Save Plan'}</button>
          <button onClick={exportPdf} className="px-4 py-2 bg-slate-700 text-white rounded">Export PDF</button>
        </div>
      </div>

      {imgUrl && (
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <p className="text-blue-200 mb-2">Generated image</p>
          <img src={imgUrl} alt="generated" className="w-full max-h-[420px] object-contain rounded" />
        </div>
      )}
    </div>
  )
}
