import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './Files.module.css'

const TAGS = [
  { id: 'all', label: 'Alle' },
  { id: 'design', label: 'Designs' },
  { id: 'mockup', label: 'Mockups' },
  { id: 'doc', label: 'Dokumente' },
]

const SAMPLE_FILES = [
  { id: 1, name: 'SS25_Lookbook.jpg', type: 'design', icon: '🖼', size: '2.4 MB', preview: null },
  { id: 2, name: 'Hoodie_Mockup_v2.png', type: 'mockup', icon: '👕', size: '1.1 MB', preview: null },
  { id: 3, name: 'Kollektion_Brief.pdf', type: 'doc', icon: '📄', size: '320 KB', preview: null },
  { id: 4, name: 'Logo_Final.png', type: 'design', icon: '🖼', size: '540 KB', preview: null },
]

export default function Files() {
  const [files, setFiles] = useState(SAMPLE_FILES)
  const [activeTag, setActiveTag] = useState('all')
  const [nextId, setNextId] = useState(10)

  const onDrop = useCallback((accepted) => {
    accepted.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase()
      const type = ext === 'pdf' ? 'doc' : 'design'
      const icon = ext === 'pdf' ? '📄' : '🖼'
      const size = file.size > 1024 * 1024
        ? (file.size / 1024 / 1024).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB'

      const newFile = { id: nextId, name: file.name, type, icon, size, preview: null }
      setNextId(n => n + 1)

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = e => {
          newFile.preview = e.target.result
          setFiles(prev => [{ ...newFile, preview: e.target.result }, ...prev])
        }
        reader.readAsDataURL(file)
      } else {
        setFiles(prev => [newFile, ...prev])
      }
    })
  }, [nextId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
  })

  const deleteFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const shown = files.filter(f => activeTag === 'all' || f.type === activeTag)

  return (
    <div>
      <div className={styles.filterRow}>
        {TAGS.map(tag => (
          <button
            key={tag.id}
            className={`${styles.pill} ${activeTag === tag.id ? styles.active : ''}`}
            onClick={() => setActiveTag(tag.id)}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div
        {...getRootProps()}
        className={`${styles.dropZone} ${isDragActive ? styles.dragActive : ''}`}
      >
        <input {...getInputProps()} />
        <div className={styles.dropIcon}>⊕</div>
        <p className={styles.dropText}>
          {isDragActive ? 'Datei loslassen…' : 'Dateien hier ablegen oder klicken zum Hochladen'}
        </p>
        <span className={styles.dropSub}>JPG, PNG, PDF — max. 20 MB</span>
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>Keine Dateien in dieser Kategorie.</p>
      ) : (
        <div className={styles.grid}>
          {shown.map(file => (
            <div key={file.id} className={styles.card}>
              <button className={styles.deleteBtn} onClick={() => deleteFile(file.id)}>✕</button>
              {file.preview
                ? <img src={file.preview} alt={file.name} className={styles.thumb} />
                : <div className={styles.icon}>{file.icon}</div>
              }
              <div className={styles.name}>{file.name}</div>
              <div className={styles.size}>{file.size}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
