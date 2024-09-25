import React, { useEffect, useState } from 'react'
import { useAfiliadoStore, useDocenteStore } from '@/helpers'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import EstadisticasDashboard from './EstadisticasDashboard'

const Dashboard = () => {
  const { afiliadosSinPaginar, startLoadingAfiliado, startGetAfiliadosSinPaginar } = useAfiliadoStore()
  const { docentesSinPaginar, startLoadingDocente, startGetDocenteSinPaginar } = useDocenteStore()
  const [isLoading, setIsLoading] = useState(true)
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      await startLoadingAfiliado()
      await startLoadingDocente()
      await startGetAfiliadosSinPaginar()
      await startGetDocenteSinPaginar()
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleInputChange = (e) => {
    setNewTodo(e.target.value)
  }

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return
    const currentDate = new Date().toLocaleString()
    const updatedTodos = [...todos, `${newTodo} | (Creada el: ${currentDate})`]
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    setNewTodo('')
  }

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index)
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div className='p-4'>
            <Card title='EDJA N°4'>
              <div className='flex justify-between'>
                <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
              </div>
            </Card>

            <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4'>
              <EstadisticasDashboard
                afiliadosSinPaginar={afiliadosSinPaginar}
                docentesSinPaginar={docentesSinPaginar}
              />
            </div>

            <div className='mt-8'>
              <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>Lista de Notas</h3>
              <div className='mt-4 flex'>
                <input
                  type='text'
                  value={newTodo}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder='Escribe una nueva nota...'
                  className='w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300'
                />
                <button
                  onClick={handleAddTodo}
                  className='ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition'
                >
                  Añadir
                </button>
              </div>
              <ul className='mt-4 space-y-2'>
                {todos.map((todo, index) => (
                  <li
                    key={index}
                    className='flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm'
                  >
                    <span className='text-gray-700 dark:text-gray-300'>{todo}</span>
                    <button
                      onClick={() => handleDeleteTodo(index)}
                      className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 transition'
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          )}
    </>
  )
}

export default Dashboard
