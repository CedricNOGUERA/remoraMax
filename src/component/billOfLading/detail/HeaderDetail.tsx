import { QRCode } from 'antd'
import { Container, Col, Row, Image } from 'react-bootstrap'
import dpam from '../../../styles/images/dpam.png'
import { ResultConnaissementType } from '../../../definitions/ConnaissementType'

export default function HeaderDetail({ selectedConnaissement }: {selectedConnaissement : ResultConnaissementType}) {
  const nbreFacture = selectedConnaissement?.referenceHorsRevatua?.split('|')?.length
  const dateLastEvent =
    new Date(
      selectedConnaissement?.dernierEtat?.dateEvenement.slice(0, 10)
    ).toLocaleDateString('fr-FR', {
      timeZone: 'UTC',
    }) +
    ' ' +
    selectedConnaissement?.dernierEtat?.dateEvenement.slice(11, 19)
  return (
    <Container fluid>
      <div className='d-flex-column d-sm-flex justify-content-between align-items-center'>
        <div className='d-none d-sm-block'>
          <Image src={dpam} width={80} height={80} />
        </div>
        <div>
          <div className='fs-3'>{selectedConnaissement?.voyage?.nomNavire}</div>
          <div className='font-75'>
            <strong>BP</strong>
            {selectedConnaissement?.armateur?.boitePostale}{' '}
            {selectedConnaissement?.armateur?.commune?.codePostal}{' '}
            {selectedConnaissement?.armateur?.commune?.nom} <strong>Tél : </strong>{' '}
            {selectedConnaissement?.armateur?.telephone}
          </div>
        </div>
        <div>
          <div className='d-flex justify-content-center w-100'>
            {selectedConnaissement?.numero !== null && (
              <QRCode
                value={selectedConnaissement?.numero}
                size={80}
                bordered={false}
                bgColor={'#ffffff'}
              />
            )}
          </div>
        </div>
      </div>

      <Row className='responsive-font-small mb-3'>
        <Col
          xs={12}
          md={12}
          className='d-flex-column m-auto p-0 text-center responsive-font-medium'
        >
          <div className=''>
            <strong className='fs-3'>CONNAISSEMENT</strong>
          </div>

          {selectedConnaissement?.dernierEtat?.evenementConnaissement}

          {selectedConnaissement?.dernierEtat?.motif && (
            <div className='mt-2'>
              <strong>Motif</strong> : {selectedConnaissement?.dernierEtat?.motif}
            </div>
          )}
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col xs={5} className=' text-start mb-3 '>
          <strong>Date</strong> : {dateLastEvent}
        </Col>
        <Col xs={2} className=''></Col>
        <Col xs={5} className='m-auto text-start'>
          {selectedConnaissement?.numero ? (
            <span>
              <strong> Numéro</strong> : {selectedConnaissement?.numero}{' '}
            </span>
          ) : (
            <span> id : {selectedConnaissement?.id}</span>
          )}
          <div className='font-75'>
            Référence chargeur{nbreFacture > 1 && `(${nbreFacture})`}:{' '}
            <div className="num-bill">{selectedConnaissement?.referenceHorsRevatua} </div>
          </div>
        </Col>
      </Row>
      <Container fluid className='mb-3'>
        <Row className='responsive-font-small mb-3 border'>
          <Col xs={4} className='m-auto text-start responsive-font-small'>
            <strong>Navire : </strong>
            {selectedConnaissement?.voyage?.nomNavire}
          </Col>
          <Col xs={4} className='m-auto responsive-font-medium'>
            <strong>Voyage n°: </strong>
            {selectedConnaissement?.voyage?.numero}
          </Col>
          <Col xs={4} className='m-auto text-end responsive-font-small'>
            <strong>Départ : </strong>
            {new Date(selectedConnaissement?.voyage?.dateDepart).toLocaleDateString('fr-FR', {
              timeZone: 'UTC',
            })}
          </Col>
        </Row>
        <Row className='responsive-font-small mb-3 border'>
          <Col xs={12} className='m-auto text-start responsive-font-small'>
            <strong>Expéditeur</strong>: {selectedConnaissement?.expediteur?.denomination} -
            N°Tahiti {selectedConnaissement?.expediteur?.numeroTahiti}
          </Col>
          <Col xs={12} className='m-auto text-start responsive-font-small'>
            <strong>Ile de départ</strong>: {selectedConnaissement?.voyage?.ileDepart} PAPEETE
          </Col>
          <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
            <strong>Téléphone</strong>: {selectedConnaissement?.expediteur?.telephone}
          </Col>
          <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
            <strong>Mail</strong>: {selectedConnaissement?.expediteur?.mail}
          </Col>
        </Row>
        <Row className='responsive-font-small border'>
          <Col xs={12} className='m-auto text-start responsive-font-small'>
            <strong>Destinataire</strong>: {selectedConnaissement?.destinataire?.denomination}{' '}
            - N°Tahiti {selectedConnaissement?.destinataire?.numeroTahiti}
          </Col>
          <Col xs={12} className='m-auto text-start responsive-font-small'>
            <strong>Ile de arrivée</strong>: {selectedConnaissement?.ileArrivee?.nom}
          </Col>
          <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
            <strong>Téléphone</strong>: {selectedConnaissement?.destinataire?.telephone}
          </Col>
          <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
            <strong>Mail</strong>: {selectedConnaissement?.destinataire?.mail}
          </Col>
        </Row>
      </Container>
    </Container>
  )
}
