import styles from './Topbar.module.css'

const DAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

export default function Topbar({ title }) {
  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.chip}>{dateStr}</div>
    </div>
  )
}
