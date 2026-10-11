import { useState } from 'react'
import { Activity, ArrowRight, Check, ChevronLeft, HeartHandshake, Leaf, LockKeyhole, MessageCircleHeart, ShieldCheck, Sparkles, Wind, X } from 'lucide-react'
import { submitCheckIn } from '../api.js'

const questions = [
  { key: 'mood', title: 'I have felt low or down.', area: 'Mood' },
  { key: 'stress', title: 'I have felt overwhelmed by daily stress.', area: 'Stress' },
  { key: 'sleep', title: 'I have had difficulties with sleep.', area: 'Sleep' },
  { key: 'energy', title: 'I have struggled to find energy for daily activities.', area: 'Energy' },
  { key: 'connection', title: 'I have felt disconnected from people around me.', area: 'Connection' },
]
const choices = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'On a few days' },
  { value: 2, label: 'On many days' },
  { value: 3, label: 'Nearly every day' },
]

function SafetyModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="support-heading">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close support resources"><X size={19} /></button>
        <div className="modal-icon"><HeartHandshake size={23} /></div>
        <p className="eyebrow">You deserve support</p>
        <h2 id="support-heading">Let’s focus on your safety first.</h2>
        <p className="modal-copy">MindCare is not an emergency service. If you may act on thoughts of harming yourself or someone else, or you are in immediate danger, contact emergency services or go to the nearest emergency department. Reach out to someone you trust and stay with them if you can.</p>
        <div className="resource-row">
          <div><strong>India emergency response</strong><span>For immediate danger or urgent emergency help</span></div>
          <a className="resource-number" href="tel:112">112 <ArrowRight size={15} /></a>
        </div>
        <div className="resource-row">
          <div><strong>Tele-MANAS mental health support</strong><span>Government of India mental health helpline</span></div>
          <a className="resource-number" href="tel:14416">14416 <ArrowRight size={15} /></a>
        </div>
        <p className="tiny-note">If you are outside India, use your local emergency number or crisis service. The resources above are provided as a starting point, not a replacement for urgent in-person help.</p>
      </section>
    </div>
  )
}

function ResultPanel({ result, onReset }) {
  return (
    <section className="result-panel" aria-live="polite">
      <div className="result-mark"><Check size={24} /></div>
      <p className="eyebrow">Your reflection</p>
      <h2>Thank you for checking in.</h2>
      <p className="result-lead">You selected responses adding up to <strong>{result.total} out of {result.max_total}</strong> on these five custom reflection prompts.</p>
      {result.focus_areas.length > 0 ? (
        <div className="focus-block"><span className="mini-label">Areas you marked most often</span><div className="chips">{result.focus_areas.map((area) => <span key={area} className="chip">{area}</span>)}</div></div>
      ) : <div className="focus-block"><span className="mini-label">A gentle reminder</span><p>Notice what is supporting your wellbeing today, even if it is something small.</p></div>}
      <div className="suggestion-block"><span className="mini-label">A small next step</span>{result.suggestions.map((suggestion, index) => <p key={index} className="suggestion"><span className="suggestion-dot"><Leaf size={14} /></span>{suggestion}</p>)}</div>
      <div className="notice"><ShieldCheck size={17} /><p>{result.notice}</p></div>
      <button className="button button-primary full-button" onClick={onReset}>Finish check-in <ArrowRight size={17} /></button>
    </section>
  )
}

export default function Home() {
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [showSafety, setShowSafety] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const complete = questions.every((question) => answers[question.key] !== undefined)
  const current = questions[step]

  function reset() {
    setAnswers({})
    setStep(0)
    setResult(null)
    setError('')
  }

  function choose(value) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.key]: value }))
    setError('')
  }

  async function handleSubmit() {
    if (!complete) return
    setLoading(true)
    setError('')
    try {
      setResult(await submitCheckIn(answers))
    } catch (issue) {
      setError(issue.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="MindCare home"><span className="brand-icon"><Leaf size={20} /></span><span>mindcare<span className="brand-period">.</span></span></a>
        <nav className="topnav"><a href="#how-it-works">How it works</a><button className="support-link" onClick={() => setShowSafety(true)}><HeartHandshake size={16} /> Get support</button></nav>
      </header>

      <main id="top">
        <section className="hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="status-dot" /> A little space for you</div>
            <h1>Your wellbeing<br />deserves <em>attention.</em></h1>
            <p className="hero-description">A calm place to pause, check in with yourself, and find one small step towards feeling more supported.</p>
            <div className="hero-actions"><a href="#check-in" className="button button-primary">Begin a check-in <ArrowRight size={17} /></a><button className="button button-quiet" onClick={() => setShowSafety(true)}>I need support now</button></div>
            <div className="privacy-caption"><LockKeyhole size={14} /><span>Your answers are not saved by this prototype.</span></div>
          </div>
          <div className="hero-art" aria-label="Decorative illustration of a peaceful sunrise and growing leaves">
            <div className="sun-orb" />
            <div className="hill hill-back" /><div className="hill hill-front" />
            <div className="plant plant-one"><i /><i /><i /><b /></div>
            <div className="plant plant-two"><i /><i /><b /></div>
            <div className="art-note"><span className="art-note-icon"><Wind size={17} /></span><div><strong>Pause for a moment</strong><small>There is no perfect way to feel.</small></div></div>
            <div className="art-sparkle sparkle-one"><Sparkles size={18} /></div><div className="art-sparkle sparkle-two"><Sparkles size={14} /></div>
          </div>
        </section>

        <section className="value-strip" id="how-it-works">
          <div className="value-item"><span className="value-icon"><Activity size={19} /></span><div><strong>Notice your patterns</strong><p>Reflect without judgement</p></div></div>
          <div className="value-item"><span className="value-icon"><MessageCircleHeart size={19} /></span><div><strong>Find a next step</strong><p>Small actions, at your pace</p></div></div>
          <div className="value-item"><span className="value-icon"><ShieldCheck size={19} /></span><div><strong>Designed with care</strong><p>No diagnosis or labels</p></div></div>
        </section>

        <section className="checkin-section" id="check-in">
          <div className="section-heading"><p className="eyebrow">Your personal check-in</p><h2>How have things been lately?</h2><p>Think about the last couple of weeks. Choose what feels closest to your experience. There are no right or wrong answers.</p></div>

          {!result ? <div className="checkin-card">
            <div className="card-topline"><span>WELLNESS REFLECTION</span><span>{step + 1} <i>/</i> {questions.length}</span></div>
            <div className="progress-track"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
            <div className="question-area">
              <span className="question-number">0{step + 1}</span>
              <h3>{current.title}</h3>
              <p className="question-sub">Select the frequency that fits best.</p>
              <div className="answer-list" role="group" aria-label={current.title}>
                {choices.map((choice) => <button key={choice.value} className={`answer-option ${answers[current.key] === choice.value ? 'selected' : ''}`} onClick={() => choose(choice.value)} aria-pressed={answers[current.key] === choice.value}><span className="radio-mark">{answers[current.key] === choice.value && <span />}</span><span>{choice.label}</span>{answers[current.key] === choice.value && <Check className="answer-check" size={16} />}</button>)}
              </div>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>}
            <div className="card-footer"><button className="button button-quiet back-button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ChevronLeft size={17} /> Back</button>{step < questions.length - 1 ? <button className="button button-primary" disabled={answers[current.key] === undefined} onClick={() => setStep((value) => value + 1)}>Next question <ArrowRight size={17} /></button> : <button className="button button-primary" disabled={!complete || loading} onClick={handleSubmit}>{loading ? 'Reflecting…' : 'See reflection'} <ArrowRight size={17} /></button>}</div>
          </div> : <ResultPanel result={result} onReset={reset} />}
          <p className="under-card-note"><LockKeyhole size={13} /> Your responses are processed for this check-in and are not written to a database.</p>
        </section>

        <section className="gentle-banner"><div className="banner-leaf"><Leaf size={24} /></div><div><p className="eyebrow">A note to remember</p><h2>You do not have to figure everything out today.</h2><p>Taking a pause is a meaningful start. Consider speaking with someone you trust or a qualified mental-health professional if you are concerned about how you feel.</p></div><button className="banner-arrow" onClick={() => setShowSafety(true)} aria-label="View support resources"><ArrowRight size={20} /></button></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-icon"><Leaf size={17} /></span><span>mindcare<span className="brand-period">.</span></span></a><p>Built with care · Academic prototype</p><button onClick={() => setShowSafety(true)}>Support resources</button></footer>
      <div className="disclaimer-bar"><ShieldCheck size={15} /><span>MindCare is not a medical service and does not diagnose or treat mental-health conditions. If you are in immediate danger, seek urgent help.</span></div>
      {showSafety && <SafetyModal onClose={() => setShowSafety(false)} />}
    </div>
  )
}
