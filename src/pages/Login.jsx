import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email oder Passwort falsch.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <svg width="90" height="28" viewBox="0 0 180 55" style={{ display:'block', margin:'0 auto 8px' }}>
            <defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#F472B6"/></linearGradient></defs>
            <text x="0" y="46" fontFamily="Arial Black,sans-serif" fontSize="52" fontWeight="900" fill="url(#lg2)" letterSpacing="-3">ZEZE</text>
          </svg>
          <p style={{ fontSize:'13px', color:'var(--text2)' }}>Brand OS · Studio Dashboard</p>
        </div>
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          <div>
            <label style={{ fontSize:'12px', fontWeight:500, color:'var(--text2)', display:'block', marginBottom:'6px' }}>Email</label>
            <input type="email" placeholder="hallo@zeze.com" value={email} onChange={e=>setEmail(e.target.value)} required
              style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'10px', padding:'10px 14px', fontSize:'14px', color:'var(--text)', outline:'none' }} />
          </div>
          <div>
            <label style={{ fontSize:'12px', fontWeight:500, color:'var(--text2)', display:'block', marginBottom:'6px' }}>Passwort</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required
              style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'10px', padding:'10px 14px', fontSize:'14px', color:'var(--text)', outline:'none' }} />
          </div>
          {error && <div style={{ background:'var(--prio-h-bg)', color:'var(--prio-h-c)', fontSize:'13px', padding:'10px 14px', borderRadius:'8px', fontWeight:500 }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ marginTop:'8px', background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:'10px', padding:'12px', fontSize:'14px', fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
            {loading ? 'Einloggen…' : 'Einloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
