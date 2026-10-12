import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowRight, BookOpen, CalendarCheck, Heart, Sparkles, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDailyAffirmation } from '../api.js'

const green = '#2e6e56'
const paleGreen = '#e8f1e8'
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

function FeatureCard({ icon: Icon, title, description, to, action }) {
  return (
    <section style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 14, background: paleGreen, color: green, display: 'grid', placeItems: 'center' }}><Icon size={20} /></span>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, color: '#273a32' }}>{title}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.6, color: muted }}>{description}</p>
        </div>
      </div>
      <Link to={to} className="button button-primary" style={{ marginTop: 8 }}>{action} <ArrowRight size={16} /></Link>
    </section>
  )
}

export default function Dashboard() {
  const [affirmation, setAffirmation] = useState('Take this one gentle step at a time.')
  const [moodSummary, setMoodSummary] = useState([])

  useEffect(() => {
    async function loadAffirmation() {
      try {
        const message = await getDailyAffirmation()
        if (message) setAffirmation(message)
      } catch {
        // fall back to the default message above
      }
    }
    loadAffirmation()
  }, [])

  useEffect(() => {
    function getLocalDateKey(value) {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    function loadMoodSummary() {
      try {
        const saved = JSON.parse(localStorage.getItem('mindcare_journal_entries') || '[]')
        const scoreMap = { 'Very low': 1, Low: 2, Okay: 3, Good: 4, Great: 5 }
        const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - index))
          return {
            key: getLocalDateKey(date),
            total: 0,
            count: 0,
          }
        })

        saved.forEach((entry) => {
          const key = getLocalDateKey(entry.date || new Date())
          const summary = lastSevenDays.find((item) => item.key === key)
          if (!summary) return
          summary.total += scoreMap[entry.mood] || 0
          summary.count += 1
        })

        const nextSummary = lastSevenDays.map((item) => ({
          ...item,
          average: item.count ? Math.round((item.total / item.count) * 10) / 10 : 0,
        }))
        setMoodSummary(nextSummary)
      } catch {
        setMoodSummary([])
      }
    }

    loadMoodSummary()
    const syncMoodSummary = () => loadMoodSummary()
    window.addEventListener('mindcare-data-updated', syncMoodSummary)
    window.addEventListener('storage', syncMoodSummary)

    return () => {
      window.removeEventListener('mindcare-data-updated', syncMoodSummary)
      window.removeEventListener('storage', syncMoodSummary)
    }
  }, [])

  const trendMax = useMemo(() => Math.max(1, ...moodSummary.map((item) => item.average || 0)), [moodSummary])

  return (
    <>
      <PageHeading eyebrow="Your space" title="A little check-in with yourself." description="Use this space to reflect, try a calming activity, and keep track of small steps that support your wellbeing." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <FeatureCard icon={Activity} title="Daily reflection" description="Pause and notice how you have been feeling." to="/#check-in" action="Start a check-in" />
        <FeatureCard icon={BookOpen} title="Mood journal" description="Put a few words to what is on your mind." to="/journal" action="Open journal" />
        <FeatureCard icon={CalendarCheck} title="Self-care planner" description="Set gentle intentions and nourish your routine." to="/planner" action="Open planner" />
        <FeatureCard icon={Wind} title="Calm toolkit" description="Try a breathing or grounding exercise." to="/toolkit" action="Explore toolkit" />
      </div>

      <section style={{ ...cardStyle, marginTop: 18, background: '#e7f0e5', display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ width: 48, height: 48, flexShrink: 0, display: 'grid', placeItems: 'center', background: '#d5e7d4', color: green, borderRadius: 15 }}><Heart size={23} /></span>
        <div>
          <p className="eyebrow" style={{ marginBottom: 7 }}>A gentle reminder</p>
          <h2 style={{ margin: 0, fontSize: 18, color: '#273a32' }}>Progress can be small and still matter.</h2>
          <p style={{ margin: '7px 0 0', color: muted, fontSize: 13, lineHeight: 1.7 }}>There is no need to solve everything at once. Choose one manageable next step for today.</p>
        </div>
      </section>

      <section style={{ ...cardStyle, marginTop: 18, display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: 14, background: paleGreen, color: green, display: 'grid', placeItems: 'center' }}><Sparkles size={20} /></span>
          <div>
            <p className="eyebrow" style={{ marginBottom: 4 }}>Daily affirmation</p>
            <h2 style={{ margin: 0, fontSize: 18, color: '#273a32' }}>“{affirmation}”</h2>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Mood trend</p>
            <span style={{ fontSize: 11, color: muted }}>Last 7 days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', gap: 10, minHeight: 120, paddingTop: 10 }}>
            {moodSummary.map((item) => (
              <div key={item.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end', minHeight: 92 }}>
                  <div
                    title={item.average ? `${item.average}/5 mood average` : 'No entries'}
                    style={{
                      width: '100%',
                      maxWidth: 26,
                      height: `${Math.max(8, (item.average / trendMax) * 80)}px`,
                      background: item.average ? '#7da98a' : '#edf1ee',
                      borderRadius: '8px 8px 0 0',
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: '.8px' }}>
                  {new Date(item.key).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
