const DAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

const NAV = [
  { id:'dashboard', label:'Dashboard',    color:'linear-gradient(135deg,#7C3AED,#EC4899)' },
  { id:'board',     label:'Board',        color:'#FCD34D' },
  { id:'todos',     label:'Aufgaben',     color:'#F472B6' },
  { id:'files',     label:'Design Files', color:'#A78BFA' },
]

export default function Topbar({ title, page, onChange, theme, onToggleTheme, onLogout }) {
  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div style={{ display:'flex', alignItems:'center', padding:'0 28px', height:'56px', background:'var(--bg2)', borderBottom:'1px solid var(--border)', gap:'24px', position:'sticky', top:0, zIndex:20 }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
        <svg width="52" height="18" viewBox="0 0 180 55">
          <defs>
            <linearGradient id="tlg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA"/>
              <stop offset="100%" stopColor="#F472B6"/>
            </linearGradient>
          </defs>
          <text x="0" y="46" fontFamily="Arial Black,sans-serif" fontSize="52" fontWeight="900" fill="url(#tlg)" letterSpacing="-3">ZEZE</text>
        </svg>
        <span style={{ fontSize:'10px', color:'var(--text3)', letterSpacing:'.04em' }}>Brand OS</span>
      </div>

      {/* Divider */}
      <div style={{ width:'1px', height:'24px', background:'var(--border)', flexShrink:0 }} />

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', gap:'2px', flex:1 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => onChange(item.id)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'8px', border:'none', fontSize:'12px', fontWeight: page===item.id ? 600 : 400, color: page===item.id ? 'var(--text)' : 'var(--text2)', background: page===item.id ? 'linear-gradient(135deg,#7C3AED22,#EC489944)' : 'transparent', cursor:'pointer', transition:'.12s', fontFamily:'Inter,sans-serif' }}
            onMouseEnter={e => { if(page!==item.id) e.currentTarget.style.background='var(--bg3)' }}
            onMouseLeave={e => { if(page!==item.id) e.currentTarget.style.background='transparent' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:item.color, flexShrink:0, display:'block' }} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginLeft:'auto', flexShrink:0 }}>
        <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'20px', padding:'5px 14px', fontSize:'11px', color:'var(--text2)', fontWeight:500 }}>
          {dateStr}
        </div>
        <button onClick={onToggleTheme}
          style={{ width:32, height:32, borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg3)', color:'var(--text2)', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button onClick={onLogout}
          style={{ width:32, height:32, borderRadius:'50%', border:'none', background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', fontSize:'11px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
          title="Ausloggen">
          ZZ
        </button>
      </div>
    </div>
  )
}
