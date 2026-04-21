const NAV = [
  { id: 'dashboard', label: 'Dashboard',   color: '#007AFF' },
  { id: 'files',     label: 'Design Files', color: '#AF52DE' },
]

const s = {
  sidebar: { background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '3px', minHeight: '100vh', position: 'sticky', top: 0 },
  logoArea: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px 20px', borderBottom: '1px solid var(--border)', marginBottom: '8px' },
  logoLabel: { fontSize: '13px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.2px' },
  logoSub: { fontSize: '10px', color: 'var(--text3)', marginTop: '1px' },
  section: { fontSize: '10px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase', padding: '10px 10px 6px' },
  navBase: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', border: 'none', background: 'transparent', color: 'var(--text2)', fontSize: '13px', fontWeight: 400, width: '100%', textAlign: 'left', cursor: 'pointer', transition: '0.12s' },
  dot: (color) => ({ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }),
}

export default function Sidebar({ current, onChange, onLogout }) {
  return (
    <aside style={s.sidebar}>
      <div style={s.logoArea}>
        <svg width="44" height="22" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="50" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="#1D1D1F" letterSpacing="-3">ZEZE</text>
        </svg>
        <div>
          <div style={s.logoLabel}>Brand OS</div>
          <div style={s.logoSub}>Studio Dashboard</div>
        </div>
      </div>

      <div style={s.section}>Workspace</div>

      {NAV.map(item => (
        <button
          key={item.id}
          style={{
            ...s.navBase,
            ...(current === item.id ? { background: 'var(--blue2)', color: 'var(--blue)', fontWeight: 500 } : {}),
          }}
          onClick={() => onChange(item.id)}
        >
          <span style={s.dot(item.color)} />
          {item.label}
        </button>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onLogout}
          style={{ ...s.navBase, color: 'var(--red)', width: '100%' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--red2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '14px' }}>⎋</span>
          Ausloggen
        </button>
        <div style={{ fontSize: '11px', color: 'var(--text3)', padding: '8px 10px 0' }}>
          ZEZE © {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  )
}
