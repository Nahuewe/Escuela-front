import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectForm } from '@/components/edja/forms'
import { updatePersona } from '@/store/afiliado'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import DatePicker from '@/components/ui/DatePicker'
import moment from 'moment'
import Loading from '@/components/Loading'
import { edjaApi } from '../../api'

const becas = [
  { id: 1, nombre: 'SÍ' },
  { id: 2, nombre: 'NO' }
]

const initialForm = {
  sexo_id: null
}

function DatosPersonalesData ({ register, setValue, errors, watch }) {
  const dispatch = useDispatch()
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [sexo, setSexo] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [picker, setPicker] = useState(null)
  const [dni, setDni] = useState('')
  const [telefono, setTelefono] = useState('')
  const [edad, setEdad] = useState('')
  const [, setInput] = useState('')
  const [, setFormData] = useState(initialForm)

  async function handleSexo () {
    const response = await edjaApi.get('sexo')
    const { data } = response.data
    setSexo(data)
  }

  const handleDateChange = (date, field) => {
    const formattedDate = new Date(date).toLocaleDateString('en-CA')
    if (field === 'fecha_nacimiento') {
      setPicker(date)
      setValue(field, formattedDate)
    }
  }

  const handleChange = setter => e => {
    const value = e.target.value
    setter(value)
    setValue(e.target.name, value)
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

  const handleSelectChange = (field, e) => {
    const { value } = e.target
    const fieldValue = parseInt(value)
    setFormData(prevState => ({
      ...prevState,
      [field]: fieldValue
    }))
    setValue(field, fieldValue)
  }

  useEffect(() => {
    if (activeAfiliado) {
      const { persona } = activeAfiliado
      const fechaNacimiento = persona.fecha_nacimiento ? moment(persona.fecha_nacimiento, 'YYYY-MM-DD').toDate() : null

      setDni(persona.dni)
      setTelefono(persona.telefono || '')
      setEdad(persona.edad || '')

      // Actualización de los pickers de fecha
      setPicker(fechaNacimiento ? [fechaNacimiento] : [])

      setFormData({
        sexo_id: persona.sexo_id || null
      })

      for (const key in persona) {
        setValue(key, persona[key])
      }
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    const personaData = {
      apellido: watch('apellido'),
      nombre: watch('nombre'),
      dni: dni || watch('dni'),
      fecha_nacimiento: picker ? moment(picker[0]).format('YYYY-MM-DD') : null,
      edad: edad || watch('edad'),
      sexo_id: parseInt(watch('sexo_id')) || null,
      telefono: telefono || watch('telefono'),
      domicilio: watch('domicilio'),
      ocupacion: watch('ocupacion'),
      enfermedad: watch('enfermedad'),
      becas: watch('becas'),
      observacion: watch('observacion')
    }

    dispatch(updatePersona(personaData))
  }, [picker, dni, telefono, edad, watch('apellido'), watch('nombre'), watch('domicilio'), watch('ocupacion'), watch('enfermedad'), watch('becas'), watch('formacion'), watch('observacion'), dispatch])

  async function loadingSexo () {
    !isLoading && setIsLoading(true)

    await handleSexo()
    setIsLoading(false)
  }

  useEffect(() => {
    loadingSexo()
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-blue-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos Personales
            </h4>

            <Card>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Apellido
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    className='mayuscula'
                    name='apellido'
                    type='text'
                    register={register}
                    placeholder='Ingrese el apellido'
                    error={errors.apellido}
                    onChange={handleChange(setInput)}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Nombre
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Textinput
                    className='mayuscula'
                    name='nombre'
                    type='text'
                    register={register}
                    placeholder='Ingrese el nombre'
                    error={errors.nombre}
                    onChange={handleChange(setInput)}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
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
                  <label htmlFor='default-picker' className='form-label'>
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

                <Numberinput
                  label='Edad de Ingreso'
                  className='mayuscula'
                  register={register}
                  id='edad'
                  type='number'
                  value={edad}
                  placeholder='Ingrese la edad de ingreso'
                  onChange={handleChange(setEdad)}
                />

                <SelectForm
                  register={register('sexo_id')}
                  className='mayuscula'
                  title='Sexo'
                  options={sexo}
                  onChange={(e) => handleSelectChange('sexo_id', e)}
                />

                <Numberinput
                  label='Teléfono'
                  register={register}
                  id='telefono'
                  type='number'
                  placeholder='Ingrese el número de teléfono'
                  value={telefono}
                  onChange={handleChange(setTelefono)}
                />

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Domicilio
                  </label>
                  <Textinput
                    className='mayuscula'
                    name='domicilio'
                    type='text'
                    register={register}
                    placeholder='Ingrese el domicilio'
                    error={errors.domicilio}
                    onChange={handleChange(setInput)}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Ocupación
                  </label>
                  <Textinput
                    className='mayuscula'
                    name='ocupacion'
                    type='text'
                    register={register}
                    placeholder='Ingrese la ocupación'
                    error={errors.ocupacion}
                    onChange={handleChange(setInput)}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Enfermedades
                  </label>
                  <Textinput
                    className='mayuscula'
                    name='enfermedad'
                    type='text'
                    register={register}
                    placeholder='Ingrese si tiene alguna enfermedad'
                    error={errors.enfermedad}
                    onChange={handleChange(setInput)}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    ¿Tiene Beca?
                  </label>
                  <SelectForm
                    className='mayuscula'
                    register={register('becas')}
                    options={becas}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Observaciones
                  </label>
                  <Textinput
                    className='mayuscula'
                    name='observacion'
                    type='text'
                    register={register}
                    placeholder='Ingrese alguna observación'
                    error={errors.observacion}
                    onChange={handleChange(setInput)}
                  />
                </div>
              </div>
            </Card>
          </div>
          )}
    </>
  )
}

export default DatosPersonalesData
