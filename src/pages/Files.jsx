import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const TAGS = [
  { id: 'all',    label: 'Alle' },
  { id: 'design', label: 'Designs' },
  { id: 'mockup', label: 'Mockups' },
  { id: 'doc',    label: 'Dokumente' },
]

const SAMPLES = [
  { id: 1, name: 'SS25_Lookbook.jpg',    type: 'design', icon: '🖼', size: '2.4 MB', preview: null },
  { id: 2, name: 'Hoodie_Mockup_v2.png', type: 'mockup', icon: '👕', size: '1.1 MB', preview: null },
  { id: 3, name: 'Kollektion_Brief.pdf', type: 'doc',    icon: '📄', size: '320 KB', preview: null },
]

export default function Files() {
  const [files, setFiles]       = useState(SAMPLES)
  const [activeTag, setActiveTag] = useState('all')
  const [nextId, setNextId]     = useState(10)

  const onDrop = useCallback((accepted) => {
    accepted.forEach(file => {
      const ext  = file.name.split('.').pop().toLowerCase()
      const type = ext === 'pdf' ? 'doc' : 'design'
      const icon = ext === 'pdf' ? '📄' : '🖼'
      const size = file.size > 1024 * 1024
        ? (file.size / 1024 / 1024).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB'
      const obj = { id: nextId, name: file.name, type, icon, size, preview: null }
      setNextId(n => n + 1)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = e => setFiles(prev => [{ ...obj, preview: e.target.result }, ...prev])
        reader.readAsDataURL(file)
      } else {
        setFiles(prev => [obj, ...prev])
      }
    })
  }, [nextId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
  })

  const shown = files.filter(f => activeTag === 'all' || f.type === activeTag)

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap' }}>
        {TAGS.map(tag => (
          <button key={tag.id} onClick={() => setActiveTag(tag.id)}
            style={{ padding:'6px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:500, border:'1px solid var(--border)', background: activeTag === tag.id ? 'var(--blue)' : 'var(--card)', color: activeTag === tag.id ? 'white' : 'var(--text2)', cursor:'pointer', transition:'0.12s' }}>
            {tag.label}
          </button>
        ))}
      </div>

      {/* Dropzone */}
      <div {...getRootProps()} style={{ border: `1.5px dashed ${isDragActive ? 'var(--blue)' : 'var(--border)'}`, borderRadius:'14px', padding:'30px', textAlign:'center', cursor:'pointer', background: isDragActive ? 'var(--blue2)' : 'var(--card)', marginBottom:'16px', transition:'0.15s' }}>
        <input {...getInputProps()} />
        <div style={{ fontSize:'28px', marginBottom:'8px', color:'var(--text3)' }}>⊕</div>
        <p style={{ fontSize:'13px', color:'var(--text2)', fontWeight:500 }}>
          {isDragActive ? 'Datei loslassen…' : 'Dateien ablegen oder klicken'}
        </p>
        <span style={{ fontSize:'11px', color:'var(--text3)' }}>JPG, PNG, PDF — max. 20 MB</span>
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <p style={{ fontSize:'13px', color:'var(--text3)', padding:'20px 0' }}>Keine Dateien in dieser Kategorie.</p>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'12px' }}>
          {shown.map(file => (
            <div key={file.id}
              style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px', textAlign:'center', position:'relative', transition:'0.15s', cursor:'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <button
                onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                style={{ position:'absolute', top:'8px', right:'8px', width:'20px', height:'20px', borderRadius:'50%', background:'rgba(0,0,0,0.07)', border:'none', fontSize:'9px', color:'var(--text2)', cursor:'pointer' }}>
                ✕
              </button>
              {file.preview
                ? <img src={file.preview} alt={file.name} style={{ width:'100%', height:'90px', objectFit:'cover', borderRadius:'8px', marginBottom:'10px' }} />
                : <div style={{ width:'100%', height:'90px', borderRadius:'8px', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', marginBottom:'10px' }}>{file.icon}</div>
              }
              <div style={{ fontSize:'11px', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--text)' }}>{file.name}</div>
              <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'3px' }}>{file.size}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
