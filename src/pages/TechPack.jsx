import { useState, useRef, useEffect } from 'react'

const STEPS = [
  { section: 'Basis', questions: [
    { key:'garmentType',      label:'Garment Type',       q:'Was für ein Kleidungsstück ist es?',              hint:'z.B. Hoodie, T-Shirt, Cargo Pants, Jacket…' },
    { key:'mainFabric',       label:'Main Fabric',         q:'Was ist das Hauptmaterial?',                      hint:'z.B. French Terry, Jersey, Ripstop Cotton…' },
    { key:'gsm',              label:'GSM',                 q:'Wie viel GSM?',                                   hint:'z.B. 380 GSM' },
    { key:'fabricFinish',     label:'Fabric Finish',       q:'Welches Fabric Finish?',                          hint:'z.B. Stonewash, Enzyme Wash, Raw, Brushed…' },
    { key:'sizes',            label:'Sizes',               q:'Welche Grössen? (Enter = S M L XL XXL)',          hint:'Standard: S M L XL XXL', optional: true },
    { key:'bulkOrder',        label:'Bulk Order',          q:'Geschätzte Bulk Order Menge?',                    hint:'z.B. 300 Stück' },
    { key:'releaseDate',      label:'Estimated Release',   q:'Geplantes Release Datum?',                        hint:'z.B. SS25, Juni 2025, Q3 2025' },
  ]},
  { section: 'Materialien & Farben', questions: [
    { key:'fabricType',       label:'Fabric Type',         q:'Fabric Type (Weave/Knit)?',                       hint:'z.B. French Terry Knit, Plain Weave, Twill…' },
    { key:'fabricPantone',    label:'Fabric Pantone',      q:'Fabric Pantone Farbe(n)?',                        hint:'z.B. Black 19-0303 TCX, Off-White 11-0601…' },
    { key:'fabricColours',    label:'Fabric Colours',      q:'Wie viele Fabric-Farben und welche?',             hint:'z.B. 2 Farben: Black + Off-White' },
    { key:'designColours',    label:'Design Colours',      q:'Design / Print Farben?',                          hint:'z.B. White Pantone 11-0601, Red 18-1660…' },
    { key:'materialList',     label:'Material List',       q:'Weitere Materialien? (Zips, Drawcords, Labels…)', hint:'z.B. YKK Zip schwarz, Kordel 8mm beige…', optional: true },
  ]},
  { section: 'Grafik & Print', questions: [
    { key:'printType',        label:'Print Type',          q:'Welcher Print-Typ?',                              hint:'z.B. Screenprint, Embroidery, DTG, Heat Transfer…' },
    { key:'printColours',     label:'Print Colours',       q:'Farben des Prints?',                              hint:'z.B. 2-colour Screenprint: White + Black' },
    { key:'graphics',         label:'Graphics & Logos',    q:'Beschreibe die Grafiken / Logo-Platzierung',      hint:'z.B. ZEZE Logo Chest vorne 8x4cm, Back Graphic A4…' },
  ]},
  { section: 'Tags & Packaging', questions: [
    { key:'wovenTag',         label:'Woven Tag',           q:'Woven Tag Details?',                              hint:'z.B. ZEZE Neck Label gewebt, 5x2cm, schwarz/weiss' },
    { key:'handTag',          label:'Hand Tag',            q:'Hand Tag Details?',                               hint:'z.B. ZEZE Cardtag 8x5cm, schwarzer Karton, 1-seitig' },
    { key:'packaging',        label:'Packaging Type',      q:'Wie wird verpackt?',                              hint:'z.B. Polybag + Custom Box, Tissue Paper, Hanger' },
    { key:'packageMaterial',  label:'Package Material',    q:'Verpackungsmaterial?',                            hint:'z.B. Recycled Polybag, Schwarze Kartonbox' },
  ]},
  { section: 'Extras', questions: [
    { key:'garmentDesigns',   label:'Garment Designs',     q:'Kurze Beschreibung des Designs',                  hint:'z.B. Oversized Fit, Dropped Shoulder, Kangaroo Pocket…' },
    { key:'specificNotes',    label:'Specific Notes',      q:'Spezifische Notizen für den Lieferanten?',        hint:'Optional…', optional: true },
    { key:'extraDetails',     label:'Extra Details',       q:'Noch irgendwas wichtiges?',                       hint:'Optional…', optional: true },
  ]},
]

const ALL_QUESTIONS = STEPS.flatMap(s => s.questions)
const TODAY = new Date().toLocaleDateString('de-CH')

export default function TechPack() {
  const [phase, setPhase]     = useState('start') // start | chat | done
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [step, setStep]       = useState(0)
  const [data, setData]       = useState({})
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading])
  useEffect(() => { if (phase === 'chat') inputRef.current?.focus() }, [phase, step])

  function startBot() {
    setPhase('chat')
    setMessages([
      { role:'bot', text:'Hey! Ich helfe euch das ZEZE Tech Pack zu erstellen. 🎽' },
      { role:'bot', text:`Ich stelle euch ${ALL_QUESTIONS.length} kurze Fragen — optional Felder könnt ihr mit Enter überspringen.` },
      { role:'bot', text: ALL_QUESTIONS[0].q, hint: ALL_QUESTIONS[0].hint, optional: ALL_QUESTIONS[0].optional },
    ])
    setStep(0)
  }

  async function handleSend() {
    const q = ALL_QUESTIONS[step]
    if (!input.trim() && !q.optional) return
    const answer = input.trim()
    setMessages(prev => [...prev, { role:'user', text: answer || '— (übersprungen)' }])
    const newData = { ...data, [q.key]: answer }
    setData(newData)
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 350))
    setLoading(false)

    const next = step + 1
    if (next >= ALL_QUESTIONS.length) {
      setMessages(prev => [...prev,
        { role:'bot', text:'Perfekt! Alle Infos gesammelt ✅' },
        { role:'bot', text:'Dein ZEZE Tech Pack wird jetzt zusammengestellt…' },
      ])
      await new Promise(r => setTimeout(r, 600))
      setData(newData)
      setPhase('done')
    } else {
      const nextQ = ALL_QUESTIONS[next]
      // Section header?
      const curSection  = STEPS.find(s => s.questions.find(q2 => q2.key === q.key))
      const nextSection = STEPS.find(s => s.questions.find(q2 => q2.key === nextQ.key))
      const msgs = []
      if (curSection !== nextSection) {
        msgs.push({ role:'bot', text:`✦ ${nextSection.section}`, isSection: true })
      }
      msgs.push({ role:'bot', text: nextQ.q, hint: nextQ.hint, optional: nextQ.optional })
      setMessages(prev => [...prev, ...msgs])
      setStep(next)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function restart() {
    setPhase('start'); setMessages([]); setData({}); setStep(0); setInput('')
  }

  const progress = phase === 'chat' ? Math.round((step / ALL_QUESTIONS.length) * 100) : 100

  // Styles
  const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column' }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 96px)', maxWidth:720, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:2 }}>Tech Pack Generator</h2>
          <p style={{ fontSize:12, color:'var(--text3)' }}>Beantworte die Fragen — dein Tech Pack wird automatisch erstellt</p>
        </div>
        {phase === 'chat' && (
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:5 }}>{step} / {ALL_QUESTIONS.length}</div>
            <div style={{ width:140, height:4, background:'var(--bg3)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ width:`${progress}%`, height:'100%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius:2, transition:'width .3s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      {phase === 'start' && (
        <div style={{ ...card, flex:1, alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
          <div style={{ fontSize:52, marginBottom:16 }}>🎽</div>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:8 }}>ZEZE Tech Pack Bot</h3>
          <p style={{ fontSize:13, color:'var(--text2)', maxWidth:380, lineHeight:1.7, marginBottom:28 }}>
            Ich führe dich durch alle Felder eures Tech Pack Templates.<br/>Am Ende bekommst du eine vollständige Zusammenfassung zum Download.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:28, width:'100%', maxWidth:360 }}>
            {STEPS.map(s => (
              <div key={s.section} style={{ background:'linear-gradient(135deg,#7C3AED11,#EC489911)', border:'1px solid #7C3AED33', borderRadius:10, padding:'10px 14px', fontSize:12, color:'#A78BFA', fontWeight:500, textAlign:'left' }}>
                <div style={{ fontSize:10, color:'#7C3AED', marginBottom:2, fontWeight:700 }}>{s.questions.length} Fragen</div>
                {s.section}
              </div>
            ))}
          </div>
          <button onClick={startBot}
            style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:12, padding:'13px 36px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
            Tech Pack starten →
          </button>
        </div>
      )}

      {phase === 'chat' && (
        <div style={{ ...card, flex:1 }}>
          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', justifyContent: msg.role==='user' ? 'flex-end' : 'flex-start' }}>
                {msg.isSection ? (
                  <div style={{ width:'100%', textAlign:'center', fontSize:10, fontWeight:700, color:'var(--text3)', letterSpacing:'.08em', textTransform:'uppercase', padding:'6px 0', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', margin:'4px 0' }}>
                    {msg.text.replace('✦ ', '')}
                  </div>
                ) : msg.role === 'bot' ? (
                  <div style={{ maxWidth:'80%' }}>
                    <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'14px 14px 14px 4px', padding:'10px 14px', fontSize:13, color:'var(--text)', lineHeight:1.5 }}>
                      {msg.text}
                    </div>
                    {msg.hint && (
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:4, paddingLeft:4 }}>
                        {msg.optional ? '✦ Optional — ' : ''}{msg.hint}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ maxWidth:'80%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius:'14px 14px 4px 14px', padding:'10px 14px', fontSize:13, color:'white', lineHeight:1.5 }}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:4, padding:'10px 14px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#A78BFA', animation:`bounce 1s ease-in-out ${i*0.15}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', background:'var(--bg)', display:'flex', gap:8 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder={ALL_QUESTIONS[step]?.hint || ''}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex:1, background:'var(--input-bg)', border:'1px solid var(--border2)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'var(--text)', outline:'none', fontFamily:'Inter,sans-serif' }}
            />
            <button onClick={handleSend}
              style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
              Senden
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ ...card, flex:1, overflow:'auto' }}>
          <div style={{ padding:'24px 24px 0', textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>✅</div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Tech Pack fertig!</h3>
            <p style={{ fontSize:12, color:'var(--text3)', marginBottom:16 }}>Zusammenfassung für {data.garmentType || 'Garment'} — {TODAY}</p>
          </div>

          {/* Summary cards */}
          <div style={{ padding:'0 24px 24px', display:'flex', flexDirection:'column', gap:12 }}>
            {STEPS.map(section => (
              <div key={section.section} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg,#7C3AED11,#EC489911)' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#A78BFA', textTransform:'uppercase', letterSpacing:'.06em' }}>{section.section}</span>
                </div>
                <div style={{ padding:'12px 14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px' }}>
                  {section.questions.map(q => (
                    <div key={q.key} style={{ display:'flex', flexDirection:'column', gap:2 }}>
                      <span style={{ fontSize:10, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.04em' }}>{q.label}</span>
                      <span style={{ fontSize:12, color: data[q.key] ? 'var(--text)' : 'var(--text3)' }}>
                        {data[q.key] || (q.key==='sizes' ? 'S M L XL XXL' : '—')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Auto-filled */}
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 14px', display:'flex', gap:16 }}>
              <div><div style={{ fontSize:10, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Company</div><div style={{ fontSize:12, color:'var(--text)' }}>ZEZE</div></div>
              <div><div style={{ fontSize:10, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Date</div><div style={{ fontSize:12, color:'var(--text)' }}>{TODAY}</div></div>
            </div>

            {/* Buttons */}
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button onClick={() => downloadTechPack(data)}
                style={{ flex:1, background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:10, padding:'12px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                ↓ Zusammenfassung herunterladen
              </button>
              <button onClick={restart}
                style={{ background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 18px', fontSize:13, cursor:'pointer' }}>
                Neu starten
              </button>
            </div>
            <p style={{ fontSize:11, color:'var(--text3)', textAlign:'center' }}>
              Kopiere die Felder in dein Illustrator Template — alle Werte sind hier zusammengefasst.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function downloadTechPack(data) {
  const today = new Date().toLocaleDateString('de-CH')
  const sizes = data.sizes || 'S  M  L  XL  XXL'
  const line = '─'.repeat(52)

  const content = `
╔══════════════════════════════════════════════════════╗
║              ZEZE TECH PACK                         ║
║         ${(data.garmentType || 'GARMENT').toUpperCase().padEnd(38)}     ║
╚══════════════════════════════════════════════════════╝

COMPANY NAME:        ZEZE
GARMENT TYPE:        ${data.garmentType || '—'}
DATE:                ${today}
ESTIMATED BULK:      ${data.bulkOrder || '—'}
EST. RELEASE:        ${data.releaseDate || '—'}
SIZES:               ${sizes}

${line}
BASIS INFORMATIONEN
${line}
Main Fabric:         ${data.mainFabric || '—'}
GSM:                 ${data.gsm || '—'}
Fabric Finish:       ${data.fabricFinish || '—'}
Fabric Type:         ${data.fabricType || '—'}
Garment Designs:     ${data.garmentDesigns || '—'}

${line}
FARBEN & MATERIALIEN
${line}
Fabric Pantone:      ${data.fabricPantone || '—'}
Fabric Colours:      ${data.fabricColours || '—'}
Design Colours:      ${data.designColours || '—'}
Material List:       ${data.materialList || '—'}

${line}
GRAFIK & PRINT
${line}
Print Type:          ${data.printType || '—'}
Print Colours:       ${data.printColours || '—'}
Graphics & Logos:    ${data.graphics || '—'}

${line}
TAGS & PACKAGING
${line}
Woven Tag:           ${data.wovenTag || '—'}
Hand Tag:            ${data.handTag || '—'}
Packaging Type:      ${data.packaging || '—'}
Package Material:    ${data.packageMaterial || '—'}

${line}
NOTIZEN
${line}
Specific Notes:      ${data.specificNotes || '—'}
Extra Details:       ${data.extraDetails || '—'}

${line}
Erstellt am ${today} mit ZEZE Brand OS
  `.trim()

  const blob = new Blob([content], { type:'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `ZEZE_TechPack_${(data.garmentType||'Garment').replace(/\s/g,'_')}_${today.replace(/\./g,'-')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
