import React from 'react'
import { Button, Card, Col, Container, Modal, Row, Table } from 'react-bootstrap'
import SearchTest from '../../../pages/private/SearchTest'
import OrdersService from '../../../services/orders/OrdersService'
import userStore, { UserState } from '../../../stores/userStore'
import { _tagStatus } from '../../../utils/functions'
import { Tag } from 'rsuite'
import {
  // _handleAddproduct,
  _handleUpdateProduct,
  _patchNotification,
} from '../../../utils/api/totaraApi'
import { debounce } from 'lodash'
import { errorType } from '../../../definitions/errorType'
import {
  DetailOrderModalType,
  filteringDataConnaissementtype,
  SearchPlanningModalType,
} from '../../../definitions/ComponentType'
import codeSH2024 from '../../../data/codeSH/codeSH2024.json'
// import { stockageData } from '../../../data/commandes/divers'
import { UpdateProductModal } from './OrderProduct'
import { _getNomenclature } from '../../../utils/api/apiControlerFunctions'
import { Link } from 'react-router-dom'
import { ToastAll } from '../Toast/Toastes'
import { FilteringOrderDetailType, OrderDetailType, OrderType } from '../../../definitions/OrderType'
import { NomenclatureType } from '../../../definitions/NomenclatureType'
import HeaderDetail from './orderDetail/HeaderDetail'
import TableHeadDetail from './orderDetail/TableHeadDetail'
import TableFilterDetail from './orderDetail/TableFilterDetail'
import TableBodyDetail from './orderDetail/TableBodyDetail'
import { NotificationType } from '../../../definitions/NotificationType'

type NotificationModalType = {
  showNotifModal: boolean
  handleCloseNotifModal: () => void
  notifications: NotificationType[] | undefined
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[] | undefined>>
  filteringData: filteringDataConnaissementtype
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  setIsNotification: React.Dispatch<React.SetStateAction<boolean>>
}

// export type FilterDetailOrderType = {
//   detail_referenceExterne: string
//   detail_contenant: string
//   detail_description: string
//   detail_nbColis: string
//   detail_poids: string
//   detail_stockage: string
//   detail_codeTarif: string
//   detail_codeSH: string
// }

// Display the planning of diffrents ships
export function SearchPlanningModal({
  SearchPlanningModalProps,
}: {
  SearchPlanningModalProps: SearchPlanningModalType
}) {
  const { showSearchPlanning, handleCloseSearchPlanning, searchPlanningProps } =
    SearchPlanningModalProps

  return (
    <Modal size='lg' show={showSearchPlanning} onHide={handleCloseSearchPlanning}>
      <SearchTest searchPlanningProps={searchPlanningProps} />
      <Modal.Footer className='border-0 sticky-bottom justify-content-start'>
        <Button variant='secondary' className='' onClick={handleCloseSearchPlanning}>
          <i className='ri-close-line me-2'></i>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// Display order (bill) detail
export function DetailOrderModal({
  detailOrderModalProps,
}: {
  detailOrderModalProps: DetailOrderModalType
}) {
  const {
    show,
    selectedOrder,
    handleClose,
    setSelectedOrder,
    dataOrder,
    setDataOrder,
    setInfoOrder,
    toggleShowInfo,
    setOrdersForConnaissement,
  } = detailOrderModalProps

  const dataStore = userStore((state: UserState) => state)
  const [validated, setValidated] = React.useState<boolean>(true)
  const [showUpdateProductModal, setShowUpdateProductModal] = React.useState<boolean>(false)
  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    order: 'asc' | 'desc'
  } | null>(null)

  const [isError, setIsError] = React.useState<errorType>({
    error: false,
    message: '',
  })

  const [sortedProductByCodeSH, setSortedProductByCodeSH] = React.useState<
    OrderDetailType[] | undefined
  >()
  const [selectedProduct, setSelectedProduct] = React.useState<OrderDetailType>()
  const [filteringData, setFilteringData] = React.useState<FilteringOrderDetailType>({
    detail_referenceExterne: '',
    detail_contenant: '',
    detail_description: '',
    detail_nbColis: null,
    detail_poids: null,
    detail_stockage: undefined,
    detail_codeTarif: undefined,
    detail_codeSH: '',
  })

  const codeSH = codeSH2024

  const [filteredCodeSh, setFilteredCodeSh] = React.useState<NomenclatureType[] | undefined>(
    []
  )

  const handleCloseUpdateProductModal = () => {
    setShowUpdateProductModal(false)
    setSelectedProduct(undefined)
  }

  const handleShowUpdateProductModal = () => {
    setIsError({
      error: false,
      message: '',
    })
    setShowUpdateProductModal(true)
  }

  // const [showAddProductModal, setShowAddProductModal] = React.useState<boolean>(false)

  // const handleCloseAddProductModal = () => {
  //   setShowAddProductModal(false)
  // }
  //Bloquer : Ajout produit à une commande existante
  // const handleShowAddProductModal = () => {
  //   setShowAddProductModal(true)
  //   setSelectedProduct({})
  // }

  React.useEffect(() => {
    if (selectedProduct && selectedProduct?.detail_codeSH?.length > 2) {
      _getNomenclature(
        dataStore?.access_token,
        selectedProduct?.detail_codeSH,
        setFilteredCodeSh
      )
    }
    if (selectedProduct?.detail_codeSH?.length === 0) {
      setFilteredCodeSh([])
    }
  }, [selectedProduct?.detail_codeSH, codeSH])

  React.useEffect(() => {
    setSortedProductByCodeSH(selectedOrder?.items)
  }, [selectedOrder])

  //Editer une ligne de commande
  const handleSaveProductUpdates = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    console.log(form.checkValidity())
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      const orderData = {
        detail_nbColis: selectedProduct?.detail_nbColis,
        detail_contenant: selectedProduct?.detail_contenant,
        detail_description: selectedProduct?.detail_description,
        detail_codeSH: selectedProduct?.detail_codeSH,
        detail_codeTarif: selectedProduct?.detail_codeTarif,
        detail_stockage: selectedProduct?.detail_stockage,
        detail_poids: selectedProduct?.detail_poids,
        detail_referenceExterne: selectedProduct?.detail_referenceExterne,
      }
      // Tableau d'origine
      const updatedProducts = selectedOrder.items.map((product: OrderDetailType) => {
        // Si l'ID du produit correspond à celui sélectionné, on le met à jour
        if (product?.detail_referenceExterne === selectedProduct?.detail_referenceExterne) {
          return {
            ...product,
            detail_nbColis: selectedProduct?.detail_nbColis,
            detail_contenant: selectedProduct?.detail_contenant,
            detail_description: selectedProduct?.detail_description,
            detail_codeSH: selectedProduct?.detail_codeSH,
            detail_codeTarif: selectedProduct?.detail_codeTarif,
            detail_stockage: selectedProduct?.detail_stockage,
            detail_poids: selectedProduct?.detail_poids,
            detail_referenceExterne: selectedProduct?.detail_referenceExterne, // On applique les changements
          }
        }
        return product // On retourne les autres produits inchangés
      })
      try {
        // Mise à jour de l'état selectedOrder avec les produits mis à jour
        // setSelectedOrder((prevOrder: any) => ({
        //   ...prevOrder,
        //   items: updatedProducts,
        // }))

        const updatedOrder = dataOrder?.map((order: OrderType) => {
          if (order.id === selectedOrder?.id) {
            return {
              ...order,
              items: updatedProducts,
            }
          }
          return order
        })

        // setDataOrder(updatedOrder)

        //Applique les changement en base de donnée
        if (selectedProduct) {
          _handleUpdateProduct(
            dataStore?.token,
            orderData,
            selectedProduct.id,
            setIsError,
            handleCloseUpdateProductModal,
            setSelectedOrder,
            updatedProducts,
            setDataOrder,
            updatedOrder
          )
          setOrdersForConnaissement([])
        }
      } catch (error) {
        console.log(error)
      }
      // _getOrdersData2(dataStore?.token,
      //   currentPage,
      //   setDataOrder,
      //   setTotalPages,
      //   setIsLoading,
      //   setErrorOrderMessage)
      // Fermer le modal
    }
  }

  //Ajouter un produit à une commande existante
  // const handleSaveProductAdd = (e: React.ChangeEvent) => {
  //   e.preventDefault()
  //   const orderData = {
  //     id_order: selectedOrder?.id,
  //     detail_nbColis: selectedProduct?.detail_nbColis,
  //     detail_contenant: selectedProduct?.detail_contenant,
  //     detail_description: selectedProduct?.detail_description,
  //     detail_codeSH: selectedProduct?.detail_codeSH,
  //     detail_codeTarif: selectedProduct?.detail_codeTarif,
  //     detail_stockage: selectedProduct?.detail_stockage,
  //     detail_poids: selectedProduct?.detail_poids,
  //     detail_unitePoids: 'KILO',
  //     detail_referenceExterne: selectedProduct?.detail_referenceExterne,
  //   }

  //   const newTab = [...selectedOrder.items, orderData]

  //   setSelectedOrder((prevOrder) => ({
  //     ...prevOrder,
  //     items: newTab as OrderDetailType[],
  //   }))

  //   _handleAddproduct(dataStore?.token, orderData)
  //   handleCloseAddProductModal()
  // }

  //Fitrer detail produit

  const handlefilteredProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    const updatedFilteringData = {
      ...filteringData,
      [name]: value,
    }
    setFilteringData(updatedFilteringData)
    debouncedFilter(updatedFilteringData)
  }

  const debouncedFilter = 
  debounce((updatedFilteringData: OrderDetailType) => {
    filteredProduct(dataStore.token, updatedFilteringData, selectedOrder?.id)
  }
  , 500) // 300ms delay

  const filteredProduct = async (
    token: string | null,
    filteringData: OrderDetailType,
    id: number | null
  ) => {
    const isEmpty =
      filteringData?.detail_codeSH === '' &&
      filteringData?.detail_contenant === '' &&
      filteringData?.detail_codeTarif === undefined &&
      filteringData?.detail_description === '' &&
      filteringData?.detail_nbColis === null &&
      filteringData?.detail_poids === null &&
      filteringData?.detail_referenceExterne === '' &&
      filteringData?.detail_stockage === undefined &&
      filteringData?.detail_unitePoids === undefined &&
      filteringData?.id === null &&
      filteringData?.id_order === null
    try {
      const response = await OrdersService.filteredItem(token, filteringData, id)
      console.log(response)
      if (response.data.data.length > 0 && !isEmpty) {
        const dataz = response.data.data?.filter((prod: OrderDetailType) => {
          return (
            prod.detail_codeSH,
            prod.detail_contenant,
            prod.detail_codeTarif,
            prod.detail_description,
            prod.detail_nbColis,
            prod.detail_poids,
            prod.detail_referenceExterne,
            prod.detail_stockage,
            prod.detail_unitePoids,
            prod.id,
            prod.id_order
          )
        })
        setSortedProductByCodeSH(dataz)
      } else {
        setSortedProductByCodeSH(
          selectedOrder?.items
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const tableHeadDetailProps = { sortConfig, setSortConfig, selectedOrder, setSelectedOrder }
  const tableFilterDetailProps = { filteringData, handlefilteredProduct }
  const tableBodyDetailProps = {
    sortedProductByCodeSH,
    selectedOrder,
    setSelectedProduct,
    handleShowUpdateProductModal,
    setInfoOrder,
    toggleShowInfo,
  }
  // const addProductModalProps = {
  //   selectedProduct,
  //   setSelectedProduct,
  //   showAddProductModal,
  //   handleCloseAddProductModal,
  //   handleSaveProductAdd,
  //   stockageData,
  // }
  const updateProductProps = {
    selectedProduct,
    setSelectedProduct,
    showUpdateProductModal,
    handleCloseUpdateProductModal,
    validated,
    setValidated,
    handleSaveProductUpdates,
    filteredCodeSh,
    setFilteredCodeSh,
    isError,
  }

  return (
    <>
      <Modal
        size='xl'
        show={show}
        onHide={() => {
          handleClose()
          setSortConfig(null)
        }}
        className='px-0'
      >
        <HeaderDetail {...selectedOrder} />
        <Modal.Body>
          <Container fluid>
            <Table striped hover responsive className='border '>
              <TableHeadDetail tableHeadDetailProps={tableHeadDetailProps} />
              <TableFilterDetail tableFilterDetailProps={tableFilterDetailProps} />
              <TableBodyDetail tableBodyDetailProps={tableBodyDetailProps} />
            </Table>
          </Container>
        </Modal.Body>
        <Modal.Footer className='sticky-bottom border-0'>
          <Button
            variant='secondary'
            onClick={() => {
              handleClose()
              setSortConfig(null)
              setFilteringData({
                detail_description: '',
                detail_contenant: '',
                detail_nbColis: null,
                detail_referenceExterne: '',
                detail_poids: null,
                detail_stockage: undefined,
                detail_codeTarif: undefined,
                detail_codeSH: '',
              })
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Product Modal bloqué*/}
      {/* <AddProductModal addProductModalProps={addProductModalProps} /> */}
      {/* Update product Modal */}
      <UpdateProductModal updateProductProps={updateProductProps} />
    </>
  )
}

// Display notification list
export function NotificationModal({notificationProps}: {notificationProps: NotificationModalType}) {
  const {
    showNotifModal,
    handleCloseNotifModal,
    notifications,
    setNotifications,
    filteringData,
    setFilteringData,
    setIsNotification,
  } = notificationProps
  const dataStore = userStore((state: UserState) => state)
  const [toastData, setToastData] = React.useState<{
    bg: string
    message: string
    icon: string
  }>({
    bg: '',
    message: '',
    icon: '',
  })

  const [showAll, setShowAll] = React.useState<boolean>(false)
  const toggleShowAll = () => setShowAll(!showAll)

  const toastAllProps = { showAll, toggleShowAll, toastData }

  return (
    <>
      <Modal
        size='lg'
        show={showNotifModal}
        onHide={handleCloseNotifModal}
        backdrop='static'
        keyboard={false}
      >
        <Container fluid className='sticky-top border-bottom-1 p-0 me-0 pb-2 rounded-top'>
          <Modal.Header className='bg-light border-0 me-0'>
            <Modal.Title>
              <i
                className='ri-arrow-left-line button-primary rounded-circle p-2 me-2'
                onClick={handleCloseNotifModal}
              ></i>
              <i className={`ri-notification-2-line fs-4 text-danger `}></i> Notifications
            </Modal.Title>
          </Modal.Header>
          <Container className='bg-light responsive-font-small d-sm-block d-none px-4 pb-3 border-bottom'>
            <Row className='responsive-font-small'>
              <Col xs={2} sm={2} md={2} className='m-auto pe-0'>
                <b>N° de voyage</b>
              </Col>
              <Col xs={2} sm={2} md={2} className='m-auto '>
                <b>Navire</b>
              </Col>
              <Col xs={4} sm={4} md={3} className='m-auto px-0 text-center'>
                <b>Statut</b>
              </Col>
              <Col xs={2} sm={2} md={3} className='m-auto pe-0'>
                <b>Client</b>
              </Col>
              <Col xs={2} sm={2} md={2} className='m-auto px-0 text-center'>
                <b>Action</b>
              </Col>
            </Row>
          </Container>
        </Container>

        <Modal.Body>
          {notifications?.length === 0 ? (
            <div className='text-center'>Aucune notification</div>
          ) : (
            <>
              {notifications?.map((notif: NotificationType, indx: number) => (
                <Card key={indx} className='p-2 mb-3  pointer responsive-font-small'>
                  <Row className='w-100 gx-0'>
                    <Col xs={12} className='m-auto d-block d-sm-none text-center'>
                      <b>{notif?.destinataire}</b>
                    </Col>
                    <Col xs={6} sm={2} md={2} className='m-auto pe-0'>
                      <b>{notif?.num_voyage}</b>
                    </Col>
                    <Col xs={6} sm={2} md={2} className='m-auto text-end text-sm-start'>
                      <b>{notif?.navire}</b>
                    </Col>
                    <Col xs={12} sm={4} md={3} className='m-md-auto pe-0 mb-2'>
                      <Row className=' w-100 gx-0 text-center '>
                        <Col xs={12} className=' m-auto pe-0'>
                          <Tag
                            className={`responsive-font-small ${
                              notif?.etat === 'EMBARQUE' && 'bg-success'
                            }`}
                            size='sm'
                            color={_tagStatus(notif?.etat)}
                          >
                            {notif?.etat}
                          </Tag>
                        </Col>

                        <Col xs={12} className=' m-auto pe-0'>
                          {notif?.motif}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={2} sm={2} md={3} className='m-auto d-sm-block d-none'>
                      <b>{notif?.destinataire}</b>
                    </Col>
                    <Col xs={12} sm={2} md={2} className='m-auto text-center'>
                      <Button
                        size='sm'
                        variant='transparent'
                        className='button-primary'
                        onClick={() => {
                          handleCloseNotifModal()
                          setFilteringData({
                            ...filteringData,
                            numeroConnaissement: notif?.num_voyage,
                          })
                          setIsNotification(true)
                          _patchNotification(
                            dataStore?.token,
                            notif?.id,
                            setNotifications,
                            setToastData,
                            toggleShowAll
                          )
                        }}
                      >
                        <Link to='/connaissements' className='text-decoration-none text-white'>
                          Voir
                        </Link>
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </>
          )}
        </Modal.Body>
        {/* <Modal.Footer className='sticky-bottom border-0'>
          <Button
            variant='transparent'
            className='button-secondary'
            onClick={handleCloseNotifModal}
          >
            Fermer
          </Button>
        </Modal.Footer> */}
      </Modal>
      <ToastAll toastAllProps={toastAllProps} />
    </>
  )
}
