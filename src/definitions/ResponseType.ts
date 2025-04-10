import { NotificationInternalType } from '../pages/private/Notifications'
import { NotificationType } from './NotificationType'
import { statusType } from './statusType'
import { stockageType } from './stockageType'

export type NotificationInternalResponseType = {
  data: {
    data: NotificationInternalType[] // Remplace NotificationType par ton type exact
  }
}

interface LinksType {
  first: string
  last: string
  prev: string | null
  next: string | null
}

interface MetaLinksType {
  url: string | null
  label: string
  active: boolean
}

interface MetaType {
  current_page: number
  from: number
  last_page: number
  links: MetaLinksType[]
  path: string
  per_page: number
  to: number
  total: number
}

interface HeaderType {
  'cache-control': string
  'content-length': string
  'content-type': string
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
}

export type DataType = {
  data: NotificationType[] | undefined
  links: LinksType
  meta: MetaType
}

export type NotificationResponseType = {
  data: DataType
  status: number
  statusText: string
  headers: HeaderType
  config: ConfigType
  request: string
}

/////////////////////////////
//Orders
/////////////////////////////

interface OrderItemType {
  id_company: number
  id_order: number
  id: number
  detail_nbColis: number
  detail_description: string
  detail_codeSH: string
  detail_codeTarif: 'FRIGODGAE' | 'FRIGO' | 'PPN' | 'PNG' | 'AUTRES'
  detail_stockage: stockageType
  detail_poids: number
  detail_unitePoids: 'KILO' | 'TONNE' | undefined
  detail_volume: number | undefined | null
  detail_uniteVolume: 'LITRE' | 'M3' | 'DM3'
  detail_montantDeclare: number | undefined | null
  detail_contenant: string
  detail_referenceExterne: string
}

interface OrderCompanyType {
  id_company: number
  name: string
  numero_tahiti: string
  access_token: string
  created_at: string
  updated_at: string
}

export type OrderDataType = {
  company: OrderCompanyType
  id: number
  id_connaissement: number | null
  numero_commande: string
  bateau: string
  numeroVoyage: string | null
  paiement: 'EXPEDITEUR' | 'AVENTURE' | 'DGAE' | 'FAD'
  ileDepart: string
  expediteur_denomination: string
  expediteur_telephone: string
  expediteur_mail: string
  expediteur_numeroTahiti: string
  destinataire_denomination: string
  destinataire_telephone: string
  destinataire_mail: string
  destinataire_numeroTahiti: string
  ileArrivee: string
  lieuArrivee: string
  referenceHorsRevatua: string
  date_facture: string
  date_livraison: string
  statut_revatua: statusType | 'A_PLANIFIER' | 'A_DEPLANIFIER'
  url_qrcode: string | null
  stockage: stockageType
  date_etl: string
  date_creation: string
  date_modification: string
  items: OrderItemType[]
}

interface OrderLinkType {
  url: string | null
  label: string
  active: boolean
}

export type OrderResponseDataType = {
  current_page: number
  data: OrderDataType[]
  first_page_url: string
  from: number
  last_page: number | null
  last_page_url: string
  links: OrderLinkType[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

interface OrderResponseHeadersType {
  'cache-control': string
  'content-length': string
  'content-type': string
}

interface OrderConfigTransitionalType {
  silentJSONParsing: boolean
  forcedJSONParsing: boolean
  clarifyTimeoutError: boolean
}

interface OrderConfigHeaderType {
  Accept: string
  'Content-Type': string
  Authorization: string
}

export type OrderResponseConfigType = {
  transitional: OrderConfigTransitionalType
  adapter: string[]
  transformRequest: string[] | null[]
  transformResponse: string[] | null[]
  timeout: number
  xsrfCookieName: string
  xsrfHeaderName: string
  maxContentLength: number
  maxBodyLength: number | null
  env: {Blob: ()=> void,
    FormData: () => void
  }
  headers: OrderConfigHeaderType
  method: string
  url: string
}

export type OrderResponseType = {
  data: OrderResponseDataType[]
  status: number
  statusText: string
  headers: OrderResponseHeadersType
  config: OrderResponseConfigType
  request: XMLHttpRequest
}
