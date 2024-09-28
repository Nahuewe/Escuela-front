import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import FormacionProfesionalData from '@/components/forms/FormacionProfesionalData'

export const Create = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isParamsLoading, setIsParamsLoading] = useState(true)
  const { activeAfiliado, startSavingAfiliado, startUpdateAfiliado, startLoadingAfiliado, startEditAfiliado } = useAfiliadoStore()
  const { user } = useSelector((state) => state.auth)

  const FormValidationSchema = yup.object().shape({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    dni: yup.string().required('El DNI es requerido')
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = async (data) => {
    if (!activeAfiliado) {
      await startSavingAfiliado(data)
    } else {
      await startUpdateAfiliado(activeAfiliado.persona.id)
    }
  }

  async function loadingAfiliado (page = 1) {
    !isLoading && setIsLoading(true)

    await startLoadingAfiliado(page)
    setIsLoading(false)
  }

  const startGetInitial = async () => {
    setIsParamsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
    startGetInitial()
  }, [])

  useEffect(() => {
    if (!id) return setIsLoading(false)
    if (id && !isParamsLoading) {
      startEditAfiliado(id)
    }
  }, [isParamsLoading, id])

  useEffect(() => {
    if (activeAfiliado) {
      Object.entries(activeAfiliado).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeAfiliado])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
              <div>
                <DatosPersonalesData register={register} errors={errors} setValue={setValue} watch={watch} />

                <FormacionProfesionalData register={register} errors={errors} setValue={setValue} watch={watch} />
              </div>
            )}

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/alumnos')}>
                  Volver
                </button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                  onClick={isSubmitting ? undefined : handleSubmit}
                />
              </div>
            </div>
          </form>
          )}
    </>
  )
}
