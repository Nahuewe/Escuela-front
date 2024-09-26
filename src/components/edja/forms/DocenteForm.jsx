import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SelectForm } from '@/components/edja/forms'
import * as yup from 'yup'
import DatePicker from '@/components/ui/DatePicker'
import Numberinput from '@/components/ui/Numberinput'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import moment from 'moment'

const situacion = [
  { id: 1, nombre: 'Titular' },
  { id: 2, nombre: 'Suplente' },
  { id: 3, nombre: 'Interino' }
]

const FormValidationSaving = yup
  .object({
    nombre: yup.string().required('el nombre es requerido')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    nombre: yup.string().required('el nombre es requerido')
  })
  .required()

export const DocenteForm = ({ fnAction, activeDocente = null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [dni, setDni] = useState('')
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [picker3, setPicker3] = useState(null)
  const [, setInput] = useState('')

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(activeDocente ? FormValidationUpdate : FormValidationSaving)
  })

  const handleChange = setter => e => {
    const value = e.target.value
    setter(value)
    setValue(e.target.name, value)
  }

  const handleDateChange = (date, field) => {
    const formattedDate = new Date(date).toLocaleDateString('en-CA')

    if (field === 'fecha_nacimiento') {
      setPicker(date)
      setValue(field, formattedDate)
    } else if (field === 'fecha_docencia') {
      setPicker2(date)
      setValue(field, formattedDate)
    } else if (field === 'fecha_cargo') {
      setPicker3(date)
      setValue(field, formattedDate)
    }
  }

  const handleDniChange = e => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const dniFormat = /^(\d{1,2})(\d{3})(\d{3})$/
    let formattedDni = ''
    const maxLength = 8

    if (cleanedValue.length > maxLength) {
      return
    }

    if (cleanedValue.length > 1 && cleanedValue.length <= 9) {
      if (cleanedValue.length <= 5) {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      } else {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      }
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
    setValue('dni', formattedDni)
  }

  const onSubmit = async (data) => {
    await fnAction(data)
  }
  async function loadingInit () {
    if (activeDocente) {
      const fechaNacimiento = activeDocente.fecha_nacimiento ? moment(activeDocente.fecha_nacimiento, 'YYYY-MM-DD').toDate() : null
      const fechaDocencia = activeDocente.fecha_docencia ? moment(activeDocente.fecha_docencia, 'YYYY-MM-DD').toDate() : null
      const fechaCargo = activeDocente.fecha_cargo ? moment(activeDocente.fecha_cargo, 'YYYY-MM-DD').toDate() : null

      setValue('nombre', activeDocente.nombre)
      setDni(activeDocente.dni)
      setValue('dni', activeDocente.dni)
      setValue('fecha_nacimiento', activeDocente.fecha_nacimiento ? moment(activeDocente.fecha_nacimiento).format('YYYY-MM-DD') : null)
      setValue('domicilio', activeDocente.domicilio)
      setValue('formacion', activeDocente.formacion)
      setValue('fecha_docencia', activeDocente.fecha_docencia ? moment(activeDocente.fecha_docencia).format('YYYY-MM-DD') : null)
      setValue('fecha_cargo', activeDocente.fecha_cargo ? moment(activeDocente.fecha_cargo).format('YYYY-MM-DD') : null)
      setValue('situacion', activeDocente.situacion)
      setValue('telefono', activeDocente.telefono)

      setPicker(fechaNacimiento ? [fechaNacimiento] : [])
      setPicker2(fechaDocencia ? [fechaDocencia] : [])
      setPicker3(fechaCargo ? [fechaCargo] : [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadingInit()
  }, [activeDocente])

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <div>
            {/* <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-4 relative'> */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>

              <div>
                <label htmlFor='nombre' className='form-label space-y-2'>
                  Nombre Completo
                  <strong className='obligatorio'>(*)</strong>
                  <Textinput
                    name='nombre'
                    type='text'
                    placeholder='Nombre Completo'
                    register={register}
                    error={errors.nombre}
                  />
                </label>
              </div>

              <div>
                <label htmlFor='default-picker' className='form-label space-y-2'>
                  DNI
                  <strong className='obligatorio'>(*)</strong>
                </label>
                <Numberinput
                  register={register}
                  id='dni'
                  placeholder='Ingrese el número de documento'
                  value={dni}
                  error={errors.dni}
                  onChange={handleDniChange}
                />
              </div>

              <div>
                <label htmlFor='default-picker' className='form-label space-y-2'>
                  Fecha de Nacimiento
                </label>
                <DatePicker
                  value={picker}
                  id='fecha_nacimiento'
                  placeholder='Seleccione la fecha de nacimiento'
                  onChange={(date) => handleDateChange(date, 'fecha_nacimiento')}
                />
                <input type='hidden' {...register('fecha_nacimiento')} />
              </div>

              <div>
                <label htmlFor='default-picker' className='form-label space-y-2'>
                  Domicilio
                </label>
                <Textinput
                  name='domicilio'
                  type='text'
                  register={register}
                  placeholder='Ingrese el domicilio'
                  error={errors.domicilio}
                  onChange={handleChange(setInput)}
                />
              </div>

              <div>
                <label htmlFor='formacion' className='form-label space-y-2'>
                  Formación Profesional
                </label>
                <Textinput
                  name='formacion'
                  type='text'
                  placeholder='Formación profesional'
                  register={register}
                />
              </div>

              <div>
                <label htmlFor='default-picker' className='form-label space-y-2'>
                  Fecha de Ingreso a la Docencia
                </label>
                <DatePicker
                  value={picker2}
                  id='fecha_docencia'
                  placeholder='Seleccione la fecha de ingreso a la docencia'
                  onChange={(date) => handleDateChange(date, 'fecha_docencia')}
                />
                <input type='hidden' {...register('fecha_docencia')} />
              </div>

              <div>
                <label htmlFor='default-picker' className='form-label space-y-2'>
                  Fecha de Ingreso al Cargo
                </label>
                <DatePicker
                  value={picker3}
                  id='fecha_cargo'
                  placeholder='Seleccione la fecha ingreso al cargo'
                  onChange={(date) => handleDateChange(date, 'fecha_cargo')}
                />
                <input type='hidden' {...register('fecha_cargo')} />
              </div>

              <div>
                <label htmlFor='default-picker' className='form-label space-y-2'>
                  Situación de Revista
                </label>
                <SelectForm
                  register={register('situacion')}
                  options={situacion}
                />
              </div>

              <div>
                <label htmlFor='telefono' className='form-label space-y-2'>
                  Teléfono Laboral
                </label>
                <Textinput
                  name='telefono'
                  type='number'
                  placeholder='Teléfono Laboral'
                  register={register}
                />
              </div>

              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
          )}
    </>
  )
}
