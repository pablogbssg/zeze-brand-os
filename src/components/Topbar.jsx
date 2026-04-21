const DAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

export default function Topbar({ title }) {
  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px 16px', borderBottom:'1px solid var(--border)', background:'var(--bg)', position:'sticky', top:0, zIndex:10 }}>
      <h1 style={{ fontSize:'22px', fontWeight:600, letterSpacing:'-0.4px' }}>{title}</h1>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'5px 14px', fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>
        {dateStr}
      </div>
    </div>
  )
}
