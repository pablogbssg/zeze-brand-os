const NAV = [
  { id:'dashboard', label:'Dashboard',    color:'linear-gradient(135deg,#7C3AED,#EC4899)' },
  { id:'board',     label:'Board',        color:'#FCD34D' },
  { id:'todos',     label:'Aufgaben',     color:'#F472B6' },
  { id:'files',     label:'Design Files', color:'#A78BFA' },
]

export default function Sidebar({ current, onChange, onLogout }) {
  return (
    <aside style={{ background:'#111', borderRight:'1px solid #222', padding:'20px 12px', display:'flex', flexDirection:'column', gap:'2px', minHeight:'100vh', position:'sticky', top:0 }}>
      <div style={{ padding:'8px 10px 20px', borderBottom:'1px solid #222', marginBottom:'10px' }}>
        <svg width="70" height="22" viewBox="0 0 180 55" style={{ display:'block', marginBottom:'5px' }}>
          <defs>
            <linearGradient id="zg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA"/>
              <stop offset="100%" stopColor="#F472B6"/>
            </linearGradient>
          </defs>
          <text x="0" y="46" fontFamily="Arial Black,sans-serif" fontSize="52" fontWeight="900" fill="url(#zg)" letterSpacing="-3">ZEZE</text>
        </svg>
        <div style={{ fontSize:'10px', color:'#555', letterSpacing:'.05em' }}>Brand OS</div>
      </div>

      <div style={{ fontSize:'10px', fontWeight:600, color:'#444', letterSpacing:'.07em', textTransform:'uppercase', padding:'10px 10px 5px' }}>Workspace</div>

      {NAV.map(item => (
        <button key={item.id} onClick={() => onChange(item.id)}
          style={{ display:'flex', alignItems:'center', gap:'9px', padding:'9px 10px', borderRadius:'10px', border:'none', fontSize:'12px', fontWeight:current===item.id?500:400, color:current===item.id?'#fff':'#666', background:current===item.id?'linear-gradient(135deg,#7C3AED22,#EC489944)':'transparent', width:'100%', textAlign:'left', cursor:'pointer', transition:'.15s' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:item.color, flexShrink:0, display:'block' }} />
          {item.label}
        </button>
      ))}

      <div style={{ marginTop:'auto', paddingTop:'16px', borderTop:'1px solid #1a1a1a' }}>
        <button onClick={onLogout}
          style={{ display:'flex', alignItems:'center', gap:'9px', padding:'9px 10px', borderRadius:'10px', border:'none', background:'transparent', color:'#555', fontSize:'12px', width:'100%', cursor:'pointer' }}
          onMouseEnter={e=>{e.currentTarget.style.background='#1a0a0a';e.currentTarget.style.color='#F87171'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#555'}}>
          <span style={{ fontSize:'14px' }}>⎋</span> Ausloggen
        </button>
        <div style={{ fontSize:'10px', color:'#333', padding:'6px 10px' }}>ZEZE © {new Date().getFullYear()}</div>
      </div>
    </aside>
  )
}
