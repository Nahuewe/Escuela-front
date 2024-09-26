import React from 'react'
import { useAfiliadoStore } from '@/helpers'
import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/constant/datos-id'
import { getTipoBeca } from '../../constant/datos-id'

export const ShowAfiliado = () => {
  const { activeAfiliado, paginate } = useAfiliadoStore()
  const navigate = useNavigate()
  const currentPage = paginate?.current_page || 1

  return (
    activeAfiliado && (
      <Card>

        {activeAfiliado.persona && (
          <div>
            <h4 className='card-title text-center bg-blue-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos Personales
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Nombre:</strong> {activeAfiliado.persona.nombre}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Apellido:</strong> {activeAfiliado.persona.apellido}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>DNI:</strong> {activeAfiliado.persona.dni}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Nacimiento:</strong> {formatDate(activeAfiliado.persona.fecha_nacimiento) || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de inicio del Cursado:</strong> {formatDate(activeAfiliado.persona.fecha_cursado) || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Edad de Ingreso:</strong> {activeAfiliado.persona.edad || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Sexo:</strong> {activeAfiliado.persona.sexo || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono:</strong> {activeAfiliado.persona.telefono || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Domicilio:</strong> {activeAfiliado.persona.domicilio || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Ocupación:</strong> {activeAfiliado.persona.ocupacion || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Enfermedades:</strong> {activeAfiliado.persona.enfermedad || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Becas:</strong> {getTipoBeca(activeAfiliado.persona.becas || '-')}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Formacion Profesional:</strong> {activeAfiliado.persona.formacion || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Observaciones:</strong> {activeAfiliado.persona.observacion || '-'}
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
