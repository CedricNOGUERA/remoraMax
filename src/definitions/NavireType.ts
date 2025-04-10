export type NavireType = {
  id: number
  name: string
}

export type NavirelistType = {
  label: string
  value: string
}

export type NavireRevatuaType = {
  id: number
  nom: string
  abreviation: string
  armateur: {
    numeroTahiti: string
    raisonSociale: string
    sigle: string
  }
  voyageExistant: boolean
  croisiere: boolean
  navette: string | null
}