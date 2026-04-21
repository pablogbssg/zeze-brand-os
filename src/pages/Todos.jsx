import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const ASSIGNEES = [
  { id: 'alle',  label: 'Alle',  avatar: '👥', color: '#6E6E73', bg: '#F0F0F0' },
  { id: 'pablo', label: 'Pablo', avatar: 'P',  color: '#007AFF', bg: '#E8F1FF' },
  { id: 'raf',   label: 'Raf',   avatar: 'R',  color: '#AF52DE', bg: '#F3E8FF' },
]

const PRIO = {
  h: { label: 'Hoch',    bg: '#FFECEC', color: '#FF3B30' },
  m: { label: 'Mittel',  bg: '#FFF3DC', color: '#FF9F0A' },
  l: { label: 'Niedrig', bg: '#E4F8EA', color: '#34C759' },
}

function AssigneeAvatar({ id }) {
  const a = ASSIGNEES.find(x => x.id === id) || ASSIGNEES[0]
  return (
    <div style={{ width:26, height:26, borderRadius:'50%', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, flexShrink:0, border:`1.5px solid ${a.color}33` }}>
      {a.avatar}
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete }) {
  const p = PRIO[todo.prio || 'm']
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 16px', borderBottom:'1px solid var(--border)', transition:'0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <button onClick={() => onToggle(todo)}
        style={{ width:18, height:18, minWidth:18, borderRadius:'50%', border:todo.done?'none':'1.5px solid var(--border)', background:todo.done?'var(--green)':'white', cursor:'pointer', fontSize:'10px', color:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {todo.done ? '✓' : ''}
      </button>
      <AssigneeAvatar id={todo.assignee || 'alle'} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'13px', color:todo.done?'var(--text3)':'var(--text)', textDecoration:todo.done?'line-through':'none', lineHeight:1.4 }}>{todo.text}</div>
        <span style={{ fontSize:'10px', fontWeight:500, padding:'1px 6px', borderRadius:'4px', background:p.bg, color:p.color, display:'inline-block', marginTop:'3px' }}>{p.label}</span>
      </div>
      <button onClick={() => onDelete(todo.id)}
        style={{ background:'none', border:'none', fontSize:'11px', color:'var(--text3)', cursor:'pointer', padding:'3px 6px', borderRadius:'4px', flexShrink:0 }}
        onMouseEnter={e => { e.currentTarget.style.background='#FFECEC'; e.currentTarget.style.color='#FF3B30' }}
        onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text3)' }}>✕</button>
    </div>
  )
}

function Column({ title, todos, badgeColor, badgeBg, onToggle, onDelete, onAdd }) {
  const [text, setText]         = useState('')
  const [prio, setPrio]         = useState('m')
  const [assignee, setAssignee] = useState('alle')
  const open = todos.filter(t => !t.done).length

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(text.trim(), prio, assignee)
    setText('')
  }

  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
        <span style={{ fontSize:'15px', fontWeight:600 }}>{title}</span>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', background:badgeBg, color:badgeColor }}>{open} offen</span>
      </div>
      <div style={{ flex:1 }}>
        {todos.length === 0 && <p style={{ fontSize:'13px', color:'var(--text3)', padding:'20px 16px' }}>Keine Aufgaben 🎉</p>}
        {todos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />)}
      </div>
      <div style={{ borderTop:'1px solid var(--border)', padding:'12px 14px', background:'var(--bg)', display:'flex', flexDirection:'column', gap:'8px' }}>
        <input type="text" placeholder="Neue Aufgabe…" value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleAdd()}
          style={{ width:'100%', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 11px', fontSize:'13px', background:'var(--card)', color:'var(--text)', outline:'none' }} />
        <div style={{ display:'flex', gap:'6px' }}>
          <select value={prio} onChange={e => setPrio(e.target.value)}
            style={{ flex:1, border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 8px', fontSize:'12px', background:'var(--card)', color:'var(--text)', outline:'none' }}>
            <option value="l">Niedrig</option>
            <option value="m">Mittel</option>
            <option value="h">Hoch</option>
          </select>
          <select value={assignee} onChange={e => setAssignee(e.target.value)}
            style={{ flex:1, border:'1px solid var(--border)', borderRadius:'8px', padding:'7px 8px', fontSize:'12px', background:'var(--card)', color:'var(--text)', outline:'none' }}>
            <option value="alle">Alle</option>
            <option value="pablo">Pablo</option>
            <option value="raf">Raf</option>
          </select>
          <button onClick={handleAdd}
            style={{ background:'var(--blue)', color:'white', border:'none', borderRadius:'8px', padding:'7px 16px', fontSize:'14px', fontWeight:600, cursor:'pointer', flexShrink:0 }}>+</button>
        </div>
      </div>
    </div>
  )
}

export default function Todos() {
  const [todos, setTodos]     = useState([])
  const [filter, setFilter]   = useState('alle')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTodos() }, [])

  async function loadTodos() {
    setLoading(true)
    const { data } = await supabase.from('todos').select('*').order('created_at', { ascending:false })
    if (data) setTodos(data)
    setLoading(false)
  }

  async function addTodo(scope, text, prio, assignee) {
    const { data, error } = await supabase.from('todos').insert({ text, prio, scope, done:false, assignee }).select().single()
    if (!error && data) setTodos(prev => [data, ...prev])
  }

  async function toggleTodo(todo) {
    await supabase.from('todos').update({ done:!todo.done }).eq('id', todo.id)
    setTodos(prev => prev.map(t => t.id===todo.id ? {...t, done:!t.done} : t))
  }

  async function deleteTodo(id) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id!==id))
  }

  const filtered  = filter==='alle' ? todos : todos.filter(t => t.assignee===filter)
  const dayTodos  = filtered.filter(t => t.scope==='day')
  const weekTodos = filtered.filter(t => t.scope==='week')

  if (loading) return <p style={{ color:'var(--text3)', fontSize:'13px' }}>Laden…</p>

  return (
    <div>
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {ASSIGNEES.map(a => (
          <button key={a.id} onClick={() => setFilter(a.id)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:500, border:'1px solid var(--border)', background:filter===a.id ? a.bg : 'var(--card)', color:filter===a.id ? a.color : 'var(--text2)', cursor:'pointer', transition:'0.12s' }}>
            <span>{a.avatar}</span>{a.label}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <Column title="Heute"       todos={dayTodos}  badgeColor="var(--orange)" badgeBg="var(--orange2)" onToggle={toggleTodo} onDelete={deleteTodo} onAdd={(t,p,a) => addTodo('day',t,p,a)} />
        <Column title="Diese Woche" todos={weekTodos} badgeColor="var(--purple)" badgeBg="var(--purple2)" onToggle={toggleTodo} onDelete={deleteTodo} onAdd={(t,p,a) => addTodo('week',t,p,a)} />
      </div>
    </div>
  )
}
