import { WarningTwoTone } from '@ant-design/icons'
import { Col, Container, Row } from 'react-bootstrap'
import { _colorMyText, _numeroFacture } from '../../utils/functions'
import {  DetailType, ResultConnaissementType } from '../../definitions/ConnaissementType'

interface ItemTransporterType {
  connaissement: ResultConnaissementType
  setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>
  handleShowDetailConnaiss: () => void
  borderColor: string
  handleShowQrcode: () => void
}


export default function ItemTransporter({ itemTransporterProps }: {itemTransporterProps: ItemTransporterType}) {
  const {
    connaissement,
    setSelectedConnaissement,
    handleShowDetailConnaiss,
    borderColor,
    handleShowQrcode,
  } = itemTransporterProps

  const isDangerous = connaissement.detailConnaissements?.some(
    (detail: DetailType) => detail.matiereDangereuse === true
  )
  const isFragile = connaissement.detailConnaissements?.some(
    (detail: DetailType) => detail.fragile === true
  )
  
  return (
    <Container fluid className={`border-${borderColor}-2 rounded-4 mb-2 py-3 px-2`}>
      <Row className=''>
        <Col
          xs={2}
          onClick={() => {
            setSelectedConnaissement(connaissement)
            handleShowDetailConnaiss()
          }}
          className={`m-auto text-start pe-0 responsive-font-small text-${_colorMyText(
            connaissement?.expediteur?.denomination
          )}`}
        >
          <b>{connaissement?.expediteur?.denomination}</b>
        </Col>
        <Col
          xs={8}
          onClick={() => {
            setSelectedConnaissement(connaissement)
            handleShowDetailConnaiss()
          }}
          className='m-auto'
        >
          <Row>
            <Col xs={12} className='m-auto text-center responsive-font-small pb-2 fw-bold'>
              {connaissement?.destinataire?.denomination}
            </Col>
            <Col
              xs={isDangerous || isFragile ? 8 : 12}
              className='m-auto responsive-font-small pb-2'
            >
              <Row className={`w-100 gx-0 text-${isDangerous || isFragile ? "start" : "center"}`}>
                <Col xs={isDangerous || isFragile ?12 : 6}>
                  <b className={`text-${_colorMyText(connaissement?.voyage?.nomNavire)}`}>
                    {connaissement?.voyage?.nomNavire}
                  </b>
                </Col>
                <Col xs={isDangerous || isFragile ? 12 : 6}>
                  <b>{connaissement?.numero}</b>
                  {/* <b>{connaissement?.numero_connaissement}</b> */}
                </Col>
              </Row>
            </Col>
            <Col xs={4} className='m-auto'>
              {isDangerous && (
                <>
                  <WarningTwoTone twoToneColor='#ee4848' />{' '}
                </>
              )}
              {isFragile && <WarningTwoTone twoToneColor='#fa8900' />}
            </Col>
            <Col xs={12} className='m-auto responsive-font-small text-center'>
              {/* <b>{connaissement?.referenceHorsRevatua}</b> */}
              <b>{_numeroFacture(connaissement?.referenceHorsRevatua)}</b>
            </Col>
          </Row>
        </Col>
        <Col
          xs={2}
          onClick={() => {
            setSelectedConnaissement(connaissement)
            handleShowQrcode()
          }}
          className='m-auto text-end ps-0 responsive-font-small'
        >
          {' '}
          {new Date(connaissement?.voyage?.dateDepart).toLocaleDateString('fr-FR', {
            timeZone: 'UTC',
          })}
          <div className=''>
            <i className='ri-qr-code-line fs-4 me-2'></i>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
