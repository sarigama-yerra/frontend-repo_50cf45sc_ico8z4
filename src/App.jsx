import { useState } from 'react'
import Hero from './components/Hero'
import PlanForm from './components/PlanForm'
import PlanViewer from './components/PlanViewer'

function App() {
  const [plan, setPlan] = useState(null)

  return (
    <div className="min-h-screen bg-slate-950 text-blue-50">
      <Hero />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Tell us about you</h2>
          <PlanForm onGenerate={setPlan} />
          <PlanViewer plan={plan} />
        </div>
      </div>
      <footer className="py-8 text-center text-blue-300/70 text-sm">
        Daily motivation appears after plan is generated.
      </footer>
    </div>
  )
}

export default App
