import { Activity, ArrowRight, BookOpen, Heart, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  return (
    <>
      <PageHeading eyebrow="Your space" title="A little check-in with yourself." description="Use this space to reflect, try a calming activity, and keep track of small steps that support your wellbeing." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <FeatureCard icon={Activity} title="Daily reflection" description="Pause and notice how you have been feeling." to="/#check-in" action="Start a check-in" />
        <FeatureCard icon={BookOpen} title="Mood journal" description="Put a few words to what is on your mind." to="/journal" action="Open journal" />
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
    </>
  )
}
