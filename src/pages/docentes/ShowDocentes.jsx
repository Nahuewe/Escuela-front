import React from 'react'
import { useDocenteStore } from '@/helpers'
import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/constant/datos-id'
import { getTipoSituacion } from '../../constant/datos-id'

export const ShowDocente = () => {
  const { activeDocente, paginate } = useDocenteStore()
  const navigate = useNavigate()
  const currentPage = paginate?.current_page || 1

  return (
    activeDocente && (
      <Card>

        {activeDocente && (
          <div>

            {/* Datos personales */}

            <h4 className='card-title text-center bg-blue-500 dark:bg-gray-600 text-white rounded-md p-2'>
              Datos Personales del Docente
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Nombre:</strong> <span className='mayuscula'>{activeDocente.nombre}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>DNI:</strong> {activeDocente.dni}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Nacimiento:</strong> {formatDate(activeDocente.fecha_nacimiento) || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Domicilio:</strong> <span className='mayuscula'>{activeDocente.domicilio || '-'}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Formación Profesional:</strong> <span className='mayuscula'>{activeDocente.formacion || '-'}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Ingreso a la Docencia:</strong> {formatDate(activeDocente.fecha_docencia) || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Ingreso al cargo:</strong> {formatDate(activeDocente.fecha_cargo) || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Situación de Revista:</strong> <span className='mayuscula'>{getTipoSituacion(activeDocente.situacion || '-')}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono:</strong> {activeDocente.telefono || '-'}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Observaciones:</strong> <span className='mayuscula'>{activeDocente.observacion || '-'}</span>
              </div>
            </div>
          </div>
        )}

        <div className='mt-4 flex justify-end gap-4'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate(`/docentes?page=${currentPage}`)}>Volver</button>
        </div>

      </Card>
    )
  )
}
