import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import userStore, { CompanyStoreType, UserState } from '../../../stores/userStore'
import { errorType } from '../../../definitions/errorType'
import {
  ToastDeleteSuccess,
  ToastError,
  ToastUpdateUserSuccess,
} from '../../../component/ui/Toast/Toastes'
import {
  QrcodeConnaissementModal,
  DetailConnaissementModal,
} from '../../../component/ui/Modal/ConnaissementModals'
import { _filterConnaissementTransp11 } from '../../../utils/api/apiControlerFunctions'
import { useReactToPrint } from 'react-to-print'
import noResult from '../../../styles/images/no_result.png'
import ItemsLimiter from '../../../component/billOfLading/ItemsLimiter'
import { useOutletContext } from 'react-router-dom'
import TableTransporter11 from '../../../component/transporter/TableTransporter11'
import useTransporterDataStore, {
  TransportState,
} from '../../../stores/transporter/useTransporterDataStore'
import {
  FilteringDataTransportType,
  FilterParamsTransp11,
} from '../../../definitions/ComponentType'
import { ResultConnaissementType } from '../../../definitions/ConnaissementType'
import PaginationComponent from '../../../component/ui/PaginationComponent'
import useSelectedIdCompanyStore, {
  selectedIdCompanyState,
  // selectedIdCompanyType,
} from '../../../stores/transporter/useSelectedIdCompanyStore'
import SearchBarTransporter from '../../../component/transporter/SearchBarTransporter'

interface ContextTransporterType {
  headerData: { title: string; borderColor: string }
  setHeaderData: React.Dispatch<React.SetStateAction<{ title: string; borderColor: string }>>
  sortConfig: string
  setSortConfig: React.Dispatch<React.SetStateAction<string>>
  companyTab: CompanyStoreType[]
}


export default function TransportersAllStatus2() {
  const { headerData, setHeaderData, sortConfig, setSortConfig, companyTab } =
    useOutletContext<ContextTransporterType>()
  const dataStore = userStore((state: UserState) => state)
  const transportStore = useTransporterDataStore((state: TransportState) => state)
  const selectedIdtStore = useSelectedIdCompanyStore((state: selectedIdCompanyState) => state)

  const setSelectedIdCompanyStore = useSelectedIdCompanyStore(
    (state: selectedIdCompanyState) => state.setSelectedIdCompanyStore
  )

  const title = transportStore.title
  const status = transportStore.status
  const borderColor = transportStore.borderColor
  const selectedId = selectedIdtStore.selectedIdCompany
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<errorType>({
    error: false,
    message: '',
  })
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false)

  const [connaissementData, setConnaissementData] = React.useState<ResultConnaissementType[]>(
    []
  )
  const [tokenTab, setTokenTab] = React.useState<string[] | undefined>([])
  const [selectedConnaissement, setSelectedConnaissement] =
    React.useState<ResultConnaissementType>({} as ResultConnaissementType)

  const [filteringDataTransport, setFilteringDataTransport] =
    React.useState<FilteringDataTransportType>({
      numero: '',
      // expediteur_id: undefined,
      destinataire_denomination: '',
      nomNavire: '',
      dateDepart: '',
    })

  const [selectedIdCompany, setSelectedIdCompany] = React.useState<number | undefined>(
    companyTab ? companyTab?.[0]?.id_company : undefined
  )

  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [totalPages, setTotalPages] = React.useState<number>(0)
  const [itemPerPage, setItemPerPage] = React.useState<number>(100)

  const isEmpty =
    filteringDataTransport?.numero === '' &&
    // filteringDataTransport?.expediteur_id === null &&
    filteringDataTransport?.destinataire_denomination === '' &&
    filteringDataTransport?.nomNavire === '' &&
    filteringDataTransport?.dateDepart === ''

  const filterParams: FilterParamsTransp11 = [
    dataStore.token,
    status,
    currentPage,
    itemPerPage,
    filteringDataTransport,
    setTotalPages,
    setConnaissementData,
    setIsLoading,
    selectedId,
    sortConfig,
    setIsFiltering,
  ]
  //////////////////
  //Toastes section
  /////////////////
  //Toast Delete success
  const [showDeleteSuccess, setShowDeleteSuccess] = React.useState<boolean>(false)
  const toggleShowDeleteSuccess = () => setShowDeleteSuccess(!showDeleteSuccess)

  const [showUpdateSuccess, setShowUpdateSuccess] = React.useState<boolean>(false)
  const toggleShowUpdateSuccess = () => setShowUpdateSuccess(!showUpdateSuccess)

  const [showOrderError, setShowOrderError] = React.useState<boolean>(false)
  const toggleShowOrderError = () => setShowOrderError(!showOrderError)

  //////////////////
  //Modals section
  /////////////////
  //detail connaissement
  const [showDetailConnaiss, setShowDetailConnaiss] = React.useState(false)
  const handleCloseDetailConnaiss = () => {
    setShowDetailConnaiss(false)
  }
  const handleShowDetailConnaiss = () => setShowDetailConnaiss(true)

  // Show qrcode
  const [showQrcode, setShowQrcode] = React.useState(false)
  const handleCloseQrcode = () => {
    setShowQrcode(false)
  }
  const handleShowQrcode = () => setShowQrcode(true)

  const printRef = React.useRef(null)

  // Utiliser useReactToPrint pour gérer l'impression
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${selectedConnaissement?.numero}`, // Titre du document imprimé
  })

  React.useEffect(() => {
    const transportTokens = dataStore?.company?.map((comp: CompanyStoreType) => {
      return comp.access_token
    })
    setTokenTab(transportTokens)
    if (setHeaderData) {
      setHeaderData({
        ...headerData,
        title: title,
        borderColor: borderColor,
      })
    }
    setSelectedIdCompanyStore({ selectedIdCompany: selectedId !== undefined ? selectedId: companyTab?.[0]?.id_company })
  }, [])

  React.useEffect(() => {
    if (isEmpty && isFiltering) {
      _filterConnaissementTransp11(...filterParams)
      setIsFiltering(false)
    }
  }, [isEmpty, isFiltering])

  React.useEffect(() => {
    _filterConnaissementTransp11(...filterParams)
  }, [currentPage, itemPerPage, tokenTab, sortConfig, status, selectedIdCompany])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [status])

  // const handleFilterConnaissement = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event?.currentTarget?.value
  //   if (value?.length > 2) {
  //     const filteredData = connaissementData.filter((item: ResultConnaissementType) => {
  //       return (
  //         item?.destinataire?.denomination?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.numero?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.expediteur?.denomination?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.dernierEtat?.evenementConnaissement
  //           .toLowerCase()
  //           .includes(value.toLowerCase()) ||
  //         item?.ileArrivee?.nom?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.referenceHorsRevatua?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.voyage?.dateDepart?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.voyage?.nomNavire?.toLowerCase().includes(value.toLowerCase()) ||
  //         item?.voyage?.periple[0]?.dateArrivee?.toLowerCase().includes(value.toLowerCase())
  //       )
  //     })

  //     setConnaissementData(filteredData)
  //   }
  //   if (value.length === 0) {
  //     _filterConnaissementTransp11(...filterParams)
  //   }
  // }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  //Table component props
  const tableTransporterProps = {
    isLoading,
    connaissementData,
    setSelectedConnaissement,
    handleShowDetailConnaiss,
    handleShowQrcode,
    isError,
    isFiltering,
    isEmpty,
    noResult,
    status,
    filteringDataTransport,
    setFilteringDataTransport,
    setIsLoading,
    selectedId,
    currentPage,
    setIsError,
    setConnaissementData,
    itemPerPage,
    setTotalPages,
    setIsFiltering,
    sortConfig,
    setSortConfig,
    borderColor,
  }

  //Modals props
  const detailOrderModalProps = {
    showDetailConnaiss,
    selectedConnaissement,
    handleCloseDetailConnaiss,
    handlePrint,
    printRef,
  }

  const searchBarTransporterProps = {
    connaissementData,
    setConnaissementData,
    setTotalPages,
    itemPerPage,
    dataStore,
    status,
    currentPage,
    filteringDataTransport,
    setIsLoading,
    selectedId,
    sortConfig,
    setIsFiltering,
  }

  const qrCodeModalProps = { showQrcode, selectedConnaissement, handleCloseQrcode }

  const toastUpdateUserSuccessProps = { showUpdateSuccess, toggleShowUpdateSuccess }
  const toastDeleteSuccessProps = { showDeleteSuccess, toggleShowDeleteSuccess }
  const toastErrorProps = { showOrderError, toggleShowOrderError, isError }

  // au départ companyName est undefined puis après il prend la valeur de la compagnie sélectionnée et grace à selectedId qui est storé le nom de la compagnie persiste m^me si l'on recharge la page
  const companyName = companyTab?.find(
    (comp: CompanyStoreType) => comp.id_company === selectedId
  )?.name


  return (
    <div className=' p-1 p-sm-3'>
      <div className='mb-2 px-'>
        <Form.Select
          name='selectedIdCompanyTransp'
          aria-label='Default select example'
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedIdCompany(parseInt(e.currentTarget?.value))
            setSelectedIdCompanyStore({ selectedIdCompany: parseInt(e.currentTarget?.value) })
          }}
        >
          <option
            className='text-center'
            value={selectedId ? selectedId : ''}
            disabled={selectedId ? false : true}
          >
            {companyName ? companyName : '-- Sélectionnez une entreprise --'}
          </option>
          {companyTab?.map((comp: CompanyStoreType, indx: number) => (
            <option key={indx} className='text-center' value={comp.id_company}>
              {comp.name}
            </option>
          ))}
        </Form.Select>
      </div>
      <SearchBarTransporter searchBarTransporterProps={searchBarTransporterProps} />  
      {/* <div>
        <Form.Group className='mb-3' controlId='searchBar'>
          <InputGroup className=''>
            <InputGroup.Text id='basic-addon1' className='bg-secondary border'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              name='searchTransporter'
              className='border'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              onChange={handleFilterConnaissement}
            />
          </InputGroup>
        </Form.Group>
      </div> */}
      <TableTransporter11 tableTransporterProps={tableTransporterProps} />
      <div className='d-flex align-items-center pb-5 mb-5'>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <ItemsLimiter itemPerPage={itemPerPage} setItemPerPage={setItemPerPage} />
      </div>

      <DetailConnaissementModal detailOrderModalProps={detailOrderModalProps} />
      <QrcodeConnaissementModal qrCodeModalProps={qrCodeModalProps} />
      <ToastUpdateUserSuccess toastUpdateUserSuccessProps={toastUpdateUserSuccessProps} />
      <ToastDeleteSuccess toastDeleteSuccessProps={toastDeleteSuccessProps} />
      <ToastError toastErrorProps={toastErrorProps} />
    </div>
  )
}
