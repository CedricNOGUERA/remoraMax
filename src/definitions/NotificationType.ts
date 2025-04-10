import { statusType } from "./statusType"

export type NotificationType = {
  id: number
  num_voyage: string
  navire: string | null
  etat: statusType | undefined
  destinataire: string | null
  motif: string | null
  views: string
  created_at: string
}

