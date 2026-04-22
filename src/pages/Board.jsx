import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const COLUMNS = [
  { id:'backlog',   label:'Backlog',   color:'#94A3B8', bg:'#1e293b22' },
  { id:'ideen',     label:'Ideen',     color:'#A78BFA', bg:'#3730a322' },
  { id:'inarbeit',  label:'In Arbeit', color:'#F472B6', bg:'#be185d22' },
  { id:'review',    label:'Review',    color:'#FCD34D', bg:'#92400022' },
  { id:'fertig',    label:'Fertig',    color:'#6EE7B7', bg:'#06503022' },
]

const ASSIGNEES = [
  { id:'alle',  label:'Alle',  avatar:'👥', color:'#9CA3AF', bg:'#1f2937' },
  { id:'pablo', label:'Pablo', avatar:'P',  color:'#A78BFA', bg:'#3730a366' },
  { id:'raf',   label:'Raf',   avatar:'R',  color:'#F472B6', bg:'#be185d44' },
]

const PRIO = {
  h: { label:'Hoch',    bg:'#3f0000', color:'#F87171' },
  m: { label:'Mittel',  bg:'#3f2000', color:'#FCD34D' },
  l: { label:'Niedrig', bg:'#002014', color:'#6EE7B7' },
}

function Avatar({ id, size=22 }) {
  const a = ASSIGNEES.find(x=>x.id===id)||ASSIGNEES[0]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size===22?10:12, fontWeight:700, flexShrink:0, border:`1px solid ${a.color}44` }}>
      {a.avatar}
    </div>
  )
}

function Card({ card, onMove, onDelete }) {
  const p = PRIO[card.prio||'m']
  const col = COLUMNS.find(c=>c.id===card.status)||COLUMNS[0]
  const colIdx = COLUMNS.findIndex(c=>c.id===card.status)

  return (
    <div style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:12, padding:'12px', marginBottom:8, transition:'.15s', cursor:'default' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='#7C3AED55'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='#2a2a2a'}>

      {/* Top row */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ fontSize:13, fontWeight:500, color:'#ddd', lineHeight:1.4, flex:1, marginRight:8 }}>{card.text}</div>
        <button onClick={()=>onDelete(card.id)}
          style={{ background:'none', border:'none', fontSize:10, color:'#333', cursor:'pointer', padding:'2px 4px', borderRadius:3, flexShrink:0 }}
          onMouseEnter={e=>{e.currentTarget.style.background='#3f0000';e.currentTarget.style.color='#F87171'}}
          onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='#333'}}>✕</button>
      </div>

      {/* Tags */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <span style={{ fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:4, background:p.bg, color:p.color }}>{p.label}</span>
      </div>

      {/* Bottom row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Avatar id={card.assignee||'alle'} />
        {/* Move buttons */}
        <div style={{ display:'flex', gap:4 }}>
          {colIdx > 0 && (
            <button onClick={()=>onMove(card, COLUMNS[colIdx-1].id)}
              style={{ background:'#111', border:'1px solid #2a2a2a', borderRadius:6, padding:'3px 8px', fontSize:10, color:'#555', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.color='#A78BFA'}
              onMouseLeave={e=>e.currentTarget.style.color='#555'}>
              ← 
            </button>
          )}
          {colIdx < COLUMNS.length-1 && (
            <button onClick={()=>onMove(card, COLUMNS[colIdx+1].id)}
              style={{ background:'#111', border:'1px solid #2a2a2a', borderRadius:6, padding:'3px 8px', fontSize:10, color:'#555', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.color='#F472B6'}
              onMouseLeave={e=>e.currentTarget.style.color='#555'}>
              →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function AddCard({ columnId, onAdd }) {
  const [open, setOpen]         = useState(false)
  const [text, setText]         = useState('')
  const [prio, setPrio]         = useState('m')
  const [assignee, setAssignee] = useState('alle')
  const sel = { background:'#111', border:'1px solid #222', borderRadius:'7px', padding:'6px 8px', fontSize:'11px', color:'#aaa', outline:'none', fontFamily:'Inter,sans-serif', flex:1 }

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(columnId, text.trim(), prio, assignee)
    setText(''); setPrio('m'); setAssignee('alle'); setOpen(false)
  }

  if (!open) return (
    <button onClick={()=>setOpen(true)}
      style={{ width:'100%', background:'transparent', border:'1px dashed #2a2a2a', borderRadius:10, padding:'8px', fontSize:12, color:'#444', cursor:'pointer', transition:'.12s' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='#7C3AED';e.currentTarget.style.color='#A78BFA'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='#2a2a2a';e.currentTarget.style.color='#444'}}>
      + Karte hinzufügen
    </button>
  )

  return (
    <div style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:12, padding:12, display:'flex', flexDirection:'column', gap:8 }}>
      <textarea placeholder="Was soll gemacht werden?" value={text} onChange={e=>setText(e.target.value)}
        rows={2}
        style={{ background:'#111', border:'1px solid #222', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#ddd', outline:'none', fontFamily:'Inter,sans-serif', resize:'none' }} />
      <div style={{ display:'flex', gap:6 }}>
        <select value={prio} onChange={e=>setPrio(e.target.value)} style={sel}>
          <option value="l">Niedrig</option><option value="m">Mittel</option><option value="h">Hoch</option>
        </select>
        <select value={assignee} onChange={e=>setAssignee(e.target.value)} style={sel}>
          <option value="alle">Alle</option><option value="pablo">Pablo</option><option value="raf">Raf</option>
        </select>
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={handleAdd}
          style={{ flex:1, background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:8, padding:'7px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Hinzufügen
        </button>
        <button onClick={()=>setOpen(false)}
          style={{ background:'#111', color:'#555', border:'1px solid #222', borderRadius:8, padding:'7px 12px', fontSize:12, cursor:'pointer' }}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default function Board() {
  const [cards, setCards]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCards() }, [])

  async function loadCards() {
    setLoading(true)
    const { data } = await supabase.from('board_cards').select('*').order('created_at', { ascending:false })
    if (data) setCards(data)
    setLoading(false)
  }

  async function addCard(status, text, prio, assignee) {
    const { data, error } = await supabase.from('board_cards').insert({ text, prio, assignee, status }).select().single()
    if (!error && data) setCards(prev => [data, ...prev])
  }

  async function moveCard(card, newStatus) {
    await supabase.from('board_cards').update({ status: newStatus }).eq('id', card.id)
    setCards(prev => prev.map(c => c.id===card.id ? {...c, status:newStatus} : c))
  }

  async function deleteCard(id) {
    await supabase.from('board_cards').delete().eq('id', id)
    setCards(prev => prev.filter(c => c.id!==id))
  }

  if (loading) return <p style={{ color:'#444', fontSize:13 }}>Laden…</p>

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, height:'calc(100vh - 90px)', alignItems:'start' }}>
      {COLUMNS.map(col => {
        const colCards = cards.filter(c => c.status===col.id)
        return (
          <div key={col.id} style={{ background:'#111', border:'1px solid #222', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', maxHeight:'100%' }}>
            {/* Column header */}
            <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid #1e1e1e', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:col.color }} />
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, color:'#ddd' }}>{col.label}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:col.bg, color:col.color, border:`1px solid ${col.color}44` }}>
                  {colCards.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div style={{ flex:1, overflowY:'auto', padding:'10px 10px 4px' }}>
              {colCards.map(card => (
                <Card key={card.id} card={card} onMove={moveCard} onDelete={deleteCard} />
              ))}
            </div>

            {/* Add */}
            <div style={{ padding:'4px 10px 12px', flexShrink:0 }}>
              <AddCard columnId={col.id} onAdd={addCard} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
