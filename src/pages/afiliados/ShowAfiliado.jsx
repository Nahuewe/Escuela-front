import React from 'react'
import { useAfiliadoStore } from '@/helpers'
import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/constant/datos-id'

export const ShowAfiliado = () => {
  const { activeAfiliado, paginate } = useAfiliadoStore()
  const navigate = useNavigate()
  const currentPage = paginate?.current_page || 1

  return (
    activeAfiliado && (
      <Card>

        {activeAfiliado.persona && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos Personales
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Afiliación:</strong> {formatDate(activeAfiliado.persona.fecha_afiliacion)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Nombre:</strong> <span className='mayuscula'>{activeAfiliado.persona.nombre}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Apellido:</strong> <span className='mayuscula'>{activeAfiliado.persona.apellido}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Sexo:</strong> {activeAfiliado.persona.sexo}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>DNI:</strong> {activeAfiliado.persona.dni}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono:</strong> {activeAfiliado.persona.telefono}
              </div>
            </div>
          </div>
        )}

        <div className='mt-4 flex justify-end gap-4'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate(`/alumnos?page=${currentPage}`)}>Volver</button>
        </div>

      </Card>
    )
  )
}
