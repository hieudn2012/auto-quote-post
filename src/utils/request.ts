import { TOKEN } from "@/config"
import axios from "axios"

const request = axios.create({
  baseURL: 'https://api.gologin.com',
})

request.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  config.headers['Authorization'] = `Bearer ${TOKEN}`
  return config
})

request.interceptors.response.use((response) => {
  return response.data
})

export default request
