import { Col, Placeholder, Row } from 'react-bootstrap'

export default function ItemTransportLoader() {
  return (
    <Placeholder as='div' animation='glow'>
      <Placeholder xs={12} as='div' className='py-1 px-2 rounded-4 mb-0 mb-2'>
        <div
          // style={{ height: '35px' }}
          style={{ height: '105px' }}
          className='w-100 d-flex justify-content-around align-items-center'
        >
          <Placeholder xs={2} as='div' className='bg-secondary rounded  my-0' />
          <Placeholder xs={7} as='div' className='rounded my-0'>
            <Row>
              <Col xs={12} className='text-center'>
                <Placeholder xs={10} as='div' className='bg-secondary rounded mb-2' />
              </Col>
              <Col xs={12}>
                <Placeholder xs={4} as='div' className='bg-secondary rounded  mb-2 me-4' />
                <Placeholder xs={6} as='div' className='bg-secondary rounded  mb-2' />
              </Col>
              <Col xs={12} className='text-center'>
                <Placeholder xs={5} as='div' className='bg-secondary rounded  mb-2' />
              </Col>
            </Row>
          </Placeholder>
          <Placeholder xs={2} as='div' className=' rounded my-0'>
            <Row>
              <Col xs={12} className='text-center'>
                <Placeholder xs={12} as='div' className='bg-secondary rounded  my-0' />
              </Col>
              <Col xs={12} className='text-center'>
                <Placeholder xs={12} as='div' className='bg-secondary rounded  my-0' />
              </Col>
            </Row>
          </Placeholder>
        </div>
      </Placeholder>
    </Placeholder>
  )
}
