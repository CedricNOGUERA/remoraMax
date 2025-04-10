import { statusType } from '../definitions/statusType'
import { stockageType } from '../definitions/stockageType'
import pontee from '../styles/images/pontee.png'
import calex from '../styles/images/calex.png'
import fresh from '../styles/images/fresh.png'
import freeze from '../styles/images/freeze.png'
import OrdersService from '../services/orders/OrdersService'
import moment from 'moment'
import { OrderDetailType, OrderType } from '../definitions/OrderType'
import { filteringDataType } from '../definitions/ComponentType'
import { SetStateAction } from 'react'
import { DetailType, ResultConnaissementType } from '../definitions/ConnaissementType'
import { OrderDataType } from '../definitions/ResponseType'
import VersionService from '../services/version/VersionService'
import { AxiosError } from 'axios'

export const _handleSelectOrders = (
  order: OrderType,
  ordersForConnaissement: OrderType[],
  setOrdersForConnaissement: React.Dispatch<React.SetStateAction<OrderType[]>>
) => {
  if (ordersForConnaissement.includes(order)) {
    setOrdersForConnaissement(
      ordersForConnaissement.filter((item: OrderType) => item !== order)
    )
  } else {
    setOrdersForConnaissement([...ordersForConnaissement, order])
  }
}

/**
 * Fonction qui permet de formater la date du jour (YYYY-MM-DD)
 * @returns {string} YYYY-MM-DD
 */
export const _todayDate = () => {
  const today = new Date()

  // Obtenir l'année
  const year = today.getFullYear()

  // Obtenir le mois (ajouter 1 car les mois commencent à 0)
  const month = String(today.getMonth() + 1).padStart(2, '0')

  // Obtenir le jour du mois
  const day = String(today.getDate()).padStart(2, '0')

  // Combiner le tout dans le format souhaité
  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}
/**
 * Fonction qui permet de formater la date du jour (DD/MM/YYYY)
 * @param date
 * @returns {string} DD/MM/YYYY
 */
export const _formatDate = (date: string | undefined) => {
  const formattedDate = moment(date).format('DD/MM/YYYY')

  return formattedDate
}

export const _numFacture = (ordersForConnaissement: OrderType[]): string | undefined => {
  if (ordersForConnaissement?.length > 0) {
    const concateNumFacture = ordersForConnaissement
      .map((order: OrderType) => order.referenceHorsRevatua)
      .join(' | ')
    return concateNumFacture
  }
}

export const _numeroFacture = (referenceHorsRevatua: string): string | undefined => {
    const updatedNumFacture = referenceHorsRevatua
      ?.replace('|', ' | ')
    return updatedNumFacture
}
//Fonction récupère l'id de plusienurs factures

export const _idOrders = (missingFromTab2: OrderType[] | undefined): (number | null)[] | undefined => {
  if (missingFromTab2 && missingFromTab2?.length > 0) {
    const concateIdFacture = missingFromTab2.map((order: OrderType) => order.id)
    return concateIdFacture
  }
}

//concatène les produits de plusienurs factures et formatte les données
export const _detailProduct = (
  ordersForConnaissement: OrderType[],
  versionBill: string | undefined
) => {
  if (ordersForConnaissement?.length > 0) {
    const formatData = (data: OrderDetailType[]) => {
      return data.map((item: OrderDetailType) => {
        if (item.detail_contenant === '') {
          return {
            version: versionBill,
            nbColis: item.detail_nbColis,
            description: item.detail_description.trim(),
            codeSH: item.detail_codeSH.replace(/\./g, ''),
            codeTarif: item.detail_codeTarif,
            stockage: item.detail_stockage,
            poids: item.detail_poids,
            unitePoids: item.detail_unitePoids,
            volume: item.detail_volume,
            uniteVolume: item.detail_uniteVolume,
            montantDeclare: item.detail_montantDeclare,
            referenceExterne: item.detail_referenceExterne,
          }
        } else {
          return {
            version: versionBill,
            nbColis: item.detail_nbColis,
            description: item.detail_description.trim(),
            codeSH: item.detail_codeSH.replace(/[.\s]/g, ''),
            contenant: item.detail_contenant,
            codeTarif: item.detail_codeTarif,
            stockage: item.detail_stockage,
            poids: item.detail_poids,
            unitePoids: item.detail_unitePoids,
            volume: item.detail_volume,
            uniteVolume: item.detail_uniteVolume,
            montantDeclare: item.detail_montantDeclare,
            referenceExterne: item.detail_referenceExterne,
          }
        }
      })
    }
    const detailProducts = ordersForConnaissement.map((order: OrderType) =>
      order.items.map((detail: OrderDetailType) => detail)
    )
    // Utiliser reduce pour concaténer tous les tableaux dans `detailProducts`
    const concatdetailProduct = detailProducts.reduce(
      (acc: OrderDetailType[], current: OrderDetailType[]) => acc.concat(current),
      []
    )
    return formatData(concatdetailProduct)
  }
}

//Retire les produits doublons et addition les qté, les poids, les volumes et les montants
export const _reduceTabProduct = (
  ordersForConnaissement: OrderType[],
  versionBill: string | undefined
) => {
  const prod = Object?.values(
    _detailProduct(ordersForConnaissement, versionBill)?.reduce((acc: any, item: any) => {
      const key = item.description // Regrouper par description

      if (!acc[key]) {
        // Initialisation du groupe s'il n'existe pas
        acc[key] = {
          ...item,
          nbColis: 0,
          poids: 0,
          volume: 0,
          montantDeclare: 0,
        }
      }

      // Agréger les valeurs
      acc[key].nbColis += item.nbColis
      acc[key].poids += parseFloat(item.poids)
      acc[key].volume += item.volume
      acc[key].montantDeclare += item.montantDeclare
console.log(acc)
      return acc
    }, {} as any)
  )

  return prod
}

export const _totalColis = (ordersForConnaissement: OrderType[]) => {
  const detailProducts = _detailProduct(ordersForConnaissement, undefined)
  const total = detailProducts?.reduce((acc: number, current) => acc + (current.nbColis ?? 0), 0)
  return total
}


export const _totalVolume = (ordersForConnaissement: OrderType[]): number | undefined => {
  const detailProducts = _detailProduct(ordersForConnaissement, undefined)

  const total = detailProducts?.reduce(
    (acc: number, current) => acc + (current.volume ?? 0),
    0
  )
  return total
}

export const _thousandSeparator = (number: number, locale: string = 'fr-FR'): string => {
  return number?.toLocaleString(locale, {
    minimumFractionDigits: 0, // Pas de décimales
  })
}

//Définie la couleur des tags en fonction du status
export const _tagStatus = (status: statusType | undefined) => {
  switch (status) {
    case 'BROUILLON':
      return 'yellow'

    case 'DEMANDE':
      return 'cyan'

    case 'DEMANDE_REFUSEE':
      return 'red'

    case 'SAISIE':
      return 'blue'

    case 'OFFICIALISE':
      return 'green'

    case 'OFFICIALISE_SOUS_RESERVE':
      return 'orange'

    case 'MODIFIE':
      return 'yellow'

    case 'PRIS_EN_CHARGE':
      return 'orange'

    case 'EMBARQUE':
      return 'green'

    case 'EMBARQUEMENT_REFUSE':
      return 'red'

    case 'TRANSFERE':
      return 'violet'

    case 'ANNULE':
      return 'red'

    default:
      return undefined
  }
}

export const _tempStockage = (stockage: stockageType) => {
  switch (stockage) {
    case 'REFRIGERE':
      return 'FRAIS'

    case 'CALE':
      return 'SEC'

    case 'CONGELE':
      return 'CONGELE'

    case 'PONTEE':
      return 'SEC'

    default:
      return undefined
  }
}
export const _tempStockageColor = (stockage: stockageType | undefined) => {
  switch (stockage) {
    case 'REFRIGERE':
      return 'bg-green-pale'

    case 'CALE':
      return 'bg-yellow-pale'

    case 'CONGELE':
      return 'bg-blue-pale'

    case 'PONTEE':
      return 'bg-yellow-pale'

    default:
      return undefined
  }
}
//Définie la couleur des tags en fonction du stockage
export const _tagStockage = (stockage: stockageType | undefined) => {
  switch (stockage) {
    case 'REFRIGERE':
      return 'green'

    case 'CALE':
      return 'orange'

    case 'CONGELE':
      return 'blue'

    case 'PONTEE':
      return 'orange'

    default:
      return undefined
  }
}

//Définie l'icone en fonction du stockage
export const _stockagePics = (stockage: stockageType) => {
  switch (stockage) {
    case 'REFRIGERE':
      return fresh

    case 'CALE':
      return calex

    case 'CONGELE':
      return freeze

    case 'PONTEE':
      return pontee

    default:
      return undefined
  }
}

export const _transformDataToNested = (data: OrderDataType[]) => {
  const result: OrderType[] = []
  data?.forEach((item: OrderDataType) => {
    result.push({
      expediteur: {
        denomination: item.expediteur_denomination,
        telephone: item.expediteur_telephone,
        mail: item.expediteur_mail,
        numeroTahiti: item.expediteur_numeroTahiti,
      },

      id: item.id,
      id_connaissement: item.id_connaissement,
      id_company: item.company?.id_company,
      numeroVoyage: item.numeroVoyage,
      paiement: item.paiement,
      ileDepart: item.ileDepart,
      ileArrivee: item.ileArrivee,
      lieuArrivee: item.lieuArrivee,
      date_creation: item.date_creation,
      date_etl: item.date_etl,
      dateFacture: item.date_facture,
      dateLivraison: item.date_livraison,
      date_modification: item.date_modification,
      numeroCommande: item.numero_commande,
      navire: item?.bateau?.replace(/Bateau /g, ''),
      stockage: item?.stockage,
      statusRevatua: item.statut_revatua,
      referenceHorsRevatua: item.referenceHorsRevatua,
      destinataire: {
        denomination: item.destinataire_denomination,
        telephone: item.destinataire_telephone,
        mail: item.destinataire_mail,
        numeroTahiti: item.destinataire_numeroTahiti,
      },
      items: item.items,
    })
  })
  return result
}


export const _getOrdersData2 = async (
  token: string | null,
  page: number, // Ajouter la page en paramètre
  setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorOrderMessage: React.Dispatch<
    React.SetStateAction<{
      error: boolean
      message: string
    }>
  >,
  itemPerPage: number
) => {
  setIsLoading(true)
  setDataOrder([])
  try {
    const response = await OrdersService.getOrders(token, page, itemPerPage)
    console.log(response.data.data)
    setDataOrder(_transformDataToNested(response.data.data))
    console.log(response.data.data)
    // Nombre total de pages
    setTotalPages(response.data.meta.last_page)
    setIsLoading(false)
    setErrorOrderMessage({
      error: false,
      message: '',
    })
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      setIsLoading(false)
      setErrorOrderMessage({
        error: true,
        message: error?.message,
      })
    }

    console.log(error)
  }
}

export const _dataSorter = (
  sortName: keyof OrderDetailType & string,
  order: 'asc' | 'desc',
  setSortConfig: React.Dispatch<
      React.SetStateAction<{
        key: string
        order: 'asc' | 'desc'
      } | null>>,
  selectedOrder: OrderType,
  setSelectedOrder: React.Dispatch<SetStateAction<OrderType>>
) => {
  setSortConfig({ key: sortName, order })
  const sortedItems = [...(selectedOrder?.items || [])] // Créer une copie des éléments

  sortedItems.sort((a: OrderDetailType, b: OrderDetailType) => {
    const aValue = a?.[sortName]
    const bValue = b?.[sortName]
    console.log(aValue)

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? (aValue) - (bValue) : (bValue) - (aValue)
    }

    if (aValue && bValue) {
      return order === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString())
    }

    return 0 // En cas de valeurs nulles ou indéfinies
  })

  // Mettre à jour l'état avec les éléments triés
  setSelectedOrder((prev: OrderType) => ({ ...prev, items: sortedItems }))
}

export const _handleClearCache = () => {
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName)
      })
    })
  } else {
    console.log(
      'Impossible de vider le cache. Votre navigateur ne prend pas en charge cette fonctionnalité.'
    )
  }
}

export const _handlefilteredOrder = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  filteringData: filteringDataType,
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataType>>
) => {
  const { name, value } = event.currentTarget
  const updatedFilteringData = {
    ...filteringData,
    [name]: value,
  }
  setFilteringData(updatedFilteringData)
}

export const _getIdNavire = (
  navire: string,
  naviresData:
    | {
        id: number
        name: string
      }[]
    | undefined
) => {
  if (navire) {
    const result = naviresData?.filter((item: { id: number; name: string }) =>
      item.name?.toLowerCase()?.includes(navire?.toLowerCase())
    )[0]
    return result?.id ? `${result.id}` : undefined
  }
  return undefined
}

export const _getIdIsland = (island: string, islandData: { id: number; name: string }[]) => {
  if (island) {
    const result = islandData?.filter((item: { id: number; name: string }) =>
      item.name?.toLowerCase()?.includes(island?.toLowerCase())
    )[0]
    return result?.id ? `${result.id}` : undefined
  }
  return undefined
}

export const _totalWeight = (selectedConnaissement: ResultConnaissementType) => {
  const weight = selectedConnaissement?.detailConnaissements
    ?.reduce((acc: number, product: DetailType) => acc + product.poids, 0)
    ?.toFixed(3)
  return weight
}

//total des volume pour les connaissements
export const _volumeTotal = (selectedConnaissement: ResultConnaissementType) => {
  const volume = selectedConnaissement?.detailConnaissements
    ?.reduce((acc: number, product: DetailType) => acc + (product.volume ?? 0), 0)
    ?.toFixed(3)
  return volume
}
//total des colis pour les connaissements
export const _colisTotal = (selectedConnaissement: ResultConnaissementType) => {
  const colis = selectedConnaissement?.detailConnaissements?.reduce(
    (acc: number, product: DetailType) => acc + product.nbColis,
    0
  )
  return colis
}

export const _totalMontant = (selectedConnaissement: ResultConnaissementType) => {
  const montant = selectedConnaissement?.detailConnaissements?.reduce(
    (acc: number, product: DetailType) => acc + (product.montantDeclare ?? 0),
    0
  )

  return montant
}

//couleur du text affichage mobile des items des connaissements des transporteur
export const _colorMyText = (shipName: string): string | undefined => {
  switch (shipName) {
    //bateaux tests
    case 'DPAM HOE':
      return 'info'
    // return 'remora-secondary'
    case 'DPAM TORU':
      return 'warning'

    //bataeux officiels
    case 'APETAHI EXPRESS':
      return 'remora-primary'
    case 'ARANUI 5':
      return 'primary'
    case 'AREMITI 6':
      return 'remora-secondary'
    case 'AREMITI FERRY II':
      return 'violet'
    case 'COBIA 3':
      return 'orange'
    case 'DORY':
      return 'green'
    case "HAVA'I":
      return 'yellow'
    case 'HAWAIKI NUI':
      return 'yellow'
    case 'HONU O TE HAU':
      return 'danger'
    case 'KAOHA TINI':
      return 'remora-secondary'
    case 'MAREVA NUI':
      return 'orange'
    case 'MAUPITI EXPRESS 2':
      return 'green'
    case 'NUKU HAU':
      return 'primary'
    case 'SAINT XAVIER MARIS STELLA III':
      return 'yellow'
    case 'ST X MARIS STELLA IV':
      return 'danger'
    case 'TAHITI NUI':
      return 'violet'
    case 'TAHITI NUI 8':
      return 'orange'
    case 'TAPORO IX':
      return 'green'
    case 'TAPORO VI':
      return 'yellow'
    case 'TAPORO VIII':
      return 'danger'
    case 'TE ATA O HIVA':
      return 'remora-primary'
    case 'TEREVAU':
      return 'remora-secondary'
    case 'TUHAA PAE IV':
      return 'violet'
    case "VAEARA'I":
      return 'orange'
    case 'VAITERE 2':
      return 'green'

    //Company
    case 'LOGIS':
      return 'green'
    case 'WAN IMPORT':
      return 'violet'
    case 'WAN DISTRIBUTION':
      return 'remora-primary'
    case 'CEDIS':
      return 'primary'
    case 'BEVCO':
      return 'remora-secondary'
    case 'FOODEZ':
      return 'violet'
    case 'COPA':
      return 'orange'
    case 'VERDEEN SCA':
      return 'green'
    case 'SODIMARK':
      return 'yellow'
    case 'SALAISONS DE TAHITI':
      return 'yellow'
    case 'CHP MOOREA - TOA MOOREA':
      return 'danger'
    case 'CHP RAIATEA-SC DE RAIATEA':
      return 'remora-secondary'

    default:
      // Retourne une couleur aléatoire si le nom n'est pas spécifié dans la liste
      return 'secondary'
  }
}

export const _getVersion = async () => {
  try {
    await VersionService.getVersion()
  } catch (error) {
    console.log(error)
  }
}
