export const tipoBeca = {
  1: 'Sí',
  2: 'No'
}

export const tipoSituacion = {
  1: 'Titular',
  2: 'Suplente',
  3: 'Interino'
}

export const tipoRoles = {
  1: 'ADMINISTRADOR',
  2: 'CARGA'
}

export const formatDate = (dateString) => {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)
  if (isNaN(date)) {
    return ''
  }

  // Ajustar la fecha para evitar problemas de huso horario
  const userTimezoneOffset = date.getTimezoneOffset() * 60000
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset)

  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return adjustedDate.toLocaleDateString(undefined, options)
}

export const getTipoRoles = (id) => {
  return tipoRoles[id] || ''
}

export const getTipoSituacion = (id) => {
  return tipoSituacion[id] || ''
}

export const getTipoBeca = (id) => {
  return tipoBeca[id] || ''
}
