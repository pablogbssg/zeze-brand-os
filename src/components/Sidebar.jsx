import styles from './Sidebar.module.css'

const navItems = [
  { id: 'calendar', label: 'Kalender', color: '#007AFF' },
  { id: 'files',    label: 'Design Files', color: '#AF52DE' },
  { id: 'todos',    label: 'Aufgaben', color: '#FF9F0A' },
]

export default function Sidebar({ current, onChange }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <svg width="44" height="22" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="50" fontFamily="Arial Black, sans-serif" fontSize="56"
            fontWeight="900" fill="#1D1D1F" letterSpacing="-3">ZEZE</text>
        </svg>
        <div>
          <div className={styles.logoLabel}>Brand OS</div>
          <div className={styles.logoSub}>Studio Dashboard</div>
        </div>
      </div>

      <div className={styles.section}>Workspace</div>

      {navItems.map(item => (
        <button
          key={item.id}
          className={`${styles.navItem} ${current === item.id ? styles.active : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className={styles.dot} style={{ background: item.color }} />
          {item.label}
        </button>
      ))}

      <div className={styles.spacer} />
      <div className={styles.footer}>ZEZE © {new Date().getFullYear()}</div>
    </aside>
  )
}
