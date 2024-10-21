import React, { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './helpers/useAuthStore'
import { Create, Afiliado, ShowAfiliado } from './pages/afiliados'
import { Docentes } from './pages/docentes/Docentes'
import { ShowDocente } from './pages/docentes/ShowDocentes'
import { Users } from './pages'
import Layout from './layout/Layout'
import Login from './pages/auth/Login'
import Error from './pages/404'
import Loading from '@/components/Loading'
const Dashboard = lazy(() => import('./pages/dashboard'))

function App () {
  const { status, checkAuthToken } = useAuthStore()

  useEffect(() => {
    checkAuthToken()
  }, [])

  if (status === 'checking') {
    return (
      <Loading />
    )
  }

  return (
    <main className='App relative'>
      <Routes>
        {
          (status === 'not-authenticated')
            ? (
              <>
                {/* Login */}
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Navigate to='/login' />} />
              </>
              )
            : (
              <>
                <Route path='/' element={<Navigate to='/alumnos' />} />

                <Route path='/*' element={<Layout />}>
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='*' element={<Navigate to='/404' />} />

                  {/* Alumnos */}
                  <Route path='alumnos' element={<Afiliado />} />
                  <Route path='alumnos/crear' element={<Create />} />
                  <Route path='alumnos/editar/:id' element={<Create />} />
                  <Route path='alumnos/ver/:id' element={<ShowAfiliado />} />

                  {/* Nuevas Rutas */}
                  <Route path='docentes' element={<Docentes />} />
                  <Route path='docentes/ver/:id' element={<ShowDocente />} />
                  <Route path='usuarios' element={<Users />} />
                </Route>

                <Route path='*' element={<Navigate to='/404' />} />
                <Route path='/404' element={<Error />} />
              </>
              )
        }
      </Routes>
    </main>
  )
}

export default App
