import React from 'react'
import { Table } from 'react-bootstrap'
import { CompanyType } from '../../definitions/CompanyType'
import HeaderTableCompany from './HeaderTableCompany'
import BodyTableCompany from './BodyTableCompany'

interface TableCompanyType {
  headerTableData: string[]
  isLoading: boolean
  companiesData: CompanyType[]
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<CompanyType>>
  handleShowUpdateCompany: () => void
}

export default function TableCompany({
  tableCompanyProps,
}: {
  tableCompanyProps: TableCompanyType
}) {
  const {
    headerTableData,
    isLoading,
    companiesData,
    setSelectedCompanyData,
    handleShowUpdateCompany,
  } = tableCompanyProps
  const bodyTableCompnyProps = {
    isLoading,
    companiesData,
    setSelectedCompanyData,
    handleShowUpdateCompany,
  }
  return (
    <Table striped hover responsive className='responsive-font-small border py-5 mb-5'>
      <HeaderTableCompany headerTableData={headerTableData} />
      <BodyTableCompany bodyTableCompnyProps={bodyTableCompnyProps} />
    </Table>
  )
}
