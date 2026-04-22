import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Files from './pages/Files.jsx'
import Todos from './pages/Todos.jsx'
import Board from './pages/Board.jsx'
import Login from './pages/Login.jsx'

const TITLES = { dashboard:'Dashboard', todos:'Aufgaben', files:'Design Files', board:'Board' }

export default function App() {
  const [page, setPage]         = useState('dashboard')
  const [session, setSession]   = useState(null)
  const [checking, setChecking] = useState(true)
  const [theme, setTheme]       = useState(() => localStorage.getItem('zeze-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('zeze-theme', theme)
  }, [theme])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setChecking(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  if (checking) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <p style={{ color:'var(--text3)', fontSize:13 }}>Laden…</p>
    </div>
  )

  if (!session) return <Login />

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'100vh' }}>
      <Sidebar current={page} onChange={setPage} onLogout={() => supabase.auth.signOut()} theme={theme} onToggleTheme={toggleTheme} />
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', overflow:'hidden' }}>
        <Topbar title={TITLES[page]} />
        <div style={{ flex:1, padding:'20px 28px 32px', overflowY:'auto' }}>
          {page==='dashboard' && <Dashboard />}
          {page==='todos'     && <Todos />}
          {page==='files'     && <Files />}
          {page==='board'     && <Board />}
        </div>
      </div>
    </div>
  )
}
