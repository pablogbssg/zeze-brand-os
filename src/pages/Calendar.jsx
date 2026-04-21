import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const DAY_NAMES = ['Mo','Di','Mi','Do','Fr','Sa','So']
const EVENT_COLORS = [
  { bg: 'var(--blue2)',   color: 'var(--blue)' },
  { bg: 'var(--orange2)', color: 'var(--orange)' },
  { bg: 'var(--purple2)', color: 'var(--purple)' },
  { bg: 'var(--green2)',  color: 'var(--green)' },
]

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const TODAY = new Date()

export default function Calendar() {
  const [current, setCurrent] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [events, setEvents] = useState({})
  const [newDate, setNewDate] = useState(fmtDate(TODAY))
  const [newText, setNewText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    const { data } = await supabase.from('events').select('*').order('created_at')
    if (data) {
      const map = {}
      data.forEach(ev => {
        if (!map[ev.date]) map[ev.date] = []
        map[ev.date].push({ id: ev.id, text: ev.text })
      })
      setEvents(map)
    }
    setLoading(false)
  }

  async function addEvent() {
    if (!newDate || !newText.trim()) return
    const { data, error } = await supabase
      .from('events')
      .insert({ date: newDate, text: newText.trim() })
      .select()
      .single()
    if (!error && data) {
      setEvents(prev => ({
        ...prev,
        [newDate]: [...(prev[newDate] || []), { id: data.id, text: data.text }]
      }))
      setNewText('')
    }
  }

  async function deleteEvent(date, id) {
    await supabase.from('events').delete().eq('id', id)
    setEvents(prev => ({
      ...prev,
      [date]: (prev[date] || []).filter(e => e.id !== id)
    }))
  }

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevTotal = new Date(year, month, 0).getDate()
  const startOffset = (firstDay.getDay() || 7) - 1

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push({ day: prevTotal - startOffset + 1 + i, current: false })
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, current: true })

  return (
    <div>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontSize:'16px', fontWeight:600, letterSpacing:'-0.3px' }}>{MONTHS[month]} {year}</span>
          <div style={{ display:'flex', gap:'6px' }}>
            {['‹','›'].map((arrow, i) => (
              <button key={i} onClick={() => setCurrent(new Date(year, month + (i === 0 ? -1 : 1), 1))}
                style={{ background:'var(--bg)', border:'1px solid var(--border)', width:'30px', height:'30px', borderRadius:'8px', fontSize:'16px', color:'var(--text2)', cursor:'pointer' }}>
                {arrow}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)' }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ textAlign:'center', padding:'10px 0 8px', fontSize:'11px', fontWeight:600, color:'var(--text3)', letterSpacing:'0.05em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>{d}</div>
          ))}

          {cells.map((cell, i) => {
            const key = cell.current ? fmtDate(new Date(year, month, cell.day)) : null
            const isToday = key === fmtDate(TODAY)
            const dayEvents = (key && events[key]) || []

            return (
              <div key={i} style={{ minHeight:'80px', borderRight: (i+1) % 7 === 0 ? 'none' : '1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'8px', opacity: cell.current ? 1 : 0.3, background:'var(--card)', transition:'background 0.1s' }}>
                <div style={{ fontSize:'12px', fontWeight:500, marginBottom:'4px', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%', background: isToday ? 'var(--blue)' : 'transparent', color: isToday ? 'white' : 'var(--text)' }}>
                  {cell.day}
                </div>
                {dayEvents.map((ev, ei) => (
                  <div key={ev.id}
                    onClick={() => key && deleteEvent(key, ev.id)}
                    title="Klicken zum Löschen"
                    style={{ fontSize:'10px', fontWeight:500, borderRadius:'5px', padding:'2px 6px', marginTop:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', cursor:'pointer', background: EVENT_COLORS[ei % 4].bg, color: EVENT_COLORS[ei % 4].color }}>
                    {ev.text}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Add row */}
        <div style={{ display:'flex', gap:'8px', padding:'14px 16px', borderTop:'1px solid var(--border)', background:'var(--bg)' }}>
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
            style={{ maxWidth:'140px', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', background:'var(--card)', color:'var(--text)', outline:'none' }} />
          <input type="text" placeholder="Event hinzufügen…" value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEvent()}
            style={{ flex:1, border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', background:'var(--card)', color:'var(--text)', outline:'none' }} />
          <button onClick={addEvent}
            style={{ background:'var(--blue)', color:'white', border:'none', borderRadius:'8px', padding:'8px 16px', fontSize:'13px', fontWeight:500, whiteSpace:'nowrap' }}>
            {loading ? '…' : 'Hinzufügen'}
          </button>
        </div>
      </div>
      <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px', paddingLeft:'4px' }}>Tipp: Event anklicken zum Löschen</p>
    </div>
  )
}
