import React from 'react'
import {
  Form,
  Table,
} from 'react-bootstrap'
import ConnaissementService from '../../services/connaissements/ConnaissementServices'
import OrdersService from '../../services/orders/OrdersService'
import userStore, { UserState } from '../../stores/userStore'
import { errorType } from '../../definitions/errorType'
import { ToastAll, ToastDeleteSuccess, ToastError, ToastUpdateUserSuccess } from '../../component/ui/Toast/Toastes'
import {
  DetailConnaissementModal,
  DeleteModal,
  EditConnaissementModal,
  MultiDeleteModal,
  NbPaletteModal,
  QrcodeConnaissementModal,
  UpdateMultiToDemandeModal,
  UpdateToDemandeModal,
  PrintMultiConnaissement,
} from '../../component/ui/Modal/ConnaissementModals'
import { _printMultiPDFConnaissementByEvenement, _refreshToken } from '../../utils/api/apiControlerFunctions'
import { useReactToPrint } from 'react-to-print'
import PaginationZero from '../../component/ui/PaginationZero'
import BillOfTableTitle from '../../component/billOfLading/BillOfTableTitle'
import BillOfFilter from '../../component/billOfLading/BillOfFilter'
import ItemsLimiter from '../../component/billOfLading/ItemsLimiter'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import SearchBar from '../../component/billOfLading/SearchBar'
import { DetailType, PeripleType, ResultConnaissementType } from '../../definitions/ConnaissementType'
import ItemBillOfLading from '../../component/billOfLading/ItemBillOfLading'
import MultiAction from '../../component/billOfLading/MultiAction'
import MultiPrintViewer from '../../component/billOfLading/MultiPrintViewer'
import { filteringDataConnaissementtype } from '../../definitions/ComponentType'
import AnomalieConnaissement from '../../component/ui/error/AnomalieConnaissement'
import { AxiosError } from 'axios'
import { OrderDataType } from '../../definitions/ResponseType'

interface ContextBillOfLadingType {
  filteringData: filteringDataConnaissementtype
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  connaissementData: ResultConnaissementType[]
  setConnaissementData: React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>
  isNotification: boolean
  setIsNotification: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BillOfLading() {
   const { filteringData, setFilteringData, connaissementData, setConnaissementData, isNotification, setIsNotification } = useOutletContext<ContextBillOfLadingType>()
  const dataStore = userStore((state: UserState) => state)
  const navigate = useNavigate()
  const params = useParams()

  const isTransporter : boolean | null = dataStore?.roles && dataStore?.roles[0]?.name === 'transporteur'

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isMultiLoading, setIsMultiLoading] = React.useState<boolean>(false)
  const [isMultiClickable, setIsMultiClickable] = React.useState<boolean>(true)
  const [isErrorConnaiss, setIsErrorConnaiss] = React.useState<errorType>({
    error: false,
    message: '',
  })
  const [isError, setIsError] = React.useState<errorType>({
    error: false,
    message: '',
  })
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false)
  const [isEdit, setIsEdit] = React.useState<boolean>(false)

  const [selectedConnaissement, setSelectedConnaissement] = React.useState<ResultConnaissementType>({}as ResultConnaissementType)
  const [checkedMultiConnaissement, setCheckedMultiConnaissement] = React.useState<ResultConnaissementType[]>([])
  const [checkedConnaissement, setCheckedConnaissement] = React.useState<number[]>([])
  const [idsOrder, setIdsOrder] = React.useState<number[]>([])
  

  const [nbPalette, setNbPalette] = React.useState<number>(0)

  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const [totalPages, setTotalPages] = React.useState<number>(0)
  const [itemPerPage, setItemPerPage] = React.useState<number>(20)

  const [sortConfig, setSortConfig] = React.useState<string>("id,desc");

  const isEmpty =
    filteringData?.numeroConnaissement === '' &&
    filteringData?.expediteur_denomination === '' &&
    filteringData?.destinataire === '' &&
    filteringData?.idNavire === '' &&
    filteringData?.dernierEvenementConnaissement === '' &&
    filteringData?.dateDepart === '' &&
    filteringData?.nomIleArrivee === '' &&
    filteringData?.dateArrivee === ''

    const [pdfData, setPdfData] = React.useState<string | undefined>();

     const [toastData, setToastData] = React.useState<{
        bg: string
        message: string
        icon: string
      }>({
        bg: '',
        message: '',
        icon: '',
      })


  //////////////////
  //Toastes
  /////////////////

  const [showAll, setShowAll] = React.useState<boolean>(false)
  const toggleShowAll = () => setShowAll(!showAll)


  //Toast Delete success
  const [showDeleteSuccess, setShowDeleteSuccess] = React.useState<boolean>(false)
  const toggleShowDeleteSuccess = () => setShowDeleteSuccess(!showDeleteSuccess)

  const [showUpdateSuccess, setShowUpdateSuccess] = React.useState<boolean>(false)
  const toggleShowUpdateSuccess = () => setShowUpdateSuccess(!showUpdateSuccess)

  const [showOrderError, setShowOrderError] = React.useState<boolean>(false)
  const toggleShowOrderError = () => setShowOrderError(!showOrderError)


 

  //////////////////
  //Modals
  /////////////////
  //detail connaissement
  const [showDetailConnaiss, setShowDetailConnaiss] = React.useState(false)
  const handleCloseDetailConnaiss = () => {
    setShowDetailConnaiss(false)
  }
  const handleShowDetailConnaiss = () => setShowDetailConnaiss(true)

  //edit connaiss
  const [showUpdate, setShowUpdate] = React.useState(false)
  const handleCloseUpdate = () => {
   
    setShowUpdate(false)
  }
  const handleShowUpdate = () => setShowUpdate(true)
  //update palette count
  const [showUpdatePalette, setShowUpdatePalette] = React.useState(false)
  const handleCloseUpdatePalette = () => {
    setShowUpdatePalette(false)
  }
  const handleShowUpdatePalette = () => setShowUpdatePalette(true)

  //Show qrcode
  const [showQrcode, setShowQrcode] = React.useState(false)
  const handleCloseQrcode = () => {
    setShowQrcode(false)
  }
  const handleShowQrcode = () => setShowQrcode(true)

  //Update connaissement to demande
  const [showUpdateToDemandeModal, setShowUpdateToDemandeModal] = React.useState(false)
  const handleCloseUpdateToDemandeModal = () => {
    setIdsOrder([])
    setShowUpdateToDemandeModal(false)
  }
  const handleShowUpdateToDemandeModal = () => {
    setShowUpdateToDemandeModal(true)
  }

  //Update multi connaissement to demande
  const [showUpdateMultiToDemandeModal, setShowUpdateMultiToDemandeModal] =
    React.useState(false)
  const handleCloseUpdateMultiToDemandeModal = () => {
    setShowUpdateMultiToDemandeModal(false)
  }
  const handleShowUpdateMultiToDemandeModal = () => {
    getOrderSByIDBill()
    setShowUpdateMultiToDemandeModal(true)
  }

  //Delete connaissement modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const handleCloseDeleteModal = () => {
    setIdsOrder([])
    setShowDeleteModal(false)
  }
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true)  
  }

  //multi Delete connaissement modal
  const [showMultiDeleteModal, setShowMultiDeleteModal] = React.useState(false)
  const handleCloseMultiDeleteModal = () => {
    setIdsOrder([])
    setShowMultiDeleteModal(false)
  }
  const handleShowMultiDeleteModal = () => {
    setShowMultiDeleteModal(true)
  }



  const [showMultiPrintModal, setShowMultiPrintModal] = React.useState<boolean>(false)
  const handleCloseMultiPrintModal = () => {
    setShowMultiPrintModal(false)
  }
  const handleShowMultiPrintModal = () => {
    setShowMultiPrintModal(true)  
  }

  //print block ref
  const printRef = React.useRef(null)
  const printref = React.useRef(null)

  // Utiliser useReactToPrint pour gérer l'impression
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${selectedConnaissement?.numero}`, // Titre du document imprimé
  })
  const handlePrintMulti = useReactToPrint({
    contentRef: printref,
    documentTitle: `${selectedConnaissement?.numero}`, // Titre du document imprimé
  })

  

/////////////////////
//useEffect section
/////////////////////
React.useEffect(() => {
  // Initial data table load
  if (isEmpty || !isFiltering || sortConfig !== 'id,desc' || isEdit || isNotification) {
    if (isEmpty && isFiltering === false && sortConfig === 'id,desc' && isEdit === false && isNotification === false) {
        connaissementDataTable(currentPage, setTotalPages, itemPerPage, sortConfig);
          setIsFiltering(false);
      }
      if (isEdit) {
        connaissementDataTable(currentPage, setTotalPages, itemPerPage, "id,desc")
          setIsEdit(false);

      }
      if (isFiltering === true || sortConfig !== 'id,desc' || isNotification) {
        filterConnaissement(
          // evnt,
          dataStore.access_token,
          filteringData,
          currentPage,
          itemPerPage,
          sortConfig
        )
        if(isNotification === true && setIsNotification){
            setIsNotification(false)
        }
      }
     
  }

  // Navigation for transporter
  if (isTransporter) {
    //transporter restriction
      navigate('/connaissements-demande');
  }


}, [isNotification, isEmpty, isFiltering, sortConfig, currentPage, itemPerPage, isEdit, params?.numConnaissement, filteringData, isTransporter]);

React.useEffect(() => {
  if(showMultiPrintModal) {
    _printMultiPDFConnaissementByEvenement(dataStore.access_token, checkedMultiConnaissement, setPdfData)
  }
}, [showMultiPrintModal])


  /////////////////////
  //events
  ////////////////////


  const getOrderSByIDBill = () => {
    setIsError({
      error: false,
      message: '',
    })
    setIsMultiLoading(true)
    setIsMultiClickable(true)
    
    try {
      checkedConnaissement?.map((id: number) => {
        return OrdersService.getOrdersByIdConnaissement(dataStore.token, id)
          .then((response) => {
            response?.data?.data?.map((order: OrderDataType) => {
              return idsOrder.push(order?.id)
            })
            setIsMultiClickable(false)
            setIsMultiLoading(false)

            // console.log(checkedOrder)
          })
          .catch((error: unknown) => {
            if (error instanceof AxiosError) {
              setIsError({
                error: true,
                message: error?.response?.data?.message,
              })
              setToastData({
                bg: "danger",
                message: error?.response?.data?.message,
                icon: "error-warning",
              })
              toggleShowAll()
              // toggleShowOrderError()
              setIsMultiClickable(true)
              setIsMultiLoading(false)
              return false
            }
          })
      })
          
    } catch (error) {
      console.log(error)
    }
  }

  const filterConnaissement = async (
    token: string ,
    filteringData: filteringDataConnaissementtype,
    currentPage: number,
    itemPerPage: number,
    sort: string
  ) => {
  
    //formate les données à filtrer
    const filteredParams = Object.entries(filteringData)
      .filter(([value]) => value) // Garde les paires où la valeur est définie (non null, non undefined, non vide)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Encode chaque paramètre
      .join('&') // Les concatène avec '&'
    // const filteredParams = Object.entries(filteringData)
    //   .filter(([value]) => value !== undefined && value !== null && value !== '') // Garde les paires où la valeur est définie (non null, non undefined, non vide)
    //   .map(([key, value]: [string, string | number | undefined]) => `${key}=${encodeURIComponent(value as string)}`) // Encode chaque paramètre
    //   .join('&') // Les concatène avec '&'

    setIsLoading(true)

    try {
      const responseFilteredConnaissement =
        await ConnaissementService.getFilteredConnaissementSort(
          token,
          currentPage,
          filteredParams,
          itemPerPage,
          sort
        )

      const filteredSortedData = responseFilteredConnaissement?.data?.content
        //filtre par date
      if (filteringData?.dateDepart || filteringData?.dateArrivee) {
        const inputDateDepart = filteringData.dateDepart?.trim() ?? ''
        const inputDateArrivee = filteringData.dateArrivee?.trim() ?? ''

        if (inputDateArrivee?.length > 2 || inputDateDepart.length > 2) {
          const filteredData = filteredSortedData.filter((item: ResultConnaissementType) => {
            // logique pour la date de départ
            const fullDateDepart = item?.voyage?.dateDepart || ''
            const itemDateDepartFormatted = fullDateDepart.split('-').reverse().join('/') // "12/11/2024"

            // Comparaison partielle pour la date de départ
            const matchDateDepart =
              !inputDateDepart ||
              itemDateDepartFormatted.includes(inputDateDepart) || // Recherche partielle
              itemDateDepartFormatted.startsWith(inputDateDepart) // Recherche début correspond

            // logique pour la date d'arrivée
            const fullDateArrivee = item?.voyage?.periple?.filter(
              (periple: PeripleType) => periple?.ileArrivee.nom === item?.ileArrivee?.nom
            )[0]
            const itemDateArriveeFormatted = fullDateArrivee.dateArrivee
              .split('-')
              .reverse()
              .join('/') // "12/11/2024"

            // Comparaison partielle pour la date d'arrivée
            const matchDateArrivee =
              !inputDateArrivee ||
              itemDateArriveeFormatted.includes(inputDateArrivee) || // Recherche partielle
              itemDateArriveeFormatted.startsWith(inputDateArrivee) // Recherche début correspond

            return matchDateArrivee && matchDateDepart
          })
          if(setConnaissementData){
            setConnaissementData(filteredData)
            setTotalPages(responseFilteredConnaissement?.data?.totalPages)
          }
        } else {
          if(setConnaissementData){
            setConnaissementData(filteredSortedData)
            setTotalPages(responseFilteredConnaissement?.data?.totalPages)
          }
        }
      } else {
        if(setConnaissementData){
          setConnaissementData(filteredSortedData)
          setTotalPages(responseFilteredConnaissement?.data?.totalPages)
        }
      }

      setIsLoading(false)
      setIsFiltering(true)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterConnaissement = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value
    if (value?.length > 2) {
      const filteredData = connaissementData?.filter((item: ResultConnaissementType) => {
        return (
          item?.destinataire?.denomination?.toLowerCase().includes(value.toLowerCase()) ||
          item?.numero?.toLowerCase().includes(value.toLowerCase()) ||
          item?.dernierEtat?.evenementConnaissement
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.ileArrivee?.nom?.toLowerCase().includes(value.toLowerCase()) ||
          item?.voyage?.dateDepart?.toLowerCase().includes(value.toLowerCase()) ||
          item?.voyage?.nomNavire?.toLowerCase().includes(value.toLowerCase()) ||
          item?.voyage?.periple[0]?.dateArrivee?.toLowerCase().includes(value.toLowerCase())
        )
      })

      setConnaissementData(filteredData)
    }
    if (value.length === 0) {
      // connaissementDataTable(0, setTotalPages, itemPerPage, "id,desc")
    }
  }
  
  const connaissementDataTable = async (currentPage: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>, itemPerPage: number, sort: string) => {
    setIsLoading(true)
   
    try {

      const response = await ConnaissementService.getConnaissementSort(
        dataStore.access_token,
        currentPage,
        itemPerPage,
        sort
      )

      if (response?.status === 200) {
        setIsErrorConnaiss({
          error: false,
          message: '',
        })
      }

      const sortedData = response?.data?.content?.sort((a: ResultConnaissementType, b: ResultConnaissementType) => b.id - a.id)
      setTotalPages(response?.data?.totalPages)
      setConnaissementData(sortedData)
      setIsLoading(false)
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        setIsError({
          error: true,
          message: error?.response?.data?.error
            ? error?.response?.data?.error
            : error?.message === 'Network Error'
            ? 'Une erreur du serveur Revatua est survenue. Veuillez réessayer plus tard.'
            : error?.message,
        })
        setIsLoading(false)

        if (error?.response?.data?.error === 'invalid_token') {
          setIsError({
            error: true,
            message: error?.response?.data?.error,
          })
          const idCompany = dataStore?.company && dataStore?.company[0]?.id_company
          _refreshToken(dataStore?.token, idCompany)
        }
      }
    }
  }

  const updateBrouillonConnaissement = async (token: string, id: number) => {
    const bodyData = {
      evenementConnaissementEnum: 'DEMANDE',
      demandeParArmateur: false,
    }

    try {
      const response = await ConnaissementService.updateConnaissement(token, bodyData, id)
      
      if (response.status === 200) {
        connaissementDataTable(currentPage, setTotalPages, itemPerPage, "id,desc")
        toggleShowUpdateSuccess()
        handleCloseUpdateToDemandeModal()
        setCheckedConnaissement([])
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        setIsError({
          error: true,
          message: error?.response?.data?.error ? error?.response?.data?.error :  error?.message === "Network Error" ? "Oups, une erreur du côté de Revatua est survenue. Veuillez réessayer plus tard." : error?.message
        })
      }
    }
  }
  
  const updateNbPaletteConnaissement = async (token: string, data: ResultConnaissementType) => {
    const connaissDetail = data.detailConnaissements?.map((prod: DetailType) => {
      return {
        codeSH: prod?.codeSH.nomenclature,
        codeTarif: prod?.codeTarif.code,
        description: prod?.description,
        nbColis: prod?.nbColis,
        poids: prod?.poids,
        stockage: prod?.stockage,
        unitePoids: prod?.unitePoids,
      }
    })


    const bodyData = {
      "version": data?.version,
      "detailConnaissementDTO": connaissDetail,
      "expediteur": data?.expediteur,
      "destinataire": data?.destinataire,
      "paiement": data?.paiement,
      "numeroVoyage": data?.voyage?.numero,
      "ileDepart": data?.ileDepart.nom,
      "lieuDepart": data?.lieuDepart.nom,
      "ileArrivee": data?.ileArrivee.nom,
      "lieuArrivee": data?.lieuArrivee.nom,
      "nombreColisAEmbarquer": nbPalette

    }

    try {

      const response = await ConnaissementService.updateNbPalette(token, bodyData, data?.id)
      if (response.status === 200) {
        toggleShowUpdateSuccess()
        handleCloseUpdatePalette()
        setCheckedConnaissement([])
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        const errorMessage =
          error?.message === 'Network Error'
            ? 'Une erreur est survenue. Veuillez vérifier votre connexion et réessayer plus tard.'
            : error?.response?.data?.error || error?.response?.data?.message

        const errorDetail = Array.isArray(error?.response?.data?.detail)
          ? error?.response?.data?.detail[0]
            ? ` : ${error?.response?.data?.detail[0]?.origine || ''} ${
                error?.response?.data?.detail[0]?.cause || ''
              }`
            : ''
          : typeof error?.response?.data?.detail === 'string'
          ? ` : ${error?.response?.data?.detail}`
          : ''
        setIsError({
          error: true,
          message: `${errorMessage || error?.message}${errorDetail}`,
        })
      }
     
   
    }
  }

  const deleteBrouillonConnaissement = async (token: string, id: number) => {
    setIsError({
      error: false,
      message: "",
    })
    try {
      const response = await ConnaissementService.deleteBrouillon(token, id)
      const deletedList = connaissementData?.filter((bill: ResultConnaissementType) => bill?.id !== id)
      if (response.status === 204) {
        // connaissementDataTable(0, setTotalPages, itemPerPage)
        setToastData({
          bg: "success",
          message: "Connaissement supprimé avec succès",
          icon: "checkbox-circle",
        })
        toggleShowAll()
        // toggleShowDeleteSuccess()
        handleCloseDeleteModal()
      setConnaissementData(deletedList)
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){

        setIsError({
          error: true,
          message: error?.response?.data?.message,
        })
        setToastData({
          bg: "danger",
          message:  error?.response ? error?.response?.data?.message : "Une erreur s'est produite",
          icon: "checkbox-circle",
        })
        toggleShowAll()
        toggleShowOrderError()
      }
    }
  }

  //Gère les connaissements selectionnées
  const handleSelectConnaissement = (bill: number) => {
    if (checkedConnaissement.includes(bill)) {
      // ()
      setCheckedConnaissement(checkedConnaissement?.filter((item: number) => item !== bill))
    } else {
      setCheckedConnaissement([...checkedConnaissement, bill])
    }
  }

  const multiselected = (bill: ResultConnaissementType) => {
    if (checkedMultiConnaissement.some((item: ResultConnaissementType) => item.id === bill.id)) {
      setCheckedMultiConnaissement(checkedMultiConnaissement?.filter((item: ResultConnaissementType) => item?.id !== bill?.id))
    } else {
      setCheckedMultiConnaissement([...checkedMultiConnaissement, bill])
    }
  }


  //sélectionner tous les connaissements
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const validedData = connaissementData
        ?.map((item: ResultConnaissementType) => item.id)
        setCheckedConnaissement(validedData)
        setCheckedMultiConnaissement(connaissementData)
    } else {
      setCheckedConnaissement([])
      setCheckedMultiConnaissement([])
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
   
  }

  const isNotJustOfficialse = checkedMultiConnaissement?.filter((bill: ResultConnaissementType) =>     bill.dernierEtat.evenementConnaissement !== 'OFFICIALISE' &&
  bill.dernierEtat.evenementConnaissement !== 'OFFICIALISE_SOUS_RESERVE' &&
  bill.dernierEtat.evenementConnaissement !== 'MODIFIE' &&
  bill.dernierEtat.evenementConnaissement !== 'PRIS_EN_CHARGE' &&
  bill.dernierEtat.evenementConnaissement !== 'EMBARQUE' &&
  bill.dernierEtat.evenementConnaissement !== 'EMBARQUEMENT_REFUSE' &&
  bill.dernierEtat.evenementConnaissement !== 'TRANSFERE' &&
  bill.dernierEtat.evenementConnaissement !== 'ANNULE')
  
  const isNotJustBrouillon = checkedMultiConnaissement?.filter((bill: ResultConnaissementType) => bill.dernierEtat.evenementConnaissement !== "BROUILLON")

  const isDeletable = checkedMultiConnaissement.some(
    (item: ResultConnaissementType) =>
      item.dernierEtat.evenementConnaissement !== 'BROUILLON' &&
      item.dernierEtat.evenementConnaissement !== 'DEMANDE_REFUSEE'
  )


  //Components props
  const BillOfTableTitleProps = {sortConfig, setSortConfig}
  const billOfilterProps = {
    handleSelectAll,
    filteringData,
    setFilteringData,
    isTransporter,
    isFiltering,
    setIsFiltering,
    isEmpty,
    isLoading,
    sortConfig,
    setSortConfig,
  }

//Modals props
  const detailOrderModalProps = {
    showDetailConnaiss,
    selectedConnaissement,
    handleCloseDetailConnaiss,
    handlePrint,
    printRef,
    isNotJustOfficialse,
  }
  const qrCodeModalProps = { showQrcode, selectedConnaissement, handleCloseQrcode }

  const updateToDemandeModalProps = {
    showUpdateToDemandeModal,
    handleCloseUpdateToDemandeModal,
    selectedConnaissement,
    updateBrouillonConnaissement,
    idsOrder,
    setIdsOrder,
    isError,
    setIsError,
    toggleShowOrderError,
  }
  const updatePaletteModalProps = {
    showUpdatePalette,
    handleCloseUpdatePalette,
    selectedConnaissement,
    setSelectedConnaissement,
    setConnaissementData,
    connaissementData,
    setNbPalette,
    updateNbPaletteConnaissement
  }
  const updateMultiToDemandeModalProps = {
    showUpdateMultiToDemandeModal,
    handleCloseUpdateMultiToDemandeModal,
    checkedConnaissement,
    setCheckedConnaissement,
    connaissementDataTable,
    toggleShowUpdateSuccess,
    isError,
    setIsError,
    toggleShowOrderError,
    idsOrder,
    setIdsOrder,
    currentPage,
    setTotalPages,
    itemPerPage,
    sortConfig,
    isMultiClickable,
    isMultiLoading
  }
  const deleteBillOfLadingProps = {
    showDeleteModal,
    handleCloseDeleteModal,
    selectedConnaissement,
    deleteBrouillonConnaissement,
    idsOrder, setIdsOrder,
    setIsError,
    toggleShowOrderError,
    setShowOrderError,
  }
  const multiDeleteBillOfLadingProps ={
    showMultiDeleteModal,
    handleCloseMultiDeleteModal,
    checkedMultiConnaissement,
    deleteBrouillonConnaissement,
    idsOrder,
    isError,
    setIsError,
    toggleShowOrderError,
    isMultiLoading,
    setIsMultiLoading
  }
  const printMultiConnaissementProps = { showMultiPrintModal, handleCloseMultiPrintModal, printRef, pdfData }
  const editConnaissementModal = {showUpdate, handleCloseUpdate, selectedConnaissement, setIsError, toggleShowOrderError, setIsEdit}
  
//Toast props
  const toastUpdateUserSuccessProps = { showUpdateSuccess, toggleShowUpdateSuccess }
  const toastDeleteSuccessProps = { showDeleteSuccess, toggleShowDeleteSuccess }
  const toastErrorProps = {showOrderError, toggleShowOrderError, isError}; 
  const toastAllProps = { showAll, toggleShowAll, toastData }

  const AnomalieConnaissementProps = {isLoading, isError, isFiltering, isErrorConnaiss, isTransporter, connaissementData}


  return (
    <div className='p-1 p-sm-3'>
      <h3 className='text-secondary'>Connaissements</h3>
      <SearchBar handleFilterConnaissement={handleFilterConnaissement} />
      <Form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          filterConnaissement(
            dataStore.access_token,
            filteringData,
            currentPage,
            itemPerPage,
            sortConfig
          )
        }}
      >
        <Table striped hover responsive className='responsive-font-small border'>
          <BillOfTableTitle BillOfTableTitleProps={BillOfTableTitleProps} />
          <BillOfFilter billOfilterProps={billOfilterProps} />
          <tbody>
            {!isLoading &&
              connaissementData?.length > 0 &&
              connaissementData?.map(
                (connaissement: ResultConnaissementType, indx: number) => {
                  const isNotBrouillon =
                    connaissement?.dernierEtat?.evenementConnaissement !== 'BROUILLON'

                  const isRefusee =
                    connaissement?.dernierEtat?.evenementConnaissement === 'ANNULE' ||
                    connaissement?.dernierEtat?.evenementConnaissement === 'DEMANDE_REFUSEE' ||
                    connaissement?.dernierEtat?.evenementConnaissement ===
                      'EMBARQUEMENT_REFUSE'

                  const isDemande =
                    connaissement?.dernierEtat?.evenementConnaissement === 'DEMANDE' ||
                    connaissement?.dernierEtat?.evenementConnaissement === 'OFFICIALISE' ||
                    connaissement?.dernierEtat?.evenementConnaissement ===
                      'OFFICIALISE_SOUS_RESERVE'

                  const isRedBackGround =
                    connaissement?.dernierEtat?.evenementConnaissement ===
                      'EMBARQUEMENT_REFUSE' ||
                    connaissement?.dernierEtat?.evenementConnaissement === 'DEMANDE_REFUSEE' ||
                    connaissement?.dernierEtat?.evenementConnaissement === 'ANNULE'

                  const isDangerous = connaissement.detailConnaissements.some(
                    (detail: DetailType) => detail.matiereDangereuse === true
                  )

                  const isFragile = connaissement.detailConnaissements.some(
                    (detail: DetailType) => detail.fragile === true
                  )

                  const dateDArrivee = connaissement?.voyage?.periple?.filter(
                    (periple: PeripleType) =>
                      periple?.ileArrivee.nom === connaissement?.ileArrivee?.nom
                  )[0]
                  const ItemBillOfLadingProps = {
                    isRedBackGround,
                    connaissement,
                    checkedConnaissement,
                    handleSelectConnaissement,
                    multiselected,
                    setSelectedConnaissement,
                    handleShowDetailConnaiss,
                    isTransporter,
                    dateDArrivee,
                    isDangerous,
                    isFragile,
                    isDemande,
                    isRefusee,
                    handleShowQrcode,
                    isNotBrouillon,
                    handleShowUpdateToDemandeModal,
                    handleShowUpdatePalette,
                    handleShowDeleteModal,
                    handleShowUpdate,
                  }

                  return (
                    <ItemBillOfLading
                      key={indx}
                      ItemBillOfLadingProps={ItemBillOfLadingProps}
                    />
                  )
                }
              )}
              <AnomalieConnaissement AnomalieConnaissementProps={AnomalieConnaissementProps} />

          </tbody>
        </Table>
      </Form>

      <div className='d-flex align-items-center mb-5'>
        <PaginationZero
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <ItemsLimiter itemPerPage={itemPerPage} setItemPerPage={setItemPerPage} />
      </div>

    {/************************************
              Modal section
    ***********************************/}
      {checkedConnaissement?.length > 1 && (
        <MultiAction
          checkedConnaissement={checkedConnaissement}
          checkedMultiConnaissement={checkedMultiConnaissement}
          isNotJustOfficialse={isNotJustOfficialse}
          dataStore={dataStore}
          setPdfData={setPdfData}
          handlePrintMulti={handlePrintMulti}
          handleShowUpdateMultiToDemandeModal={handleShowUpdateMultiToDemandeModal}
          isNotJustBrouillon={isNotJustBrouillon}
          isDeletable={isDeletable}
          handleShowMultiDeleteModal={handleShowMultiDeleteModal}
          handleShowMultiPrintModal={handleShowMultiPrintModal}
          setCheckedConnaissement={setCheckedConnaissement}
          setCheckedMultiConnaissement={setCheckedMultiConnaissement}
        />
      )}

      <DetailConnaissementModal detailOrderModalProps={detailOrderModalProps} />
      <QrcodeConnaissementModal qrCodeModalProps={qrCodeModalProps} />
      <UpdateToDemandeModal updateToDemandeModalProps={updateToDemandeModalProps} />
      <NbPaletteModal updatePaletteModalProps={updatePaletteModalProps} />
      <UpdateMultiToDemandeModal
        updateMultiToDemandeModalProps={updateMultiToDemandeModalProps}
      />
      <MultiPrintViewer
        checkedMultiConnaissement={checkedMultiConnaissement}
        printref={printref}
      />
      {/* Multi Print */}
      <PrintMultiConnaissement printMultiConnaissementProps={printMultiConnaissementProps} />
      <DeleteModal deleteBillOfLadingProps={deleteBillOfLadingProps} />
      <MultiDeleteModal multiDeleteBillOfLadingProps={multiDeleteBillOfLadingProps} />
      <EditConnaissementModal editConnaissementModal={editConnaissementModal} />

      {/************************************
                Toast section
      ***********************************/}
      <ToastUpdateUserSuccess toastUpdateUserSuccessProps={toastUpdateUserSuccessProps} />
      <ToastDeleteSuccess toastDeleteSuccessProps={toastDeleteSuccessProps} />
      <ToastError toastErrorProps={toastErrorProps} />
      <ToastAll toastAllProps={toastAllProps} />
      
    </div>
  )

}
