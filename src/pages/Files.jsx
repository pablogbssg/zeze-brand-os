import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const CATEGORIES = [
  { id:'alle',        label:'Alle' },
  { id:'illustrator', label:'Illustrator' },
  { id:'photoshop',   label:'Photoshop' },
  { id:'pdf',         label:'PDF' },
  { id:'mockup',      label:'Mockups' },
  { id:'andere',      label:'Andere' },
]

const FILE_ICONS = {
  illustrator: { icon:'Ai',   color:'#FF9A00', bg:'#FF9A0022', border:'#FF9A0044' },
  photoshop:   { icon:'Ps',   color:'#31A8FF', bg:'#31A8FF22', border:'#31A8FF44' },
  pdf:         { icon:'PDF',  color:'#F47374', bg:'#F4737422', border:'#F4737444' },
  mockup:      { icon:'Mk',   color:'#A78BFA', bg:'#A78BFA22', border:'#A78BFA44' },
  andere:      { icon:'File', color:'#6EE7B7', bg:'#6EE7B722', border:'#6EE7B744' },
}

export default function Files() {
  const [files, setFiles]     = useState([])
  const [filter, setFilter]   = useState('alle')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl]   = useState('')
  const [newCat, setNewCat]   = useState('andere')
  const [saving, setSaving]   = useState(false)

  useEffect(() => { loadFiles() }, [])

  async function loadFiles() {
    setLoading(true)
    const { data } = await supabase.from('files').select('*').order('created_at',{ascending:false})
    if (data) setFiles(data)
    setLoading(false)
  }
  async function addFile() {
    if (!newName.trim()||!newUrl.trim()) return
    setSaving(true)
    const { data,error } = await supabase.from('files').insert({ name:newName.trim(), url:newUrl.trim(), category:newCat, type:newCat }).select().single()
    if (!error&&data) { setFiles(prev=>[data,...prev]); setNewName(''); setNewUrl(''); setNewCat('andere'); setShowAdd(false) }
    setSaving(false)
  }
  async function deleteFile(id) {
    await supabase.from('files').delete().eq('id',id)
    setFiles(prev=>prev.filter(f=>f.id!==id))
  }

  const shown = filter==='alle' ? files : files.filter(f=>f.category===filter)
  const inp = { width:'100%', background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', color:'var(--text)', outline:'none', fontFamily:'Inter,sans-serif' }
  const sel = { background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:'8px', padding:'9px 10px', fontSize:'13px', color:'var(--text2)', outline:'none', fontFamily:'Inter,sans-serif' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={()=>setFilter(c.id)}
              style={{ padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:500, border:'1px solid var(--border2)', background:filter===c.id?'linear-gradient(135deg,#7C3AED,#EC4899)':'var(--bg2)', color:filter===c.id?'white':'var(--text2)', cursor:'pointer', transition:'.12s' }}>
              {c.label}
            </button>
          ))}
        </div>
        <button onClick={()=>setShowAdd(!showAdd)}
          style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:'10px', padding:'8px 18px', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>
          + Datei hinzufügen
        </button>
      </div>

      {showAdd && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px', marginBottom:16 }}>
          <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', marginBottom:12, fontFamily:'Syne,sans-serif' }}>Neue Datei verknüpfen</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input type="text" placeholder="Dateiname (z.B. SS25_Logo.ai)" value={newName} onChange={e=>setNewName(e.target.value)} style={inp} />
            <input type="text" placeholder="Google Drive Link einfügen…" value={newUrl} onChange={e=>setNewUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addFile()} style={inp} />
            <div style={{ display:'flex', gap:8 }}>
              <select value={newCat} onChange={e=>setNewCat(e.target.value)} style={{ ...sel, flex:1 }}>
                <option value="illustrator">Illustrator (.ai)</option>
                <option value="photoshop">Photoshop (.psd)</option>
                <option value="pdf">PDF</option>
                <option value="mockup">Mockup</option>
                <option value="andere">Andere</option>
              </select>
              <button onClick={addFile} disabled={saving}
                style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:'8px', padding:'9px 20px', fontSize:'13px', fontWeight:700, cursor:'pointer', opacity:saving?0.7:1 }}>
                {saving?'…':'Speichern'}
              </button>
              <button onClick={()=>setShowAdd(false)}
                style={{ background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'9px 16px', fontSize:'13px', cursor:'pointer' }}>
                Abbrechen
              </button>
            </div>
          </div>
          <div style={{ marginTop:10, padding:'10px 12px', background:'var(--bg3)', borderRadius:'8px', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text3)', marginBottom:4 }}>So geht's:</div>
            <div style={{ fontSize:'11px', color:'var(--text3)', lineHeight:1.6 }}>
              1. Datei in Google Drive hochladen<br/>
              2. Rechtsklick → "Link kopieren" (Freigabe: Jeder mit Link)<br/>
              3. Link hier einfügen → Speichern
            </div>
          </div>
        </div>
      )}

      {loading ? <p style={{color:'var(--text3)',fontSize:13}}>Laden…</p>
      : shown.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text3)' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📁</div>
          <div style={{ fontSize:14 }}>Noch keine Dateien in dieser Kategorie</div>
          <div style={{ fontSize:12, marginTop:4 }}>Klick auf "+ Datei hinzufügen" um loszulegen</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
          {shown.map(file => {
            const fi = FILE_ICONS[file.category]||FILE_ICONS.andere
            return (
              <div key={file.id}
                style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px', display:'flex', flexDirection:'column', gap:10, transition:'.15s', position:'relative' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#7C3AED'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <button onClick={()=>deleteFile(file.id)}
                  style={{ position:'absolute', top:8, right:8, background:'none', border:'none', fontSize:10, color:'var(--text3)', cursor:'pointer', padding:'3px 5px', borderRadius:4 }}
                  onMouseEnter={e=>{e.currentTarget.style.background='var(--prio-h-bg)';e.currentTarget.style.color='var(--prio-h-c)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text3)'}}>✕</button>
                <div style={{ width:56, height:56, borderRadius:12, background:fi.bg, border:`1px solid ${fi.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:16, fontWeight:800, color:fi.color, fontFamily:'Arial Black,sans-serif' }}>{fi.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--text)', lineHeight:1.3, wordBreak:'break-word' }}>{file.name}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', marginTop:3, textTransform:'uppercase', letterSpacing:'.04em' }}>{file.category}</div>
                </div>
                <a href={file.url} target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'8px', padding:'7px', fontSize:'11px', color:'var(--text2)', textDecoration:'none', fontWeight:500, transition:'.12s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#3730a322';e.currentTarget.style.color='#A78BFA';e.currentTarget.style.borderColor='#7C3AED44'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='var(--bg3)';e.currentTarget.style.color='var(--text2)';e.currentTarget.style.borderColor='var(--border)'}}>
                  ↗ In Drive öffnen
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
