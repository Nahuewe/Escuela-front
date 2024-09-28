/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import EditModal from '@/components/ui/EditModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { useDispatch } from 'react-redux'
import { handleShowDelete, handleShowEdit } from '@/store/layout'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import Tooltip from '@/components/ui/Tooltip'
import { useDocenteStore } from '@/helpers'
import { setActiveDocente } from '../store/docente'
import { DocenteForm } from '../components/edja/forms'
import { TextInput } from 'flowbite-react'
import { formatDate } from '@/constant/datos-id'
import columnDocente from '@/json/columnDocente'
import { getTipoSituacion } from '../constant/datos-id'

export const Docentes = () => {
  const { docentes, paginate, activeDocente, startLoadingDocente, startSavingDocente, startDeleteDocente, startUpdateDocente, startSearchDocente } = useDocenteStore()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  function onEdit (id) {
    dispatch(setActiveDocente(id))
    dispatch(handleShowEdit())
  }

  function onDelete (id) {
    dispatch(setActiveDocente(id))
    dispatch(handleShowDelete())
  }

  const onSearch = async ({ target: { value } }) => {
    setSearch(value)
    if (value.length === 0) {
      await loadingDocente()
    }
    if (value.length <= 1) return
    await startSearchDocente(value)
  }

  const loadingDocente = async (page = 1) => {
    if (!isLoading) setIsLoading(true)
    await startLoadingDocente(page)
    setIsLoading(false)
  }

  useEffect(() => {
    loadingDocente()
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Docentes</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex gap-2'>
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

                      <Modal
                        title='Agregar Docente'
                        label='Agregar'
                        labelClass='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                        centered
                        children={
                          <DocenteForm
                            fnAction={startSavingDocente}
                          />
                      }
                      />

                      <EditModal
                        title='Editar Docente'
                        centered
                        children={
                          <DocenteForm
                            fnAction={startUpdateDocente}
                            activeDocente={activeDocente}
                          />
                      }
                      />

                      <DeleteModal
                        themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                        centered
                        title='Eliminar Docente'
                        message='¿Estás seguro?'
                        labelBtn='Aceptar'
                        btnFunction={startDeleteDocente}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card noborder>
                <div className='overflow-x-auto -mx-6'>
                  <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                      <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                        <thead className='bg-slate-200 dark:bg-slate-700'>
                          <tr>
                            {columnDocente.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (docentes && docentes.length > 0)
                              ? (docentes.map((docente) => (
                                <tr key={docente.id}>
                                  <td className='table-td mayuscula'>{docente.nombre}</td>
                                  <td className='table-td'>{docente.dni}</td>
                                  <td className='table-td'>{formatDate(docente.fecha_nacimiento)}</td>
                                  <td className='table-td mayuscula'>{docente.domicilio}</td>
                                  <td className='table-td mayuscula'>{docente.formacion}</td>
                                  <td className='table-td'>{formatDate(docente.fecha_docencia)}</td>
                                  <td className='table-td'>{formatDate(docente.fecha_cargo)}</td>
                                  <td className='table-td mayuscula'>{getTipoSituacion(docente.situacion)}</td>
                                  <td className='table-td'>{docente.telefono}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
                                      <button
                                        className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700'
                                        onClick={() => onEdit(docente.id)}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          className='icon icon-tabler icon-tabler-pencil'
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          strokeWidth='2'
                                          stroke='currentColor'
                                          fill='none'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        >
                                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                          <path d='M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4' />
                                          <path d='M13.5 6.5l4 4' />
                                        </svg>
                                      </button>
                                    </Tooltip>

                                    <Tooltip content='Eliminar' placement='top' arrow animation='shift-away'>
                                      <button
                                        className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700'
                                        onClick={() => onDelete(docente.id)}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          className='icon icon-tabler icon-tabler-trash'
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          strokeWidth='1.5'
                                          stroke='currentColor'
                                          fill='none'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        >
                                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                          <path d='M4 7l16 0' />
                                          <path d='M10 11l0 6' />
                                          <path d='M14 11l0 6' />
                                          <path d='M5 7l1 12.5a1 1 0 0 0 1 0.5h10a1 1 0 0 0 1 -0.5l1 -12.5' />
                                          <path d='M9 7l0 -3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1l0 3' />
                                        </svg>
                                      </button>
                                    </Tooltip>
                                  </td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                        }
                        </tbody>
                      </table>

                      {/* Paginado */}
                      {paginate && (
                        <div className='flex justify-center mt-8'>
                          <Pagination
                            paginate={paginate}
                            onPageChange={(page) =>
                              search !== ''
                                ? startSearchDocente(search, page)
                                : startLoadingDocente(page)}
                            text
                          />
                        </div>
                      )}

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
