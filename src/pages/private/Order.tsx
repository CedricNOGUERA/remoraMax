import React from 'react'
import {
 
  Form,
  Table,
} from 'react-bootstrap'
import {
  ToastCurrentTrip,
  ToastInfo,
  ToastSendedBrouillon,
} from '../../component/ui/Toast/Toastes'
import { DetailOrderModal, SearchPlanningModal } from '../../component/ui/Modal/Modals'
import userStore, { UserState } from '../../stores/userStore'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  _transformDataToNested,
} from '../../utils/functions'
import { OrderType } from '../../definitions/OrderType'
import OrdersService from '../../services/orders/OrdersService'
import PaginationComponent from '../../component/ui/PaginationComponent'
import OrderTableTitle from '../../component/orders/OrderTableTitle'
import OrderFilter from '../../component/orders/OrderFilter'
import PlanningButton from '../../component/orders/PlanningButton'
import ItemsLimiter from '../../component/billOfLading/ItemsLimiter'
import {
  DetailOrderModalType,
  filteringDataType,
  PlanningButtonType,
  SearchPlanningModalType,
  SearchPlanningType,
} from '../../definitions/ComponentType'
import OrderBodyTable from '../../component/orders/OrderBodyTable'

interface ContextOrderType {
  naviresData: {
    id: number
    name: string
  }[]
}





export default function Order() {
  const { naviresData } = useOutletContext<ContextOrderType>()

  // const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  ///////////
  //store Data
  /////////////
  const dataStore = userStore((state: UserState) => state)
  const navigate = useNavigate()

  const isTransporter = dataStore?.roles && dataStore.roles[0]?.name === 'transporteur'

  //////////////
  //State
  /////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false)
  const [errorOrderMessage, setErrorOrderMessage] = React.useState<{
    error: boolean
    message: string
  }>({
    error: false,
    message: '',
  })
  const [infoOrder, setInfoOrder] = React.useState<string>('')

  const [dataOrder, setDataOrder] = React.useState<OrderType[]>([])
  const [selectedOrder, setSelectedOrder] = React.useState<OrderType>({} as OrderType)
  const [sortConfig, setSortConfig] = React.useState<{by: string, order: string}>({ by: 'date_facture', order: 'DESC' });
  const [filteringData, setFilteringData] = React.useState<filteringDataType>({
    bateau: '',
    date_facture: '',
    referenceHorsRevatua: '',
    destinataire_denomination: '',
    numeroVoyage: '',
    statut_revatua: '',
    ileArrivee: '',
    stockage: '',
  })
  
  const isEmpty =
  filteringData?.bateau === '' &&
    filteringData?.date_facture === '' &&
    filteringData?.referenceHorsRevatua === '' &&
    filteringData?.destinataire_denomination === '' &&
    filteringData?.numeroVoyage === '' &&
    filteringData?.statut_revatua === '' &&
    filteringData?.ileArrivee === '' &&
    filteringData?.stockage === ''

  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [itemPerPage, setItemPerPage] = React.useState<number>(20)


  const [ordersForConnaissement, setOrdersForConnaissement] = React.useState<OrderType[]>([])
  // Toastes
  const [showA, setShowA] = React.useState<boolean>(false)
  const toggleShowA = () => setShowA(!showA)

  const [showBrouillon, setShowBrouillon] = React.useState<boolean>(false)
  const toggleShowBrouillon = () => setShowBrouillon(!showBrouillon)

  const [showErrorOrder, setShowErrorOrder] = React.useState<boolean>(false)
  const toggleShowErrorOrder = () => setShowErrorOrder(!showErrorOrder)

  const [showInfo, setShowInfo] = React.useState<boolean>(false)
  const toggleShowInfo = () => setShowInfo(!showInfo)

  //Modals
  const [show, setShow] = React.useState(false)

  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => setShow(true)

  const [showSearchPlanning, setShowSearchPlanning] = React.useState(false)

  const handleCloseSearchPlanning = () => setShowSearchPlanning(false)
  const handleShowSearchPlanning = () => {
    if (ordersForConnaissement.length > 0) {
      setShowSearchPlanning(true)
    } else {
      toggleShowInfo()
      setInfoOrder('Veuillez sélectionner au moins une Facture')
    }
  }

  /////////////////////////
  //UseEffect
  ////////////////////////

  React.useEffect(() => {
    if (!dataStore?.token || dataStore?.token === undefined) {
      navigate('/connexion')
    }

    if (isTransporter) {
      navigate('/connaissements-transporteur')
    }


  }, [])

 
  React.useEffect(() => {
    if (dataStore.token && dataStore.token !== '') {
      filteredSortedOrders(
        dataStore?.token,
        filteringData,
        currentPage,
        itemPerPage,
        sortConfig.by,
        sortConfig.order
      )
    }
  }, [dataStore.token, currentPage, itemPerPage, sortConfig])

 

  //Gère les factures selectionnées
  
  const handleSelectOrders = (order: OrderType) => {
    setOrdersForConnaissement((prevOrders) => {
      const isSelected = prevOrders.some((selected) => selected.id === order.id);
      return isSelected
        ? prevOrders.filter((selected) => selected.id !== order.id)
        : [...prevOrders, order];
    });
  }

  //Gère la selection de toutes les factures
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
   // Vérifie si la case à cocher est sélectionnée
    if (event.target.checked) {

      // Filtre les commandes valides
      const validOrders = dataOrder?.filter((order: OrderType) => {

        const isDifferentDestinataire =
          (ordersForConnaissement?.length > 0 &&
            ordersForConnaissement[0]?.destinataire?.denomination !==
              order?.destinataire?.denomination) ||
          (order?.statusRevatua !== 'A_PLANIFIER')
         //retourne les commandes qui ont le même destinataire et le statut 'A_PLANIFIER'
        return !isDifferentDestinataire
      })
      const detailDestinataire = dataOrder.map((order: OrderType) => 
        order?.destinataire.denomination
      );
      //retire les doublons des destinataires
      const uniqueMagasins = [...new Set(detailDestinataire)];

      if (uniqueMagasins?.length > 1 || validOrders?.length !== dataOrder?.length) {
        setInfoOrder(
          "Vous devez sélectionner des factures avec le même client et un statut 'A_PLANIFIER'"
        )
        toggleShowInfo()
        setOrdersForConnaissement([])
      } else {
        setOrdersForConnaissement(validOrders)
      }
    } 
    else {
      // Désélectionne toutes les commandes
      setOrdersForConnaissement([])
    }
  }
 
 
  const filteredSortedOrders = async (
    token: string | null,
    filteringData: filteringDataType,
    currentPage: number,
    itemPerPage: number,
    by: string,
    order: string
  ) => {
   
    // Filtrer les paramètres qui ne sont pas définis ou sont vides
    const filteredParams = Object.entries(filteringData)
    .filter(([value]) => value) // Garde les paires où la valeur est définie (non null, non undefined, non vide)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Encode chaque paramètre
    .join('&')
    // const filteredParams = Object.entries(filteringData)
    //   .filter(([value]) => value !== undefined && value !== null && value !== '') // Garde les paires où la valeur est définie (non null, non undefined, non vide)
    //   .map(([key, value]: [string, string | null | undefined]) => `${key}=${encodeURIComponent(value as string)}`) // Encode chaque paramètre
    //   .join('&') // Les concatène avec '&'
    setIsLoading(true)
    setDataOrder([])

    // on vérifie si les factures sont déjà filtrées
    const pageValue = currentPage

    try {
    
      const response = await OrdersService.filteredSortedOrder(
        token,
        filteredParams,
        pageValue,
        itemPerPage,
        by,
        order
      )
      setTotalPages(response.data.last_page) // Nombre total de pages
      setDataOrder(_transformDataToNested(response.data.data))
      
    } catch (error) {
      console.log(error)
    } finally {
      if (!isEmpty) {
        setIsFiltering(true)
      }
      setIsLoading(false)
    }
  }
  // console.log(dataOrder)

  const handlePageChange = (pageNumber: number) => {
    if (dataStore.token && dataStore.token !== '') {
    
      filteredSortedOrders(
        dataStore?.token,
        filteringData,
        pageNumber,
        itemPerPage,
        sortConfig.by,
        sortConfig.order
      )
    
    }
    setCurrentPage(pageNumber)
  }



  const searchPlanningProps: SearchPlanningType = {
    ordersForConnaissement,
    setOrdersForConnaissement,
    handleCloseSearchPlanning,
    toggleShowA,
    toggleShowBrouillon,
    dataOrder,
    setDataOrder,
    naviresData,
  }
  const planningButtonProps: PlanningButtonType = {
    ordersForConnaissement,
    handleShowSearchPlanning,
  }

  const toastCurrentTripProps = { showA, toggleShowA }
  const toastSendedBrouillonProps = { showBrouillon, toggleShowBrouillon }
  const toastInfoProps = { showInfo, toggleShowInfo, infoOrder }

  const SearchPlanningModalProps: SearchPlanningModalType = {
    showSearchPlanning,
    handleCloseSearchPlanning,
    searchPlanningProps,
  }
  const detailOrderModalProps: DetailOrderModalType = {
    show,
    selectedOrder,
    handleClose,
    setSelectedOrder,
    dataOrder,
    setDataOrder,
    setErrorOrderMessage,
    setIsLoading,
    currentPage,
    setTotalPages,
    setInfoOrder,
    toggleShowInfo,
    setOrdersForConnaissement,
    itemPerPage,
  }
  const OrderTableTitleProps = { sortConfig, setSortConfig }
  const orderFilterProps = {
    handleSelectAll,
    dataOrder,
    ordersForConnaissement,
    filteringData,
    setFilteringData,
    isFiltering,
    setIsFiltering,
    currentPage,
    setDataOrder,
    setTotalPages,
    isLoading,
    setIsLoading,
    setErrorOrderMessage,
    naviresData,
    itemPerPage,
  }
  const orderBodyTableProps = {
    dataOrder,
    setDataOrder,
    ordersForConnaissement,
    setSelectedOrder,
    handleShow,
    errorOrderMessage,
    setErrorOrderMessage,
    isLoading,
    setInfoOrder,
    toggleShowErrorOrder,
    toggleShowInfo,
    handleSelectOrders,
  }
 

  return (
    <div className='p-3 pb-5 mb-5'>
      <h3 className='text-secondary'>Factures</h3>
      <Form
        onSubmit={(event) =>{
          event?.preventDefault()
          filteredSortedOrders( 
            dataStore?.token,
            filteringData,
            currentPage,
            itemPerPage,
            sortConfig.by,
            sortConfig.order)
        }}
      >
        <Table striped hover responsive className=' border'>
          <OrderTableTitle OrderTableTitleProps={OrderTableTitleProps} />
          <OrderFilter orderFilterProps={orderFilterProps} />
          <OrderBodyTable orderBodyTableProps={orderBodyTableProps} />
        </Table>
      </Form>

      <div className='d-flex align-items-center mb-5'>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <ItemsLimiter itemPerPage={itemPerPage} setItemPerPage={setItemPerPage} />
      </div>
      
      <PlanningButton planningButtonProps={planningButtonProps} />

      <SearchPlanningModal SearchPlanningModalProps={SearchPlanningModalProps} />
      <DetailOrderModal detailOrderModalProps={detailOrderModalProps} />

      <ToastSendedBrouillon toastSendedBrouillonProps={toastSendedBrouillonProps} />
      <ToastCurrentTrip toastCurrentTripProps={toastCurrentTripProps} />
      <ToastInfo toastInfoProps={toastInfoProps} />
    </div>
  )
}
