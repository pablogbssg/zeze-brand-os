import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const ASSIGNEES = [
  { id:'alle',  label:'Alle',  avatar:'👥', color:'#9CA3AF', bg:'var(--bg3)' },
  { id:'pablo', label:'Pablo', avatar:'P',  color:'#A78BFA', bg:'#3730a366' },
  { id:'raf',   label:'Raf',   avatar:'R',  color:'#F472B6', bg:'#be185d44' },
]

function TodoItem({ todo, onToggle, onDelete, onSendToBoard }) {
  const a = ASSIGNEES.find(x=>x.id===(todo.assignee||'alle'))||ASSIGNEES[0]
  const p = {
    h:{label:'Hoch',    bg:'var(--prio-h-bg)', color:'var(--prio-h-c)'},
    m:{label:'Mittel',  bg:'var(--prio-m-bg)', color:'var(--prio-m-c)'},
    l:{label:'Niedrig', bg:'var(--prio-l-bg)', color:'var(--prio-l-c)'},
  }[todo.prio||'m']
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    await onSendToBoard(todo)
    setSent(true)
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:'1px solid var(--border)', transition:'.1s' }}
      onMouseEnter={e=>e.currentTarget.style.background='var(--card-hover)'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <button onClick={()=>onToggle(todo)}
        style={{ width:18, height:18, minWidth:18, borderRadius:'50%', border:todo.done?'none':'1.5px solid var(--border2)', background:todo.done?'linear-gradient(135deg,#7C3AED,#EC4899)':'transparent', cursor:'pointer', fontSize:10, color:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {todo.done?'✓':''}
      </button>
      <div style={{ width:26, height:26, borderRadius:'50%', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, border:`1.5px solid ${a.color}44` }}>
        {a.avatar}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, color:todo.done?'var(--text3)':'var(--text)', textDecoration:todo.done?'line-through':'none', lineHeight:1.4 }}>{todo.text}</div>
        <span style={{ fontSize:10, fontWeight:600, padding:'1px 6px', borderRadius:4, background:p.bg, color:p.color, display:'inline-block', marginTop:3 }}>{p.label}</span>
      </div>
      <button onClick={handleSend} title="Ins Board übertragen"
        style={{ background:sent?'var(--prio-l-bg)':'var(--bg3)', border:`1px solid ${sent?'var(--prio-l-c)':'var(--border2)'}`, borderRadius:7, padding:'4px 9px', fontSize:11, color:sent?'var(--prio-l-c)':'var(--text2)', cursor:'pointer', flexShrink:0, transition:'.2s', whiteSpace:'nowrap' }}
        onMouseEnter={e=>{ if(!sent){e.currentTarget.style.background='#3730a322';e.currentTarget.style.color='#A78BFA'}}}
        onMouseLeave={e=>{ if(!sent){e.currentTarget.style.background='var(--bg3)';e.currentTarget.style.color='var(--text2)'}}}>
        {sent?'✓ Gesendet':'→ Board'}
      </button>
      <button onClick={()=>onDelete(todo.id)}
        style={{ background:'none', border:'none', fontSize:11, color:'var(--text3)', cursor:'pointer', padding:'3px 6px', borderRadius:4, flexShrink:0 }}
        onMouseEnter={e=>{e.currentTarget.style.background='var(--prio-h-bg)';e.currentTarget.style.color='var(--prio-h-c)'}}
        onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text3)'}}>✕</button>
    </div>
  )
}

function Column({ title, todos, badgeColor, onToggle, onDelete, onAdd, onSendToBoard }) {
  const [text, setText]         = useState('')
  const [prio, setPrio]         = useState('m')
  const [assignee, setAssignee] = useState('alle')
  const open = todos.filter(t=>!t.done).length
  const sel = { flex:1, background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'8px', padding:'7px 8px', fontSize:'12px', color:'var(--text2)', outline:'none', fontFamily:'Inter,sans-serif' }
  const handleAdd = () => { if (!text.trim()) return; onAdd(text.trim(),prio,assignee); setText('') }

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
        <span style={{ fontFamily:'Syne,sans-serif', fontSize:'15px', fontWeight:600, color:'var(--text)' }}>{title}</span>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', background:'linear-gradient(135deg,#7C3AED22,#EC489922)', color:badgeColor, border:`1px solid ${badgeColor}44` }}>{open} offen</span>
      </div>
      <div style={{ flex:1 }}>
        {todos.length===0&&<p style={{fontSize:13,color:'var(--text3)',padding:'20px 16px'}}>Keine Aufgaben 🎉</p>}
        {todos.map(t=><TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} onSendToBoard={onSendToBoard}/>)}
      </div>
      <div style={{ borderTop:'1px solid var(--border)', padding:'12px 14px', background:'var(--bg)', display:'flex', flexDirection:'column', gap:8 }}>
        <input type="text" placeholder="Neue Aufgabe…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAdd()}
          style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', color:'var(--text)', outline:'none', fontFamily:'Inter,sans-serif' }} />
        <div style={{ display:'flex', gap:6 }}>
          <select value={prio} onChange={e=>setPrio(e.target.value)} style={sel}>
            <option value="l">Niedrig</option><option value="m">Mittel</option><option value="h">Hoch</option>
          </select>
          <select value={assignee} onChange={e=>setAssignee(e.target.value)} style={sel}>
            <option value="alle">Alle</option><option value="pablo">Pablo</option><option value="raf">Raf</option>
          </select>
          <button onClick={handleAdd} style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:'8px', padding:'7px 18px', fontSize:'14px', fontWeight:700, cursor:'pointer', flexShrink:0 }}>+</button>
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
    const { data } = await supabase.from('todos').select('*').order('created_at',{ascending:false})
    if (data) setTodos(data)
    setLoading(false)
  }
  async function addTodo(scope,text,prio,assignee) {
    const { data,error } = await supabase.from('todos').insert({text,prio,scope,done:false,assignee}).select().single()
    if (!error&&data) setTodos(prev=>[data,...prev])
  }
  async function toggleTodo(todo) {
    await supabase.from('todos').update({done:!todo.done}).eq('id',todo.id)
    setTodos(prev=>prev.map(t=>t.id===todo.id?{...t,done:!t.done}:t))
  }
  async function deleteTodo(id) {
    await supabase.from('todos').delete().eq('id',id)
    setTodos(prev=>prev.filter(t=>t.id!==id))
  }
  async function sendToBoard(todo) {
    await supabase.from('board_cards').insert({ text:todo.text, prio:todo.prio, assignee:todo.assignee||'alle', status:'ideen' })
  }

  const filtered  = filter==='alle' ? todos : todos.filter(t=>t.assignee===filter)
  const dayTodos  = filtered.filter(t=>t.scope==='day')
  const weekTodos = filtered.filter(t=>t.scope==='week')

  if (loading) return <p style={{color:'var(--text3)',fontSize:13}}>Laden…</p>

  return (
    <div>
      <div style={{ display:'flex', gap:6, marginBottom:16, alignItems:'center' }}>
        {ASSIGNEES.map(a=>(
          <button key={a.id} onClick={()=>setFilter(a.id)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:500, border:'1px solid var(--border2)', background:filter===a.id?'linear-gradient(135deg,#7C3AED,#EC4899)':'var(--bg2)', color:filter===a.id?'white':'var(--text2)', cursor:'pointer', transition:'.12s' }}>
            <span style={{fontSize:13}}>{a.avatar}</span>{a.label}
          </button>
        ))}
        <div style={{ marginLeft:'auto', fontSize:11, color:'var(--text3)' }}>→ Board überträgt die Task ins Kanban Board</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Column title="Heute"       todos={dayTodos}  badgeColor="#F472B6" onToggle={toggleTodo} onDelete={deleteTodo} onAdd={(t,p,a)=>addTodo('day',t,p,a)}  onSendToBoard={sendToBoard}/>
        <Column title="Diese Woche" todos={weekTodos} badgeColor="#A78BFA" onToggle={toggleTodo} onDelete={deleteTodo} onAdd={(t,p,a)=>addTodo('week',t,p,a)} onSendToBoard={sendToBoard}/>
      </div>
    </div>
  )
}
