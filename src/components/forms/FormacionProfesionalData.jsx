import React, { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { onAddOrUpdateFormacion, onDeleteFormacion } from '@/store/afiliado'
import { SelectForm } from '@/components/edja/forms'
import { Icon } from '@iconify/react'
import { formatDate } from '@/constant/datos-id'
import { edjaApi } from '@/api'
import Tooltip from '@/components/ui/Tooltip'
import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import DatePicker from '../ui/DatePicker'
import moment from 'moment'
import Loading from '@/components/Loading'

const initialForm = {
  formacion_id: null,
  fecha_cursado: null,
  fecha_finalizacion: null,
  observaciones: ''
}

function FormacionProfesionalData () {
  const dispatch = useDispatch()
  const { register, setValue, reset } = useForm()
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [formaciones, setFormaciones] = useState([])
  const [editingFormacionId, setEditingFormacionId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef()
  const [formacion, setFormacion] = useState([])
  const [idCounter, setIdCounter] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingFormaciones] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  function onChange ({ target }) {
    const { name, value } = target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const getFormacionName = (formacionId) => {
    const formacionEncontrada = formacion.find(f => f.id === formacionId)
    return formacionEncontrada ? formacionEncontrada.formacion : 'No Especifica'
  }

  async function handleFormacion () {
    const response = await edjaApi.get('docenteAll')
    const { data } = response.data
    setFormacion(data)
  }

  const handleDateChange = (date, field) => {
    if (field === 'fecha_cursado') {
      setPicker(date)
      setValue(field, date)
    } else if (field === 'fecha_finalizacion') {
      setPicker2(date)
      setValue(field, date)
    }
  }

  const handleSelectChange = (e) => {
    const { value } = e.target
    const tipoFormacionId = parseInt(value)
    setFormData((prevState) => ({
      ...prevState,
      formacion_id: tipoFormacionId
    }))
  }

  const onReset = () => {
    formRef.current.reset()
    setPicker(null)
    setPicker2(null)
    setFormData(initialForm)
    setIsEditing(false)
    setEditingFormacionId(null)
    reset(initialForm)
  }

  function addFormacion () {
    const selectedFormacionName = getFormacionName(formData.formacion_id)

    const newFormacion = {
      ...formData,
      nombre_formacion: selectedFormacionName,
      fecha_cursado: picker ? moment(picker[0]).format('YYYY-MM-DD') : null,
      fecha_finalizacion: picker2 ? moment(picker2[0]).format('YYYY-MM-DD') : null,
      id: isEditing ? editingFormacionId : idCounter
    }

    if (isEditing) {
      setFormaciones((prevFormaciones) =>
        prevFormaciones.map((formacion) =>
          formacion.id === editingFormacionId ? newFormacion : formacion
        )
      )
    } else {
      setFormaciones((prevFormaciones) => [...prevFormaciones, newFormacion])
      setIdCounter(idCounter + 1)
    }

    onReset()
  }

  const handleEdit = (formacion) => {
    const fechaCursado = formacion.fecha_cursado ? moment(formacion.fecha_cursado, 'YYYY-MM-DD').toDate() : null
    const fechaFinalizacion = formacion.fecha_finalizacion ? moment(formacion.fecha_finalizacion, 'YYYY-MM-DD').toDate() : null

    setFormData({
      ...formacion,
      fecha_cursado: formacion.fecha_cursado,
      fecha_finalizacion: formacion.fecha_finalizacion
    })

    setEditingFormacionId(formacion.id)
    setIsEditing(true)

    setPicker(fechaCursado ? [fechaCursado] : [])
    setPicker2(fechaFinalizacion ? [fechaFinalizacion] : [])

    setValue('formacion_id', formacion.formacion_id)
    setValue('fecha_cursado', formacion.fecha_cursado)
    setValue('fecha_finalizacion', formacion.fecha_finalizacion)
    setValue('observaciones', formacion.observaciones)
  }

  const onDelete = (id) => {
    const newFormaciones = formaciones.filter(formacion => formacion.id !== id)
    setFormaciones(newFormaciones)
    dispatch(onDeleteFormacion(id))
  }

  useEffect(() => {
    if (activeAfiliado && activeAfiliado.formacion) {
      const formattedFormaciones = activeAfiliado.formacion.map(formacionItem => {
        const nombreFormacion = getFormacionName(formacionItem.formacion_id)
        return {
          ...formacionItem,
          nombre_formacion: nombreFormacion,
          fecha_cursado: formacionItem.fecha_cursado ? moment(formacionItem.fecha_cursado).format('YYYY-MM-DD') : null,
          fecha_finalizacion: formacionItem.fecha_finalizacion ? moment(formacionItem.fecha_finalizacion).format('YYYY-MM-DD') : null
        }
      })
      setFormaciones(formattedFormaciones)
    }
  }, [activeAfiliado])

  useEffect(() => {
    if (activeAfiliado && activeAfiliado.formacion) {
      const timer = setTimeout(() => {
        const formattedFormaciones = activeAfiliado.formacion.map(formacionItem => {
          const nombreFormacion = getFormacionName(formacionItem.formacion_id)
          return {
            ...formacionItem,
            nombre_formacion: nombreFormacion,
            fecha_cursado: formacionItem.fecha_cursado
              ? moment(formacionItem.fecha_cursado).format('YYYY-MM-DD')
              : null,
            fecha_finalizacion: formacionItem.fecha_finalizacion
              ? moment(formacionItem.fecha_finalizacion).format('YYYY-MM-DD')
              : null
          }
        })
        setFormaciones(formattedFormaciones)
      }, 1)

      return () => clearTimeout(timer)
    }
  }, [activeAfiliado, formacion])

  async function loadingFormacion () {
    !isLoading && setIsLoading(true)

    await handleFormacion()
    setIsLoading(false)
  }

  useEffect(() => {
    loadingFormacion()
  }, [])

  useEffect(() => {
    if (!loadingFormaciones) {
      formaciones.forEach(formacion => {
        dispatch(onAddOrUpdateFormacion(formacion))
      })
    }
  }, [formaciones, loadingFormaciones, dispatch])

  useEffect(() => {
    if (activeAfiliado) {
      const intervals = [100]
      const timers = intervals.map((interval) =>
        setTimeout(() => {
          setReloadKey((prevKey) => prevKey + 1)
        }, interval)
      )

      return () => timers.forEach(clearTimeout)
    }
  }, [activeAfiliado])

  return (
    <div key={reloadKey}>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Formacion Profesional
            </h4>

            <Card>
              <form ref={formRef}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                  <SelectForm
                    className='mayuscula'
                    value={formData.formacion_id}
                    register={register('formacion_id')}
                    title='Tipo de Formacion'
                    options={formacion.map(f => ({ ...f, formacion: f.formacion.toUpperCase() }))}
                    onChange={handleSelectChange}
                  />

                  <div>
                    <label htmlFor='fecha_cursado' className='form-label'>
                      Fecha de Cursado
                    </label>
                    <DatePicker
                      value={picker}
                      id='fecha_cursado'
                      name='fecha_cursado'
                      placeholder='Ingrese la fecha de cursado'
                      onChange={(date) => handleDateChange(date, 'fecha_cursado')}
                    />
                    <input type='hidden' {...register('fecha_cursado')} />
                  </div>

                  <div>
                    <label htmlFor='fecha_finalizacion' className='form-label'>
                      Fecha de Finalizacion
                    </label>
                    <DatePicker
                      value={picker2}
                      id='fecha_finalizacion'
                      name='fecha_finalizacion'
                      placeholder='Ingrese la fecha de finalizacion'
                      onChange={(date) => handleDateChange(date, 'fecha_finalizacion')}
                    />
                    <input type='hidden' {...register('fecha_finalizacion')} />
                  </div>

                  <div>
                    <label htmlFor='observaciones' className='form-label'>
                      Observaciones
                    </label>
                    <Textarea
                      className='mayuscula'
                      name='observaciones'
                      value={formData.observaciones}
                      onChange={onChange}
                      register={register}
                      placeholder='Ingrese algunas observaciones'
                    />
                  </div>

                </div>
              </form>
              <div className='flex justify-end mt-4 gap-4'>
                <button
                  type='button'
                  className={`btn rounded-lg ${isEditing ? 'btn-purple' : 'btn-primary'}`}
                  onClick={addFormacion}
                >
                  {isEditing ? 'Terminar Edición' : 'Agregar Formacion'}
                </button>
              </div>
            </Card>
          </div>
          )}
      {formaciones.length > 0 && (
        <div className='overflow-x-auto mt-4'>
          <table className='table-auto w-full'>
            <thead className='bg-gray-300 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-center dark:text-white'>Tipo de Formación</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Cursado</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Finalizacion</th>
                <th className='px-4 py-2 text-center dark:text-white'>Observaciones</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {formaciones.map((formacion) => (
                <tr key={formacion.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 text-center dark:text-white mayuscula'>{formacion.nombre_formacion || '-'}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{formatDate(formacion.fecha_cursado) || '-'}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    {formacion.fecha_finalizacion ? formatDate(formacion.fecha_finalizacion) : 'Cursando...'}
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white mayuscula'>{formacion.observaciones || '-'}</td>
                  <td className='text-center py-2 gap-4 flex justify-center'>
                    <Tooltip content='Editar'>
                      <button
                        type='button'
                        onClick={() => handleEdit(formacion)}
                        className='text-purple-600 hover:text-purple-900'
                      >
                        <Icon icon='heroicons:pencil-square' width='24' height='24' />
                      </button>
                    </Tooltip>
                    <Tooltip content='Eliminar'>
                      <button
                        type='button'
                        onClick={() => onDelete(formacion.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        <Icon icon='heroicons:trash' width='24' height='24' />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default FormacionProfesionalData
