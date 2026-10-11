import { useEffect, useState } from 'react'
import { Wind, Sparkles, MessageCircleHeart, Heart, Pause, Play, Check } from 'lucide-react'

const green = '#2e6e56'
const muted = '#718075'
const border = '#e1e8df'
const cardStyle = {
  background: '#fff', border: `1px solid ${border}`, borderRadius: 18,
  padding: 22, boxShadow: '0 12px 35px #293e3208',
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 style={{ fontSize: 'clamp(32px, 4vw, 46px)', lineHeight: 1.12, letterSpacing: '-1.8px', margin: '0 0 12px', color: '#253c31' }}>{title}</h1>
      <p style={{ color: muted, fontSize: 14, lineHeight: 1.8, maxWidth: 680, margin: 0 }}>{description}</p>
    </div>
  )
}

function ToolkitCard({ icon: Icon, title, description, children }) {
  return (
    <section style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 14, background: '#e8f1e8', color: green, display: 'grid', placeItems: 'center' }}><Icon size={20} /></span>
        <div><h2 style={{ margin: 0, fontSize: 16, color: '#273a32' }}>{title}</h2><p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.6, color: muted }}>{description}</p></div>
      </div>
      {children}
    </section>
  )
}

export default function Toolkit() {
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState('Ready when you are')
  const [exercise, setExercise] = useState('breathing')

  useEffect(() => {
    if (!breathing || exercise !== 'breathing') {
      setPhase('Ready when you are')
      return undefined
    }
    const phases = ['Breathe in gently', 'Hold softly', 'Breathe out slowly', 'Pause']
    let index = 0
    setPhase(phases[0])
    const timer = window.setInterval(() => {
      index = (index + 1) % phases.length
      setPhase(phases[index])
    }, 4000)
    return () => window.clearInterval(timer)
  }, [breathing, exercise])

  function selectExercise(next) {
    setBreathing(false)
    setExercise(next)
  }

  return (
    <>
      <PageHeading eyebrow="Calm toolkit" title="A small pause can help." description="Choose a simple activity and move at your own pace. You can stop whenever you need to." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, alignItems: 'stretch' }}>
        <ToolkitCard icon={Wind} title="Gentle breathing" description="Try a slow, comfortable breathing rhythm for a minute or two.">
          <div style={{ margin: '22px auto', width: 150, height: 150, borderRadius: '50%', background: breathing ? '#dcefe5' : '#eef3ed', border: '1px solid #d4e5d5', display: 'grid', placeItems: 'center', textAlign: 'center', transition: 'transform 1s ease, background 1s ease', transform: breathing && phase.startsWith('Breathe in') ? 'scale(1.08)' : 'scale(1)' }}>
            <div><Wind size={25} color={green} /><p style={{ maxWidth: 105, margin: '9px auto 0', fontSize: 12, fontWeight: 700, color: green }}>{phase}</p></div>
          </div>
          <button className="button button-primary" onClick={() => setBreathing((value) => !value)} style={{ width: '100%' }}>{breathing ? <><Pause size={16} /> Pause exercise</> : <><Play size={16} /> Start breathing</>}</button>
          <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, marginBottom: 0 }}>Keep the breath comfortable. Stop if you feel dizzy or uncomfortable.</p>
        </ToolkitCard>
        <ToolkitCard icon={Sparkles} title="Grounding: notice five things" description="Bring your attention gently to the space around you.">
          <ol style={{ paddingLeft: 20, color: '#5e7064', fontSize: 13, lineHeight: 2 }}>
            <li>Notice five things you can see.</li><li>Notice four things you can feel.</li><li>Notice three things you can hear.</li><li>Notice two things you can smell.</li><li>Notice one thing you can taste.</li>
          </ol>
          <button className="button button-primary" onClick={() => selectExercise('grounding')}>Choose grounding <Check size={16} /></button>
          {exercise === 'grounding' && <p role="status" style={{ color: green, fontSize: 12, lineHeight: 1.6, marginBottom: 0 }}>Take your time with each step. You can skip anything that does not feel comfortable.</p>}
        </ToolkitCard>
        <ToolkitCard icon={MessageCircleHeart} title="A kind note to yourself" description="Try speaking to yourself as you would speak to someone you care about.">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4e6558', background: '#f4f7f1', borderRadius: 12, padding: 15 }}>“I am allowed to take this one step at a time. I do not have to have every answer right now.”</p>
          <button className="button button-primary" onClick={() => selectExercise('kindness')}>Take a moment <Heart size={16} /></button>
          {exercise === 'kindness' && <p role="status" style={{ color: green, fontSize: 12, lineHeight: 1.6, marginBottom: 0 }}>Pause for a few breaths and choose words that feel genuine to you.</p>}
        </ToolkitCard>
      </div>
    </>
  )
}
