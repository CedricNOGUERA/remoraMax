import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import {  ResultConnaissementType } from '../../definitions/ConnaissementType';
import { _filterConnaissementTransp11 } from '../../utils/api/apiControlerFunctions';
import { UserState } from '../../stores/userStore';
import { statusType } from '../../definitions/statusType';
import { FilteringDataTransportType, FilterParamsTransp11 } from '../../definitions/ComponentType';

interface searchBarTransporterType {
  connaissementData: ResultConnaissementType[]
  setConnaissementData: React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
  itemPerPage: number
  dataStore: UserState
  status: statusType
  currentPage: number
  filteringDataTransport: FilteringDataTransportType
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedId: number | undefined
  sortConfig: string
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SearchBarTransporter({searchBarTransporterProps}: {searchBarTransporterProps: searchBarTransporterType}) {
    const {
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
    } = searchBarTransporterProps

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

   
    const handleFilterConnaissement = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value
        if (value?.length > 2) {
          const filteredData = connaissementData?.filter((item: ResultConnaissementType) => {
            return (
              item?.destinataire?.denomination?.toLowerCase().includes(value.toLowerCase()) ||
              item?.numero?.toLowerCase().includes(value.toLowerCase()) ||
              item?.expediteur?.denomination?.toLowerCase().includes(value.toLowerCase()) ||
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
          _filterConnaissementTransp11(
            ...filterParams
          )
        }
      }


  return (
    <div>
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
      </div>
  )
}
