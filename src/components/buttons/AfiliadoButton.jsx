import React from 'react'
import Tooltip from '@/components/ui/Tooltip' // Ajusta la ruta según tu estructura de archivos

const AfiliadoButton = ({ afiliado, onDelete }) => {
  const renderButton = () => {
    if (afiliado.estado === 'PENDIENTE') {
      return (
        <Tooltip content='Autorizar' placement='top' arrow animation='shift-away'>
          <button
            className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-700'
            onClick={() => onDelete(afiliado.id)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-tabler icon-tabler-check'
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
              <path d='M5 12l5 5l10 -10' />
            </svg>
          </button>
        </Tooltip>
      )
    } else if (afiliado.estado === 'INACTIVO') {
      return (
        <Tooltip content='Reactivar' placement='top' arrow animation='shift-away'>
          <button
            className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-700'
            onClick={() => onDelete(afiliado.id)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-tabler icon-tabler-arrow-back-up'
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
              <path d='M9 14l-4 -4l4 -4' />
              <path d='M5 10h11a4 4 0 1 1 0 8h-1' />
            </svg>
          </button>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip content='Dar de Baja' placement='top' arrow animation='shift-away'>
          <button
            className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700'
            onClick={() => onDelete(afiliado.id)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-tabler icon-tabler-x'
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
              <path d='M18 6l-12 12' />
              <path d='M6 6l12 12' />
            </svg>
          </button>
        </Tooltip>
      )
    }
  }

  return <>{renderButton()}</>
}

export default AfiliadoButton
