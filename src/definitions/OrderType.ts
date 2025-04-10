import { statusType } from './statusType'
import { stockageType } from './stockageType'
import { UsagerType } from './UsagerType'

export type OrderDetailType = {
  id_company: number
  id_order: number
  id: number
  detail_nbColis: number | null | undefined
  detail_description: string
  detail_codeSH: string
  detail_codeTarif: 'FRIGODGAE' | 'FRIGO' | 'PPN' | 'PNG' | 'AUTRES' | undefined
  detail_stockage: stockageType | undefined
  detail_poids: number | null
  detail_unitePoids: 'KILO' | 'TONNE' | undefined
  detail_volume: number | undefined | null
  detail_uniteVolume: string
  detail_montantDeclare: number | undefined | null
  detail_contenant: string
  detail_referenceExterne: string
}

  export type OrderForConnaissementDetailType = {
    nbColis: number
    description: string
    codeSH: string
    contenant: string
    codeTarif: 'FRIGODGAE' | 'FRIGO' | 'PPN' | 'PNG' | 'AUTRES' | undefined
    stockage: stockageType | undefined
    poids: number
    unitePoids: 'KILO' | 'TONNE' | undefined
    volume: number | undefined 
    uniteVolume: 'LITRE' | 'M3' | 'DM3' | undefined
    montantDeclare: number | undefined
    referenceExterne: string
  }

export type FilteringOrderDetailType = {
  detail_nbColis: number | null | undefined
  detail_description: string
  detail_codeSH: string
  detail_codeTarif: 'FRIGODGAE' | 'FRIGO' | 'PPN' | 'PNG' | 'AUTRES' | undefined
  detail_contenant: string
  detail_stockage: stockageType | undefined
  detail_poids: number | null
  detail_referenceExterne: string
}

export type OrderType = {
  dateFacture?: string
  dateLivraison?: string
  date_creation: string
  date_etl: string
  date_modification: string
  destinataire: UsagerType
  expediteur: UsagerType
  id: number | null
  id_company: number
  id_connaissement: number | null
  ileArrivee: string
  ileDepart: string
  items: OrderDetailType[]
  lieuArrivee: string | null
  navire: string
  numeroCommande?: string
  numeroVoyage: string | null
  paiement: 'EXPEDITEUR' | 'AVENTURE' | 'DGAE' | 'FAD'
  referenceHorsRevatua: string
  statusRevatua: statusType
  nombreColisAEmbarquer?: number | null
  stockage?: stockageType
}

export type ConnaissementBrouillonDetailType = {
  nbColis: number
  description: string
  codeSH: string
  codeTarif: 'FRIGODGAE' | 'FRIGO' | 'PPN' | 'PNG' | 'AUTRES'
  stockage: stockageType
  poids: number
  unitePoids: string
  volume: number
  uniteVolume: string
  montantDeclare: number
  referenceExterne: string
  version?: string
}

export type ConnaissementBrouillonType = {
  version?: string | undefined
  id_connaissement?: number | undefined
  numeroVoyage: string | null
  paiement: string
  ileDepart: string
  lieuDepart?: string
  statusRevatua: string
  expediteur: UsagerType
  destinataire: UsagerType
  ileArrivee: string
  lieuArrivee?: string | null
  detailConnaissementDTO: ConnaissementBrouillonDetailType[] | unknown[]
  referenceHorsRevatua: string | undefined
  nombreColisAEmbarquer: number | null
  volumeAEmbarquer: number | null | undefined
  demandeParArmateur: boolean
}

///////////////////////////////
// Original order data
///////////////////////////////

interface OriginalCompanyType {
  id_company: number
  name: string
  numero_tahiti: string
  access_token: string
  created_at: string
  updated_at: string
}

interface ItemType {
  id_company: number
  id_order: number
  id: number
  detail_nbColis: number
  detail_description: string
  detail_codeSH: string
  detail_codeTarif: 'FRIGODGAE' | 'FRIGO' | 'PPN' | 'PNG' | 'AUTRES'
  detail_stockage: stockageType
  detail_poids: number
  detail_unitePoids: string
  detail_volume: number
  detail_uniteVolume:  "LITRE" | "M3" | "DM3"
  detail_montantDeclare: number
  detail_contenant: string
  detail_referenceExterne: '30069'
}

export type OriginalOrderType = {
  company: OriginalCompanyType
  id: number
  id_company: number
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
  items: ItemType[]
}

////////////////
//functions
////////////////

export type ProductDataType = {
  id_order?: number | undefined
  detail_nbColis: number | null | undefined
  detail_description: string | undefined
  detail_codeSH: string | undefined
  detail_codeTarif: string | undefined
  detail_stockage: stockageType | string | undefined
  detail_poids: number | null | undefined
  detail_unitePoids?: 'KILO' | undefined
  detail_referenceExterne: string | undefined
  detail_contenant: string | undefined
}

export type selectedOrderType = {
  expediteur: UsagerType
  id?: number | null
  id_connaissement: number
  id_company: number
  numeroVoyage: string | null
  paiement: string
  ileDepart: string
  ileArrivee: string
  lieuArrivee: string
  date_creation: string
  date_etl: string
  dateFacture: string
  dateLivraison: string
  date_modification: string
  numeroCommande: string
  navire: string
  stockage: string
  statusRevatua: string
  referenceHorsRevatua: string
  destinataire: UsagerType
  items: OrderDetailType[]
}



/////////////////////////
//   Add product data
/////////////////////////


export type AddProductType = {
  id_order: number | null
  detail_nbColis: number | null | undefined
  detail_contenant: string | undefined
  detail_description: string | undefined
  detail_codeSH: string | undefined
  detail_codeTarif: string | undefined
  detail_stockage: stockageType | undefined
  detail_poids: number | null | undefined
  detail_unitePoids: string
  detail_referenceExterne: string | undefined
}