import { AxiosHeaders } from "axios";

export type errorType = {
    error: boolean;
      message: string;
}

interface TransitionalConfigType {
  silentJSONParsing: boolean
  forcedJSONParsing: boolean
  clarifyTimeoutError: boolean
}
interface headersConfigType {
  Accept: string
  'Content-Type': string
  Authorization: string
}

interface ConfigType {
  transitional: TransitionalConfigType
  adapter: string[] | null[]
  transformRequest: string[] | null[]
  transformResponse: string[] | null[]
  timeout: number
  xsrfCookieName: string
  xsrfHeaderName: string
  maxContentLength: number
  maxBodyLength: number | null
  env: string
  headers: headersConfigType
  baseURL: string
  method: string
  url: string
  data: string
}


export type ErrorAxiosType = {
  message: string
  name: 'AxiosError'
  stack: string
  config: ConfigType
  code: string
  status: number
  response: {
    config: ConfigType
    data: { message: string }
    headers: AxiosHeaders
    request: XMLHttpRequest
    status: number
    statusText: string
  }
}