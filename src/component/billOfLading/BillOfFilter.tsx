import React from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom'
import { status } from '../../data/commandes/divers'
import { filteringDataConnaissementtype } from '../../definitions/ComponentType'

interface BillOfFilterType {
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  filteringData: filteringDataConnaissementtype
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  isTransporter: boolean | null
  isFiltering: boolean
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
  isEmpty: boolean
  isLoading: boolean
  sortConfig: string
  setSortConfig: React.Dispatch<React.SetStateAction<string>>

}

interface ContextBillOfFilterType {
  naviresData: {
    id: number
    name: string
  }[]
}

export default function BillOfFilter({ billOfilterProps }: {billOfilterProps: BillOfFilterType}) {
  const {
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
  } = billOfilterProps

  const { naviresData } = useOutletContext<ContextBillOfFilterType>();


  return (
    <React.Fragment>
    <thead className=' d-table-head'>
      <tr>
      
        <th className='p-1 p-sm-2'>
          <Form.Check className='' type='checkbox' id={`allCheck`} onChange={handleSelectAll} />
        </th>
        
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder='N°Connaisse...'
            name='numeroConnaissement'
            value={filteringData.numeroConnaissement || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                numeroConnaissement: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
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
            value={filteringData.destinataire || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                destinataire: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Select
            name='idNavire'
            value={filteringData.idNavire || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                idNavire: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
            aria-label='zone'
            
          >
            <option value='' className='text-ui-second'>
              Navire
            </option>
            {naviresData?.map((navire: {id: number, name: string}, index: number) => (
              <option key={index} value={navire?.id}>
                {navire?.name}
              </option>
            ))}
          </Form.Select>
        </th>
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Select
            name='dernierEvenementConnaissement'
            value={filteringData.dernierEvenementConnaissement || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                dernierEvenementConnaissement: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
            aria-label='zone'
          >
            <option value='' className='text-ui-second responsive-font-small'>
              Statut
            </option>
            {status?.map((etat: string, index: number) => (
              <option key={index} value={etat}>
                {etat}
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
            name='dateDepart'
            value={filteringData.dateDepart || ''}
            onChange={(e) => {
              const departDate = e.currentTarget.value.trim()
              const updatedFilteringData = {
                ...filteringData,
                dateDepart: departDate,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
       
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder="Ile d'arrivée"
            name='nomIleArrivee'
            value={filteringData.nomIleArrivee || ''}
            
            onChange={(e) => {

              const updatedFilteringData = {
                ...filteringData,
                nomIleArrivee: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        <th className='responsive-font-small p-1 p-sm-2'>
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder='Date Arrivée'
            name='dateArrivee'
            value={filteringData.dateArrivee || ''}
            onChange={(e) => {
              const dateArrivee = e.currentTarget.value.trim()
              const updatedFilteringData = {
                ...filteringData,
                dateArrivee: dateArrivee,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        
        <th className='responsive-font-small p-1 p-sm-2'>
          <Button
            type="submit"
            className='d-flex align-items-center font-85 bg-remora-primary border-remora-primary'
            disabled={isEmpty}
          >
            {isLoading ? 
          <Spinner size="sm" animation="border" role="status" className='me-2'/>
          : 
          <i className='ri-search-line me-0  me-md-2'></i>
        }
            <span className='d-none d-md-block'>Rechercher</span>{' '}
          </Button>
          {(isFiltering || sortConfig !== 'id,desc') &&(
            <span
              className='pointer'
              onClick={() => {
                setFilteringData({
                  numeroConnaissement: '',
                  expediteur_denomination: '',
                  destinataire: '',
                  idNavire: '',
                  dernierEvenementConnaissement: '',
                  dateDepart: '',
                  nomIleArrivee: '',
                  dateArrivee: '',
                })
                setSortConfig("id,desc")
                setIsFiltering(false)
              }}
            >
              <i className='ri-close-line fs-5'></i>
              <u>Réinitialiser</u>
            </span>
          )}
        </th>
      </tr>
    </thead>
{/************************
Mobike view
*************************/}
    
    <thead className=' mobile-table-head '>
      <tr>
        {!isTransporter && 
        <th className='p-1 p-sm-2 d-flex-header-group align-items-center'>
          <Form.Check type='checkbox' id={`allCheck2`} onChange={handleSelectAll} />
        </th>
        }
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder='N°'
            name='numeroConnaissementMobile'
            value={filteringData.numeroConnaissement || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                numeroConnaissement: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        {isTransporter && (
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Compagnie'
              name='expediteur_denominationMobile'
              value={filteringData.expediteur_denomination || ''}
              onChange={(e) => {
                const updatedFilteringData = {
                  ...filteringData,
                  expediteur_denomination: e.currentTarget.value,
                }
                setFilteringData(updatedFilteringData)
              }}
            />
          </th>
        )}
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder='Client'
            name='destinataireMobile'
            value={filteringData.destinataire || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                destinataire: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Select
            name='idNavireMobile'
            value={filteringData.idNavire || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                idNavire: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
            aria-label='zone'
            className=''
          >
            <option value='' className='text-ui-second'>
              Navire
            </option>
            {naviresData?.map((navire: {id: number, name: string}, index: number) => (
              <option key={index} value={navire?.id}>
                {navire?.name}
              </option>
            ))}
          </Form.Select>
        </th>
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Select
            name='dernierEvenementConnaissementMobile'
            value={filteringData.dernierEvenementConnaissement || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                dernierEvenementConnaissement: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
            aria-label='zone'
          >
            <option value='' className='text-ui-second'>
              Statut
            </option>
            {status?.map((etat: string, index: number) => (
              <option key={index} value={etat}>
                {etat}
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
            name='date_departMobile'
            value={filteringData.dateDepart || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                dateDepart: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        {!isTransporter &&
        <>
        <th className='responsive-font-small p-1 p-sm-2'>
          {' '}
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder="Ile d'arrivée"
            name='nomIleArriveeMobile'
            value={filteringData.nomIleArrivee || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                nomIleArrivee: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        <th className='responsive-font-small p-1 p-sm-2'>
          <Form.Control
            className=' border'
            type='text'
            autoComplete='on'
            placeholder='Date Arrivée'
            name='dateArriveeMobile'
            value={filteringData.dateArrivee || ''}
            onChange={(e) => {
              const updatedFilteringData = {
                ...filteringData,
                dateArrivee: e.currentTarget.value,
              }
              setFilteringData(updatedFilteringData)
            }}
          />
        </th>
        </>
        }

        <th className='responsive-font-small p-1 p-sm-2'>
          <Button
          type="submit"
            className='d-flex align-items-center font-85 bg-remora-primary border-remora-primary'
            disabled={isEmpty}
          >
            {isLoading ? 
          <Spinner size="sm" animation="border" role="status" className='me-2'/>
          : 
          <i className='ri-search-line me-0  me-md-2'></i>
        }
            <span className='d-none d-md-block'>Rechercher</span>{' '}
          </Button>
          {(isFiltering || sortConfig !== 'id,desc') && (
            <span
              className='pointer'
              onClick={() => {
                setFilteringData({
                  numeroConnaissement: '',
                  expediteur_denomination: '',
                  destinataire: '',
                  idNavire: '',
                  dernierEvenementConnaissement: '',
                  dateDepart: '',
                  nomIleArrivee: '',
                  dateArrivee: '',
                })
                setSortConfig("id,desc")
                setIsFiltering(false)
              }}
            >
              <i className='ri-close-line fs-5'></i>
              <u>Réinitialiser</u>
            </span>
          )}
        </th>
      </tr>
    </thead>
    </React.Fragment>
  )
}
