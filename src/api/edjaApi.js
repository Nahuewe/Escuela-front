import axios from 'axios'

const edjaApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
})

edjaApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }

  return config
})

export default edjaApi
