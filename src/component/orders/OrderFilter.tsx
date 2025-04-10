import React from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import userStore, { UserState } from '../../stores/userStore';
import { _getOrdersData2, _handlefilteredOrder} from '../../utils/functions';
import { useOutletContext } from 'react-router-dom';
import { filteringDataType } from '../../definitions/ComponentType';
import { OrderType } from '../../definitions/OrderType';

interface NavireDataType {
  id: number
  name: string
}

interface OrderFilterType {
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  dataOrder: OrderType[]
  ordersForConnaissement: OrderType[]
  filteringData: filteringDataType
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataType>>
  isFiltering: boolean
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setErrorOrderMessage: React.Dispatch<
    React.SetStateAction<{
      error: boolean
      message: string
    }>
  >
  itemPerPage: number
  trigger?: boolean
}

interface ContextOrderFilterType {
  naviresData: {
    id: number
    name: string
  }[]
}


export default function OrderFilter({orderFilterProps}: {orderFilterProps: OrderFilterType}) {

  const { naviresData } = useOutletContext<ContextOrderFilterType>();
    const dataStore = userStore((state: UserState) => state)
    const {
      handleSelectAll,
      dataOrder,
      ordersForConnaissement,
      filteringData,
      setFilteringData,
      isFiltering,
      setIsFiltering,
      currentPage,
      setDataOrder,
      setTotalPages,
      isLoading,
      setIsLoading,
      setErrorOrderMessage,
      itemPerPage,
      trigger,
    } = orderFilterProps

    const status = [
      'A_PLANIFIER',
      'A_DEPLANIFIER',
      'BROUILLON',
      'DEMANDE',
      'DEMANDE_REFUSEE',
      'SAISIE',
      'OFFICIALISE',
      'OFFICIALISE_SOUS_RESERVE',
      'MODIFIE',
      'PRIS_EN_CHARGE',
      'EMBARQUE',
      'EMBARQUEMENT_REFUSE',
      'TRANSFERE',
      'ANNULE',
    ]
    const stockageData = ["CALE", "PONTEE", "REFRIGERE", "CONGELE"]
    //if fitteringData is empty
    const isEmpty =
      filteringData.date_facture === '' &&
      filteringData.referenceHorsRevatua === '' &&
      filteringData.destinataire_denomination === '' &&
      filteringData.numeroVoyage === '' &&
      filteringData.statut_revatua === '' &&
      filteringData.stockage === '' &&
      filteringData.bateau === '' &&
      filteringData.ileArrivee === ''

  
    return (
      <thead className=''>
        <tr>
          <th className='p-1 p-sm-2'>
            <Form.Check
              type='checkbox'
              id={`allCheckOrder`}
              onChange={handleSelectAll}
              checked={
                dataOrder?.length > 0 && ordersForConnaissement?.length === dataOrder?.length
              }
            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Date'
              name='date_facture'
              value={filteringData.date_facture || ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}

            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Numéro Facture'
              name='referenceHorsRevatua'
              value={filteringData.referenceHorsRevatua}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}
            />
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Client'
              name='destinataire_denomination'
              value={filteringData.destinataire_denomination || ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}
            />
          </th>
          {!trigger && (
            <>
              <th className='responsive-font-small p-1 p-sm-2'>
                {' '}
                <Form.Control
                  className=' border'
                  type='text'
                  autoComplete='on'
                  placeholder='N°voyage'
                  name='numeroVoyage'
                  value={filteringData.numeroVoyage || ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}

                />
              </th>
              <th className='responsive-font-small p-1 p-sm-2'>
                {' '}
                <Form.Select
                  name='statut_revatua'
                  value={filteringData.statut_revatua || ''}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}
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
            </>
          )}
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Select
            name='stockage'
            value={filteringData.stockage || ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}
            aria-label='zone'
            className=''
          >
            <option value='' className='text-ui-second'>
              Stockage
            </option>
            {stockageData?.map((zone: string, index: number) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </Form.Select>
          </th>
          <th className='responsive-font-small p-1 p-sm-2'>
            {' '}
            <Form.Select
            name='bateau'
            value={filteringData.bateau || ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}
            aria-label='zone'
            className=''
          >
            <option value='' className='text-ui-second'>
              Navire
            </option>
            {naviresData?.map((navire: NavireDataType, index: number) => (
              <option key={index} value={navire?.name}>
                {navire?.name}
              </option>
            ))}
          </Form.Select>
          </th>
          
          <th className='responsive-font-small p-1 p-sm-2'>
            <Form.Control
              className=' border'
              type='text'
              autoComplete='on'
              placeholder='Arrivée'
              name='ileArrivee'
              value={filteringData.ileArrivee || ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => _handlefilteredOrder(event, filteringData, setFilteringData)}
            />
          </th>
         
          <th className='responsive-font-small p-1 p-sm-2'>
            <Button
              className='d-flex align-items-center font-85 bg-remora-primary border-remora-primary'
              type='submit'
              disabled={isEmpty}
            >
              {isLoading ? (
                <Spinner size='sm' animation='border' role='status' className='me-2' />
              ) : (
                <i className='ri-search-line me-0  me-md-2'></i>
              )}
              <span className='d-none d-md-block'>Rechercher</span>
            </Button>
            {isFiltering && (
              <span
                className='pointer'
                onClick={() => {
                  setFilteringData({
                    date_facture: '',
                    referenceHorsRevatua: '',
                    destinataire_denomination: '',
                    numeroVoyage: '',
                    statut_revatua: '',
                    bateau: '',
                    ileArrivee: '',
                    stockage: '',
                  })
                  _getOrdersData2(
                    dataStore.token,
                    currentPage,
                    setDataOrder,
                    setTotalPages,
                    setIsLoading,
                    setErrorOrderMessage,
                    itemPerPage
                  )
                 
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
    )
}