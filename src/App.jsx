import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Files from './pages/Files.jsx'
import Todos from './pages/Todos.jsx'
import Login from './pages/Login.jsx'

const TITLES = { dashboard: 'Dashboard', todos: 'Aufgaben', files: 'Design Files' }

export default function App() {
  const [page, setPage]         = useState('dashboard')
  const [session, setSession]   = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (checking) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <p style={{ color:'var(--text3)', fontSize:'13px' }}>Laden…</p>
    </div>
  )

  if (!session) return <Login />

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'100vh' }}>
      <Sidebar current={page} onChange={setPage} onLogout={handleLogout} />
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', overflow:'hidden' }}>
        <Topbar title={TITLES[page]} />
        <div style={{ flex:1, padding:'20px 28px 32px', overflowY:'auto' }}>
          {page === 'dashboard' && <Dashboard />}
          {page === 'todos'     && <Todos />}
          {page === 'files'     && <Files />}
        </div>
      </div>
    </div>
  )
}
