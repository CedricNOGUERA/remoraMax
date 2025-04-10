import { UsagerType } from './UsagerType'
import { statusType } from './statusType'
import { stockageType } from './stockageType'

//////////////////////////////////
//body data post connaissement
//////////////////////////////////

export type ConnaissementType = {
  detailConnaissementDTO: [
    {
      codeSH: string
      codeTarif: string
      description: string
      nbColis: number
      poids: number
      stockage: 'REFRIGERE' | 'CALE' | 'CONGELE' | 'PONTEE'
      unitePoids: 'KILO' | 'TONNE'
      id: number
      version: string
      contenant: string
      idCapacite: number
      idNomenclature: number
      volume: number
      uniteVolume: 'DM3' | 'LITRE'
      montantDeclare: number
      tarifUnitaire: number
      montantLibre: number
      matiereDangereuse: boolean
      fragile: boolean
      idsPrestationsComplementaires: object
      codeAvantage: string
      referenceExterne: string
    }
  ]
  expediteur: UsagerType

  ileDepart: string
  numeroVoyage: string | null
  paiement: 'EXPEDITEUR' | 'AVENTURE' | 'DGAE' | 'FAD'
  version: string
  numero: string
  lieuDepart: string
  destinataire: UsagerType
  ileArrivee: string
  lieuArrivee?: string | null | undefined
  idsPrestationsComplementaires: object
  referenceHorsRevatua: string
  nombreColisAEmbarquer: number | null
  volumeAEmbarquer: number
  demandeParArmateur: boolean
}

///////////////////////////
//data get connaissement
//////////////////////////

interface lieuDebarquementsType {
  version: string
  id: number
  nom: string
}

interface ilePeripleType {
  id: number
  nom: string
  privee: boolean
  codeZoneTarifaire: string
  version: string
  lieuDebarquements: lieuDebarquementsType[]
}

interface lieuType {
  version?: string
  id: number
  nom: string
}

interface heureType {
  hour: number
  minute: number
  second: number
  nano: number
}

interface manifestesType {
  version: string
  id: number
  dateEdition: string
  type: "SORTIE"| "ENTREE" | "INTER_ILES"
  nomFichier: string
  pdfConnaissements: string[]
  signe: boolean
}

export type PeripleType = {
  id: number
  ileDepart: ilePeripleType
  lieuDepart: lieuType
  dateDepart: string
  heureDepart: heureType
  ileArrivee: ilePeripleType
  lieuArrivee: lieuType
  dateArrivee: string
  heureArrivee: heureType
  version: string
  numeroVoyage: string
  nomNavire: string
  manifestes: manifestesType[]
  genererManifeste: true
  dateDerniereModificationConnaissement: string
}

interface archipelType {
    id: number;
    nom: string;
    nbJoursMaxSansTouche: number | null;
}

interface ileType {
  id: number;
  nom: string;
  privee: boolean;
  archipel: archipelType;
}

interface utilisateurType {
  identifiant: string
  nom: string
  prenom: string
  mail: string
}

interface etatType {
  id: number
  dateEvenement: string
  evenementConnaissement: statusType
  utilisateur: utilisateurType
  nomFichier: string
  motif: string | null
  commentaire: string | null
}

interface voyageType {
  numero: string
  numeroArmateur: string
  nomNavire: string
  croisiere: false
  dateDepart: string
  heureDepart: heureType
  ileDepart: string
  lieuDepart: string
  dateRetour: string
  heureRetour: heureType
  version: string
  periple: PeripleType[]
  dateEditionAvisDepart: string | null
  annule: boolean
  messagesConflit: string[]
  anomalies: string[]
  utilise: boolean
  manifestesInterIles: manifestesType[]
  nomFichierListeEquipage: string | null
  nomFichierMouvementsNavire: string | null
}

interface DesignationType {
  nomenclature: string
  idNomenclature: number
  libelle: string
  codeAvantage: string | null
  categorieMatiereDangereuse: string | null
  nombreUtilisations: number
  codeTarifCode: string | null
}

interface UniteMesureDouaneType {
  "id": number
  "code": string
  "libelle": string
}

interface VariationType {
  "version": string
  "id": number
  "dateDebut": string
 "dateFin": string
}

interface CategorieMatiereDangereuseType {
  "version": string
  "id": number
  "variation": VariationType
  "libelle": string
  "codesSHParent": string[]
}

interface CodeSHType {
  id: number
  nomenclature: string
  libelle: string
  uniteMesureDouane: UniteMesureDouaneType | null
  categorieMatiereDangereuse: CategorieMatiereDangereuseType | null
  designations: DesignationType[]
}

interface CodeTarifType {
  id: number
  code: string
  libelle: string
  refrigere: boolean
  remboursementDgae: boolean | null
}

interface ContenantType {
  id: number
  libelle: string
}

interface CapaciteType {
  version: string
  id: number
  quantite: number
  unite: "LITRE" | "M3" | "DM3"
}

interface CodeAvantageType {
  code: string
  libelle: string
}

export type PrestationsComplementairesType = {
  version: string
  id: number
  libelle: string
  actif: boolean
}

export type DetailType = {
  id: number
  version: string
  nbColis: number
  contenant: ContenantType | null
  capacite: CapaciteType | null
  description: string
  codeSH: CodeSHType
  codeTarif: CodeTarifType
  stockage: stockageType
  poids: number
  unitePoids: "KILO" | "TONNE"
  volume: number | null
  uniteVolume: "LITRE"| "M3"| "DM3"
  montantDeclare: number | null
  montantOfficiel: number | null
  numeroOrdre: number
  tarifUnitaire: number | null
  montantLibre: number | null
  matiereDangereuse: boolean
  fragile: boolean
  codeAvantage: CodeAvantageType | null
  prestationsComplementaires: PrestationsComplementairesType[]
  numeroConnaissement: string
}

interface CommuneType {
  id: number
  nom: string
  codePostal: string
}

interface ArmateurType {
  version: string
  numeroTahiti: string
  raisonSociale: string
  sigle: string
  telephone: string
  mail: string
  boitePostale: string
  commune: CommuneType
  kbis: string[]
  nomFichierKbis: string
  pieceIdentiteResponsableLegal: string[]
  nomFichierPieceIdentiteResponsableLegal: string
  procuration: string[]
  nomFichierProcuration: string
  pieceIdentiteProcuration: string[]
  nomFichierPieceIdentiteProcuration: string
  dateArretActivite: string
  dateValidationInscription: string
  listeEmailsAvisDepart: string
  listeNumerosTahitiFavoris: string
  compteBancaire: string
  codeTiers: string
}

export type ResultConnaissementType = {
  id: number
  numero: string
  voyage: voyageType
  paiement: "EXPEDITEUR" | "AVENTURE" | "DGAE" | "FAD"
  ileDepart: ileType
  armateur: ArmateurType
  expediteur: UsagerType
  lieuDepart: lieuType
  detailConnaissements: DetailType[]
  ileArrivee: ileType
  lieuArrivee: lieuType
  destinataire: UsagerType
  version: string
  dernierEtat: etatType
  dernierEtatOfficialise: etatType
  montantTotal: number | null
  numeroBac: string | null
  prestationsComplementaires?: PrestationsComplementairesType[]
  matiereDangereuse: boolean
  fragile: boolean
  profil: "DPAM" | "ARMATEUR" | "CHARGEUR" | "APPLICATIF_ARMATEUR" | "APPLICATIF_CHARGEUR" | "NOUVELUTILISATEUR" | "PARTICULIER"
  referenceHorsRevatua: string
  nombreColisAEmbarquer: number | null
  volumeAEmbarquer: number | null
}

/////////////////////
//Axios Response type
/////////////////////

interface ConnaissementConfigTransitionalType {
  silentJSONParsing: boolean
  forcedJSONParsing: boolean
  clarifyTimeoutError: boolean
}

interface ConnaissementConfigHeaderType {
  Accept: string
  'Content-Type': string
  Authorization: string
}

export type ResponseConnaissementDataType = {
  "data": ResultConnaissementType[]
}

interface ConnaissementResponseHeadersType {
  'cache-control': string
  'content-length': string
  'content-type': string
}



export type ConnaissementResponseConfigType = {
  transitional: ConnaissementConfigTransitionalType
  adapter: string[]
  transformRequest: string[] | null[]
  transformResponse: string[] | null[]
  timeout: number
  xsrfCookieName: string
  xsrfHeaderName: string
  maxContentLength: number
  maxBodyLength: number | null
  env: { Blob: () => void; FormData: () => void }
  headers: ConnaissementConfigHeaderType
  method: string
  url: string
}


export type ResponseConnaissementType = {
  "data": ResponseConnaissementDataType,
  "status": 200,
  "statusText": "",
  "headers": ConnaissementResponseHeadersType,
  "config": ConnaissementResponseConfigType,
  "request": XMLHttpRequest
}



//////////////////////////////////
//    functions
//////////////////////////////////

export type UpdateNbPaletteType = {
  "version": string
    "detailConnaissementDTO": {
      codeSH: string
      codeTarif: string
      description: string
      nbColis: number
      poids: number
      stockage: string
      unitePoids: string
    }[],
    "expediteur": UsagerType
    "destinataire": UsagerType
    "paiement": string
    "numeroVoyage":string
    "ileDepart": string
    "lieuDepart": string,
    "ileArrivee": string
    "lieuArrivee": string
    "nombreColisAEmbarquer": number

  }