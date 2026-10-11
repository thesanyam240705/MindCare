import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Leaf, ShieldCheck } from 'lucide-react'
import Home from './pages/Home.jsx'
import Journal from './pages/Journal.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Toolkit from './pages/Toolkit.jsx'
import Support from './pages/Support.jsx'
import Planner from './pages/Planner.jsx'

const green = '#2e6e56'
const paleGreen = '#e8f1e8'

const pageStyle = {
  maxWidth: 1440,
  margin: '0 auto',
  padding: '0 6.25%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}

const contentStyle = {
  width: '100%',
  maxWidth: 1000,
  margin: '0 auto',
  padding: '48px 0 72px',
  flex: 1,
}

function PageLayout({ children }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/journal', label: 'Mood journal' },
    { to: '/planner', label: 'Self-care planner' },
    { to: '/toolkit', label: 'Calm toolkit' },
    { to: '/support', label: 'Support' },
  ]

  return (
    <div style={pageStyle}>
      <header className="topbar" style={{ gap: 20, height: 'auto', minHeight: 86, flexWrap: 'wrap', padding: '16px 0' }}>
        <Link className="brand" to="/" aria-label="MindCare home">
          <span className="brand-icon"><Leaf size={20} /></span>
          <span>mindcare<span className="brand-period">.</span></span>
        </Link>
        <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              textDecoration: 'none', borderRadius: 999, padding: '9px 12px', fontSize: 12,
              fontWeight: isActive ? 700 : 500, color: isActive ? green : '#60756a',
              background: isActive ? paleGreen : 'transparent',
            })}>{item.label}</NavLink>
          ))}
        </nav>
      </header>

      <main style={contentStyle}>{children}</main>

      <footer className="footer" style={{ gap: 16, flexWrap: 'wrap' }}>
        <Link className="brand footer-brand" to="/">
          <span className="brand-icon"><Leaf size={17} /></span>
          <span>mindcare<span className="brand-period">.</span></span>
        </Link>
        <p>Built with care · Academic prototype</p>
        <Link to="/support" style={{ color: green, fontSize: 12 }}>Support resources</Link>
      </footer>
      <div className="disclaimer-bar">
        <ShieldCheck size={15} />
        <span>MindCare is not a medical service and does not diagnose or treat mental-health conditions. If you are in immediate danger, seek urgent help.</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<PageLayout><Dashboard /></PageLayout>} />
      <Route path="/journal" element={<PageLayout><Journal /></PageLayout>} />
      <Route path="/planner" element={<PageLayout><Planner /></PageLayout>} />
      <Route path="/toolkit" element={<PageLayout><Toolkit /></PageLayout>} />
      <Route path="/support" element={<PageLayout><Support /></PageLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
