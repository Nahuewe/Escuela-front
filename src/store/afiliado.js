import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  afiliados: [],
  afiliadosSinPaginar: [],
  formacion: [],
  persona: {},
  paginate: null,
  activeAfiliado: null,
  errorMessage: ''
}

export const afiliadoSlice = createSlice({
  name: 'afiliado',
  initialState,
  reducers: {
    handleAfiliado: (state, { payload }) => {
      state.afiliados = payload.data
      state.paginate = payload.meta
      state.activeAfiliado = null
    },
    handleAfiliadosSinPaginar: (state, { payload }) => {
      state.afiliadosSinPaginar = payload
    },
    setActiveAfiliado: (state, { payload }) => {
      if (!payload) {
        state.activeAfiliado = null
      } else {
        const afiliadoEnAfiliados = state.afiliados.find((afiliado) => afiliado.id === payload)
        if (afiliadoEnAfiliados) {
          state.activeAfiliado = afiliadoEnAfiliados
        } else {
          state.activeAfiliado = state.afiliadosSinPaginar.find((afiliado) => afiliado.id === payload) || null
        }
      }
    },
    onUpdateAfiliado: (state, { payload }) => {
      state.afiliados = state.afiliados.map((afiliado) => {
        if (afiliado.id === payload.id) return payload
        return afiliado
      })
    },
    onAddOrUpdateFormacion: (state, { payload }) => {
      const index = state.formacion.findIndex((formacion) => formacion.id === payload.id)
      if (index !== -1) {
        state.formacion[index] = payload
      } else {
        state.formacion.push(payload)
      }
    },
    onDeleteFormacion: (state, { payload }) => {
      state.formacion = state.formacion.filter((formacion) => formacion.id !== payload)
    },
    onDeleteAfiliado: (state, { payload }) => {
      state.afiliados = state.afiliados.filter((afiliado) => afiliado.id !== payload.id)
    },
    onShowAfiliado: (state, { payload }) => {
      state.activeAfiliado = payload
    },
    updatePersona: (state, { payload }) => {
      state.persona = payload
    },
    cleanAfiliado: (state) => {
      state.persona = {}
      state.formacion = []
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleAfiliado,
  handleAfiliadosSinPaginar,
  setActiveAfiliado,
  onAddOrUpdateFormacion,
  onDeleteFormacion,
  onUpdateAfiliado,
  onDeleteAfiliado,
  onShowAfiliado,
  updatePersona,
  cleanAfiliado,
  setErrorMessage
} = afiliadoSlice.actions

export default afiliadoSlice.reducer
