import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { cleanAfiliado, setActiveAfiliado } from '@/store/afiliado'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { handleShowDelete } from '@/store/layout'
import { TextInput } from 'flowbite-react'
import { formatDate, getTipoBeca } from '@/constant/datos-id'
import { edjaApi } from '@/api'
import EstadisticasAfiliados from './EstadisticasAfiliados'
import Tooltip from '@/components/ui/Tooltip'
import * as XLSX from 'xlsx'
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
  const [isExporting, setIsExporting] = useState(false)
  const [showEstadisticas, setShowEstadisticas] = useState(false)
  let searchTimeout = null

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

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(async () => {
      if (value.length === 0) {
        await loadingAfiliado()
      }
      if (value.length > 1) {
        await startSearchAfiliado(value)
      }
    }, 1000)
  }

  async function loadingAfiliado (page = 1) {
    if (!isLoading) setIsLoading(true)
    await startLoadingAfiliado(page)
    await startGetAfiliadosSinPaginar()
    setIsLoading(false)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const page = searchParams.get('page') || 1
    loadingAfiliado(page)
  }, [])

  async function handlePersonalista () {
    try {
      const response = await edjaApi.get('personalista')
      const { data } = response.data
      return data
    } catch (error) {
      console.error('Error al obtener los datos:', error)
      return []
    }
  }

  // Función para exportar los datos a Excel
  async function exportToExcel () {
    setIsExporting(true)
    const afiliados = await handlePersonalista()

    if (afiliados.length === 0) {
      console.log('No hay datos para exportar.')
      setIsExporting(false)
      return
    }

    const personasData = []
    const formacionData = []

    afiliados.forEach((activeAfiliado) => {
      if (activeAfiliado.persona) {
        personasData.push({
          Nombre: activeAfiliado.persona.nombre?.toUpperCase(),
          Apellido: activeAfiliado.persona.apellido?.toUpperCase(),
          DNI: activeAfiliado.persona.dni,
          'Fecha de Nacimiento': formatDate(activeAfiliado.persona.fecha_nacimiento),
          'Edad de Ingreso': activeAfiliado.persona.edad,
          Sexo: activeAfiliado.persona.sexo?.toUpperCase(),
          Teléfono: activeAfiliado.persona.telefono,
          Domicilio: activeAfiliado.persona.domicilio?.toUpperCase(),
          Ocupacion: activeAfiliado.persona.ocupacion?.toUpperCase(),
          Enfermedades: activeAfiliado.persona.enfermedad?.toUpperCase(),
          Becas: getTipoBeca(activeAfiliado.persona.becas)?.toUpperCase(),
          Observacion: activeAfiliado.persona.observacion?.toUpperCase(),
          Estado: activeAfiliado.persona.estados
        })
      }

      if (activeAfiliado.formacion) {
        formacionData.push(...activeAfiliado.formacion.map(formacion => ({
          Nombre: activeAfiliado.persona.nombre?.toUpperCase(),
          Apellido: activeAfiliado.persona.apellido?.toUpperCase(),
          DNI: activeAfiliado.persona.dni,
          'Tipo de Formación Profesional': formacion.formacion?.toUpperCase(),
          'Fecha de Cursado': formatDate(formacion.fecha_cursado),
          'Fecha de Finalizacion': formatDate(formacion.fecha_finalizacion),
          Observaciones: formacion.observaciones?.toUpperCase()
        })))
      }
    })

    const wb = XLSX.utils.book_new()
    const personasSheet = XLSX.utils.json_to_sheet(personasData)
    const formacionSheet = XLSX.utils.json_to_sheet(formacionData)

    XLSX.utils.book_append_sheet(wb, personasSheet, 'Alumnos')
    XLSX.utils.book_append_sheet(wb, formacionSheet, 'Formación Profesional')

    XLSX.writeFile(wb, 'Alumnos.xlsx')
    setIsExporting(false)
  }

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

                    {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
                      <button
                        type='button'
                        onClick={exportToExcel}
                        className={`bg-green-500 ${isExporting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                        disabled={isExporting}
                      >
                        {isExporting ? 'Exportando...' : 'Exportar'}
                      </button>
                    )}

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
