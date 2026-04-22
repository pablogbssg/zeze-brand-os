import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Files from './pages/Files.jsx'
import Todos from './pages/Todos.jsx'
import Board from './pages/Board.jsx'
import TechPack from './pages/TechPack.jsx'
import Login from './pages/Login.jsx'

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

  if (checking) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <p style={{ color:'var(--text3)', fontSize:13 }}>Laden…</p>
    </div>
  )

  if (!session) return <Login />

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Topbar
        page={page}
        onChange={setPage}
        theme={theme}
        onToggleTheme={() => setTheme(t => t==='dark'?'light':'dark')}
        onLogout={() => supabase.auth.signOut()}
      />
      <div style={{ flex:1, padding:'20px 28px 32px', overflowY:'auto' }}>
        {page==='dashboard' && <Dashboard />}
        {page==='todos'     && <Todos />}
        {page==='files'     && <Files />}
        {page==='board'     && <Board />}
        {page==='techpack'  && <TechPack />}
      </div>
    </div>
  )
}
