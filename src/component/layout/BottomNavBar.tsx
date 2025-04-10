import { Navbar, Container, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import userStore, { UserState } from '../../stores/userStore'
import useTransporterDataStore, { TransportState } from '../../stores/transporter/useTransporterDataStore'

export default function BottomNavBar() {
  const dataStore = userStore((state: UserState) => state)
  const isTransporter = dataStore?.roles && dataStore.roles[0]?.name ==='transporteur'
  const setTransporterDataStore = useTransporterDataStore((state: TransportState) => state.setTransporterDataStore)

  return (
    <Navbar
      fixed='bottom'
      expand='lg'
      className='bg-body-tertiary border-top font-45 d-block d-md-none'
    >
      <Container className='d-flex justify-content-between'>
        {!isTransporter && (
          <Row className='gx-0 w-100' >
          <Col>
            <Link className='text-decoration-none' to='/factures'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className=''>
                  {' '}
                  <i className='ri-file-text-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto d-sm-block'>Factures</Col>
              </Row>
            </Link>
          </Col>
        <Col>
          {' '}
          <Link
            className='text-decoration-none'
            to='/connaissements'
          >
            <Row className='text-center'>
              <Col xs={12} lg={2} className='m-auto'>
                {' '}
                <i className='ri-sailboat-line fs-5'></i>
              </Col>{' '}
              <Col className='m-auto d-sm-block'>
                CONNAISSEMENTS
              </Col>
            </Row>
          </Link>
        </Col>
        </Row>
        )}
        {isTransporter && (
          <>
          {/* <Col onClick={() => setTransporterDataStore({
            title: "DEMANDE",
            status: "DEMANDE",
            borderColor: "cyan"
          })}>
            {' '}
            <Link className='text-decoration-none' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-list-view fs-5 text-info'></i>
                </Col>{' '}
                <Col className='m-auto d-sm-block'>DEMANDE</Col>
              </Row>
            </Link>
          </Col> */}
          
          <Col onClick={() => setTransporterDataStore({
            title: "OFFICIALISE",
            status: "OFFICIALISE",
            borderColor: "green"
          })}>
            {' '}
            <Link className='text-decoration-none' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-sailboat-line fs-5 text-green'></i>
                </Col>{' '}
                <Col className='m-auto d-sm-block'>OFFICIALISE</Col>
              </Row>
            </Link>
          </Col>
          <Col onClick={() => setTransporterDataStore({
            title: "SOUS RESERVE",
            status: "OFFICIALISE_SOUS_RESERVE",
            borderColor: "orange"
          })}>
            {' '}
            <Link className='text-decoration-none' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-file-edit-line fs-5 text-orange'></i>
                </Col>{' '}
                <Col className='m-auto d-sm-block'>SOUS RESERVE</Col>
              </Row>
            </Link>
          </Col>
          <Col onClick={() => setTransporterDataStore({
            title: "DEMANDE REFUSEE",
            status: "DEMANDE_REFUSEE",
            borderColor: "red"
          })}>
            {' '}
            <Link className='text-decoration-none' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-file-close-line fs-5 text-danger'></i>
                </Col>{' '}
                <Col className='m-auto d-sm-block '>DEMANDE REFUSEE</Col>
              </Row>
            </Link>
          </Col>
          <Col onClick={() => setTransporterDataStore({
            title: "EMBARQUEMENT REFUSE",
            status: "EMBARQUEMENT_REFUSE",
            borderColor: "red"
          })}>
            {' '}
            <Link className='text-decoration-none' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-close-line fs-5 danger-text'></i>
                </Col>{' '}
                <Col className='m-auto d-sm-block'>EMBARQ. REFUSE</Col>
              </Row>
            </Link>
          </Col>
         
          </>

        )}
      </Container>
    </Navbar>
  )
}
