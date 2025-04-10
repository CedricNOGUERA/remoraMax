import React, {  ReactNode, SetStateAction } from "react";
import { ResultConnaissementType } from "./ConnaissementType";
import { errorType } from "./errorType";
import { OrderType } from "./OrderType";
import { UserType } from "./UserType";
import { CompanyType } from "./CompanyType";
import { CodeTarifType, statusType } from "./statusType";
import { CompanyStoreType } from "../stores/userStore";
import { stockageType } from "./stockageType";



interface HeaderDataType{
  title: string
    borderColor: string
}

export type ContextType = {
  userData?: UserType[]
  setUserData?: React.Dispatch<SetStateAction<UserType[] | undefined>>
  companiesData?: CompanyType[] | undefined
  setCompaniesData?: React.Dispatch<SetStateAction<CompanyType[] | undefined>>  | undefined
  toggleShowUpdateSuccess?: () => void
  naviresData?: {
    id: number
    name: string
  }[] | undefined
  headerData?: HeaderDataType
  setHeaderData?: React.Dispatch<SetStateAction<HeaderDataType>>
  filteringData?: filteringDataConnaissementtype
  setFilteringData?: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  connaissementData?: ResultConnaissementType
  setConnaissementData?: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  isNotification ?:boolean
  setIsNotification?: React.Dispatch<React.SetStateAction<boolean>>
  sortConfig?: string
  setSortConfig?: React.Dispatch<React.SetStateAction<string>>
  tokenTab?: string[]
  setTokenTab?: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  companyTab?: CompanyStoreType[] 
  setCompanyTab?: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
}

export type filteringDataConnaissementtype = {
  numeroConnaissement: string
  expediteur_denomination: string
  destinataire: string
  idNavire: number | string
  dernierEvenementConnaissement: string
  dateDepart: string
  nomIleArrivee: string
  dateArrivee: string
}


export type filteringDataType = {
  dateFacture?: string //order
  date_facture?: string //connaissement

  referenceHorsRevatua: string
  destinataire_denomination: string
  numeroVoyage: string
  statut_revatua: string
  bateau: string
  ileArrivee: string
  stockage: string
}

export type FilteringDataOrderProductType = {
  detail_referenceExterne: ''
  detail_contenant: ''
  detail_description: ''
  detail_nbColis: ''
  detail_poids: ''
  detail_stockage: ''
  detail_codeTarif: ''
  detail_codeSH: ''
}
/////////////////////
// Order
/////////////////////


export type OrderFilterType = {
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  dataOrder: OrderType[]
  ordersForConnaissement: OrderType[]
  handlefilteredOrder: (e: React.ChangeEvent<HTMLInputElement>) => void
  filteringData: filteringDataType
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataType>>
  filteredOrder?: (
    token: string | null,
    filteringData: filteringDataType,
    currentPage: number,
    itemPerPage: number
  ) => void
  isFiltering: boolean
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setErrorOrderMessage: React.Dispatch<React.SetStateAction<errorType>>
  naviresData: { id: number; name: string }[]
  itemPerPage: number
}

export type OrderBodyTableType = {
  dataOrder: OrderType[]
  setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>
  ordersForConnaissement: OrderType[]
  setSelectedOrder: React.Dispatch<React.SetStateAction<OrderType>>
  handleShow: () => void
  trigger?: string
  errorOrderMessage: {
    error: boolean
    message: string
  }
  setErrorOrderMessage: React.Dispatch<React.SetStateAction<{
    error: boolean
    message: string
  }>>
  isLoading: boolean
  setInfoOrder: React.Dispatch<React.SetStateAction<string>>
  toggleShowErrorOrder: () => void
  toggleShowInfo: () => void
  handleSelectOrders: (order: OrderType) => void
  showInfoPopOrders?: boolean
   setShowInfoPopOrders?: React.Dispatch<React.SetStateAction<boolean>>
}



export type ReduceProduct = {
  nbColis: number
  description: string
  codeSH: string
  contenant: string
  codeTarif: CodeTarifType
  stockage: stockageType
  poids: number
  unitePoids: string
  volume: number
  uniteVolume: string
  montantDeclare: number
  referenceExterne: string
  version: string | undefined
}






  export type PaginationType = {
    currentPage: number 
    totalPages: number 
    handlePageChange: (nbPage: number) => void
  }

  export type PlanningButtonType = {
    ordersForConnaissement: OrderType[]
    handleShowSearchPlanning: () => void
  }



export type SearchPlanningType = {
  ordersForConnaissement: OrderType[]
  setOrdersForConnaissement: React.Dispatch<React.SetStateAction<OrderType[]>>
  handleCloseSearchPlanning: () => void
  toggleShowA: () => void
  toggleShowBrouillon: () => void
  dataOrder: OrderType[]
  setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>
  naviresData: { id: number; name: string }[] | undefined
  versionBill?: string
  handleCloseUpdate?: () => void
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>
  orderInConnaiss?: OrderType[]
}

  //////////////////////////
  // Modal type
  //////////////////////////

export type SearchPlanningModalType = {
    showSearchPlanning: boolean
    handleCloseSearchPlanning: () => void
    searchPlanningProps: SearchPlanningType
  }
  

  export type DetailOrderModalType = {
    show: boolean
    selectedOrder: OrderType
    handleClose: () => void
    setSelectedOrder: React.Dispatch<React.SetStateAction<OrderType>>
    dataOrder: OrderType[]
    setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>
    setErrorOrderMessage: React.Dispatch<React.SetStateAction<errorType>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    currentPageEdit?: number
    setTotalPagesEdit?: React.Dispatch<React.SetStateAction<number>>
    currentPage?: number
    setTotalPages?: React.Dispatch<React.SetStateAction<number>>
    setInfoOrder: React.Dispatch<React.SetStateAction<string>>
    toggleShowInfo: () => void
    setOrdersForConnaissement: React.Dispatch<React.SetStateAction<OrderType[]>>
    itemPerPage?: number
    itemPerPageEdit?: number
  }
  export type DetailOrderEditModalType = {
    showUpdate: boolean
    orderInConnaiss: OrderType[] | undefined
    filteringData: filteringDataType
    // setFilteringData: React.Dispatch<React.SetStateAction<filteringDataType>>
    dataOrder: OrderType[]
    setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>
    ordersForConnaissement: OrderType[]
    setOrdersForConnaissement: React.Dispatch<React.SetStateAction<OrderType[]>>
    show :boolean
    handleClose: () => void
    handleShow: () => void
    selectedOrder: OrderType
    setSelectedOrder: React.Dispatch<React.SetStateAction<OrderType>>
    versionBill: string
    handleCloseUpdate: () => void
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
    // selectedConnaissement: ConnaissementBrouillonType
    showInfoPopOrders:  boolean
      setShowInfoPopOrders: React.Dispatch<React.SetStateAction<boolean>>
  }

  //////////////////////////
  // Toast type
  //////////////////////////

  export type ToastUpdateUserSuccessType = {
    showUpdateSuccess: boolean
    toggleShowUpdateSuccess: () => void
  }

  export type ToastCurrentTripType = {
    showA: boolean
    toggleShowA: () => void
  }
  export type ToastSendedBrouillonType = {
    showBrouillon: boolean
    toggleShowBrouillon: () => void
  }

  export type ToastInfoType = {
    showInfo: boolean
    toggleShowInfo: () => void
    infoOrder: string
  }

  export type ToastAllType = {
    showAll: boolean
    toggleShowAll: () => void
    toastData: ToastType
  }
  
  export type ToastType = {
      bg: string
      message: string
      icon: string
  }

  

  //////////////////////////
  // Transporter type
  //////////////////////////
  //type for bill of lading filter fonction
  // export type FilterParams = [
  //   statusType, // Type pour `status` (par exemple, string ou undefined)
  //   FilteringDataTransportType, // Type pour `filteringData`
  //   React.Dispatch<React.SetStateAction<boolean>>, // Type pour `setIsLoading`
  //   string[], // Type pour `tokenTab`
  //   number, // Type pour `currentPage`
  //   React.Dispatch<React.SetStateAction<errorType>>, // Type pour `setIsError`
  //   React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>, // Type pour `setConnaissementData`
  //   number, // Type pour `itemPerPage`
  //   React.Dispatch<React.SetStateAction<number>>, // Type pour `setTotalPages`
  //   React.Dispatch<React.SetStateAction<boolean>>, // Type pour `setIsFiltering`
  //   string, // Type pour `sortConfig`
  //   boolean, // Type pour `isEmpty`
  //   UserState // Type pour `dataStore`
  // ];

  //type for transporter bill of lading filter fonction
  export type FilterParamsTransp11 = [
     string | null, // Type pour `dataStore`
     statusType, // Type pour `status`
    number, // Type pour `currentPage`
    number, // Type pour `itemPerPage`
    FilteringDataTransportType, // Type pour `filteringDataTransport`
    React.Dispatch<React.SetStateAction<number>>, // Type pour `setTotalPages`
    React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>, // Type pour `setConnaissementData`
    React.Dispatch<React.SetStateAction<boolean>>, //
    number | undefined,
    string,
    React.Dispatch<React.SetStateAction<boolean>>,
   
  ];

  
  export type FilteringDataTransportType = {
    numero: string
    // expediteur_id: number | undefined
    destinataire_denomination: string
    nomNavire: string
    dateDepart: string
  }

  export type TransporterTableType = {
    setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>;
    connaissement: ResultConnaissementType;
    handleShowDetailConnaiss: () => void;
    handleShowQrcode: () => void;
  }



  ////////////////////////////
  //Planning Type
  ////////////////////////////

export type SelectedTrajetType = {
  id?: number
  numeroVoyage: string
      nomNavire: string
      abreviationNavire: string
      archipelDestinationDepart: string
      destinationDepart: string
      dateDepart: string
      heureDepart:{
        hour: number
        minute: number
        second: number
        nano: number
      }
      dateDepartVoyage: string
      archipelDestinationArrivee: string
      destinationArrivee: string,
      dateArrivee: string
      heureArrivee:{
      hour: number
      minute: number
      second: number
      nano: number
      }
      dateRetourVoyage: string
      croisiere: boolean
      codeZoneTarifaireArrivee: string
}

  export type SearchIslandDataType = {
    idNavire: string
    nameNavire: string
    page: string
    limit: string
    dateDebut: string
    dateFin: string
    ileArrivee: string | number | undefined
    nameIleArrivee: string
  }

  export type TrajetDataType = {
    id: number
    numeroVoyage: string
    nomNavire: string
    abreviationNavire: string
    archipelDestinationDepart: string
    archipelDestinationArrivee: string
    ileDestination: string
    lieuDestination: string
    destinationDepart: string
    dateDepart: string
    heureDepart: {
      hour: number
      minute: number
      second: number
      nano: number
    }
    destinationArrivee: string
    dateArrivee: string
    heureArrivee: {
      hour: number
      minute: number
      second: number
      nano: number
    }
    dateDepartVoyage: string
    dateRetourVoyage: string
    croisiere: true
    codeZoneTarifaireArrivee: string
  }

  export type SearchNavireDataType = {
    idNavire: string | undefined | null
    nameNavire: string | undefined | ReactNode
    page: string
    limit: string
    dateDebut: string
    dateFin: string
    ileArrivee:string
  }



