import axios from "axios"

const request = axios.create({
  baseURL: 'https://api.gologin.com',
})

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODBjODY0Yjg5ZmUyYTY1MWNjMjE2YzIiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2ODBjOGQxZGNiZTA1YTE2MTExN2IyMTkifQ.3r1Gnp8WVYQzg0iYS6xTeUw0-qshuQviUqg-XeYegu8`

request.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  config.headers['Authorization'] = `Bearer ${token}`
  return config
})

request.interceptors.response.use((response) => {
  return response.data
})

export default request
