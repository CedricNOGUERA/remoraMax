import { Modal, Container, Button, Row, Col, Form, Overlay, Popover, Spinner } from 'react-bootstrap'
import userStore, { CompanyStoreType, UserState } from '../../../stores/userStore'
import OrdersService from '../../../services/orders/OrdersService'
import React from 'react'
import { Tag } from 'rsuite'
import {
  _colisTotal,
  _tagStatus,
  _tempStockageColor,
  _transformDataToNested,
} from '../../../utils/functions'
import { QRCode } from 'antd'
import ConnaissementServices from '../../../services/connaissements/ConnaissementServices'
import OrderForEdit from '../../../pages/private/OrderForEdit'
import { filteringDataType } from '../../../definitions/ComponentType'
import { OrderType } from '../../../definitions/OrderType'
import { useReactToPrint } from 'react-to-print'
import { ConnaissementResponseConfigType, ResponseConnaissementDataType, ResultConnaissementType } from '../../../definitions/ConnaissementType'
import { _getOrdersByOneIdBill, _resetOrderInDb } from '../../../utils/api/totaraApi'
import { ToastDeleteError } from '../Toast/Toastes'
import { usePDF, Margin } from 'react-to-pdf'
import { _getPDFConnaissementByEvenement } from '../../../utils/api/apiControlerFunctions'
import PdfViewer from '../../pdf/PdfViewer'
import HeaderDetail from '../../billOfLading/detail/HeaderDetail'
import TableDetail from '../../billOfLading/detail/TableDetail'
import PrintFooterDetail from '../../billOfLading/detail/PrintFooterDetail'
import FooterDetail from '../../billOfLading/detail/FooterDetail'
import { errorType } from '../../../definitions/errorType'
import { AxiosError, AxiosResponse } from 'axios'

interface DetailConnaissementModalType {
  showDetailConnaiss: boolean
  selectedConnaissement: ResultConnaissementType
  // selectedConnaissement: any
  handleCloseDetailConnaiss: () => void
  handlePrint: () => void
  printRef: React.MutableRefObject<null>
}

interface DeleteModalType {
  showDeleteModal: boolean
  handleCloseDeleteModal: () => void
  selectedConnaissement: ResultConnaissementType
  deleteBrouillonConnaissement: (access_token: string, id: number) => void
  idsOrder: number[]
  setIsError: React.Dispatch<React.SetStateAction<errorType>>
  toggleShowOrderError: () => void
  setShowOrderError: React.Dispatch<React.SetStateAction<boolean>>
}

// Display bill of lading (connaissement) detail
export function DetailConnaissementModal({ detailOrderModalProps }: {detailOrderModalProps: DetailConnaissementModalType}) {

  const {
    showDetailConnaiss,
    selectedConnaissement,
    handleCloseDetailConnaiss,
    handlePrint,
    printRef,
  } = detailOrderModalProps

  const dataStore = userStore((state: UserState) => state)

  const [pdfData, setPdfData] = React.useState<string | undefined>("")

  const { toPDF, targetRef } = usePDF({
    method: 'save',
    filename: `${
      selectedConnaissement?.dernierEtat?.evenementConnaissement !== 'OFFICIALISE' && 'Aperçu-'
    }${
      selectedConnaissement?.numero ? selectedConnaissement?.numero : selectedConnaissement?.id
    }.pdf`,
    page: { margin: Margin.MEDIUM },
  })

  

    const isPdfable = 
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'TRANSFERE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'MODIFIE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'EMBARQUEMENT_REFUSE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'ANNULE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'PRIS_EN_CHARGE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'OFFICIALISE_SOUS_RESERVE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'EMBARQUE' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'OFFICIALISE'

  React.useEffect(() => {

    const companyToken = dataStore?.company?.filter(
      (company: CompanyStoreType) => company?.name === selectedConnaissement?.expediteur?.denomination
    )[0]

    const pdfToken = companyToken !== undefined ? companyToken?.access_token : dataStore.access_token

    if (isPdfable && showDetailConnaiss) {
      _getPDFConnaissementByEvenement(
        pdfToken,
        selectedConnaissement?.id,
        selectedConnaissement?.dernierEtat?.id,
        setPdfData
      )
    }
    return () => {
      if (pdfData) URL.revokeObjectURL(pdfData);
    };
  }, [selectedConnaissement?.id, selectedConnaissement?.dernierEtat?.evenementConnaissement]);

  const footerDetailProps = {selectedConnaissement, toPDF, setPdfData, handlePrint, handleCloseDetailConnaiss}

    return (
    <Modal
      size='lg'
      fullscreen='lg-down'
      show={showDetailConnaiss}
      onHide={handleCloseDetailConnaiss}
      className='px-0'
    >
      <Modal.Body
        ref={printRef}
        className={`p-1 p-sm-4 text-center border-bottom-0 pdf-container ${
          !isPdfable
          // selectedConnaissement?.dernierEtat?.evenementConnaissement !== 'OFFICIALISE'
            ? 'printer'
            : ''
        }`}
      >
        <div
          ref={targetRef}
          className={` ${
            // selectedConnaissement?.dernierEtat?.evenementConnaissement !== 'OFFICIALISE'
            !isPdfable
              ? 'pdf-bg'
              : ''
          }`}
        >
          {(pdfData &&
          isPdfable) ? (
            <>
              <PdfViewer pdfUrl={pdfData} />
            </>
          ) : (
            <>
              <HeaderDetail selectedConnaissement={selectedConnaissement} />

              <TableDetail selectedConnaissement={selectedConnaissement} />

              <PrintFooterDetail selectedConnaissement={selectedConnaissement} />
            </>
          )}
        </div>
      </Modal.Body>
      <FooterDetail footerDetailProps={footerDetailProps} />
    </Modal>
  )
}

export function DeleteModal({ deleteBillOfLadingProps }: { deleteBillOfLadingProps: DeleteModalType }) {
  const {
    showDeleteModal,
    handleCloseDeleteModal,
    selectedConnaissement,
    deleteBrouillonConnaissement,
    idsOrder,
    setIsError,
    toggleShowOrderError,
    setShowOrderError,
  } = deleteBillOfLadingProps

  const dataStore = userStore((state: UserState) => state)

  const isDeletable =
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'BROUILLON' ||
    selectedConnaissement?.dernierEtat?.evenementConnaissement === 'DEMANDE_REFUSEE'

    const [isClickable, setIsClickable] = React.useState<boolean>(true);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteError, setShowDeleteError] = React.useState<boolean>(false)
    const toggleShowDeleteError = () => setShowDeleteError(!showDeleteError)

  React.useEffect(() => {
    if (showDeleteModal) {
      // Get orders id from selected connaissement id
      _getOrdersByOneIdBill(selectedConnaissement?.id, idsOrder, toggleShowOrderError, dataStore, setIsError, setIsLoading, 
        setIsClickable

      )
    }
  }, [showDeleteModal])


  const handleDeleteOrder = async (token: string | null) => {

    try {
      //update order in db to 'A_PLANIFIER' status
      _resetOrderInDb(token, idsOrder, toggleShowOrderError, setIsError, setShowOrderError)


    if(isDeletable){
      //delete connaissement
      deleteBrouillonConnaissement(dataStore.access_token, selectedConnaissement?.id)

    }else{
      //if the bill of lading can be deleted, we send an informative message which says: This bill of lading cannot be deleted, but these orders have been reset
      handleCloseDeleteModal()
      toggleShowDeleteError()
    }
    } catch (error) {
      console.log(error)
    }
  }
  //Error props
  const toastDeleteErrorProps = {showDeleteError, toggleShowDeleteError}

  return (
    <>
      <Modal size='lg' show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header className='border border-3 border-danger border-bottom-0'>
          <Modal.Title>Supprimer le connaissement</Modal.Title>
        </Modal.Header>

        <Modal.Body className='border border-3 border-danger border-bottom-0 border-top-0'>
          <Container fluid>
            &Ecirc;tes vous sur de vouloir supprimer le connaissement{' '}
            <b>
              N°{' '}
              {selectedConnaissement?.numero
                ? selectedConnaissement?.numero
                : selectedConnaissement?.id}
            </b>{' '}
            ?
          </Container>
        </Modal.Body>
        <Modal.Footer className='border border-3 border-danger border-top-0'>
          <Button className='button-secondary' variant='transparent' onClick={handleCloseDeleteModal}>
            <i className='ri-close-circle-line me-2'></i> Annuler
          </Button>
          <Button
            variant='danger'
            onClick={() => handleDeleteOrder(dataStore.token)}
            disabled={isClickable}
          >
            {isLoading ? (
              <>
                <Spinner size='sm' /> <span>Loading ...</span>
              </>
            ) : (
              <>
                <i className='ri-delete-bin-2-line me-2'></i> <span>Valider</span>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastDeleteError toastDeleteErrorProps={toastDeleteErrorProps} />
    </>
  )
}

interface MultiDeleteModalType {
  showMultiDeleteModal: boolean
  handleCloseMultiDeleteModal: () => void
  checkedMultiConnaissement: ResultConnaissementType[]
  deleteBrouillonConnaissement: (access_token: string, id: number) => void
  idsOrder: number[]
  isError: errorType
  setIsError: React.Dispatch<React.SetStateAction<errorType>>
  toggleShowOrderError: () => void
    isMultiLoading: boolean
    setIsMultiLoading: React.Dispatch<React.SetStateAction<boolean>>
}
export function MultiDeleteModal({ multiDeleteBillOfLadingProps }: { multiDeleteBillOfLadingProps: MultiDeleteModalType }) {
  const {
    showMultiDeleteModal,
    handleCloseMultiDeleteModal,
    checkedMultiConnaissement,
    deleteBrouillonConnaissement,
    idsOrder,
    isError,
    setIsError,
    toggleShowOrderError,
    isMultiLoading,
    setIsMultiLoading
  
  } = multiDeleteBillOfLadingProps
  const dataStore = userStore((state: UserState) => state)
  

  React.useEffect(() => {
    if (showMultiDeleteModal) {
      checkedMultiConnaissement?.map((bill: ResultConnaissementType) => getOrdersByOneIdBill(bill?.id))
    }
  }, [showMultiDeleteModal])

  const getOrdersByOneIdBill = (id: number) => {
    setIsError({
      error: false,
      message: '',
    })
    setIsMultiLoading(true)

    try {
      OrdersService.getOrdersByIdConnaissement(dataStore.token, id)
        .then((response: AxiosResponse<ResponseConnaissementDataType, ConnaissementResponseConfigType>) => {
          console.log(response)
          response?.data?.data?.map((order: ResultConnaissementType) => {
            return idsOrder.push(order.id)
          })
            setIsMultiLoading(false)
        })
        .catch((error: unknown) => {
          console.log(error)
          if(error instanceof AxiosError){

            setIsError({
              error: true,
              message: error?.response?.data?.message,
            })
            toggleShowOrderError()
            setIsMultiLoading(false)
          }
        })
    } catch (error) {
      console.log(error)
    }
  }


  const handleDeleteOrder = (token: string | null) => {
    setIsError({
      error: false,
      message: '',
    })
    const bodyData = {
      statut_revatua: 'A_PLANIFIER',
      numeroVoyage: null,
      id_connaissement: null,
    }

    try {
      //modification du status des factures => A_PLANIFIER
      const orderPromises = idsOrder?.map((id: number | null) =>
        OrdersService.updateOrder(token, bodyData, id).catch((error: unknown) => {
          if (error instanceof AxiosError) {
            console.log(error)
            setIsError({
              error: true,
              message: error?.response?.data?.message,
            })
            toggleShowOrderError()
          }
        })
      )
      console.log(orderPromises)
      // await Promise.all([
      //   ...(orderPromises || [])
      // ]);
      //suppression des connaissements
      checkedMultiConnaissement?.map((bill: ResultConnaissementType) =>
        deleteBrouillonConnaissement(dataStore.access_token, bill?.id)
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal size='lg' show={showMultiDeleteModal} onHide={handleCloseMultiDeleteModal}>
      <Modal.Header className='border border-3 border-danger border-bottom-0'>
        <Modal.Title>Supprimer le connaissement</Modal.Title>
      </Modal.Header>

      <Modal.Body className='border border-3 border-danger border-bottom-0 border-top-0'>
        <Container fluid>
          &Ecirc;tes vous sur de vouloir supprimer les connaissements{' '}
          {checkedMultiConnaissement?.map((bill: ResultConnaissementType, indx: number) => (
            <b key={bill?.id}>
              N° {bill?.id} {indx + 1 !== checkedMultiConnaissement?.length && ', '}
            </b>
          ))}
          ?
        </Container>
      </Modal.Body>
      <Modal.Footer className='border border-3 border-danger border-top-0'>
        <Button className='button-secondary' variant='secondary' onClick={handleCloseMultiDeleteModal}>
          <i className='ri-close-circle-line me-2'></i> Annuler
        </Button>
        <Button variant='danger' onClick={() => handleDeleteOrder(dataStore.token)}
           disabled={isError.error}>
           {isMultiLoading ? (
               <>
                 <Spinner size='sm' /> <span>Loading ...</span>
               </>
             ) : (
               <>
                 {/* <i className='ri-check-double-line me-2'></i> Valider */}
                 <i className='ri-delete-bin-2-line me-2'></i> Valider
               </>
             )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

interface UpdateMultiToDemandeModalType {
  showUpdateMultiToDemandeModal: boolean
  handleCloseUpdateMultiToDemandeModal: () => void
  checkedConnaissement: number[]
  setCheckedConnaissement: React.Dispatch<React.SetStateAction<number[]>>
  connaissementDataTable: (
    currentPage: number,
    setTotalPage: React.Dispatch<React.SetStateAction<number>>,
    itemPerPage: number,
    sort: string
  ) => void
  toggleShowUpdateSuccess: () => void
  isError: errorType
  setIsError: React.Dispatch<React.SetStateAction<errorType>>
  idsOrder: number[]
  setIdsOrder: React.Dispatch<React.SetStateAction<number[]>>
  currentPage: number
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
  itemPerPage: number
  sortConfig: string
  // isMultiClickable: boolean
  isMultiLoading: boolean
    

}
export function UpdateMultiToDemandeModal({ updateMultiToDemandeModalProps }: { updateMultiToDemandeModalProps: UpdateMultiToDemandeModalType }) {
  const {
    showUpdateMultiToDemandeModal,
    handleCloseUpdateMultiToDemandeModal,
    checkedConnaissement,
    setCheckedConnaissement,
    connaissementDataTable,
    toggleShowUpdateSuccess,
    isError,
    setIsError,
    idsOrder,
    setIdsOrder,
    currentPage,
    setTotalPages,
    itemPerPage,
    sortConfig,
    // isMultiClickable,
    isMultiLoading
  } = updateMultiToDemandeModalProps
  const dataStore = userStore((state: UserState) => state)
  const dataStoreConnaissement = userStore((state: UserState) => state)
  // const [isClickable, setIsClickable] = React.useState<boolean>(false);
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleUpdateMultiOrder = async () => {
    try {
      // Mise à jour des commandes
      updateOrderRemora(dataStore.token)

      // Mise à jour des connaissements
      updateConnaissRevatua()

      // Si tout a réussi
      connaissementDataTable(currentPage, setTotalPages, itemPerPage, sortConfig)
      toggleShowUpdateSuccess()
      handleCloseUpdateMultiToDemandeModal()
      setCheckedConnaissement([])
      setIsError({
        error: false,
        message: '',
      })
    } catch (error: unknown) {
      console.error(error)
      if(error instanceof AxiosError){
        setIsError({
          error: true,
          message: error?.response?.data?.message || "Une erreur s'est produite",
        })
      }
    }
  }

  const updateOrderRemora = async (token: string | null) => {
    const bodyData = {
      statut_revatua: 'DEMANDE',
    }
    // setIsLoading(true)
    try {
      const orderPromises = idsOrder?.map((id: number) =>
        OrdersService.updateOrder(token, bodyData, id).catch((error: unknown) => {
          if (error instanceof AxiosError) {
            console.log(error)
            setIsError({
              error: true,
              message: error?.response?.data?.message,
            })
          }
        })
      )

      await Promise.all([...(orderPromises || [])])
    } catch (error) {
      console.log(error)
    }
  }

  const updateConnaissRevatua = async () => {
    const bodyDataConnaissement = {
      evenementConnaissementEnum: 'DEMANDE',
      demandeParArmateur: false,
    }

    try {
      const connaissementPromises = checkedConnaissement?.map((id: number) =>
        ConnaissementServices.updateConnaissement(
          dataStoreConnaissement?.access_token,
          bodyDataConnaissement,
          id
        ).catch((error: unknown) => {
          if (error instanceof AxiosError) {
            console.log(error)
            setIsError({
              error: true,
              message: error?.response?.data?.message,
            })
          }
        })
      )

      await Promise.all([...(connaissementPromises || [])])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      size='lg'
      show={showUpdateMultiToDemandeModal}
      onHide={handleCloseUpdateMultiToDemandeModal}
    >
      <Modal.Header className=''>
        <Modal.Title>Valider plusieurs brouillons</Modal.Title>
      </Modal.Header>

      <Modal.Body className=''>
        <Container fluid>
          Voulez-vous valider ces brouillons de connaissement{' '}
          {checkedConnaissement?.map((id: number, indx: number) => (
            <b key={id}>
              N° {id} {indx + 1 !== checkedConnaissement?.length && ', '}
            </b>
          ))}
        </Container>
      </Modal.Body>
      <Modal.Footer className=''>
        <Button
          className='button-secondary'
          variant='secondary'
          onClick={() => {
            setIdsOrder([])
            setCheckedConnaissement([])
            handleCloseUpdateMultiToDemandeModal()
          }}
          
        >
          <i className='ri-close-circle-line me-2'></i> Annuler
        </Button>
        <Button className='button-primary' variant='success' onClick={() => handleUpdateMultiOrder()}
          disabled={isError.error}>
        {isMultiLoading ? (
            <>
              <Spinner size='sm' /> <span>Loading ...</span>
            </>
          ) : (
            <>
              <i className='ri-check-double-line me-2'></i> Valider
            </>
          )}
        
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

interface UpdateToDemandeModalType {
  showUpdateToDemandeModal: boolean
    handleCloseUpdateToDemandeModal: () => void
    selectedConnaissement: ResultConnaissementType
    updateBrouillonConnaissement: (token: string, id: number) => void
    idsOrder: number[]
    isError: errorType
    setIsError: React.Dispatch<React.SetStateAction<errorType>>
    toggleShowOrderError: () => void
}
export function UpdateToDemandeModal({ updateToDemandeModalProps }: { updateToDemandeModalProps: UpdateToDemandeModalType }) {
  const {
    showUpdateToDemandeModal,
    handleCloseUpdateToDemandeModal,
    selectedConnaissement,
    updateBrouillonConnaissement,
    idsOrder,
    isError,
    setIsError,
    toggleShowOrderError,
  } = updateToDemandeModalProps
  const dataStore = userStore((state: UserState) => state)

  const [isClickable, setIsClickable] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (showUpdateToDemandeModal) {
      // getOrderSByIDBill()
      _getOrdersByOneIdBill(selectedConnaissement?.id, idsOrder, toggleShowOrderError, dataStore, setIsError, setIsLoading
        , setIsClickable
      )

    }
  }, [showUpdateToDemandeModal])

 

  const handleUpdateOrder = (token: string | null) => {
    const bodyData = {
      statut_revatua: 'DEMANDE',
    }

    try {
      const orderPromises = idsOrder?.map((id: number) =>
        OrdersService.updateOrder(token, bodyData, id).catch((error: unknown) => {
          if (error instanceof AxiosError) {
            console.log(error)
          }
        })
      )
      console.log(orderPromises)
      // await Promise.all([
      //   ...(orderPromises || [])
      // ]);

      updateBrouillonConnaissement(dataStore.access_token, selectedConnaissement?.id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal size='lg' show={showUpdateToDemandeModal} onHide={handleCloseUpdateToDemandeModal}>
      <Modal.Header className=''>
        <Modal.Title>Validation du brouillon</Modal.Title>
      </Modal.Header>

      <Modal.Body className=''>
        <Container fluid>
          Voulez-vous valider le brouillon de connaissement{' '}
          <b>
            N°{' '}
            {selectedConnaissement?.numero
              ? selectedConnaissement?.numero
              : selectedConnaissement?.id}
          </b>{' '}
          ?
          <br />
          {selectedConnaissement?.destinataire?.denomination}
        </Container>
      </Modal.Body>
      <Modal.Footer className=''>
        <Button
          className='button-secondary'
          variant='transparent'
          onClick={handleCloseUpdateToDemandeModal}
        >
          <i className='ri-close-circle-line me-2'></i> Annuler
        </Button>
        <Button
          className='button-primary'
          variant='transparent'
          onClick={() => handleUpdateOrder(dataStore?.token)}
          disabled={isError?.error || isClickable}
        >
          {isLoading ? (
            <>
              <Spinner size='sm' /> <span>Loading ...</span>
            </>
          ) : (
            <>
              <i className='ri-check-line me-2'></i> <span>Valider</span>
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

interface QrcodeConnaissementModalType {
  showQrcode: boolean
  handleCloseQrcode: () => void
  selectedConnaissement: ResultConnaissementType
  // selectedConnaissement: ResultConnaissementType
}
export const QrcodeConnaissementModal = ({ qrCodeModalProps }: { qrCodeModalProps: QrcodeConnaissementModalType}) => {
  const { showQrcode, handleCloseQrcode, selectedConnaissement } = qrCodeModalProps
  const printRef = React.useRef(null)


  // Utiliser useReactToPrint pour gérer l'impression
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${selectedConnaissement?.numero}`, // Titre du document imprimé
  })
  return (
    <Modal show={showQrcode} onHide={handleCloseQrcode} className='px-0'>
      <Container fluid ref={printRef}>
        <Modal.Header>
          <Container fluid>
            <Row>
              <Col xs={0} md={2} className='m-auto text-start responsive-font-small'></Col>
              <Col xs={12} md={8} className='m-auto responsive-font-medium text-center'>
                <div>{selectedConnaissement?.voyage?.nomNavire}</div>
                <div className='font-75'>
                  {selectedConnaissement?.armateur !== null && (
                    <>
                      BP {selectedConnaissement?.armateur?.boitePostale}{' '}
                      {selectedConnaissement?.armateur?.commune?.codePostal}{' '}
                      {selectedConnaissement?.armateur?.commune?.nom} <strong>Tél : </strong>{' '}
                      {selectedConnaissement?.armateur?.telephone}
                    </>
                  )}
                </div>
              </Col>
              <Col
                xs={12}
                md={2}
                className='d-flex justify-content-center py-2 py-md-0  text-md-end responsive-font-small'
              ></Col>
            </Row>
            <Row>
              <Col xs={12} className='m-auto text-center responsive-font-medium mb-3'>
                <strong>{selectedConnaissement?.destinataire?.denomination}</strong>
              </Col>
            </Row>
            <Row className='responsive-font-small mb-3'>
              <Col xs={12} className='m-auto responsive-font-medium text-center mb-3'>
                <Tag
                  className='responsive-font-small'
                  size='sm'
                  color={_tagStatus(
                    selectedConnaissement?.dernierEtat?.evenementConnaissement
                  )}
                >
                  {selectedConnaissement?.dernierEtat?.evenementConnaissement}
                </Tag>
              </Col>
              <Col xs={6} className='m-auto text-start responsive-font-small font-75'>
                <strong>Date</strong> :{' '}
                {new Date(selectedConnaissement?.voyage?.dateDepart).toLocaleDateString(
                  'fr-FR',
                  {
                    timeZone: 'UTC',
                  }
                )}{' '}
                {selectedConnaissement?.voyage?.heureDepart?.hour && (
                  <span>
                    {selectedConnaissement?.voyage?.heureDepart?.hour} :{' '}
                    {selectedConnaissement?.voyage?.heureDepart?.minute}
                  </span>
                )}
              </Col>
              <Col xs={6} className='m-auto text-end responsive-font-small  font-75'>
                <strong>N°Connaiss...</strong> : {selectedConnaissement?.numero}
              </Col>
              {selectedConnaissement?.dernierEtat?.motif && (
                <Col
                  xs={12}
                  className='m-auto text-center responsive-font-small font-85  mb-3'
                >
                  <strong>Motif</strong> : {selectedConnaissement?.dernierEtat?.motif}
                </Col>
              )}
              <Col xs={6} className='m-auto text-start responsive-font-small font-85'>
                <strong>N° Facture</strong> : {selectedConnaissement?.referenceHorsRevatua}
              </Col>
              <Col xs={6} className='m-auto text-end responsive-font-small font-85'>
                {selectedConnaissement.nombreColisAEmbarquer &&  selectedConnaissement?.nombreColisAEmbarquer > 0 ? (
                  <>
                    <strong>Nb suremballages</strong> :{' '}
                    {selectedConnaissement?.nombreColisAEmbarquer}
                  </>
                ) : (
                  <>
                    <strong>Nb de colis</strong> : {_colisTotal(selectedConnaissement)}
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column align-items-center justify-content-center text-remora-primary'>
          <div>Ce Qrcode est destiné à l'armateur</div>
          <div>
            {selectedConnaissement?.numero !== null && (
              <QRCode
                value={selectedConnaissement?.numero}
                size={320}
                bordered={true}
                bgColor={'#ffffff'}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className='print-button'>
          <Button
            variant='transparante'
            className='d-flex bg-remora-primary '
            onClick={() => handlePrint}
          >
            <i className='ri-printer-line  text-light'></i>
            <span className='d-none d-sm-block text-light  ms-2'>Imprimer</span>
          </Button>
          <Button
            className='w-1 bg-remora-secondary'
            variant='transparante'
            onClick={handleCloseQrcode}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Container>
    </Modal>
  )
}

interface NbPaletteModalType {
  showUpdatePalette: boolean
  handleCloseUpdatePalette: () => void
  selectedConnaissement: ResultConnaissementType
  setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>
  setConnaissementData: React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>
  connaissementData: ResultConnaissementType[]
  setNbPalette: React.Dispatch<React.SetStateAction<number>>
  updateNbPaletteConnaissement: (token: string, data: ResultConnaissementType) => void
}
export const NbPaletteModal = ({ updatePaletteModalProps }: { updatePaletteModalProps: NbPaletteModalType }) => {
  const {
    showUpdatePalette,
    handleCloseUpdatePalette,
    selectedConnaissement,
    setSelectedConnaissement,
    setConnaissementData,
    connaissementData,
    setNbPalette,
    updateNbPaletteConnaissement,
  } = updatePaletteModalProps

  const dataStore = userStore((state: UserState) => state)

  return (
    <Modal show={showUpdatePalette} onHide={handleCloseUpdatePalette}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le nombre de suremballages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {' '}
        <Form.Group className='mb-3 px-2'>
          <Form.Label className='d-flex'> Nombre de suremballages</Form.Label>
          <Form.Control
            id='nombrePalette'
            name='nombrePalette'
            type='number'
            placeholder='Saisissez un nombre'
            style={{ width: 'auto' }}
            value={selectedConnaissement?.nombreColisAEmbarquer || 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const nb = parseInt(e.currentTarget.value)
              setSelectedConnaissement({
                ...selectedConnaissement,
                nombreColisAEmbarquer: nb,
              })

              const order = connaissementData?.map((order: ResultConnaissementType) => {
                if (order.id === selectedConnaissement?.id) {
                  return {
                    ...order,
                    nombreColisAEmbarquer: nb,
                  }
                }
                return order
              })
              setConnaissementData(order)
              setNbPalette(nb)
            }}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className="button-secondary" variant='transparent' onClick={handleCloseUpdatePalette}>
        <i className='ri-close-circle-line me-2'></i> Annuler
        </Button>
        <Button className="button-primary"
          variant='transparent'
          onClick={() =>
            updateNbPaletteConnaissement(dataStore.access_token, selectedConnaissement)
          }
        >
           <i className='ri-check-line me-2'></i> Valider
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

interface EditConnaissementModalType {
 showUpdate: boolean
    handleCloseUpdate: () => void
    selectedConnaissement: ResultConnaissementType
    setIsError: React.Dispatch<React.SetStateAction<errorType>>
    toggleShowOrderError: () => void
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}
export const EditConnaissementModal = ({ editConnaissementModal }: { editConnaissementModal: EditConnaissementModalType }) => {
  const {
    showUpdate,
    handleCloseUpdate,
    selectedConnaissement,
    setIsError,
    toggleShowOrderError,
    setIsEdit,
  } = editConnaissementModal
  const dataStore = userStore((state: UserState) => state)
  const [dataOrder, setDataOrder] = React.useState<OrderType[]>([])

  const [versionBill, setVersionBill] = React.useState<string>('')
  const [orderInConnaiss, setOrderInConnaiss] = React.useState<OrderType[]>([])
  const [ordersForConnaissement, setOrdersForConnaissement] = React.useState<OrderType[]>([])
  const [selectedOrder, setSelectedOrder] = React.useState<OrderType>({} as OrderType)

  const [filteringData, setFilteringData] = React.useState<filteringDataType>({
    date_facture: '',
    referenceHorsRevatua: '',
    destinataire_denomination: '',
    numeroVoyage: '',
    statut_revatua: '',
    bateau: '',
    ileArrivee: '',
    stockage: '',
  })

  ////////////////////
  //pop over
  //////////////

  const [showInfoPop, setShowInfoPop] = React.useState(false)
  const refInfoPop = React.useRef(null)

  const [showInfoPopOrders, setShowInfoPopOrders] = React.useState(false)


  /////////////////////
  //Modals
  ////////////////////

  //order detail
  const [show, setShow] = React.useState(false)

  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => setShow(true)
  // console.log(versionBill)

  React.useEffect(() => {
    if (showUpdate) {
      getOrdersByOneIdBill(selectedConnaissement?.id)
      setVersionBill(selectedConnaissement?.version)
   
    const isFirstLogin = localStorage.getItem('firstLogin') === null
    const isFirstOrderInfo = localStorage.getItem('firstLogin')

    if (isFirstLogin || !isFirstOrderInfo) {
      setShowInfoPop(true) // Afficher l'Overlay
      localStorage.setItem('firstLogin', 'false') // Mettre à jour localStorage
    }

    const isFirstLoginOrders = localStorage.getItem('infoOrder') === null
    const isFirsOrders = localStorage.getItem('infoOrder')
    if (isFirstLoginOrders || !isFirsOrders ) {
      setShowInfoPopOrders(true) // Afficher l'Overlay
      localStorage.setItem('infoOrder', 'false') // Mettre à jour localStorage
    }
  }
  }, [showUpdate, showInfoPop, showInfoPopOrders])

  React.useEffect(() => {
    setFilteringData({
      date_facture: '',
      referenceHorsRevatua: '',
      destinataire_denomination: orderInConnaiss?.[0]?.destinataire?.denomination,
      numeroVoyage: '',
      statut_revatua: 'A_PLANIFIER',
      bateau: '',
      ileArrivee: '',
      stockage: '',
    })
    if (orderInConnaiss) {
      setOrdersForConnaissement(orderInConnaiss)
    }
  }, [orderInConnaiss])

  const handleSelectOrders = (order: OrderType) => {
    setOrdersForConnaissement((prevOrders: OrderType[]) => {
      if (prevOrders.includes(order)) {
        return prevOrders.filter((item) => item !== order)
      } else {
        return [...prevOrders, order]
      }
    })
  }

  const getOrdersByOneIdBill = (id: number) => {
    setIsError({
      error: false,
      message: '',
    })

    try {
      OrdersService.getOrdersByIdConnaissement(dataStore.token, id)
        .then((response) => {
          setOrderInConnaiss(_transformDataToNested(response?.data?.data))
        })
        .catch((error: unknown) => {
          if(error instanceof AxiosError)
          setIsError({
            error: true,
            message: error?.response?.data?.message,
          })
          toggleShowOrderError()
        })
    } catch (error) {
      console.log(error)
    }
  }

  const clearData = () => {
    handleCloseUpdate()
    setOrderInConnaiss([])
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
    setDataOrder([])
    setOrdersForConnaissement([])
  }

  const handleCloseInfoPop = () => {
    setShowInfoPop(false) // Masquer l'Overlay
    localStorage.setItem('firstLogin', 'true') // Mettre à jour localStorage
  }

  const orderForEditProps = {
    showUpdate,
    orderInConnaiss,
    filteringData,
    setFilteringData,
    dataOrder,
    setDataOrder,
    ordersForConnaissement,
    setOrdersForConnaissement,
    show,
    handleClose,
    handleShow,
    selectedOrder,
    setSelectedOrder,
    versionBill,
    handleCloseUpdate,
    setIsEdit,
    selectedConnaissement,
    showInfoPopOrders, setShowInfoPopOrders,
  }



  return (
    <Modal fullscreen show={showUpdate} onHide={handleCloseUpdate}>
      <Modal.Header>
        <Modal.Title><i className='ri-arrow-left-line button-primary rounded-circle p-2' onClick={clearData}></i> Editer un connaissement</Modal.Title>
      </Modal.Header>
      <Modal.Body className='pt-0'>
        <Row>
          <Col sm={12} md={3} className='pt-3 ps-1 pe-2 h-100-prcnt'>
            <Container>
              <b className='text-remora-primary'>
                <u>
                  Facture(s) actuelle(s) du connaissement <br />
                </u>
              </b>
            </Container>
            <Container>
              <div>Navire d'origine : {orderInConnaiss?.[0]?.navire}</div>
              <div>Numero voyage : {orderInConnaiss?.[0]?.numeroVoyage}</div>

              <div>
                {orderInConnaiss?.map((order: OrderType, indx: number) => (
                  <div key={indx}>
                    <Row
                      className={`order-in-billoflading ${_tempStockageColor(
                        order?.stockage
                      )}`}
                    >
                      <Col xs={2} className='pointer font-85 py-2 pe-0 ' ref={refInfoPop}>
                        <Form.Check
                          id={`${order.id}`}
                          onChange={() => {
                            handleSelectOrders(order)
                          }}
                          checked={
                            ordersForConnaissement && ordersForConnaissement?.includes(order)
                          }
                          value={order?.referenceHorsRevatua}
                        />
                        <Overlay
                          show={showInfoPop}
                          target={refInfoPop?.current}
                          placement='bottom-start'
                          container={refInfoPop}
                          containerPadding={20}
                        >
                          <Popover id='popover-contained'>
                            {/* <Popover.Header as='h3'>Popover bottom</Popover.Header> */}
                            <Popover.Body>
                              En décochant une facture, celle-ci sera <b>retirée</b> du
                              connaissement lors de la validation de la modification.
                              <br />
                              <b>Attention</b> : Un connaissement doit contenir au moins une
                              facture
                              <Button variant='primary' size='sm' onClick={handleCloseInfoPop}>
                                OK, compris !
                              </Button>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
                      </Col>
                      <Col
                        onClick={() => {
                          setSelectedOrder(order)
                          handleShow()
                        }}
                        className='pointer font-75 py-2'
                      >
                        {order.referenceHorsRevatua} {order?.destinataire?.denomination}{' '}
                        <i className='ri-eye-line ms-1 '></i>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </Container>
          </Col>
          <Col className='pt-3 px-0 border-0 border-start'>
            <div className='text-remora-secondary px-1 px-sm-2 px-lg-3 mb-2'>
              <b>
                <u>Facture(s) à ajouter</u>
              </b>
            </div>
            <OrderForEdit orderForEditProps={orderForEditProps} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

interface PrintMultiConnaissementType {
showMultiPrintModal: boolean
    handleCloseMultiPrintModal: () => void
    printRef: React.MutableRefObject<null>
    pdfData: string | undefined
}
//Multi Print 
export const PrintMultiConnaissement = ({ printMultiConnaissementProps }: { printMultiConnaissementProps: PrintMultiConnaissementType }) => {
  const {
    showMultiPrintModal,
    handleCloseMultiPrintModal,
    printRef,
    pdfData,
  } = printMultiConnaissementProps
 
  return (
    <Modal
      size='lg'
      fullscreen='lg-down'
      show={showMultiPrintModal}
      onHide={handleCloseMultiPrintModal}
      className='px-0'
    >
      <Modal.Body
        ref={printRef}
        className={`p-1 p-sm-4 text-center border-bottom-0 pdf-container-multi`}
      >
        <PdfViewer pdfUrl={pdfData} />
      </Modal.Body>
      <Modal.Footer className='fixed-bottom border-0'>
        <Button
          className=' button-secondary'
          variant='transparent'
          onClick={handleCloseMultiPrintModal}
        >
          <i className='ri-close-fill'></i> Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
