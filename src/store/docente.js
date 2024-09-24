/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
import { createSlice } from '@reduxjs/toolkit'

export const docenteSlice = createSlice({
  name: 'docente',
  initialState: {
    docentes: [],
    docentesSinPaginar: [],
    activeDocente: null,
    paginate: null,
    errorMessage: ''
  },
  reducers: {
    handleDocente: (state, { payload }) => {
      state.docentes = payload.data
      state.paginate = payload.meta
      state.activeDocente = null
    },
    handleDocenteSinPaginar: (state, { payload }) => {
      state.docentesSinPaginar = payload
    },
    onAddNewDocente: (state, { payload }) => {
      state.docentes.push(payload)
      state.activeDocente = null
    },
    setActiveDocente: (state, { payload }) => {
      state.docentes.filter((docente) => {
        if (docente.id == payload) { return state.activeDocente = docente }
      })
    },
    onDeleteDocente: (state, { payload }) => {
      state.docentes = state.docentes.map((docente) => {
        if (docente.id == payload.id) { return payload }
        return docente
      })
      state.activeDocente = null
    },
    onUpdateDocente: (state, { payload }) => {
      state.docentes = state.docentes.map((docente) => {
        if (docente.id == payload.id) { return payload }
        return docente
      })
      state.activeDocente = null
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleDocente,
  handleDocenteSinPaginar,
  onAddNewDocente,
  setActiveDocente,
  onDeleteDocente,
  onUpdateDocente,
  setErrorMessage
} = docenteSlice.actions

export default docenteSlice.reducer
