import React from 'react'
import { Dropdown } from 'react-bootstrap'
import TableLoaderMap from '../ui/Loader/TableLoaderMap'
import { CompanyType } from '../../definitions/CompanyType'

interface BodyTableCompanyType {
  isLoading: boolean
  companiesData: CompanyType[]
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<CompanyType>>
  handleShowUpdateCompany: () => void
}

export default function BodyTableCompany({
  bodyTableCompnyProps,
}: {
  bodyTableCompnyProps: BodyTableCompanyType
}) {
  const { isLoading, companiesData, setSelectedCompanyData, handleShowUpdateCompany } =
    bodyTableCompnyProps

  return (
    <tbody>
      {!isLoading &&
        companiesData?.map((company: CompanyType, indx: number) => (
          <tr key={indx}>
            <td className='pointer p-0 p-md-2'>{company?.id_company}</td>
            <td className='pointer p-0 p-md-2'>{company?.name}</td>
            <td className='pointer p-0 p-md-2'>{(company?.created_at)?.slice(0, 10)}</td>
            <td className='pointer p-0 p-md-2'>
              <Dropdown>
                <Dropdown.Toggle
                  variant='transparent'
                  id='dropdown-basic'
                  className='border-0 no-chevron'
                >
                  <b>
                    {' '}
                    <i className='ri-more-2-line'></i>
                  </b>
                </Dropdown.Toggle>
                <Dropdown.Menu align='end'>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedCompanyData(company)
                      handleShowUpdateCompany()
                    }}
                  >
                    <i className='ri-pencil-line'></i> Modifier
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      {isLoading && <TableLoaderMap colNumber={3} repetition={5} />}
    </tbody>
  )
}
