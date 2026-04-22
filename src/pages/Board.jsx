import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const COLUMNS = [
  { id:'backlog',   label:'Backlog',   color:'#94A3B8', bg:'var(--bg3)' },
  { id:'ideen',     label:'Ideen',     color:'#A78BFA', bg:'#3730a322' },
  { id:'inarbeit',  label:'In Arbeit', color:'#F472B6', bg:'#be185d22' },
  { id:'review',    label:'Review',    color:'#FCD34D', bg:'#92400022' },
  { id:'fertig',    label:'Fertig',    color:'#6EE7B7', bg:'#06503022' },
]

const ASSIGNEES = [
  { id:'alle',  avatar:'👥', color:'#9CA3AF', bg:'var(--bg3)' },
  { id:'pablo', avatar:'P',  color:'#A78BFA', bg:'#3730a366' },
  { id:'raf',   avatar:'R',  color:'#F472B6', bg:'#be185d44' },
]

function Card({ card, onMove, onDelete }) {
  const p = { h:{label:'Hoch',bg:'var(--prio-h-bg)',color:'var(--prio-h-c)'}, m:{label:'Mittel',bg:'var(--prio-m-bg)',color:'var(--prio-m-c)'}, l:{label:'Niedrig',bg:'var(--prio-l-bg)',color:'var(--prio-l-c)'} }[card.prio||'m']
  const a = ASSIGNEES.find(x=>x.id===(card.assignee||'alle'))||ASSIGNEES[0]
  const colIdx = COLUMNS.findIndex(c=>c.id===card.status)

  return (
    <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:12, padding:'12px', marginBottom:8, transition:'.15s' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='#7C3AED55'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ fontSize:13, fontWeight:500, color:'var(--text)', lineHeight:1.4, flex:1, marginRight:8 }}>{card.text}</div>
        <button onClick={()=>onDelete(card.id)}
          style={{ background:'none', border:'none', fontSize:10, color:'var(--text3)', cursor:'pointer', padding:'2px 4px', borderRadius:3 }}
          onMouseEnter={e=>{e.currentTarget.style.background='var(--prio-h-bg)';e.currentTarget.style.color='var(--prio-h-c)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text3)'}}>✕</button>
      </div>
      <span style={{ fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:4, background:p.bg, color:p.color }}>{p.label}</span>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
        <div style={{ width:22, height:22, borderRadius:'50%', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, border:`1px solid ${a.color}44` }}>
          {a.avatar}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {colIdx>0 && (
            <button onClick={()=>onMove(card,COLUMNS[colIdx-1].id)}
              style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:6, padding:'3px 8px', fontSize:10, color:'var(--text2)', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.color='#A78BFA'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>←</button>
          )}
          {colIdx<COLUMNS.length-1 && (
            <button onClick={()=>onMove(card,COLUMNS[colIdx+1].id)}
              style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:6, padding:'3px 8px', fontSize:10, color:'var(--text2)', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.color='#F472B6'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>→</button>
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
  const sel = { background:'var(--input-bg)', border:'1px solid var(--border)', borderRadius:'7px', padding:'6px 8px', fontSize:'11px', color:'var(--text2)', outline:'none', fontFamily:'Inter,sans-serif', flex:1 }

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(columnId,text.trim(),prio,assignee)
    setText(''); setPrio('m'); setAssignee('alle'); setOpen(false)
  }

  if (!open) return (
    <button onClick={()=>setOpen(true)}
      style={{ width:'100%', background:'transparent', border:'1px dashed var(--border2)', borderRadius:10, padding:'8px', fontSize:12, color:'var(--text3)', cursor:'pointer', transition:'.12s' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='#7C3AED';e.currentTarget.style.color='#A78BFA'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text3)'}}>
      + Karte hinzufügen
    </button>
  )

  return (
    <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:12, padding:12, display:'flex', flexDirection:'column', gap:8 }}>
      <textarea placeholder="Was soll gemacht werden?" value={text} onChange={e=>setText(e.target.value)} rows={2}
        style={{ background:'var(--input-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 10px', fontSize:12, color:'var(--text)', outline:'none', fontFamily:'Inter,sans-serif', resize:'none' }} />
      <div style={{ display:'flex', gap:6 }}>
        <select value={prio} onChange={e=>setPrio(e.target.value)} style={sel}>
          <option value="l">Niedrig</option><option value="m">Mittel</option><option value="h">Hoch</option>
        </select>
        <select value={assignee} onChange={e=>setAssignee(e.target.value)} style={sel}>
          <option value="alle">Alle</option><option value="pablo">Pablo</option><option value="raf">Raf</option>
        </select>
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={handleAdd} style={{ flex:1, background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:8, padding:'7px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Hinzufügen</button>
        <button onClick={()=>setOpen(false)} style={{ background:'var(--bg2)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:8, padding:'7px 12px', fontSize:12, cursor:'pointer' }}>✕</button>
      </div>
    </div>
  )
}

export default function Board() {
  const [cards, setCards]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCards() }, [])

  async function loadCards() {
    setLoading(true)
    const { data } = await supabase.from('board_cards').select('*').order('created_at',{ascending:false})
    if (data) setCards(data)
    setLoading(false)
  }
  async function addCard(status,text,prio,assignee) {
    const { data,error } = await supabase.from('board_cards').insert({text,prio,assignee,status}).select().single()
    if (!error&&data) setCards(prev=>[data,...prev])
  }
  async function moveCard(card,newStatus) {
    await supabase.from('board_cards').update({status:newStatus}).eq('id',card.id)
    setCards(prev=>prev.map(c=>c.id===card.id?{...c,status:newStatus}:c))
  }
  async function deleteCard(id) {
    await supabase.from('board_cards').delete().eq('id',id)
    setCards(prev=>prev.filter(c=>c.id!==id))
  }

  if (loading) return <p style={{color:'var(--text3)',fontSize:13}}>Laden…</p>

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, alignItems:'start' }}>
      {COLUMNS.map(col => {
        const colCards = cards.filter(c=>c.status===col.id)
        return (
          <div key={col.id} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:col.color }} />
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, color:'var(--text)' }}>{col.label}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:col.bg, color:col.color, border:`1px solid ${col.color}44` }}>{colCards.length}</span>
              </div>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'10px 10px 4px', maxHeight:'65vh' }}>
              {colCards.map(card => <Card key={card.id} card={card} onMove={moveCard} onDelete={deleteCard} />)}
            </div>
            <div style={{ padding:'4px 10px 12px' }}>
              <AddCard columnId={col.id} onAdd={addCard} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
