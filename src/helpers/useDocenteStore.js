/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleDocente, handleDocenteSinPaginar, setErrorMessage } from '@/store/docente'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { edjaApi } from '../api'
import { useState } from 'react'
import { onShowDocente } from '../store/docente'

export const useDocenteStore = () => {
  const { docentes, docentesSinPaginar, paginate, activeDocente } = useSelector(state => state.docente)
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()

  const startLoadingDocente = async (page = 1) => {
    try {
      const response = await edjaApi.get(`/docente?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleDocente({ data, meta }))
      setCurrentPage(page)
    } catch (error) {
      console.log(error)
    }
  }

  const startGetDocenteSinPaginar = async () => {
    try {
      const response = await edjaApi.get('/docenteAll')
      const { data } = response.data
      dispatch(handleDocenteSinPaginar(data))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingDocente = async (form) => {
    try {
      const response = await edjaApi.post('/docente', form)
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

      console.error('Error en la actualización de la docente:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo crear la docente: ${errorMessage}`)
    }
  }

  const startEditDocente = async (id) => {
    try {
      const currentPage = paginate?.current_page || 1
      const response = await edjaApi.get(`/docente/${id}`)
      const { data } = response.data
      dispatch(onShowDocente(data, currentPage))
    } catch (error) {
      console.log(error)
    }
  }

  const startUpdateDocente = async (form) => {
    try {
      const id = activeDocente.id
      const response = await edjaApi.put(`/docente/${id}`, form)
      const { data } = response.data
      await startLoadingDocente(currentPage)
      dispatch(handleShowEdit())

      toast.info('Docente actualizado con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la docente:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar la docente: ${errorMessage}`)
    }
  }

  const startDeleteDocente = async () => {
    try {
      const id = activeDocente.id
      await edjaApi.delete(`/docente/${id}`)
      await startLoadingDocente(currentPage)

      toast.success('Docente eliminado con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  const startSearchDocente = async (search, page = 1) => {
    try {
      const response = await edjaApi.get(`/buscar-docente?query=${search}&page=${page}`)
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
    startEditDocente,
    startDeleteDocente,
    startUpdateDocente,
    startSearchDocente
  }
}
