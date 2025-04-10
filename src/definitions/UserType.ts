
interface pivotType {
  model_type: string
  model_id: number
  role_id: number
}

export type roleNameType = 'user' | 'transporteur' | 'comptable' | 'admin' | 'super_admin'

interface roleType {
  id: number
  name: roleNameType
  guard_name: string
  created_at: string
  updated_at: string
  pivot: pivotType
}

interface companyType {
  id_company: number
  name: string
  numero_tahiti: string
  access_token: string
  created_at: string
  updated_at: string
}

export type UserType = {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  role: roleType[]
  companies: companyType[]
}

export type FunctionUserType = {
  name: string
  email?: string | undefined
  role: string
  companies: [],
  password?: string
  password_confirmation?: string
}

export type FormForgotType = {
  email: string | null
  password: string
  password_confirmation: string
  token: string | null
}