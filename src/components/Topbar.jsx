const DAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

export default function Topbar({ title }) {
  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 28px 16px', borderBottom:'1px solid #1a1a1a', background:'#0D0D0D', position:'sticky', top:0, zIndex:10 }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'22px', fontWeight:700, background:'linear-gradient(135deg,#A78BFA,#F472B6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        {title}
      </h1>
      <div style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'20px', padding:'5px 14px', fontSize:'11px', color:'#666', fontWeight:500 }}>
        {dateStr}
      </div>
    </div>
  )
}
