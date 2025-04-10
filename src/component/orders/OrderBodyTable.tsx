import React from 'react'
import { Alert, Button, Dropdown, Form, Image, Overlay, Popover } from 'react-bootstrap'
import { Tag } from 'rsuite'
import { _tagStatus, _tempStockageColor } from '../../utils/functions'
import { OrderType } from '../../definitions/OrderType'
import { _switchStatus } from '../../utils/api/totaraApi'
import noResult from '../../styles/images/no_result.png'
import userStore, { UserState } from '../../stores/userStore'
import TableLoader from '../ui/Loader/TableLoader'
import { OrderBodyTableType } from '../../definitions/ComponentType'

export default function OrderBodyTable({ orderBodyTableProps }: {orderBodyTableProps: OrderBodyTableType}) {
  const {
    dataOrder,
    setDataOrder,
    ordersForConnaissement,
    setSelectedOrder,
    handleShow,
    trigger,
    errorOrderMessage,
    setErrorOrderMessage,
    isLoading,
    setInfoOrder,
    toggleShowErrorOrder,
    toggleShowInfo,
    handleSelectOrders,
    showInfoPopOrders, setShowInfoPopOrders
  } = orderBodyTableProps

  const dataStore = userStore((state: UserState) => state)
  const refInfoPopOrders = React.useRef(null)


  const handleCloseInfoPopOrder = () => {
    if(setShowInfoPopOrders){

      setShowInfoPopOrders(false) // Masquer l'Overlay
      localStorage.setItem('infoOrder', 'true')
    }
  }

  return (

    <tbody>
      {(!errorOrderMessage.error || !isLoading) &&
        dataOrder?.length > 0 &&
        dataOrder?.map((order: OrderType, indx: number) => {
          const isDifferentDestinataire =
            ordersForConnaissement?.length > 0 &&
            ordersForConnaissement?.[0]?.destinataire?.denomination !==
              order?.destinataire?.denomination

          const isNotBrouillon =
            order?.statusRevatua !== 'A_PLANIFIER' 
            // && order?.statusRevatua !== 'BROUILLON'
          return (
            <tr key={indx}>
              <td
                ref={refInfoPopOrders}
                className={`
                 ${trigger && _tempStockageColor(order?.stockage)}
               pointer p-1 p-sm-2`}
                onClick={() => {
                  if (isDifferentDestinataire) {
                    setInfoOrder(
                      'Vous ne pouvez pas sélectionner des factures avec des destinataires différents'
                    )
                    toggleShowInfo()
                  } else if (isNotBrouillon) {
                    setInfoOrder('Cette facture ne peut pas être sélectionnée.')
                    toggleShowInfo()
                  }
                }}
              >
                {' '}
                {order?.date_creation !== undefined && (
                  <Form.Check
                    type='checkbox'
                    id={`${order.id}`}
                    onChange={() => {
                      handleSelectOrders(order)
                    }}
                    checked={ordersForConnaissement?.some(
                      (selectedOrder: OrderType) => selectedOrder.id === order.id
                    )}
                    value={order?.referenceHorsRevatua}
                    disabled={isDifferentDestinataire || isNotBrouillon}
                  />
                )}
                <Overlay
                  show={showInfoPopOrders}
                  target={refInfoPopOrders?.current}
                  placement='bottom-start'
                  container={refInfoPopOrders}
                  containerPadding={20}
                >
                  <Popover id='popover-contained'>
                    <Popover.Body>
                      En cochant une facture, celle-ci sera <b>ajoutée</b> au connaissement
                      lors de la validation de la modification.
                      <br />
                      <Button variant='primary' size='sm' onClick={handleCloseInfoPopOrder}>
                        OK, compris !
                      </Button>
                    </Popover.Body>
                  </Popover>
                </Overlay>
              </td>
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={` responsive-font-small pointer p-1 p-sm-2`}
              >
                {order?.dateFacture !== undefined && order?.dateFacture}
              </td>
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={` responsive-font-small pointer p-1 p-sm-2`}
              >
                <span className='truncate'>{order?.referenceHorsRevatua} </span>
              </td>
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={` responsive-font-small pointer p-1 p-sm-2`}
              >
                {order?.destinataire?.denomination}{' '}
              </td>
              {trigger !== 'edit' && (
                <>
                  <td
                    onClick={() => {
                      setSelectedOrder(order)
                      handleShow()
                    }}
                    className={` responsive-font-small pointer p-1 p-sm-2`}
                  >
                    {order?.numeroVoyage}
                  </td>
                  <td
                    onClick={() => {
                      if (
                        order?.statusRevatua !== 'A_PLANIFIER' &&
                        order?.statusRevatua !== 'A_DEPLANIFIER'
                      ) {
                        setSelectedOrder(order)
                        handleShow()
                      }
                    }}
                    className={` responsive-font-small pointer p-1 p-sm-2`}
                  >
                    {' '}
                    <Tag
                      size='sm'
                      className={
                        order?.statusRevatua === 'A_DEPLANIFIER'
                          ? 'bg-secondary text-light responsive-font-small border hover-parent'
                          : 'responsive-font-small  border hover-parent'
                      }
                      color={_tagStatus(order?.statusRevatua)}
                    >
                      {order?.statusRevatua === 'A_PLANIFIER' ||
                      order?.statusRevatua === 'A_DEPLANIFIER' ? (
                        <Dropdown className=''>
                          <Dropdown.Toggle
                            className='border-0 p-0'
                            variant='transparent'
                            id='update_status'
                          >
                            <span className='font-75'>{order?.statusRevatua}</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              className='responsive-font-small'
                              onClick={() => {
                                if (order?.statusRevatua === 'A_PLANIFIER') {
                                  _switchStatus(
                                    dataStore.token,
                                    'A_DEPLANIFIER',
                                    order.id,
                                    setErrorOrderMessage,
                                    dataOrder,
                                    setDataOrder,
                                    toggleShowErrorOrder
                                  )
                                } else {
                                  _switchStatus(
                                    dataStore.token,
                                    'A_PLANIFIER',
                                    order.id,
                                    setErrorOrderMessage,
                                    dataOrder,
                                    setDataOrder,
                                    toggleShowErrorOrder
                                  )
                                }
                              }}
                            >
                              {order?.statusRevatua === 'A_PLANIFIER'
                                ? 'A_DEPLANIFIER'
                                : 'A_PLANIFIER'}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <>{order?.statusRevatua}</>
                      )}
                    </Tag>
                  </td>
                </>
              )}
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={`responsive-font-small pointer p-1 p-sm-2 `}
              >
                {order?.stockage}{' '}
              </td>
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={` responsive-font-small pointer p-1 p-sm-2`}
              >
                {order?.navire}
              </td>
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={` responsive-font-small pointer p-1 p-sm-2`}
              >
                {order?.ileArrivee}
              </td>
              {/* <td
            onClick={() => {
              setSelectedOrder(order)
              handleShow()
            }}
            className={`text-${_tempStockageColor(order?.items?.[0]?.detail_stockage)} text-center ${_tempStockageColor(order?.items?.[0]?.detail_stockage)} responsive-font-small pointer p-1 p-sm-2`}
          >
           { _tempStockage(order?.items?.[0]?.detail_stockage)}
          </td> */}
              <td
                onClick={() => {
                  setSelectedOrder(order)
                  handleShow()
                }}
                className={` responsive-font-small pointer p-1 p-sm-2`}
              ></td>
            </tr>
          )
        })}
      {isLoading &&
        Array.from({ length: 10 }).map((_: unknown, index: number) => (
          <TableLoader colNumber={trigger ? 6 : 9} key={index} />
        ))}
      {!isLoading && dataOrder?.length === 0 && (
        <tr className=''>
          <td></td>
          <td colSpan={8} className='text-center'>
            <Image src={noResult} height={32} /> Votre recherche n'a donné aucun résultat
          </td>
          <td></td>
        </tr>
      )}
      {!isLoading && errorOrderMessage?.error && (
        <tr className=''>
          <td colSpan={9} className='text-center'>
            <Alert variant='danger'>
              <i className='ri-error-warning-line fs-2 text-light  me-3'></i>
              {errorOrderMessage?.message}
            </Alert>
          </td>
          <td></td>
        </tr>
      )}
    </tbody>

  )
}
