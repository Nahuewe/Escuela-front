import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import { sutepaApi } from '../../../api'

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
  const [isUglLoading, setIsUglLoading] = useState(true)
  const [ugl, setUgl] = useState([])

  async function handleUgl () {
    try {
      const response = await sutepaApi.get('ugl')
      const { data } = response.data
      setUgl(data)
      setIsUglLoading(false)
    } catch (error) {
      console.error('Error al obtener UGLs:', error)
      setIsUglLoading(false)
    }
  }

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(activeDocente ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    await fnAction({
      ...data,
      ugl_id: 1
    })
  }

  async function loadingInit () {
    if (activeDocente) {
      setValue('ugl_id', 1)
      setValue('nombre', activeDocente.nombre)
      setValue('domicilio_trabajo', activeDocente.domicilio_trabajo)
      setValue('telefono_laboral', activeDocente.telefono_laboral)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    handleUgl()
  }, [])

  useEffect(() => {
    if (ugl.length > 0) {
      loadingInit()
    }
  }, [ugl, activeDocente])

  return (
    <>
      {isLoading || isUglLoading
        ? (
          <Loading />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>

            <div>
              <label htmlFor='nombre' className='form-label space-y-2'>
                Docente
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='nombre'
                  type='text'
                  placeholder='Nombre del docente'
                  register={register}
                  error={errors.nombre}
                />
              </label>
            </div>

            <div>
              <label htmlFor='domicilio_trabajo' className='form-label space-y-2'>
                Formación Profesional
                <Textinput
                  name='domicilio_trabajo'
                  type='text'
                  placeholder='Formación profesional'
                  register={register}
                />
              </label>
            </div>

            <div>
              <label htmlFor='telefono_laboral' className='form-label space-y-2'>
                Teléfono Laboral
                <Textinput
                  name='telefono_laboral'
                  type='text'
                  placeholder='Teléfono Laboral'
                  register={register}
                />
              </label>
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
          )}
    </>
  )
}
