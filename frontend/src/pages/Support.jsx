import { HeartHandshake, MessageCircleHeart, ShieldCheck } from 'lucide-react'

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

function SupportCard({ icon: Icon, title, description, children, emphasized = false }) {
  return (
    <section style={{ ...cardStyle, ...(emphasized ? { borderColor: '#d9e7d9', background: '#f7faf5' } : {}) }}>
      <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
        <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 14, background: '#e8f1e8', color: green, display: 'grid', placeItems: 'center' }}><Icon size={22} /></span>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '1px 0 8px', color: '#273a32', fontSize: 18 }}>{title}</h2>
          <p style={{ margin: 0, color: muted, fontSize: 13, lineHeight: 1.8 }}>{description}</p>
          {children}
        </div>
      </div>
    </section>
  )
}

export default function Support() {
  return (
    <>
      <PageHeading eyebrow="Support and resources" title="You do not have to handle everything alone." description="Reaching out can be a meaningful next step. Consider contacting someone you trust or a qualified mental-health professional." />
      <div style={{ display: 'grid', gap: 16 }}>
        <SupportCard icon={HeartHandshake} title="Start with a trusted person" description="You could tell a friend, family member, mentor, or someone else you trust how you have been feeling and what kind of support would help." emphasized />
        <SupportCard icon={MessageCircleHeart} title="Professional mental-health support" description="A qualified mental-health professional can help you understand what you are experiencing and discuss appropriate options.">
          <p style={{ color: muted, fontSize: 12, lineHeight: 1.7, marginBottom: 0 }}>If you are at a school or university, you may also be able to contact its counselling service or student-wellbeing office.</p>
        </SupportCard>
        <SupportCard icon={ShieldCheck} title="Urgent support in India" description="These contacts are starting points for urgent help, not a replacement for in-person care.">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, borderTop: `1px solid ${border}`, padding: '14px 0' }}>
            <div><strong style={{ display: 'block', fontSize: 13 }}>Emergency response</strong><span style={{ color: muted, fontSize: 11 }}>For immediate danger or an emergency</span></div>
            <a href="tel:112" style={{ color: green, fontWeight: 800, fontSize: 17 }}>112</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, borderTop: `1px solid ${border}`, padding: '14px 0 0' }}>
            <div><strong style={{ display: 'block', fontSize: 13 }}>Tele-MANAS</strong><span style={{ color: muted, fontSize: 11 }}>Government of India mental-health support</span></div>
            <a href="tel:14416" style={{ color: green, fontWeight: 800, fontSize: 17 }}>14416</a>
          </div>
        </SupportCard>
        <p style={{ fontSize: 11, color: muted, lineHeight: 1.7 }}>If you may act on thoughts of harming yourself or someone else, or you are in immediate danger, call emergency services or go to the nearest emergency department. If you are outside India, use local emergency or crisis resources.</p>
      </div>
    </>
  )
}
