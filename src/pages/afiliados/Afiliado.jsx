import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { cleanAfiliado, setActiveAfiliado } from '@/store/afiliado'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { handleShowDelete } from '@/store/layout'
import { Select, TextInput } from 'flowbite-react'
import { edjaApi } from '../../api'
import { ExportarExcel } from './ExportarExcel'
import EstadisticasAfiliados from './EstadisticasAfiliados'
import Tooltip from '@/components/ui/Tooltip'
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
  const [formacionFilter, setFormacionFilter] = useState('')
  const [formaciones, setFormaciones] = useState([])
  const [showEstadisticas, setShowEstadisticas] = useState(false)

  const {
    afiliados,
    afiliadosSinPaginar,
    paginate,
    startLoadingAfiliado,
    startGetAfiliadosSinPaginar,
    startEditAfiliado,
    startDeleteAfiliado,
    startSearchAfiliado
  } = useAfiliadoStore()

  const filteredAfiliados = afiliados
    .filter(afiliado => (user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) || afiliado.formacion_id === user.formacion_id)
    .filter(afiliado =>
      formacionFilter === '' ||
    afiliado.formacion?.some(f => f.formacion === formacionFilter)
    )

  const addAfiliado = () => {
    navigate('/alumnos/crear')
    dispatch(cleanAfiliado())
  }

  const showAfiliado = async (id) => {
    const currentPage = paginate?.current_page || 1
    await startEditAfiliado(id)
    navigate(`/alumnos/ver/${id}?page=${currentPage}`)
  }

  const onEdit = async (id) => {
    const currentPage = paginate?.current_page || 1
    await startEditAfiliado(id)
    dispatch(cleanAfiliado())
    navigate(`/alumnos/editar/${id}?page=${currentPage}`)
  }

  const onDelete = (id) => {
    const currentPage = paginate?.current_page || 1
    dispatch(setActiveAfiliado(id))
    dispatch(handleShowDelete())
    navigate(`/alumnos?page=${currentPage}`)
  }

  let searchTimeout

  const handleSearch = ({ target: { value } }) => {
    setSearch(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(async () => {
      if (value.length === 0) {
        await startLoadingAfiliado()
      } else if (value.length > 2) {
        await startSearchAfiliado(value)
      }
    }, 1000)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const page = parseInt(searchParams.get('page'), 10) || 1

    const fetchAfiliados = async () => {
      setIsLoading(true)
      await startLoadingAfiliado(page)
      setIsLoading(false)
      await startGetAfiliadosSinPaginar()
    }

    fetchAfiliados()
  }, [])

  useEffect(() => {
    async function handleFormacion () {
      try {
        const response = await edjaApi.get('docenteAll')
        const { data } = response.data
        setFormaciones(data)
      } catch (error) {
        console.error('Error al obtener formaciones:', error)
      }
    }

    handleFormacion()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
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
                        onChange={handleSearch}
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

                    <Select
                      name='formacionFilter'
                      onChange={(e) => setFormacionFilter(e.target.value)}
                      value={formacionFilter}
                    >
                      <option value=''>Filtrar formacion (En Desarrollo)</option>
                      {formaciones.map((formacion) => (
                        <option key={formacion.id} value={formacion.formacion}>
                          {formacion.formacion.toUpperCase()}
                        </option>
                      ))}
                    </Select>

                    <DeleteModal
                      themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                      centered
                      title='Acciones del Alumno'
                      message='¿Estás seguro?'
                      labelBtn='Aceptar'
                      btnFunction={startDeleteAfiliado}
                    />

                    {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
                      <Tooltip content={showEstadisticas ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}>
                        <button
                          onClick={() => setShowEstadisticas(!showEstadisticas)}
                          className='bg-purple-500 hover:bg-purple-700 text-white items-center text-center py-2 px-6 rounded-lg'
                        >
                          {showEstadisticas ? 'Estadísticas' : 'Estadísticas'}
                        </button>
                      </Tooltip>
                    )}

                    <div className='flex gap-4'>
                      {[1, 2, 3].includes(user.roles_id) && (
                        <ExportarExcel />
                      )}

                      {[1, 2, 3].includes(user.roles_id) && (
                        <div>
                          <Tooltip content='Crear Alumno'>
                            <button
                              type='button'
                              onClick={addAfiliado}
                              className='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                            >
                              Agregar
                            </button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4'>
                  {showEstadisticas && <EstadisticasAfiliados afiliadosSinPaginar={afiliadosSinPaginar} />}
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
                                  <td className='table-td mayuscula'>{afiliado.apellido || '-'}</td>
                                  <td className='table-td mayuscula'>{afiliado.nombre || '-'}</td>
                                  <td className='table-td'>{afiliado.dni || '-'}</td>
                                  <td className='table-td'>{afiliado.telefono || '-'}</td>
                                  <td className='table-td mayuscula'>
                                    {afiliado.formacion?.length > 0 ? afiliado.formacion[afiliado.formacion.length - 1].formacion : '-'}
                                  </td>
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
                                    <EditButton afiliado={afiliado} onEdit={onEdit} />
                                    <AfiliadoButton afiliado={afiliado} onDelete={onDelete} />
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
