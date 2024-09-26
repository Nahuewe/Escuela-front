import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { cleanAfiliado, setActiveAfiliado } from '@/store/afiliado'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { handleShowDelete } from '@/store/layout'
import { TextInput } from 'flowbite-react'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EditButton from '@/components/buttons/EditButton'
import ViewButton from '@/components/buttons/ViewButton'
import AfiliadoButton from '@/components/buttons/AfiliadoButton'
import columnAfiliado from '@/json/columnAfiliado'

export const Afiliado = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const {
    afiliados,
    paginate,
    startLoadingAfiliado,
    startEditAfiliado,
    startDeleteAfiliado,
    startSearchAfiliado
  } = useAfiliadoStore()

  const filteredAfiliados = (user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) ? afiliados : afiliados.filter(afiliado => afiliado.seccional_id === user.seccional_id)

  function addAfiliado () {
    navigate('/alumnos/crear')
    dispatch(cleanAfiliado())
  }

  async function showAfiliado (id) {
    const currentPage = paginate?.current_page
    await startEditAfiliado(id)
    navigate(`/alumnos/ver/${id}?page=${currentPage}`)
    dispatch(cleanAfiliado())
  }

  function onEdit (id) {
    const currentPage = paginate?.current_page || 1
    startEditAfiliado(id)
    navigate(`/alumnos/editar/${id}?page=${currentPage}`)
    dispatch(cleanAfiliado())
  }

  function onDelete (id) {
    const currentPage = paginate?.current_page || 1
    dispatch(setActiveAfiliado(id))
    dispatch(handleShowDelete())
    navigate(`/alumnos?page=${currentPage}`)
  }

  async function onSearch ({ target: { value } }) {
    setSearch(value)
    if (value.length === 0) await loadingAfiliado()
    if (value.length <= 1) return false
    await startSearchAfiliado(value)
  }

  async function loadingAfiliado (page = 1) {
    !isLoading && setIsLoading(true)
    await startLoadingAfiliado(page)
    setIsLoading(false)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const page = searchParams.get('page') || 1
    loadingAfiliado(page)
  }, [])

  return (
    <>
      {
        isLoading
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Alumnos</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <TextInput
                        name='search'
                        placeholder='Buscar'
                        onChange={onSearch}
                        value={search}
                      />

                      <div
                        type='button'
                        className='absolute top-3 right-2'
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-search dark:stroke-white' width='16' height='16' viewBox='0 0 24 24' strokeWidth='1.5' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                          <path d='M21 21l-6 -6' />
                        </svg>
                      </div>
                    </div>

                    <DeleteModal
                      themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                      centered
                      title='Acciones del Alumno'
                      message='¿Estás seguro?'
                      labelBtn='Aceptar'
                      btnFunction={startDeleteAfiliado}
                    />

                    <div className='flex gap-4'>
                      {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
                        <button
                          type='button'
                          onClick={addAfiliado}
                          className='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                        >
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card noborder>
                <div className='overflow-x-auto -mx-6'>
                  <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden '>
                      <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                        <thead className='bg-slate-200 dark:bg-slate-700'>
                          <tr>
                            {columnAfiliado.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (filteredAfiliados.length > 0)
                              ? (filteredAfiliados.map((afiliado) => (
                                <tr key={afiliado.id}>
                                  <td className='table-td'>{afiliado.apellido}</td>
                                  <td className='table-td'>{afiliado.nombre}</td>
                                  <td className='table-td'>{afiliado.dni}</td>
                                  <td className='table-td'>{afiliado.telefono}</td>
                                  <td className='table-td'>{afiliado.formacion}</td>
                                  <td className='table-td'>
                                    <span
                                      className={`inline-block text-black px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 ${afiliado.estado === 'ACTIVO'
                                        ? 'text-black bg-success-500 dark:bg-success-400'
                                        : afiliado.estado === 'PENDIENTE'
                                          ? 'text-black bg-warning-500 dark:bg-warning-500'
                                          : 'text-black bg-danger-500 dark:bg-danger-500'
                                        }`}
                                    >
                                      {afiliado.estado}
                                    </span>
                                  </td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <ViewButton afiliado={afiliado} onView={showAfiliado} />

                                    {user.roles_id !== 5 && (
                                      <EditButton afiliado={afiliado} onEdit={onEdit} />
                                    )}

                                    {user.roles_id === 1 && (
                                      <AfiliadoButton afiliado={afiliado} onDelete={onDelete} />
                                    )}
                                  </td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>
                      </table>

                      {/* Paginado */}
                      {
                        paginate && (
                          <div className='flex justify-center mt-8'>
                            <Pagination
                              paginate={paginate}
                              onPageChange={(page) =>
                                search !== ''
                                  ? startSearchAfiliado(search, page)
                                  : startLoadingAfiliado(page)}
                              text
                            />
                          </div>
                        )
                      }

                    </div>
                  </div>
                </div>
              </Card>
            </>
            )
      }
    </>
  )
}
