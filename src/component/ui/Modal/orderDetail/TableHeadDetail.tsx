import React from 'react'
import { _dataSorter } from '../../../../utils/functions'
import { OrderType } from '../../../../definitions/OrderType'

type TableHeadDetailType = {
  sortConfig: {
    key: string
    order: 'asc' | 'desc'
  } | null
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string
      order: 'asc' | 'desc'
    } | null>
  >
  selectedOrder: OrderType
  setSelectedOrder: React.Dispatch<React.SetStateAction<OrderType>>
}

interface FilterKeyType {
  name: string
  filterKey: "id_company" | "id_order" | "id" | "detail_nbColis" | "detail_description" | "detail_codeSH" | "detail_codeTarif" | "detail_stockage" | "detail_poids" | "detail_unitePoids"  | "detail_referenceExterne" | "detail_contenant"
}

export default function TableHeadDetail({
  tableHeadDetailProps,
}: {
  tableHeadDetailProps: TableHeadDetailType
}) {
  const { sortConfig, setSortConfig, selectedOrder, setSelectedOrder } = tableHeadDetailProps

  const mapData: FilterKeyType[] = [
    { name: 'Réf', filterKey: 'detail_referenceExterne' },
    { name: 'Contenant', filterKey: 'detail_contenant' },
    { name: 'Désignation', filterKey: 'detail_description' },
    { name: 'NbColis', filterKey: 'detail_nbColis' },
    { name: 'Poids(Kg)', filterKey: 'detail_poids' },
    { name: 'Stockage', filterKey: 'detail_stockage' },
    { name: 'C.Tarif', filterKey: 'detail_codeTarif' },
    { name: ' C.SH', filterKey: 'detail_codeSH' },
  ]

  return (
    <thead className=''>
      <tr>
        {mapData?.map((item: FilterKeyType, indx: number) => (
          <th
            key={indx}
            style={item?.name === 'Désignation' ? { width: '256px' } : { width: 'auto' }}
            className='responsive-font-small p-1 p-sm-2'
          >
            <div className='d-flex align-items-center'>
              <span className='me-1'>{item?.name}</span>
              <span className='d-flex flex-column align-items-center pointer'>
                <span style={{ height: '16px' }} className='d-flex'>
                  <i
                    className={`ri-arrow-up-s-fill ${
                      sortConfig?.order === 'asc' && sortConfig?.key === item?.filterKey
                        ? 'text-remora-secondary'
                        : 'text-dark'
                    }`}
                    onClick={() =>
                      _dataSorter(
                        item?.filterKey,
                        'asc',
                        setSortConfig,
                        selectedOrder,
                        setSelectedOrder
                      )
                    }
                  ></i>{' '}
                </span>
                <span style={{ height: '16px' }} className='d-flex '>
                  <i
                    className={`ri-arrow-down-s-fill ${
                      sortConfig?.order === 'desc' && sortConfig?.key === item?.filterKey
                        ? 'text-remora-secondary'
                        : 'text-dark'
                    }`}
                    onClick={() =>
                      _dataSorter(
                        item?.filterKey,
                        'desc',
                        setSortConfig,
                        selectedOrder,
                        setSelectedOrder
                      )
                    }
                  ></i>
                </span>
              </span>
            </div>
          </th>
        ))}
        <th className='responsive-font-small '>Action</th>
      </tr>
    </thead>
  )
}
