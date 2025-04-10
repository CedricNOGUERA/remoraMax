import React from 'react'
// import { Dropdown, Form, InputGroup, Table } from 'react-bootstrap'
import FloatingAddCompanyButton from '../../component/ui/FloatingAddCompanyButton'
import ModalUpdateCompany from '../../component/company/ModalUpdateCompany'
import userStore, { UserState } from '../../stores/userStore'
import { _getCompaniesData } from '../../utils/api/totaraApi'
import { useOutletContext } from 'react-router-dom'
import { CompanyType } from '../../definitions/CompanyType'
import TableCompany from '../../component/company/TableCompany'
import SearchBarCompany from '../../component/company/SearchBarCompany'

interface ContextCompanyType {
  companiesData: CompanyType[]
  setCompaniesData: React.Dispatch<React.SetStateAction<CompanyType[]>>
}

export default function Companies() {
  const { companiesData, setCompaniesData } = useOutletContext<ContextCompanyType>()

  const dataStore = userStore((state: UserState) => state)

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [selectedCompanyData, setSelectedCompanyData] = React.useState<CompanyType>({} as CompanyType)

  const headerTableData = ['Id', 'nom', 'Date de création', 'Action']

  ///////////////////////
  //Modal
  ///////////////////////
  const [showUpdateCompany, setShowUpdateCompany] = React.useState<boolean>(false)
  const handleCloseUpdateCompany = () => setShowUpdateCompany(false)
  const handleShowUpdateCompany = () => setShowUpdateCompany(true)

  React.useEffect(() => {
    if (dataStore.token !== '') {
      _getCompaniesData(dataStore.token, setCompaniesData, setIsLoading)
    }
  }, [dataStore.token, setCompaniesData])

  ///////////////////////
  //Event
  ///////////////////////

  const handleFilterUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const filteredData = companiesData?.filter((item: CompanyType) => {
      return (
        item?.id_company?.toString()?.includes(value) ||
        item?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.created_at?.toLowerCase()?.includes(value?.toLowerCase())
      )
    })
    if (setCompaniesData) {
      setCompaniesData(filteredData)
    }
    if (value.length === 0) {
      _getCompaniesData(dataStore.token, setCompaniesData, setIsLoading)
    }
  }

  ///////////////////////
  //Props
  ///////////////////////

  const tableCompanyProps = {
    headerTableData,
    isLoading,
    companiesData,
    setSelectedCompanyData,
    handleShowUpdateCompany,
  }

  const modalUpdateCompanyProps = {
    showUpdateCompany,
    handleCloseUpdateCompany,
    selectedCompanyData,
    setSelectedCompanyData,
    setIsLoading,
  }
  const floatingAddCompanyButtonProps = { setCompaniesData, setIsLoading }

  return (
    <div className='p-1 p-lg-3 pb-5 mb-5 w-100'>
      <h3 className='text-secondary'>Compagnies</h3>
      <SearchBarCompany handleFilterUsers={handleFilterUsers} />
      <TableCompany tableCompanyProps={tableCompanyProps} />
      <ModalUpdateCompany modalUpdateCompanyProps={modalUpdateCompanyProps} />
      <FloatingAddCompanyButton
        floatingAddCompanyButtonProps={floatingAddCompanyButtonProps}
      />
    </div>
  )
}
