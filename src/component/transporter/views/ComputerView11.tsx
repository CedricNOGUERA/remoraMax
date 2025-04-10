import React from 'react'
import { _filterConnaissementTransp11 } from '../../../utils/api/apiControlerFunctions'
import { Form, Table, Image } from 'react-bootstrap'
import TransporterFilterTab, { BillOFilterType } from '../TransporterFilterTab'
import TableTitleTransporter, { BillOfTableTitleType } from '../TableTitleTransporter'
import TransporterTable from '../../ui/TransporterTable'
import { ResultConnaissementType } from '../../../definitions/ConnaissementType'
import userStore, { UserState } from '../../../stores/userStore'
import TableLoader from '../../ui/Loader/TableLoader'
import { FilteringDataTransportType } from '../../../definitions/ComponentType'
import { errorType } from '../../../definitions/errorType'
import { statusType } from '../../../definitions/statusType'

export type ComputerViewType = {
  status: statusType
  filteringDataTransport: FilteringDataTransportType
  // selectedIdCompany: string | null
  selectedId: number | undefined
  currentPage: number
  connaissementData: ResultConnaissementType[]
  setConnaissementData: React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>
  itemPerPage: number
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
  sortConfig: string | undefined
  billOfTableTitleProps: BillOfTableTitleType
  billOfilterProps: BillOFilterType
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isError: errorType
  setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>
  handleShowDetailConnaiss: () => void
  handleShowQrcode: () => void
  isFiltering: boolean
  noResult: string
}

export default function ComputerView11({
  computerViewProps,
}: {
  computerViewProps: ComputerViewType
}) {
  const {
    status,
    filteringDataTransport,
    setIsLoading,
    // selectedIdCompany,
    selectedId,
    currentPage,
    setConnaissementData,
    itemPerPage,
    setTotalPages,
    setIsFiltering,
    sortConfig,
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
  } = computerViewProps

  const dataStore = userStore((state: UserState) => state)

  console.log(isFiltering)

  return (
    <Form
      className='d-none d-md-block'
      onSubmit={(event) => {
        event.preventDefault()
        _filterConnaissementTransp11(
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
          setIsFiltering
        )
      }}
    >
      <Table
        striped
        hover
        responsive
        className='transport-table responsive-font-small border w-100'
      >
        <TableTitleTransporter billOfTableTitleProps={billOfTableTitleProps} />
        <TransporterFilterTab billOfilterProps={billOfilterProps} />
        <tbody>
          {!isLoading &&
            connaissementData?.length > 0 &&
            connaissementData?.map((connaissement: ResultConnaissementType, indx: number) => {
              return (
                <React.Fragment key={indx}>
                  <TransporterTable
                    setSelectedConnaissement={setSelectedConnaissement}
                    connaissement={connaissement}
                    handleShowDetailConnaiss={handleShowDetailConnaiss}
                    handleShowQrcode={handleShowQrcode}
                  />
                </React.Fragment>
              )
            })}
          {!isLoading && !isError.error && !isFiltering && connaissementData?.length === 0 && (
            <tr>
              <td colSpan={5} className='text-center'>
                <i className='ri-close-circle-line'></i> Aucun connaissement
              </td>
            </tr>
          )}
          {isLoading &&
            Array.from({ length: 5 }).map((_: unknown, index: number) => (
              <TableLoader colNumber={5} key={index} />
            ))}
          {!isLoading && !isError.error && isFiltering && connaissementData?.length === 0 && (
            <tr className=''>
              <td colSpan={5} className='text-center'>
                <Image src={noResult} height={32} /> Votre recherche n'a donné aucun résultat
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Form>
  )
}
