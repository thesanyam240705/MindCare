import { useState, useEffect } from 'react'
import { CalendarDays, ArrowRight } from 'lucide-react'

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

export default function Journal() {
  const [mood, setMood] = useState('Okay')
  const [note, setNote] = useState('')
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare_journal_entries')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const moods = ['Very low', 'Low', 'Okay', 'Good', 'Great']

  useEffect(() => {
    try {
      localStorage.setItem('mindcare_journal_entries', JSON.stringify(entries))
    } catch {
      // ignore storage errors in restricted browsers
    }
  }, [entries])

  function addEntry(event) {
    event.preventDefault()
    if (!note.trim()) return
    const nextEntry = {
      id: Date.now(),
      mood,
      note: note.trim(),
      date: new Date().toISOString().slice(0, 10),
    }
    setEntries((current) => [nextEntry, ...current])
    window.dispatchEvent(new CustomEvent('mindcare-data-updated'))
    setNote('')
  }

  return (
    <>
      <PageHeading eyebrow="Mood journal" title="Make room for your feelings." description="A private space in this session to name your mood and write down what is on your mind. You do not need to make your entry perfect." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', gap: 18 }}>
        <form onSubmit={addEntry} style={cardStyle}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>How are you feeling today?</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {moods.map((item) => (
              <button key={item} type="button" onClick={() => setMood(item)} aria-pressed={mood === item} style={{ border: `1px solid ${mood === item ? '#68a27a' : border}`, background: mood === item ? '#f0f7ef' : '#fff', color: mood === item ? green : muted, borderRadius: 999, padding: '9px 12px', fontSize: 12 }}>{item}</button>
            ))}
          </div>
          <label htmlFor="journal-note" style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 9 }}>Anything you would like to note?</label>
          <textarea id="journal-note" value={note} onChange={(event) => setNote(event.target.value)} rows={5} placeholder="What stood out today? What might you need right now?" style={{ width: '100%', resize: 'vertical', boxSizing: 'border-box', padding: 13, border: `1px solid ${border}`, borderRadius: 12, font: 'inherit', fontSize: 13, lineHeight: 1.7, outlineColor: '#8ab59b' }} />
          <button type="submit" className="button button-primary" disabled={!note.trim()} style={{ marginTop: 14 }}>Add journal entry <ArrowRight size={16} /></button>
          <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, marginBottom: 0 }}>Entries are held in page memory only and will disappear when you refresh or leave this page.</p>
        </form>
        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 14, background: '#e8f1e8', color: green, display: 'grid', placeItems: 'center' }}><CalendarDays size={20} /></span>
            <div><h2 style={{ margin: 0, fontSize: 16, color: '#273a32' }}>Your entries</h2><p style={{ margin: '4px 0 0', fontSize: 12, color: muted }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'} in this session</p></div>
          </div>
          {entries.length === 0 ? (
            <p style={{ fontSize: 13, lineHeight: 1.7, color: muted, marginBottom: 0 }}>Your entries will appear here. There is no pressure to write every day.</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {entries.map((entry) => (
                <article key={entry.id} style={{ borderTop: `1px solid ${border}`, paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, color: green, fontSize: 11, fontWeight: 700 }}><span>{entry.mood}</span><span>{entry.date}</span></div>
                  <p style={{ color: '#5e7064', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 0 }}>{entry.note}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
