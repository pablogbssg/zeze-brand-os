import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Todos() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  // 📥 Todos laden
  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fehler beim Laden:', error)
    } else {
      setTodos(data)
    }
  }

  // ➕ Todo hinzufügen
  async function addTodo(e) {
    e.preventDefault()

    if (!newTodo) return

    const { error } = await supabase
      .from('todos')
      .insert([{ text: newTodo }])

    if (error) {
      console.error('Fehler beim Hinzufügen:', error)
    } else {
      setNewTodo('')
      fetchTodos()
    }
  }

  // ❌ Todo löschen
  async function deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Fehler beim Löschen:', error)
    } else {
      fetchTodos()
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Todos</h2>

      {/* ➕ Formular */}
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Neues Todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* 📋 Liste */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}