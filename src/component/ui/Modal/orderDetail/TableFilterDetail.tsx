import React from 'react'
import { Form } from 'react-bootstrap'
import { FilteringOrderDetailType } from '../../../../definitions/OrderType'

type TableFilterDetailType = {
  filteringData: FilteringOrderDetailType
  handlefilteredProduct: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type InputDataType = {
  type: string
  placeholder: string
  name: keyof FilteringOrderDetailType
}

export default function TableFilterDetail({
  tableFilterDetailProps,
}: {
  tableFilterDetailProps: TableFilterDetailType
}) {
  const { filteringData, handlefilteredProduct } = tableFilterDetailProps
  const inputData: InputDataType[] = [
    { type: 'text', placeholder: 'Référence', name: 'detail_referenceExterne' },
    { type: 'text', placeholder: 'Contenant', name: 'detail_contenant' },
    { type: 'text', placeholder: 'Désignation', name: 'detail_description' },
    { type: 'number', placeholder: 'nbColis', name: 'detail_nbColis' },
    { type: 'text', placeholder: 'Poids', name: 'detail_poids' },
    { type: 'text', placeholder: 'Stockage', name: 'detail_stockage' },
    { type: 'text', placeholder: 'C.tarif', name: 'detail_codeTarif' },
    { type: 'text', placeholder: 'C.SH', name: 'detail_codeSH' },
  ]
  return (
    <thead className='responsive-font-medium border-top-0'>
      <tr>
        {inputData?.map((item: InputDataType, indx: number) => (
          <th key={indx}>
            <Form.Control
              className=' border'
              type={item?.type}
              autoComplete='on'
              placeholder={item?.placeholder}
              name={item?.name}
              value={filteringData?.[item?.name] || undefined}
              onChange={handlefilteredProduct}
            />
          </th>
        ))}
        <th className='text-center'></th>
      </tr>
    </thead>
  )
}
