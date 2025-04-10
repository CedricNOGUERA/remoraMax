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
  _transformDataToNested
} from '../../utils/functions'
import { OrderType } from '../../definitions/OrderType'
import OrdersService from '../../services/orders/OrdersService'
import PaginationComponent from '../../component/ui/PaginationComponent'
import OrderTableTitle from '../../component/orders/OrderTableTitle'
import PlanningButton from '../../component/orders/PlanningButton'
import ItemsLimiter from '../../component/billOfLading/ItemsLimiter'
import {
  DetailOrderEditModalType,
  DetailOrderModalType,
  filteringDataType,
  PlanningButtonType,
  SearchPlanningModalType,
  SearchPlanningType,
} from '../../definitions/ComponentType'
import OrderBodyTable from '../../component/orders/OrderBodyTable'

interface ContextOrderEditType {
  naviresData: {
    id: number
    name: string
  }[]
}

export default function OrderForEdit({orderForEditProps}: {orderForEditProps: DetailOrderEditModalType}) {
  const { naviresData } = useOutletContext<ContextOrderEditType>()
  const {
    showUpdate,
    orderInConnaiss,
    filteringData,
    // setFilteringData,
    dataOrder,
    setDataOrder,
    ordersForConnaissement,
    setOrdersForConnaissement,
    show,
    handleClose,
    handleShow,
    selectedOrder,
    setSelectedOrder,
    versionBill,
    handleCloseUpdate,
    setIsEdit,
    showInfoPopOrders,
      setShowInfoPopOrders
  } = orderForEditProps

  ///////////
  //store Data
  /////////////
  const dataStore = userStore((state: UserState) => state)
  const navigate = useNavigate()

  const isTransporter = dataStore?.roles && dataStore.roles[0]?.name === 'transporteur'
  const trigger = "edit"

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

  const evnt = undefined

  const [currentPageEdit, setCurrentPageEdit] = React.useState(1)
  const [totalPagesEdit, setTotalPagesEdit] = React.useState(1)
  const [itemPerPageEdit, setItemPerPageEdit] = React.useState<number>(20)


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

  React.useEffect(() => {
    if (!dataStore?.token || dataStore?.token === undefined) {
      navigate('/connexion')
    }

    if (isTransporter) {
      navigate('/connaissements-demande')
    }
  }, [])

  React.useEffect(() => {
    if (filteringData?.destinataire_denomination !== '') {
   
      filteredOrders(evnt, dataStore?.token, filteringData, currentPageEdit, itemPerPageEdit)
    }
  }, [filteringData])
  


  React.useEffect(() => {
    if (isFiltering) {
      filteredOrders(evnt, dataStore?.token, filteringData, currentPageEdit, itemPerPageEdit)
    }
  }, [currentPageEdit, itemPerPageEdit])


  //Gère les factures selectionnées
  const handleSelectOrders = (order: OrderType) => {
    setOrdersForConnaissement((prevOrders: OrderType[]) => {
      if (prevOrders.includes(order)) {
        return prevOrders.filter((item) => item !== order)
      } else {
        return [...prevOrders, order]
      }
    })
  }

  //Gère la selection de toutes les factures
  // const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     const validOrders = dataOrder?.filter((order: OrderType) => {
  //       const isDifferentDestinataire =
  //         (ordersForConnaissement?.length > 0 &&
  //           ordersForConnaissement[0]?.destinataire?.denomination !==
  //             order?.destinataire?.denomination) ||
  //         (order?.statusRevatua !== 'A_PLANIFIER' && order?.statusRevatua !== 'BROUILLON')

  //       return !isDifferentDestinataire
  //     })

  //     if (validOrders?.length !== dataOrder?.length) {
  //       setInfoOrder(
  //         "Vous devez sélectionner des factures avec le même client et un statut 'A_PLANIFIER' ou 'BROUILLON'"
  //       )
  //       toggleShowInfo()
  //       setOrdersForConnaissement([])
  //     } else {
  //       setOrdersForConnaissement(validOrders)
  //     }
  //   } else {
  //     // Désélectionne toutes les commandes
  //     setOrdersForConnaissement([])
  //   }
  // }

  // const handlefilteredOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.currentTarget
  //   const updatedFilteringData = {
  //     ...filteringData,
  //     [name]: value,
  //   }
  //   setFilteringData(updatedFilteringData)
  // }


  //unused function
  const filteredOrders = async (
    event: React.FormEvent | undefined,
    token: string | null,
    filteringData: filteringDataType,
    currentPageEdit: number,
    itemPerPageEdit: number
  ) => {
    if (event !== undefined) {
      event?.preventDefault()
    }

    // Filtrer les paramètres qui ne sont pas définis ou sont vides
    const filteredParams = Object.entries(filteringData)
      .filter(([ value]) => value !== undefined && value !== null && value !== '') // Garde les paires où la valeur est définie (non null, non undefined, non vide)
      .map(([key, value]: [string, string | null | undefined]) => `${key}=${encodeURIComponent(value as string)}`) // Encode chaque paramètre
      .join('&') // Les concatène avec '&'
    setIsLoading(true)
    setDataOrder([])
    try {
      const response = await OrdersService.filteredOrder(
        token,
        filteredParams,
        currentPageEdit,
        itemPerPageEdit
      )
      setTotalPagesEdit(response.data.last_page) // Nombre total de pages
      setDataOrder(_transformDataToNested(response.data.data))
      setIsFiltering(true)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsFiltering(true)
      setIsLoading(false)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPageEdit(pageNumber)
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
    versionBill,
    handleCloseUpdate,
    setIsEdit,
    orderInConnaiss,
  }
  const planningButtonProps: PlanningButtonType = {
    ordersForConnaissement,
    handleShowSearchPlanning,
  }

  const toastCurrentTripProps = { showA, toggleShowA }
  const toastSendedBrouillonProps = { showBrouillon, toggleShowBrouillon }
  const toastInfoProps = { showInfo, toggleShowInfo, infoOrder }
  // const toastErrorOrderProps = {showErrorOrder, toggleShowErrorOrder, errorOrderMessage};

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
    currentPageEdit,
    setTotalPagesEdit,
    setInfoOrder,
    toggleShowInfo,
    setOrdersForConnaissement,
    itemPerPageEdit,
  }
  // const orderFilterProps = {
  //   handleSelectAll,
  //   dataOrder,
  //   ordersForConnaissement,
  //   handlefilteredOrder,
  //   filteringData,
  //   setFilteringData,
  //   isFiltering,
  //   setIsFiltering,
  //   currentPageEdit,
  //   setDataOrder,
  //   setTotalPagesEdit,
  //   isLoading,
  //   setIsLoading,
  //   setErrorOrderMessage,
  //   naviresData,
  //   itemPerPageEdit,
  //   trigger
  // }

  const orderBodyTableProps = {
    dataOrder,
    setDataOrder,
    ordersForConnaissement,
    setSelectedOrder,
    handleShow,
    trigger,
    errorOrderMessage,
    setErrorOrderMessage,
    isLoading,
    setInfoOrder,
    toggleShowErrorOrder,
    toggleShowInfo,
    handleSelectOrders,
    showUpdate,
    showInfoPopOrders, setShowInfoPopOrders
  }
  const OrderTableTitleProps = { trigger }
  
  return (
    <div className=' px-1 px-sm-2 px-lg-3  pb-5 mb-5'>
      <Form
        onSubmit={(event) =>
          filteredOrders(
            event,
            dataStore.token,
            filteringData,
            currentPageEdit,
            itemPerPageEdit
          )
        }
      >
        <Table  hover responsive className=' border'>
          <OrderTableTitle OrderTableTitleProps={OrderTableTitleProps} />
          {/* <OrderFilter orderFilterProps={orderFilterProps} /> */}
          <OrderBodyTable orderBodyTableProps={orderBodyTableProps} />
        </Table>
      </Form>
      <div className='d-flex align-items-center mb-5'>
        <PaginationComponent
          currentPage={currentPageEdit}
          totalPages={totalPagesEdit}
          handlePageChange={handlePageChange}
        />
        <ItemsLimiter itemPerPage={itemPerPageEdit} setItemPerPage={setItemPerPageEdit} />
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
