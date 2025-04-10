import React from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom'
import { FilteringDataTransportType } from '../../definitions/ComponentType'
import { NavireType } from '../../definitions/NavireType'

interface ContextFilterType {
  naviresData: {
    id: number
    name: string
  }[]
}

export type BillOFilterType = {
  filteringDataTransport: FilteringDataTransportType
  setFilteringDataTransport: React.Dispatch<React.SetStateAction<FilteringDataTransportType>>
  isFiltering: boolean
  isEmpty: boolean
  isLoading: boolean
}

export default function TransporterFilterTab({
  billOfilterProps,
}: {
  billOfilterProps: BillOFilterType
}) {
  const {
    filteringDataTransport,
    setFilteringDataTransport,
    isFiltering,
    isEmpty,
    isLoading,
  } = billOfilterProps

  const { naviresData } = useOutletContext<ContextFilterType>()

  return (
    <React.Fragment>
      <thead className=''>
        <tr>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='N°Connaisse...'
              name='numeroConnaissementTransp'
              value={filteringDataTransport.numero || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  numero: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
            />
          </th>
          <th className='d-none responsive-font-small p-1 p-sm-2' style={{ width: '12%' }}>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Compagnie'
              name='expediteur_denomination'
              readOnly
              // value={filteringDataTransport.expediteur_denomination || ''}
              // onChange={(e) => {
              //   const updatedFilteringData = {
              //     ...filteringDataTransport,
              //     expediteur_denomination: e.currentTarget.value,
              //   }
              //   setFilteringDataTransport(updatedFilteringData)
              // }}
            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Client'
              name='destinataireTransp'
              value={filteringDataTransport.destinataire_denomination || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  destinataire_denomination: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Select
              name='idNavireTransp'
              value={filteringDataTransport.nomNavire || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  nomNavire: e.currentTarget.value,
                  // nomNavire: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
              aria-label='zone'
              className=''
            >
              <option value='' className='text-ui-second'>
                Navire
              </option>
              {naviresData?.map((navire: NavireType, index: number) => (
                <option key={index} value={navire?.name}>
                  {navire?.name}
                </option>
              ))}
            </Form.Select>
          </th>

          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Date départ'
              name='dateDepartTransp'
              value={filteringDataTransport.dateDepart || ''}
              onChange={(e) => {
                const dateDepart = e.currentTarget.value
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  dateDepart: dateDepart,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
            />
          </th>

          <th className='responsive-font-small p-1 p-sm-2'>
            <Button
              type='submit'
              className='d-flex align-items-center font-85 bg-remora-primary border-remora-primary'
              disabled={isEmpty}
            >
              {isLoading ? (
                <Spinner size='sm' animation='border' role='status' className='me-2' />
              ) : (
                <i className='ri-search-line me-0  me-md-2'></i>
              )}
              <span className='d-none d-md-block'>Rechercher</span>{' '}
            </Button>
            {isFiltering && (
              <span
                className='pointer'
                onClick={() => {
                  setFilteringDataTransport({
                    numero: '',
                    // expediteur_id: undefined,
                    destinataire_denomination: '',
                    nomNavire: '',
                    dateDepart: '',
                  })
                }}
              >
                <i className='ri-close-line fs-5'></i>
                <u>Réinitialiser</u>
              </span>
            )}
          </th>
        </tr>
      </thead>
      {/* <thead className=' mobile-table-head'>
        <tr>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='N°'
              name='numeroConnaissement'
              value={filteringDataTransport.numeroConnaissement || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  numeroConnaissement: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
            />
          </th>
            <th className='responsive-font-small p-1 p-sm-2'>
              {' '}
              <Form.Control
                className=' border'
                type='text'
                autoComplete='on'
                placeholder='Compagnie'
                name='expediteur_denomination'
                value={filteringDataTransport.expediteur_denomination || ''}
                onChange={(e) => {
                  const updatedFilteringData = {
                    ...filteringDataTransport,
                    expediteur_denomination: e.currentTarget.value,
                  }
                  setFilteringDataTransport(updatedFilteringData)
                }}
              />
            </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Client'
              name='destinataire'
              value={filteringDataTransport.destinataire || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  destinataire: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Select
              name='idNavire'
              value={filteringDataTransport.idNavire || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  idNavire: e.currentTarget.value,
                  nomNavire: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
              aria-label='zone'
              className=''
            >
              <option value='' className='text-ui-second'>
                Navire
              </option>
              {naviresData?.map((navire: any, index: any) => (
                <option key={index} value={navire?.name}>
                  {navire?.name}
                </option>
              ))}
            </Form.Select>
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Date départ'
              name='date_depart'
              value={filteringDataTransport.dateDepart || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringDataTransport,
                  dateDepart: e.currentTarget.value,
                }
                setFilteringDataTransport(updatedFilteringData)
              }}
            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            <Button
              type='submit'
              className='d-flex align-items-center font-85 bg-remora-primary border-remora-primary'
              disabled={isEmpty}
            >
              {isLoading ? (
                <Spinner size='sm' animation='border' role='status' className='me-2' />
              ) : (
                <i className='ri-search-line me-0  me-md-2'></i>
              )}
              <span className='d-none d-md-block'>Rechercher</span>{' '}
            </Button>
            {isFiltering && (
              <span
                className='pointer'
                onClick={() => {
                  setFilteringDataTransport({
                    numeroConnaissement: '',
                    expediteur_denomination: '',
                    destinataire: '',
                    idNavire: '',
                    evenementConnaissement: '',
                    dateDepart: '',
                    nomIleArrivee: '',
                    dateArrivee: '',
                  })
                }}
              >
                <i className='ri-close-line fs-5'></i>
                <u>Réinitialiser</u>
              </span>
            )}
          </th>
        </tr>
      </thead> */}
    </React.Fragment>
  )
}
