import React from 'react'
import { OrderDetailType, OrderType } from '../../../../definitions/OrderType'

type TableBodyDetailType = {
    sortedProductByCodeSH: OrderDetailType[] | undefined
    selectedOrder: OrderType
    setSelectedProduct: React.Dispatch<React.SetStateAction<OrderDetailType | undefined>>
    handleShowUpdateProductModal: () => void
    setInfoOrder: React.Dispatch<React.SetStateAction<string >>
    toggleShowInfo: () => void
  }

export default function TableBodyDetail({tableBodyDetailProps}: {tableBodyDetailProps: TableBodyDetailType}) {
    const {
      sortedProductByCodeSH,
      selectedOrder,
      setSelectedProduct,
      handleShowUpdateProductModal,
      setInfoOrder,
      toggleShowInfo,
    } = tableBodyDetailProps
  return (
    <tbody className='responsive-font-small'>
    {sortedProductByCodeSH?.map((product: OrderDetailType, indexProd: number) => {
      const isMiissingData =
        product?.detail_poids && product?.detail_poids <= 0 ||
        product?.detail_poids === undefined ||
        product?.detail_stockage === undefined ||
        product?.detail_codeTarif === undefined ||
        product?.detail_codeSH === ''
      return (
        <tr key={indexProd}>
          <td className={`text-${isMiissingData && 'danger'}`}>
            {product?.detail_referenceExterne}
          </td>
          <td className={`text-${isMiissingData && 'danger'}`}>
            {product?.detail_contenant}
          </td>
          <td className={`text-${isMiissingData && 'danger'}`}>
            {product?.detail_description}
          </td>
          <td className={`text-end text-${isMiissingData && 'danger'}`}>
            {product?.detail_nbColis}
          </td>
          <td className={`text-end text-${isMiissingData && 'danger'}`}>
            {product?.detail_poids}
          </td>
          <td className={`text-${isMiissingData && 'danger'}`}>
            {product?.detail_stockage}
          </td>
          <td className={`text-${isMiissingData && 'danger'}`}>
            {product?.detail_codeTarif}
          </td>
          <td className={`text-${isMiissingData && 'danger'}`}>
            {product?.detail_codeSH}
          </td>
          <td
            className='text-center pointer'
            onClick={() => {
              if (
                selectedOrder?.statusRevatua === 'A_PLANIFIER' ||
                selectedOrder?.statusRevatua === 'BROUILLON'
              ) {
                setSelectedProduct(product)
                handleShowUpdateProductModal()
              } else {
                setInfoOrder(
                  `Les commandes qui sont au statut ${selectedOrder?.statusRevatua} ne sont pas modifiables`
                )
                toggleShowInfo()
              }
            }}
          >
            <i className='ri-pencil-line fs-5'></i>{' '}
          </td>
        </tr>
      )
    })}
  </tbody>
  )
}
