import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Calendar from './pages/Calendar.jsx'
import Files from './pages/Files.jsx'
import Todos from './pages/Todos.jsx'
import styles from './App.module.css'

export default function App() {
  const [page, setPage] = useState('calendar')

  const pages = {
    calendar: <Calendar />,
    files: <Files />,
    todos: <Todos />,
  }

  const titles = {
    calendar: 'Kalender',
    files: 'Design Files',
    todos: 'Aufgaben',
  }

  return (
    <div className={styles.app}>
      <Sidebar current={page} onChange={setPage} />
      <div className={styles.main}>
        <Topbar title={titles[page]} />
        <div className={styles.content}>
          {pages[page]}
        </div>
      </div>
    </div>
  )
}
