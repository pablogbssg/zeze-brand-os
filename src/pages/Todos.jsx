import { useState } from 'react'
import styles from './Todos.module.css'

const PRIO = {
  h: { label: 'Hoch', cls: styles.prioH },
  m: { label: 'Mittel', cls: styles.prioM },
  l: { label: 'Niedrig', cls: styles.prioL },
}

const INITIAL = {
  day: [
    { id: 1, text: 'Fotoshooting Outfit auswählen', prio: 'h', done: false },
    { id: 2, text: 'Instagram Post planen', prio: 'm', done: false },
    { id: 3, text: 'Lieferanten-Mail beantworten', prio: 'l', done: true },
  ],
  week: [
    { id: 4, text: 'Lieferant für Stickerei kontaktieren', prio: 'h', done: false },
    { id: 5, text: 'Preiskalkulation SS25 finalisieren', prio: 'm', done: false },
    { id: 6, text: 'Website-Banner aktualisieren', prio: 'l', done: false },
  ],
}

function TodoList({ items, onToggle, onDelete, onAdd, scope }) {
  const [text, setText] = useState('')
  const [prio, setPrio] = useState('m')
  const open = items.filter(t => !t.done).length

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(scope, text.trim(), prio)
    setText('')
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHead}>
        <span className={styles.blockTitle}>
          {scope === 'day' ? 'Heute' : 'Diese Woche'}
        </span>
        <span className={`${styles.badge} ${scope === 'day' ? styles.badgeDay : styles.badgeWeek}`}>
          {open} offen
        </span>
      </div>

      <div className={styles.list}>
        {items.map(item => (
          <div key={item.id} className={`${styles.item} ${item.done ? styles.done : ''}`}>
            <button
              className={`${styles.check} ${item.done ? styles.checked : ''}`}
              onClick={() => onToggle(scope, item.id)}
            >
              {item.done ? '✓' : ''}
            </button>
            <div className={styles.itemBody}>
              <div className={`${styles.itemText} ${item.done ? styles.strikethrough : ''}`}>
                {item.text}
              </div>
              <span className={`${styles.prioTag} ${PRIO[item.prio].cls}`}>
                {PRIO[item.prio].label}
              </span>
            </div>
            <button className={styles.del} onClick={() => onDelete(scope, item.id)}>✕</button>
          </div>
        ))}
        {items.length === 0 && (
          <p className={styles.empty}>Keine Aufgaben. Gut gemacht! 🎉</p>
        )}
      </div>

      <div className={styles.addRow}>
        <input
          type="text"
          placeholder="Neue Aufgabe…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className={styles.input}
        />
        <select
          value={prio}
          onChange={e => setPrio(e.target.value)}
          className={styles.select}
        >
          <option value="l">Niedrig</option>
          <option value="m">Mittel</option>
          <option value="h">Hoch</option>
        </select>
        <button className={styles.btn} onClick={handleAdd}>+</button>
      </div>
    </div>
  )
}

export default function Todos() {
  const [todos, setTodos] = useState(INITIAL)
  const [nextId, setNextId] = useState(10)

  const toggle = (scope, id) => {
    setTodos(prev => ({
      ...prev,
      [scope]: prev[scope].map(t => t.id === id ? { ...t, done: !t.done } : t)
    }))
  }

  const del = (scope, id) => {
    setTodos(prev => ({
      ...prev,
      [scope]: prev[scope].filter(t => t.id !== id)
    }))
  }

  const add = (scope, text, prio) => {
    setTodos(prev => ({
      ...prev,
      [scope]: [{ id: nextId, text, prio, done: false }, ...prev[scope]]
    }))
    setNextId(n => n + 1)
  }

  return (
    <div className={styles.grid}>
      <TodoList items={todos.day} onToggle={toggle} onDelete={del} onAdd={add} scope="day" />
      <TodoList items={todos.week} onToggle={toggle} onDelete={del} onAdd={add} scope="week" />
    </div>
  )
}
