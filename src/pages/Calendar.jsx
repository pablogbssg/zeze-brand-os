import { useState } from 'react'
import styles from './Calendar.module.css'

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const DAY_NAMES = ['Mo','Di','Mi','Do','Fr','Sa','So']
const EVENT_COLORS = [styles.c0, styles.c1, styles.c2, styles.c3]

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const today = new Date()

export default function Calendar() {
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [events, setEvents] = useState({
    [fmtDate(today)]: ['Drop SS25', 'Fotoshoot'],
  })
  const [newDate, setNewDate] = useState(fmtDate(today))
  const [newText, setNewText] = useState('')

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevTotal = new Date(year, month, 0).getDate()
  const startOffset = (firstDay.getDay() || 7) - 1

  const addEvent = () => {
    if (!newDate || !newText.trim()) return
    setEvents(prev => ({
      ...prev,
      [newDate]: [...(prev[newDate] || []), newText.trim()]
    }))
    setNewText('')
  }

  const cells = []
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: prevTotal - startOffset + 1 + i, current: false })
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, current: true })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.month}>{MONTHS[month]} {year}</span>
          <div className={styles.navBtns}>
            <button onClick={() => setCurrent(new Date(year, month - 1, 1))}>‹</button>
            <button onClick={() => setCurrent(new Date(year, month + 1, 1))}>›</button>
          </div>
        </div>

        <div className={styles.grid}>
          {DAY_NAMES.map(d => (
            <div key={d} className={styles.dayName}>{d}</div>
          ))}

          {cells.map((cell, i) => {
            const key = cell.current ? fmtDate(new Date(year, month, cell.day)) : null
            const isToday = key === fmtDate(today)
            return (
              <div
                key={i}
                className={`${styles.cell} ${!cell.current ? styles.other : ''} ${isToday ? styles.today : ''}`}
              >
                <div className={styles.dayNum}>{cell.day}</div>
                {key && (events[key] || []).map((ev, ei) => (
                  <div key={ei} className={`${styles.event} ${EVENT_COLORS[ei % 4]}`}>{ev}</div>
                ))}
              </div>
            )
          })}
        </div>

        <div className={styles.addRow}>
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className={styles.input}
            style={{ maxWidth: 140 }}
          />
          <input
            type="text"
            placeholder="Event hinzufügen…"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEvent()}
            className={styles.input}
            style={{ flex: 1 }}
          />
          <button className={styles.btn} onClick={addEvent}>Hinzufügen</button>
        </div>
      </div>
    </div>
  )
}
