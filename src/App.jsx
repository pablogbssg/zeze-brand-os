import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Calendar from './pages/Calendar.jsx'
import Files from './pages/Files.jsx'
import Todos from './pages/Todos.jsx'

const styles = {
  app: { display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' },
  main: { display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' },
  content: { flex: 1, padding: '20px 28px 32px', overflowY: 'auto' },
}

const TITLES = { calendar: 'Kalender', files: 'Design Files', todos: 'Aufgaben' }

export default function App() {
  const [page, setPage] = useState('calendar')

  return (
    <div style={styles.app}>
      <Sidebar current={page} onChange={setPage} />
      <div style={styles.main}>
        <Topbar title={TITLES[page]} />
        <div style={styles.content}>
          {page === 'calendar' && <Calendar />}
          {page === 'files'    && <Files />}
          {page === 'todos'    && <Todos />}
        </div>
      </div>
    </div>
  )
}
