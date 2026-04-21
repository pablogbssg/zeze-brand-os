import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const DAY_NAMES = ['Mo','Di','Mi','Do','Fr','Sa','So']
const EVENT_COLORS = [
  { bg: '#E8F1FF', color: '#007AFF' },
  { bg: '#FFF3DC', color: '#FF9F0A' },
  { bg: '#F3E8FF', color: '#AF52DE' },
  { bg: '#E4F8EA', color: '#34C759' },
]
const PRIO = {
  h: { label: 'Hoch',    bg: '#FFECEC', color: '#FF3B30' },
  m: { label: 'Mittel',  bg: '#FFF3DC', color: '#FF9F0A' },
  l: { label: 'Niedrig', bg: '#E4F8EA', color: '#34C759' },
}
const ASSIGNEES = [
  { id: 'alle',  label: 'Alle',  avatar: '👥', color: '#6E6E73', bg: '#F5F5F7' },
  { id: 'pablo', label: 'Pablo', avatar: 'P',  color: '#007AFF', bg: '#E8F1FF' },
  { id: 'raf',   label: 'Raf',   avatar: 'R',  color: '#AF52DE', bg: '#F3E8FF' },
]

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const TODAY = new Date()

function Avatar({ assignee, size = 24 }) {
  const a = ASSIGNEES.find(x => x.id === assignee) || ASSIGNEES[0]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: a.bg, color: a.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size === 24 ? '11px' : '13px', fontWeight: 600, flexShrink: 0,
      border: `1.5px solid ${a.color}22`
    }}>
      {a.avatar}
    </div>
  )
}

export default function Dashboard() {
  const [events, setEvents] = useState({})
  const [todos, setTodos]   = useState([])
  const [calDate, setCalDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [newEvtDate, setNewEvtDate] = useState(fmtDate(TODAY))
  const [newEvtText, setNewEvtText] = useState('')
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoPrio, setNewTodoPrio] = useState('m')
  const [newTodoAssignee, setNewTodoAssignee] = useState('alle')
  const [newTodoScope, setNewTodoScope] = useState('day')
  const [filterAssignee, setFilterAssignee] = useState('alle')

  useEffect(() => {
    loadEvents()
    loadTodos()
  }, [])

  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').order('created_at')
    if (data) {
      const map = {}
      data.forEach(ev => {
        if (!map[ev.date]) map[ev.date] = []
        map[ev.date].push({ id: ev.id, text: ev.text })
      })
      setEvents(map)
    }
  }

  async function loadTodos() {
    const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: false })
    if (data) setTodos(data)
  }

  async function addEvent() {
    if (!newEvtDate || !newEvtText.trim()) return
    const { data, error } = await supabase.from('events').insert({ date: newEvtDate, text: newEvtText.trim() }).select().single()
    if (!error && data) {
      setEvents(prev => ({ ...prev, [newEvtDate]: [...(prev[newEvtDate] || []), { id: data.id, text: data.text }] }))
      setNewEvtText('')
    }
  }

  async function deleteEvent(date, id) {
    await supabase.from('events').delete().eq('id', id)
    setEvents(prev => ({ ...prev, [date]: (prev[date] || []).filter(e => e.id !== id) }))
  }

  async function addTodo() {
    if (!newTodoText.trim()) return
    const { data, error } = await supabase.from('todos').insert({ text: newTodoText.trim(), prio: newTodoPrio, scope: newTodoScope, done: false, assignee: newTodoAssignee }).select().single()
    if (!error && data) { setTodos(prev => [data, ...prev]); setNewTodoText('') }
  }

  async function toggleTodo(todo) {
    await supabase.from('todos').update({ done: !todo.done }).eq('id', todo.id)
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))
  }

  async function deleteTodo(id) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  // Calendar cells
  const year = calDate.getFullYear(), month = calDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevTotal = new Date(year, month, 0).getDate()
  const startOffset = (firstDay.getDay() || 7) - 1
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push({ day: prevTotal - startOffset + 1 + i, current: false })
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, current: true })

  const filteredTodos = filterAssignee === 'alle' ? todos : todos.filter(t => t.assignee === filterAssignee)
  const dayTodos  = filteredTodos.filter(t => t.scope === 'day')
  const weekTodos = filteredTodos.filter(t => t.scope === 'week')
  const openCount = todos.filter(t => !t.done).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Offene Tasks', value: openCount, color: 'var(--blue)', bg: 'var(--blue2)' },
          { label: 'Heute fällig', value: dayTodos.filter(t => !t.done).length, color: 'var(--orange)', bg: 'var(--orange2)' },
          { label: 'Diese Woche', value: weekTodos.filter(t => !t.done).length, color: 'var(--purple)', bg: 'var(--purple2)' },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: stat.color, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main grid: Calendar + Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px', alignItems: 'start' }}>

        {/* CALENDAR */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{MONTHS[month]} {year}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['‹','›'].map((a, i) => (
                <button key={i} onClick={() => setCalDate(new Date(year, month + (i === 0 ? -1 : 1), 1))}
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', width: '28px', height: '28px', borderRadius: '7px', fontSize: '15px', color: 'var(--text2)', cursor: 'pointer' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: 'center', padding: '8px 0', fontSize: '10px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{d}</div>
            ))}
            {cells.map((cell, i) => {
              const key = cell.current ? fmtDate(new Date(year, month, cell.day)) : null
              const isToday = key === fmtDate(TODAY)
              const dayEvts = (key && events[key]) || []
              return (
                <div key={i} style={{ minHeight: '64px', borderRight: (i + startOffset) % 7 === 6 ? 'none' : '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '6px', opacity: cell.current ? 1 : 0.3 }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: isToday ? 'var(--blue)' : 'transparent', color: isToday ? 'white' : 'var(--text)', marginBottom: '3px' }}>
                    {cell.day}
                  </div>
                  {dayEvts.map((ev, ei) => (
                    <div key={ev.id} onClick={() => key && deleteEvent(key, ev.id)} title="Löschen"
                      style={{ fontSize: '9px', fontWeight: 500, borderRadius: '4px', padding: '2px 5px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', background: EVENT_COLORS[ei % 4].bg, color: EVENT_COLORS[ei % 4].color }}>
                      {ev.text}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <input type="date" value={newEvtDate} onChange={e => setNewEvtDate(e.target.value)}
              style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px', fontSize: '12px', background: 'var(--card)', color: 'var(--text)', outline: 'none', maxWidth: '130px' }} />
            <input type="text" placeholder="Event…" value={newEvtText} onChange={e => setNewEvtText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEvent()}
              style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px', fontSize: '12px', background: 'var(--card)', color: 'var(--text)', outline: 'none' }} />
            <button onClick={addEvent} style={{ background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+</button>
          </div>
        </div>

        {/* TASKS */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>Aufgaben</span>
            </div>
            {/* Assignee filter */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {ASSIGNEES.map(a => (
                <button key={a.id} onClick={() => setFilterAssignee(a.id)}
                  style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, border: '1px solid var(--border)', background: filterAssignee === a.id ? a.bg : 'var(--bg)', color: filterAssignee === a.id ? a.color : 'var(--text2)', cursor: 'pointer', transition: '0.12s' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Todo list */}
          <div style={{ maxHeight: '480px', overflowY: 'auto', padding: '8px 0' }}>
            {/* Heute */}
            {dayTodos.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 16px 4px' }}>Heute</div>
                {dayTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
                ))}
              </div>
            )}
            {/* Woche */}
            {weekTodos.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 16px 4px' }}>Diese Woche</div>
                {weekTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
                ))}
              </div>
            )}
            {filteredTodos.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--text3)', padding: '20px 16px' }}>Keine Aufgaben 🎉</p>
            )}
          </div>

          {/* Add todo */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 14px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="text" placeholder="Neue Aufgabe…" value={newTodoText} onChange={e => setNewTodoText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()}
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 11px', fontSize: '12px', background: 'var(--card)', color: 'var(--text)', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <select value={newTodoPrio} onChange={e => setNewTodoPrio(e.target.value)}
                style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', background: 'var(--card)', color: 'var(--text)', outline: 'none' }}>
                <option value="l">Niedrig</option>
                <option value="m">Mittel</option>
                <option value="h">Hoch</option>
              </select>
              <select value={newTodoAssignee} onChange={e => setNewTodoAssignee(e.target.value)}
                style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', background: 'var(--card)', color: 'var(--text)', outline: 'none' }}>
                <option value="alle">Alle</option>
                <option value="pablo">Pablo</option>
                <option value="raf">Raf</option>
              </select>
              <select value={newTodoScope} onChange={e => setNewTodoScope(e.target.value)}
                style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', background: 'var(--card)', color: 'var(--text)', outline: 'none' }}>
                <option value="day">Heute</option>
                <option value="week">Woche</option>
              </select>
              <button onClick={addTodo}
                style={{ background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete }) {
  const a = [
    { id: 'alle',  label: 'Alle',  avatar: '👥', color: '#6E6E73', bg: '#F5F5F7' },
    { id: 'pablo', label: 'Pablo', avatar: 'P',  color: '#007AFF', bg: '#E8F1FF' },
    { id: 'raf',   label: 'Raf',   avatar: 'R',  color: '#AF52DE', bg: '#F3E8FF' },
  ].find(x => x.id === (todo.assignee || 'alle'))

  const p = {
    h: { label: 'Hoch',    bg: '#FFECEC', color: '#FF3B30' },
    m: { label: 'Mittel',  bg: '#FFF3DC', color: '#FF9F0A' },
    l: { label: 'Niedrig', bg: '#E4F8EA', color: '#34C759' },
  }[todo.prio || 'm']

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 16px', borderBottom: '1px solid var(--border)', transition: '0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <button onClick={() => onToggle(todo)}
        style={{ width: '17px', height: '17px', minWidth: '17px', borderRadius: '50%', border: todo.done ? 'none' : '1.5px solid var(--border)', background: todo.done ? 'var(--green)' : 'white', cursor: 'pointer', fontSize: '9px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
        {todo.done ? '✓' : ''}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: todo.done ? 'var(--text3)' : 'var(--text)', textDecoration: todo.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{todo.text}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 500, padding: '1px 6px', borderRadius: '4px', background: p.bg, color: p.color }}>{p.label}</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '10px', background: a.bg, color: a.color }}>{a.label}</span>
        </div>
      </div>
      <button onClick={() => onDelete(todo.id)}
        style={{ background: 'none', border: 'none', fontSize: '10px', color: 'var(--text3)', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', flexShrink: 0 }}
        onMouseEnter={e => { e.currentTarget.style.background = '#FFECEC'; e.currentTarget.style.color = '#FF3B30' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text3)' }}>
        ✕
      </button>
    </div>
  )
}
