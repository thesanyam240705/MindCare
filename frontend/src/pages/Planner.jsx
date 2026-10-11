import { useState, useEffect } from 'react'
import {
  CalendarCheck,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Droplets,
  Sun,
  Moon,
  Footprints,
  RotateCcw,
  Leaf,
  Coffee,
  Smile,
  ShieldCheck
} from 'lucide-react'

const green = '#2e6e56'
const paleGreen = '#e8f1e8'
const muted = '#718075'
const border = '#e1e8df'
const cardStyle = {
  background: '#fff',
  border: `1px solid ${border}`,
  borderRadius: 18,
  padding: 22,
  boxShadow: '0 12px 35px #293e3208',
}

const defaultSuggestions = [
  { id: 'sug-1', text: 'Step outside for 5 minutes of fresh air', category: 'Mind' },
  { id: 'sug-2', text: 'Gentle neck and shoulder stretch', category: 'Body' },
  { id: 'sug-3', text: 'Drink a soothing glass of warm water or tea', category: 'Body' },
  { id: 'sug-4', text: 'Send a quick caring thought or message to someone', category: 'Connection' },
  { id: 'sug-5', text: 'Put your phone away 20 minutes before bedtime', category: 'Rest' },
  { id: 'sug-6', text: 'Notice three pleasant things around you right now', category: 'Mind' },
]

function PageHeading({ eyebrow, title, description }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="eyebrow">{eyebrow}</p>
      <h1
        style={{
          fontSize: 'clamp(32px, 4vw, 46px)',
          lineHeight: 1.12,
          letterSpacing: '-1.8px',
          margin: '0 0 12px',
          color: '#253c31',
        }}
      >
        {title}
      </h1>
      <p style={{ color: muted, fontSize: 14, lineHeight: 1.8, maxWidth: 680, margin: 0 }}>
        {description}
      </p>
    </div>
  )
}

export default function Planner() {
  const [intentions, setIntentions] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare_intentions')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback if localStorage is unavailable
    }
    return [
      { id: 1, text: 'Take three slow, conscious breaths', category: 'Mind', done: true },
      { id: 2, text: 'Step away from screens for a 10-minute break', category: 'Rest', done: false },
      { id: 3, text: 'Drink a glass of water after waking up', category: 'Body', done: false },
    ]
  })

  const [nourishment, setNourishment] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare_nourishment')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return {
      water: 2, // glasses out of 4
      walk: false,
      quietTime: true,
      windDown: false,
    }
  })

  const [activeCategory, setActiveCategory] = useState('All')
  const [customText, setCustomText] = useState('')
  const [customCategory, setCustomCategory] = useState('Mind')

  useEffect(() => {
    try {
      localStorage.setItem('mindcare_intentions', JSON.stringify(intentions))
    } catch {
      // ignore
    }
  }, [intentions])

  useEffect(() => {
    try {
      localStorage.setItem('mindcare_nourishment', JSON.stringify(nourishment))
    } catch {
      // ignore
    }
  }, [nourishment])

  const categories = ['All', 'Body', 'Mind', 'Rest', 'Connection']

  function toggleIntention(id) {
    setIntentions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  function deleteIntention(id) {
    setIntentions((prev) => prev.filter((item) => item.id !== id))
  }

  function addCustomIntention(e) {
    e.preventDefault()
    if (!customText.trim()) return
    setIntentions((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: customText.trim(),
        category: customCategory,
        done: false,
      },
    ])
    setCustomText('')
  }

  function addSuggestion(suggestion) {
    if (intentions.some((item) => item.text === suggestion.text)) return
    setIntentions((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: suggestion.text,
        category: suggestion.category,
        done: false,
      },
    ])
  }

  function resetPlan() {
    setIntentions([])
    setNourishment({ water: 0, walk: false, quietTime: false, windDown: false })
  }

  const completedCount = intentions.filter((i) => i.done).length
  const totalCount = intentions.length
  const filteredIntentions =
    activeCategory === 'All'
      ? intentions
      : intentions.filter((item) => item.category === activeCategory)

  return (
    <>
      <PageHeading
        eyebrow="Daily wellbeing"
        title="Gentle Self-Care Planner"
        description="A compassionate space to set small, manageable intentions for your day. Focus on nourishment, restful pauses, and gentle routines without any guilt or pressure."
      />

      {/* Top Nourishment Micro-Habits */}
      <section style={{ ...cardStyle, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: paleGreen,
                color: green,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Heart size={20} />
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, color: '#273a32' }}>Daily Nourishment Foundations</h2>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: muted }}>
                Tiny check-ins to support your body and mind throughout the day.
              </p>
            </div>
          </div>
          <button
            onClick={resetPlan}
            style={{
              background: 'transparent',
              border: `1px solid ${border}`,
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 11,
              color: muted,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RotateCcw size={13} /> Reset day
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {/* Hydration */}
          <div
            style={{
              background: '#f9fbf8',
              border: `1px solid ${border}`,
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Droplets size={18} color="#458a69" />
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Hydration</strong>
                <span style={{ fontSize: 11, color: muted }}>{nourishment.water} of 4 glasses</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() =>
                    setNourishment((prev) => ({
                      ...prev,
                      water: prev.water >= step ? step - 1 : step,
                    }))
                  }
                  aria-label={`Water glass ${step}`}
                  style={{
                    flex: 1,
                    height: 28,
                    borderRadius: 8,
                    border: `1px solid ${nourishment.water >= step ? green : border}`,
                    background: nourishment.water >= step ? '#dcefe5' : '#fff',
                    color: nourishment.water >= step ? green : '#9cb0a2',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {nourishment.water >= step ? '✓' : step}
                </button>
              ))}
            </div>
          </div>

          {/* Gentle Movement */}
          <div
            onClick={() => setNourishment((prev) => ({ ...prev, walk: !prev.walk }))}
            style={{
              background: nourishment.walk ? '#f0f7ef' : '#f9fbf8',
              border: `1px solid ${nourishment.walk ? '#68a27a' : border}`,
              borderRadius: 14,
              padding: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'background 0.15s, border 0.15s',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: nourishment.walk ? '#dcefe5' : '#eef3ed',
                display: 'grid',
                placeItems: 'center',
                color: nourishment.walk ? green : muted,
              }}
            >
              <Footprints size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 13, display: 'block', color: nourishment.walk ? green : '#273a32' }}>
                Gentle Movement
              </strong>
              <span style={{ fontSize: 11, color: muted }}>
                {nourishment.walk ? 'Completed today' : 'Stretch, stroll or walk'}
              </span>
            </div>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `1px solid ${nourishment.walk ? green : border}`,
                background: nourishment.walk ? green : '#fff',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 11,
              }}
            >
              {nourishment.walk && '✓'}
            </span>
          </div>

          {/* Mindful Pause */}
          <div
            onClick={() => setNourishment((prev) => ({ ...prev, quietTime: !prev.quietTime }))}
            style={{
              background: nourishment.quietTime ? '#f0f7ef' : '#f9fbf8',
              border: `1px solid ${nourishment.quietTime ? '#68a27a' : border}`,
              borderRadius: 14,
              padding: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'background 0.15s, border 0.15s',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: nourishment.quietTime ? '#dcefe5' : '#eef3ed',
                display: 'grid',
                placeItems: 'center',
                color: nourishment.quietTime ? green : muted,
              }}
            >
              <Sun size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 13, display: 'block', color: nourishment.quietTime ? green : '#273a32' }}>
                Mindful Pause
              </strong>
              <span style={{ fontSize: 11, color: muted }}>
                {nourishment.quietTime ? 'Paused for quiet' : '5 mins of stillness'}
              </span>
            </div>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `1px solid ${nourishment.quietTime ? green : border}`,
                background: nourishment.quietTime ? green : '#fff',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 11,
              }}
            >
              {nourishment.quietTime && '✓'}
            </span>
          </div>

          {/* Screen-Free Wind Down */}
          <div
            onClick={() => setNourishment((prev) => ({ ...prev, windDown: !prev.windDown }))}
            style={{
              background: nourishment.windDown ? '#f0f7ef' : '#f9fbf8',
              border: `1px solid ${nourishment.windDown ? '#68a27a' : border}`,
              borderRadius: 14,
              padding: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'background 0.15s, border 0.15s',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: nourishment.windDown ? '#dcefe5' : '#eef3ed',
                display: 'grid',
                placeItems: 'center',
                color: nourishment.windDown ? green : muted,
              }}
            >
              <Moon size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 13, display: 'block', color: nourishment.windDown ? green : '#273a32' }}>
                Screen Rest
              </strong>
              <span style={{ fontSize: 11, color: muted }}>
                {nourishment.windDown ? 'Screens set aside' : 'Unplug before sleep'}
              </span>
            </div>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `1px solid ${nourishment.windDown ? green : border}`,
                background: nourishment.windDown ? green : '#fff',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 11,
              }}
            >
              {nourishment.windDown && '✓'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Intentions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18, alignItems: 'start' }}>
        {/* Left: Intentions Checklist */}
        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: paleGreen,
                  color: green,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <CalendarCheck size={20} />
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, color: '#273a32' }}>Today's Intentions</h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: muted }}>
                  {totalCount === 0
                    ? 'No intentions added yet'
                    : `${completedCount} of ${totalCount} explored`}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ height: 6, borderRadius: 99, background: '#edf1eb', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(completedCount / totalCount) * 100}%`,
                    background: green,
                    borderRadius: 99,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 11, color: muted, fontStyle: 'italic' }}>
                {completedCount === totalCount
                  ? 'Wonderful! You gave yourself space today.'
                  : 'Take your time. There is no requirement to finish everything.'}
              </p>
            </div>
          )}

          {/* Category filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  border: `1px solid ${activeCategory === cat ? '#68a27a' : border}`,
                  background: activeCategory === cat ? '#f0f7ef' : '#fff',
                  color: activeCategory === cat ? green : muted,
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 11,
                  fontWeight: activeCategory === cat ? 700 : 500,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Intentions List */}
          {filteredIntentions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 14px', background: '#fafbf9', borderRadius: 14, border: `1px dashed ${border}` }}>
              <Smile size={28} color="#90a395" style={{ margin: '0 auto 8px' }} />
              <p style={{ margin: 0, fontSize: 13, color: muted }}>
                No intentions in this category yet.
              </p>
              <small style={{ color: '#8d9c90', fontSize: 11 }}>
                Choose one from the suggested list or create a custom one below.
              </small>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {filteredIntentions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 12,
                    background: item.done ? '#f4f8f3' : '#fff',
                    border: `1px solid ${item.done ? '#d5e7d5' : border}`,
                    transition: 'background 0.15s, border 0.15s',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleIntention(item.id)}
                    aria-label={item.done ? 'Mark incomplete' : 'Mark complete'}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      border: `1px solid ${item.done ? green : '#cbd6cc'}`,
                      background: item.done ? green : '#fff',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.done && <Check size={14} />}
                  </button>

                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: item.done ? '#65776c' : '#273a32',
                      textDecoration: item.done ? 'line-through' : 'none',
                    }}
                  >
                    {item.text}
                  </span>

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 99,
                      background: '#edf4ec',
                      color: green,
                    }}
                  >
                    {item.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteIntention(item.id)}
                    aria-label="Delete intention"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#9aa99e',
                      padding: 4,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add custom intention input */}
          <form onSubmit={addCustomIntention} style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${border}` }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#273a32' }}>
              Add a personal intention
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                placeholder="What gentle step would feel good today?"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  fontSize: 13,
                  outlineColor: '#8ab59b',
                }}
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                style={{
                  padding: '9px 10px',
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  fontSize: 12,
                  background: '#fff',
                  color: '#273a32',
                }}
              >
                <option value="Body">Body</option>
                <option value="Mind">Mind</option>
                <option value="Rest">Rest</option>
                <option value="Connection">Connection</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!customText.trim()}
              className="button button-primary"
              style={{ fontSize: 12, minHeight: 38, width: '100%' }}
            >
              <Plus size={15} /> Add to my plan
            </button>
          </form>
        </section>

        {/* Right: Gentle Suggestions & Compassion Notes */}
        <div style={{ display: 'grid', gap: 18 }}>
          {/* Quick Suggestions Card */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: paleGreen,
                  color: green,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={20} />
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, color: '#273a32' }}>Gentle Suggestions</h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: muted }}>
                  Click to add any small step that resonates with you.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              {defaultSuggestions.map((item) => {
                const alreadyAdded = intentions.some((i) => i.text === item.text)
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 11,
                      background: '#f8faf7',
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 12, color: '#33483c', display: 'block' }}>
                        {item.text}
                      </span>
                      <span style={{ fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {item.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addSuggestion(item)}
                      disabled={alreadyAdded}
                      style={{
                        padding: '5px 9px',
                        fontSize: 11,
                        borderRadius: 8,
                        border: `1px solid ${alreadyAdded ? '#cbd6cc' : border}`,
                        background: alreadyAdded ? '#eef3ed' : '#fff',
                        color: alreadyAdded ? '#809185' : green,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 600,
                      }}
                    >
                      {alreadyAdded ? 'Added' : <><Plus size={13} /> Add</>}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Gentle Reminder Note */}
          <section
            style={{
              ...cardStyle,
              background: '#e7f0e5',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#d5e7d4',
                color: green,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Leaf size={22} />
            </span>
            <div>
              <p className="eyebrow" style={{ marginBottom: 6 }}>
                A compassionate reminder
              </p>
              <h3 style={{ margin: 0, fontSize: 15, color: '#273a32' }}>
                Self-care is not a performance.
              </h3>
              <p style={{ margin: '6px 0 0', color: muted, fontSize: 12, lineHeight: 1.7 }}>
                You do not need to earn rest or check off every single intention. Simply noticing what your body and mind need is already a kind, mindful step forward.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
