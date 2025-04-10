import React from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { Tag } from 'rsuite'
import { OrderType } from '../../../../definitions/OrderType'
import { _tagStatus } from '../../../../utils/functions'

export default function HeaderDetail(selectedOrder: OrderType) {
 
  return (
    <Modal.Header className='text-center'>
          <Container fluid>
            <Row>
              <Col xs={12} className='m-auto responsive-font-medium  mb-3'>
                {selectedOrder?.destinataire?.denomination}
              </Col>

              <Col xs={4} className='m-auto text-start responsive-font-small'>
                <b>N° Facture : </b>
                {selectedOrder?.referenceHorsRevatua}
              </Col>
              <Col xs={4} className='m-auto responsive-font-medium mb-3'>
                <Tag color={_tagStatus(selectedOrder?.statusRevatua)} className='mb-3'>
                  {selectedOrder?.statusRevatua}
                </Tag>
                <div>
                  <b>Paiement : </b>
                  {selectedOrder?.paiement}
                </div>
              </Col>
              <Col xs={4} className='m-auto text-end responsive-font-small'>
                <b> Date : </b> {selectedOrder?.dateFacture}
              </Col>
            </Row>
          </Container>
        </Modal.Header>
  )
}
