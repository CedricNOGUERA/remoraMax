import MobileView from './views/MobileView'
import ComputerView from './views/ComputerView11'
import { errorType } from '../../definitions/errorType'
import { ResultConnaissementType } from '../../definitions/ConnaissementType'
import { FilteringDataTransportType } from '../../definitions/ComponentType'
import { statusType } from '../../definitions/statusType'

interface TableTransporterType {
  isLoading: boolean
  connaissementData: ResultConnaissementType[]
  setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>
  handleShowDetailConnaiss: () => void
  handleShowQrcode: () => void
  isError: errorType
  isFiltering: boolean
  isEmpty: boolean
  noResult: string
  status: statusType
  filteringDataTransport: FilteringDataTransportType
  setFilteringDataTransport: React.Dispatch<React.SetStateAction<FilteringDataTransportType>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // selectedIdCompany: number | null
  selectedId: number | undefined
  currentPage: number
  setIsError: React.Dispatch<React.SetStateAction<errorType>>
  setConnaissementData: React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>
  itemPerPage: number
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
  sortConfig: string | undefined
  setSortConfig: React.Dispatch<React.SetStateAction<string>> | undefined
  borderColor: string
}

export default function TableTransporter11({ tableTransporterProps }: {tableTransporterProps: TableTransporterType}) {
  const {
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
    // selectedIdCompany,
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
  } = tableTransporterProps

  const billOfTableTitleProps = { sortConfig, setSortConfig }

  const billOfilterProps = {
    filteringDataTransport,
    setFilteringDataTransport,
    isFiltering,
    isEmpty,
    isLoading,
  }

  const mobileViewProps = {
    isLoading,
    isError,
    isFiltering,
    connaissementData,
    setSelectedConnaissement,
    handleShowDetailConnaiss,
    handleShowQrcode,
    borderColor,
    status,
    noResult,
  }

  const computerViewProps = { 
    status,
    filteringDataTransport,
    setIsLoading,
    // tokenTab,
    // selectedIdCompany,
    selectedId,
    currentPage,
    setIsError,
    setConnaissementData,
    itemPerPage,
    setTotalPages,
    setIsFiltering,
    sortConfig,
    isEmpty,
    billOfTableTitleProps,
    billOfilterProps,
    isLoading,
    connaissementData,
    setSelectedConnaissement,
    handleShowDetailConnaiss,
    handleShowQrcode,
    isError,
    isFiltering,
    noResult,
    setFilteringDataTransport
}

  return (
    <>
      <ComputerView computerViewProps={computerViewProps} />
      <MobileView mobileViewProps={mobileViewProps} />
    </>
  )
}
