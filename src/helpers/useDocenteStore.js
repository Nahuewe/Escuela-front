/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleDocente, handleDocenteSinPaginar, setErrorMessage } from '@/store/docente'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'
import { useState } from 'react'

export const useDocenteStore = () => {
  const { docentes, docentesSinPaginar, paginate, activeDocente } = useSelector(state => state.docente)
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()

  const startLoadingDocente = async (page = 1) => {
    try {
      const response = await sutepaApi.get(`/agencia?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleDocente({ data, meta }))
      setCurrentPage(page)
    } catch (error) {
      console.log(error)
    }
  }

  const startGetDocenteSinPaginar = async () => {
    try {
      const response = await sutepaApi.get('/agenciaAll')
      const { data } = response.data
      dispatch(handleDocenteSinPaginar(data))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingDocente = async (form) => {
    try {
      const response = await sutepaApi.post('/agencia', form)
      await startLoadingDocente(currentPage)
      dispatch(handleShowModal())

      toast.success('Docente agregado con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la agencia:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo crear la agencia: ${errorMessage}`)
    }
  }

  const startUpdateDocente = async (form) => {
    try {
      const id = activeDocente.id
      const response = await sutepaApi.put(`/agencia/${id}`, form)
      const { data } = response.data
      await startLoadingDocente(currentPage)
      dispatch(handleShowEdit())

      toast.success('Docente actualizado con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la agencia:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar la agencia: ${errorMessage}`)
    }
  }

  const startDeleteDocente = async () => {
    try {
      const id = activeDocente.id
      await sutepaApi.delete(`/agencia/${id}`)
      await startLoadingDocente(currentPage)

      toast.success('Docente eliminado con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  const startSearchDocente = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/buscar-agencia?query=${search}&page=${page}`)
      const { data, meta } = response.data
      dispatch(handleDocente({ data, meta }))
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = error.message
      }

      console.error('Error en la búsqueda de docente:', errorMessage)
      toast.error(`No se pudo realizar la búsqueda: ${errorMessage}`)
    }
  }

  return {
    //* Propiedades
    docentes,
    docentesSinPaginar,
    paginate,
    activeDocente,

    //* Metodos
    startLoadingDocente,
    startGetDocenteSinPaginar,
    startSavingDocente,
    startDeleteDocente,
    startUpdateDocente,
    startSearchDocente
  }
}
