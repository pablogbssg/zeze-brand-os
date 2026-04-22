import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const DAY_NAMES = ['Mo','Di','Mi','Do','Fr','Sa','So']
const ASSIGNEES = [
  { id:'alle',  label:'Alle',  avatar:'👥', color:'#9CA3AF', bg:'var(--bg3)' },
  { id:'pablo', label:'Pablo', avatar:'P',  color:'#A78BFA', bg:'#3730a366' },
  { id:'raf',   label:'Raf',   avatar:'R',  color:'#F472B6', bg:'#be185d44' },
]

function fmtDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const TODAY = new Date()

function TodoRow({ todo, onToggle, onDelete }) {
  const a = ASSIGNEES.find(x=>x.id===(todo.assignee||'alle'))||ASSIGNEES[0]
  const p = {
    h:{label:'Hoch',    bg:'var(--prio-h-bg)', color:'var(--prio-h-c)'},
    m:{label:'Mittel',  bg:'var(--prio-m-bg)', color:'var(--prio-m-c)'},
    l:{label:'Niedrig', bg:'var(--prio-l-bg)', color:'var(--prio-l-c)'},
  }[todo.prio||'m']

  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderBottom:'1px solid var(--border)', transition:'.1s' }}
      onMouseEnter={e=>e.currentTarget.style.background='var(--card-hover)'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <button onClick={()=>onToggle(todo)}
        style={{ width:15, height:15, minWidth:15, borderRadius:'50%', border:todo.done?'none':'1.5px solid var(--border2)', background:todo.done?'linear-gradient(135deg,#7C3AED,#EC4899)':'transparent', cursor:'pointer', fontSize:8, color:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {todo.done?'✓':''}
      </button>
      <div style={{ width:20, height:20, borderRadius:'50%', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, flexShrink:0, border:`1px solid ${a.color}44` }}>
        {a.avatar}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, color:todo.done?'var(--text3)':'var(--text)', textDecoration:todo.done?'line-through':'none', lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{todo.text}</div>
        <span style={{ fontSize:9, fontWeight:600, padding:'1px 5px', borderRadius:3, background:p.bg, color:p.color, display:'inline-block', marginTop:2 }}>{p.label}</span>
      </div>
      <button onClick={()=>onDelete(todo.id)}
        style={{ background:'none', border:'none', fontSize:9, color:'var(--text3)', cursor:'pointer', padding:'2px 4px', borderRadius:3, flexShrink:0 }}
        onMouseEnter={e=>{e.currentTarget.style.background='var(--prio-h-bg)';e.currentTarget.style.color='var(--prio-h-c)'}}
        onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text3)'}}>✕</button>
    </div>
  )
}

export default function Dashboard() {
  const [events, setEvents]         = useState({})
  const [todos, setTodos]           = useState([])
  const [calDate, setCalDate]       = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [evtDate, setEvtDate]       = useState(fmtDate(TODAY))
  const [evtText, setEvtText]       = useState('')
  const [todoText, setTodoText]     = useState('')
  const [todoPrio, setTodoPrio]     = useState('m')
  const [todoAssignee, setTodoAssignee] = useState('alle')
  const [todoScope, setTodoScope]   = useState('day')
  const [filter, setFilter]         = useState('alle')

  useEffect(() => { loadEvents(); loadTodos() }, [])

  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').order('created_at')
    if (data) {
      const map = {}
      data.forEach(ev => { if (!map[ev.date]) map[ev.date]=[]; map[ev.date].push({id:ev.id,text:ev.text}) })
      setEvents(map)
    }
  }
  async function loadTodos() {
    const { data } = await supabase.from('todos').select('*').order('created_at',{ascending:false})
    if (data) setTodos(data)
  }
  async function addEvent() {
    if (!evtDate||!evtText.trim()) return
    const { data,error } = await supabase.from('events').insert({date:evtDate,text:evtText.trim()}).select().single()
    if (!error&&data) { setEvents(prev=>({...prev,[evtDate]:[...(prev[evtDate]||[]),{id:data.id,text:data.text}]})); setEvtText('') }
  }
  async function deleteEvent(date,id) {
    await supabase.from('events').delete().eq('id',id)
    setEvents(prev=>({...prev,[date]:(prev[date]||[]).filter(e=>e.id!==id)}))
  }
  async function addTodo() {
    if (!todoText.trim()) return
    const { data,error } = await supabase.from('todos').insert({text:todoText.trim(),prio:todoPrio,scope:todoScope,done:false,assignee:todoAssignee}).select().single()
    if (!error&&data) { setTodos(prev=>[data,...prev]); setTodoText('') }
  }
  async function toggleTodo(todo) {
    await supabase.from('todos').update({done:!todo.done}).eq('id',todo.id)
    setTodos(prev=>prev.map(t=>t.id===todo.id?{...t,done:!t.done}:t))
  }
  async function deleteTodo(id) {
    await supabase.from('todos').delete().eq('id',id)
    setTodos(prev=>prev.filter(t=>t.id!==id))
  }

  const year = calDate.getFullYear(), month = calDate.getMonth()
  const firstDay = new Date(year,month,1)
  const totalDays = new Date(year,month+1,0).getDate()
  const prevTotal = new Date(year,month,0).getDate()
  const startOffset = (firstDay.getDay()||7)-1
  const cells = []
  for (let i=0;i<startOffset;i++) cells.push({day:prevTotal-startOffset+1+i,current:false})
  for (let d=1;d<=totalDays;d++) cells.push({day:d,current:true})

  const filtered  = filter==='alle' ? todos : todos.filter(t=>t.assignee===filter)
  const dayTodos  = filtered.filter(t=>t.scope==='day')
  const weekTodos = filtered.filter(t=>t.scope==='week')
  const openCount = todos.filter(t=>!t.done).length

  const EV_COLORS = [
    {bg:'var(--ev1-bg)',color:'var(--ev1-c)',border:'var(--ev1-b)'},
    {bg:'var(--ev2-bg)',color:'var(--ev2-c)',border:'var(--ev2-b)'},
    {bg:'var(--ev3-bg)',color:'var(--ev3-c)',border:'var(--ev3-b)'},
    {bg:'var(--ev4-bg)',color:'var(--ev4-c)',border:'var(--ev4-b)'},
  ]

  const inp = { background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'8px', padding:'8px 12px', fontSize:'12px', color:'var(--text)', outline:'none', fontFamily:'Inter,sans-serif' }
  const sel = { background:'var(--sel-bg)', border:'1px solid var(--border2)', borderRadius:'8px', padding:'6px 8px', fontSize:'11px', color:'var(--text2)', outline:'none', fontFamily:'Inter,sans-serif', flex:1 }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16, height:'calc(100vh - 80px)' }}>

      {/* BIG CALENDAR */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <span style={{ fontFamily:'Syne,sans-serif', fontSize:'18px', fontWeight:700, background:'linear-gradient(135deg,#A78BFA,#F472B6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {MONTHS[month]} {year}
          </span>
          <div style={{ display:'flex', gap:6 }}>
            {['‹','›'].map((a,i) => (
              <button key={i} onClick={()=>setCalDate(new Date(year,month+(i===0?-1:1),1))}
                style={{ background:'var(--bg3)', border:'1px solid var(--border)', width:32, height:32, borderRadius:'8px', color:'var(--text2)', cursor:'pointer', fontSize:'16px' }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', flexShrink:0 }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ textAlign:'center', padding:'10px 0', fontSize:'11px', fontWeight:600, color:'var(--text3)', letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>{d}</div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gridAutoRows:'1fr', flex:1 }}>
          {cells.map((cell,i) => {
            const key = cell.current ? fmtDate(new Date(year,month,cell.day)) : null
            const isToday = key===fmtDate(TODAY)
            const dayEvts = (key&&events[key])||[]
            return (
              <div key={i} style={{ borderRight:(i+startOffset)%7===6?'none':'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'8px', opacity:cell.current?1:0.25, overflow:'hidden' }}>
                <div style={{ fontSize:12, fontWeight:600, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%', background:isToday?'linear-gradient(135deg,#7C3AED,#EC4899)':'transparent', color:isToday?'white':'var(--text2)', marginBottom:4 }}>{cell.day}</div>
                {dayEvts.map((ev,ei) => (
                  <div key={ev.id} onClick={()=>key&&deleteEvent(key,ev.id)} title="Löschen"
                    style={{ fontSize:10, fontWeight:500, borderRadius:4, padding:'2px 6px', marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', cursor:'pointer', background:EV_COLORS[ei%4].bg, color:EV_COLORS[ei%4].color, border:`1px solid ${EV_COLORS[ei%4].border}` }}>
                    {ev.text}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', background:'var(--bg)', display:'flex', gap:8, flexShrink:0 }}>
          <input type="text" placeholder="Event hinzufügen…" value={evtText} onChange={e=>setEvtText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addEvent()} style={{ ...inp, flex:1 }} />
          <input type="date" value={evtDate} onChange={e=>setEvtDate(e.target.value)} style={{ ...inp, maxWidth:140 }} />
          <button onClick={addEvent} style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:'8px', padding:'7px 16px', fontSize:'13px', fontWeight:700, cursor:'pointer', flexShrink:0 }}>+</button>
        </div>
      </div>

      {/* TASK SIDEBAR */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {/* Stats */}
        <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:10 }}>Aufgaben</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
            {[
              { label:'Offen', value:openCount,                          c1:'var(--stat1-c1)', c2:'var(--stat1-c2)', color:'#A78BFA' },
              { label:'Heute', value:dayTodos.filter(t=>!t.done).length, c1:'var(--stat2-c1)', c2:'var(--stat2-c2)', color:'#F472B6' },
              { label:'Woche', value:weekTodos.filter(t=>!t.done).length,c1:'var(--stat3-c1)', c2:'var(--stat3-c2)', color:'#60A5FA' },
            ].map(s=>(
              <div key={s.label} style={{ background:`linear-gradient(135deg,${s.c1},${s.c2})`, borderRadius:10, padding:'8px 6px', textAlign:'center', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:9, fontWeight:600, color:s.color, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:3 }}>{s.label}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display:'flex', gap:4, padding:'8px 12px', borderBottom:'1px solid var(--border)', flexShrink:0, flexWrap:'wrap' }}>
          {ASSIGNEES.map(a=>(
            <button key={a.id} onClick={()=>setFilter(a.id)}
              style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:600, border:'1px solid var(--border2)', background:filter===a.id?'linear-gradient(135deg,#7C3AED,#EC4899)':'transparent', color:filter===a.id?'white':'var(--text2)', cursor:'pointer', transition:'.12s' }}>
              {a.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {dayTodos.length>0&&<>
            <div style={{ fontSize:9, fontWeight:700, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', padding:'8px 12px 3px' }}>Heute</div>
            {dayTodos.map(t=><TodoRow key={t.id} todo={t} onToggle={toggleTodo} onDelete={deleteTodo}/>)}
          </>}
          {weekTodos.length>0&&<>
            <div style={{ fontSize:9, fontWeight:700, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', padding:'10px 12px 3px' }}>Diese Woche</div>
            {weekTodos.map(t=><TodoRow key={t.id} todo={t} onToggle={toggleTodo} onDelete={deleteTodo}/>)}
          </>}
          {filtered.length===0&&<p style={{fontSize:12,color:'var(--text3)',padding:'16px 12px'}}>Keine Aufgaben 🎉</p>}
        </div>

        {/* Add todo */}
        <div style={{ borderTop:'1px solid var(--border)', padding:'10px 12px', background:'var(--bg)', display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
          <input type="text" placeholder="Neue Aufgabe…" value={todoText} onChange={e=>setTodoText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTodo()} style={{ ...inp, width:'100%' }} />
          <div style={{ display:'flex', gap:5 }}>
            <select value={todoPrio} onChange={e=>setTodoPrio(e.target.value)} style={sel}>
              <option value="l">Niedrig</option><option value="m">Mittel</option><option value="h">Hoch</option>
            </select>
            <select value={todoAssignee} onChange={e=>setTodoAssignee(e.target.value)} style={sel}>
              <option value="alle">Alle</option><option value="pablo">Pablo</option><option value="raf">Raf</option>
            </select>
            <select value={todoScope} onChange={e=>setTodoScope(e.target.value)} style={sel}>
              <option value="day">Heute</option><option value="week">Woche</option>
            </select>
          </div>
          <button onClick={addTodo} style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:'8px', padding:'8px', fontSize:'12px', fontWeight:700, cursor:'pointer', width:'100%' }}>+ Hinzufügen</button>
        </div>
      </div>
    </div>
  )
}
