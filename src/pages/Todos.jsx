import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const PRIO = {
  h: { label: 'Hoch',    bg: 'var(--red2)',    color: 'var(--red)' },
  m: { label: 'Mittel',  bg: 'var(--orange2)', color: 'var(--orange)' },
  l: { label: 'Niedrig', bg: 'var(--green2)',  color: 'var(--green)' },
}

function TodoColumn({ scope, todos, onToggle, onDelete, onAdd }) {
  const [text, setText] = useState('')
  const [prio, setPrio] = useState('m')
  const open = todos.filter(t => !t.done).length

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(scope, text.trim(), prio)
    setText('')
  }

  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'18px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <span style={{ fontSize:'15px', fontWeight:600 }}>{scope === 'day' ? 'Heute' : 'Diese Woche'}</span>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', background: scope === 'day' ? 'var(--orange2)' : 'var(--purple2)', color: scope === 'day' ? 'var(--orange)' : 'var(--purple)' }}>
          {open} offen
        </span>
      </div>

      <div style={{ flex:1, marginBottom:'12px', minHeight:'80px' }}>
        {todos.length === 0 && (
          <p style={{ fontSize:'12px', color:'var(--text3)', padding:'16px 0' }}>Keine Aufgaben 🎉</p>
        )}
        {todos.map(todo => (
          <div key={todo.id} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
            <button
              onClick={() => onToggle(todo)}
              style={{ width:'18px', height:'18px', minWidth:'18px', borderRadius:'50%', border: todo.done ? 'none' : '1.5px solid var(--border)', background: todo.done ? 'var(--green)' : 'white', cursor:'pointer', fontSize:'10px', color:'white', display:'flex', alignItems:'center', justifyContent:'center', marginTop:'1px', transition:'0.12s' }}>
              {todo.done ? '✓' : ''}
            </button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'13px', color: todo.done ? 'var(--text3)' : 'var(--text)', textDecoration: todo.done ? 'line-through' : 'none', lineHeight:1.4 }}>
                {todo.text}
              </div>
              <span style={{ display:'inline-block', fontSize:'10px', fontWeight:500, padding:'2px 7px', borderRadius:'4px', marginTop:'4px', background: PRIO[todo.prio].bg, color: PRIO[todo.prio].color }}>
                {PRIO[todo.prio].label}
              </span>
            </div>
            <button onClick={() => onDelete(todo.id)}
              style={{ background:'none', border:'none', fontSize:'11px', color:'var(--text3)', cursor:'pointer', padding:'2px 5px', borderRadius:'4px' }}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'6px', paddingTop:'12px', borderTop:'1px solid var(--border)' }}>
        <input
          type="text"
          placeholder="Neue Aufgabe…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={{ flex:1, border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 11px', fontSize:'12px', background:'var(--bg)', color:'var(--text)', outline:'none', minWidth:0 }}
        />
        <select value={prio} onChange={e => setPrio(e.target.value)}
          style={{ border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 8px', fontSize:'12px', background:'var(--bg)', color:'var(--text)', outline:'none' }}>
          <option value="l">Niedrig</option>
          <option value="m">Mittel</option>
          <option value="h">Hoch</option>
        </select>
        <button onClick={handleAdd}
          style={{ background:'var(--blue)', color:'white', border:'none', borderRadius:'8px', padding:'7px 14px', fontSize:'14px', fontWeight:500, flexShrink:0 }}>
          +
        </button>
      </div>
    </div>
  )
}

export default function Todos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTodos() }, [])

  async function loadTodos() {
    setLoading(true)
    const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: false })
    if (data) setTodos(data)
    setLoading(false)
  }

  async function addTodo(scope, text, prio) {
    const { data, error } = await supabase
      .from('todos')
      .insert({ text, prio, scope, done: false })
      .select()
      .single()
    if (!error && data) setTodos(prev => [data, ...prev])
  }

  async function toggleTodo(todo) {
    const { error } = await supabase.from('todos').update({ done: !todo.done }).eq('id', todo.id)
    if (!error) setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))
  }

  async function deleteTodo(id) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const day  = todos.filter(t => t.scope === 'day')
  const week = todos.filter(t => t.scope === 'week')

  if (loading) return <p style={{ color:'var(--text3)', fontSize:'13px' }}>Laden…</p>

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
      <TodoColumn scope="day"  todos={day}  onToggle={toggleTodo} onDelete={deleteTodo} onAdd={addTodo} />
      <TodoColumn scope="week" todos={week} onToggle={toggleTodo} onDelete={deleteTodo} onAdd={addTodo} />
    </div>
  )
}
