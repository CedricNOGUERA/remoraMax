import { QRCode } from 'antd'
import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import TableDetail from './detail/TableDetail'
import dpam from '../../styles/images/dpam.png'
import { ResultConnaissementType } from '../../definitions/ConnaissementType'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface MultiPrintViewerTpe {
  checkedMultiConnaissement: ResultConnaissementType[]
  printref: React.LegacyRef<HTMLDivElement> | undefined
}

export default function MultiPrintViewer({
  checkedMultiConnaissement,
  printref,
}: MultiPrintViewerTpe) {

  return (
    <div className='p-1 p-sm-4 text-center border-bottom-0  printermulti' ref={printref}>
      {checkedMultiConnaissement.map((connaissement: ResultConnaissementType, index: number) => {
        const dateLastEvent =
          new Date(connaissement?.dernierEtat?.dateEvenement.slice(0, 10)).toLocaleDateString(
            'fr-FR',
            {
              timeZone: 'UTC',
            }
          ) +
          ' ' +
          connaissement?.dernierEtat?.dateEvenement?.slice(11, 19)

        return (
          <div key={index} className='multi-pdf-container'>
            <Container fluid>
              <div className='d-flex-column d-sm-flex justify-content-around align-items-center'>
                <div>
                  <Image src={dpam} width={80} height={80} />
                </div>
                <div>
                  <div className='fs-3'>{connaissement?.voyage?.nomNavire}</div>
                  <div className='font-75'>
                    BP {connaissement?.armateur?.boitePostale}{' '}
                    {connaissement?.armateur?.commune?.codePostal}{' '}
                    {connaissement?.armateur?.commune?.nom} <strong>Tél : </strong>{' '}
                    {connaissement?.armateur?.telephone}
                  </div>
                </div>
                <div>
                  <div className='d-flex justify-content-center w-100'>
                    {connaissement?.numero !== null && (
                      <QRCode
                        value={connaissement?.numero}
                        size={110}
                        bordered={true}
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
                  className='d-flex-column m-auto p-0    text-center responsive-font-small'
                >
                  <div className='mb-1'>
                    <strong className='fs-3'>CONNAISSEMENT</strong>
                  </div>

                  {connaissement?.dernierEtat?.evenementConnaissement}

                  {connaissement?.dernierEtat?.motif && (
                    <div className='mt-2'>
                      <strong>Motif</strong> : {connaissement?.dernierEtat?.motif}
                    </div>
                  )}
                </Col>
              </Row>
              <Row className='responsive-font-small mb-3'>
                <Col xs={5} className='m-auto text-start responsive-font-small mb-3 '>
                  <strong>Date</strong> : {dateLastEvent}
                </Col>
                <Col xs={2} className='m-auto responsive-font-medium'></Col>
                <Col xs={5} className='m-auto text-start responsive-font-small'>
                  {connaissement?.numero ? (
                    <span>
                      <strong> Numéro</strong> : {connaissement?.numero}{' '}
                    </span>
                  ) : (
                    <span> id : {connaissement?.id}</span>
                  )}
                  <div className='font-75'>
                    Référence chargeur
                    {connaissement?.referenceHorsRevatua?.split('|')?.length > 1 &&
                      `(${connaissement?.referenceHorsRevatua?.split('|')?.length})`}
                    : {connaissement?.referenceHorsRevatua}{' '}
                  </div>
                </Col>
              </Row>
              <Container fluid className='mb-3'>
                <Row className='responsive-font-small mb-3 border'>
                  <Col xs={4} className='m-auto text-start responsive-font-small'>
                    Navire :{' '}
                    {connaissement?.voyage?.periple &&
                      connaissement?.voyage?.periple[0]?.nomNavire}
                  </Col>
                  <Col xs={4} className='m-auto responsive-font-medium'>
                    Voyage n°: {connaissement?.voyage?.numero}
                  </Col>
                  <Col xs={4} className='m-auto text-end responsive-font-small'>
                    Départ: {connaissement?.voyage?.dateDepart}
                  </Col>
                </Row>
                <Row className='responsive-font-small mb-3 border'>
                  <Col xs={12} className='m-auto text-start responsive-font-small'>
                    <strong>Expéditeur</strong>: {connaissement?.expediteur?.denomination} -
                    N°Tahiti {connaissement?.expediteur?.numeroTahiti}
                  </Col>
                  <Col xs={12} className='m-auto text-start responsive-font-small'>
                    <strong>Ile de départ</strong>: {connaissement?.voyage?.ileDepart} PAPEETE
                  </Col>
                  <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
                    <strong>Téléphone</strong>: {connaissement?.expediteur?.telephone}
                  </Col>
                  <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
                    <strong>Mail</strong>: {connaissement?.expediteur?.mail}
                  </Col>
                </Row>
                <Row className='responsive-font-small border'>
                  <Col xs={12} className='m-auto text-start responsive-font-small'>
                    <strong>Destinataire</strong>: {connaissement?.destinataire?.denomination}{' '}
                    - N°Tahiti {connaissement?.destinataire?.numeroTahiti}
                  </Col>
                  <Col xs={12} className='m-auto text-start responsive-font-small'>
                    <strong>Ile de arrivée</strong>: {connaissement?.ileArrivee?.nom}
                  </Col>
                  <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
                    <strong>Téléphone</strong>: {connaissement?.destinataire?.telephone}
                  </Col>
                  <Col xs={12} sm={6} className='m-auto text-start responsive-font-small'>
                    <strong>Mail</strong>: {connaissement?.destinataire?.mail}
                  </Col>
                </Row>
              </Container>
            </Container>
            <TableDetail selectedConnaissement={connaissement} />
            <div className='footer-multi-connaissement mt-auto font-65'>
              <div className='printermulti'>
                REVATUA - Le {dateLastEvent} édition du connaissement n°
                {connaissement?.numero}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
