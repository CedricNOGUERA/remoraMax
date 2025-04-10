export type CompanyType = {
  id_company: number | null
  name: string
  client_id?: string
  client_secret?: string
  username?: string
  scope?: string
  password?: string
  access_token: string
  refresh_token?: string
  created_at: string
  updated_at: string
  numero_tahiti: string
}


export type CompanyUserType = {
  id_company: number
  name: string
  numero_tahiti: string
  access_token: string
  created_at: string
  updated_at: string
}