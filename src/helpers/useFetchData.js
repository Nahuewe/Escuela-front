import { useEffect, useState } from 'react'
import { edjaApi } from '../api'

const useFetchData = () => {
  const [sexo, setSexo] = useState([])
  const [formacion, setFormacion] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sexoResponse,
          formacionResponse
        ] = await Promise.all([
          edjaApi.get('sexo'),
          edjaApi.get('docente')
        ])

        setSexo(sexoResponse.data.data)
        setFormacion(formacionResponse.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return {
    sexo,
    formacion
  }
}

export default useFetchData
