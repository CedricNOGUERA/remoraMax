import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { TransporterTableType } from '../../definitions/ComponentType';
import { WarningTwoTone } from '@ant-design/icons';
import { _formatDate } from '../../utils/functions';
import { DetailType } from '../../definitions/ConnaissementType';


export default function TransporterTable({setSelectedConnaissement, connaissement, handleShowDetailConnaiss, handleShowQrcode}: TransporterTableType) {

  const isDangerous = connaissement.detailConnaissements?.some(
    (detail: DetailType) => detail.matiereDangereuse === true
  )

  const isFragile = connaissement.detailConnaissements?.some(
    (detail: DetailType) => detail.fragile === true
  )


  const itemData = [ 
    connaissement?.numero,
    // connaissement?.expediteur?.denomination,
    connaissement?.destinataire?.denomination,
    connaissement?.voyage?.nomNavire,
    _formatDate(connaissement?.voyage?.dateDepart)
  ]


  return (
    <tr>
      {itemData?.map((item: string | null, index: number) => (
        <td key={index}  onClick={() => {
          setSelectedConnaissement(connaissement)
          handleShowDetailConnaiss()
        }}
        className='pointer p-1 pe-0 p-md-2'>
          {item}
        </td>
      ))}
      <td className='p-1 pe-0 p-md-2 text-center'>
        <Row className='w-100 gx-0'>
          <Col xs={6} className='m-auto'>
            {isDangerous && (
              <div>
                <WarningTwoTone twoToneColor='#ee4848' />
              </div>
            )}
            {isFragile && (
              <div>
                <WarningTwoTone twoToneColor='#fa8900' />
              </div>
            )}
          </Col>
          <Col xs={6} className='m-auto pointer'>
            <span
             
              onClick={() => {
                setSelectedConnaissement(connaissement)
                handleShowQrcode()
              }}
            >
              <i className='ri-qr-code-line fs-4 me-2'></i>
            </span>
          </Col>
        </Row>
      </td>
    </tr>
  )
}
