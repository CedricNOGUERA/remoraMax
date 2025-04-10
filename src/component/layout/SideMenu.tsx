import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import userStore, { UserState } from '../../stores/userStore'
import useTransporterDataStore, {
  TransportState,
} from '../../stores/transporter/useTransporterDataStore'

export default function SideMenu() {
  const dataStore = userStore((state: UserState) => state)
  const isAdmin = dataStore?.roles && dataStore.roles[0]?.name === 'admin'
  const isSuperAdmin = dataStore?.roles && dataStore.roles[0]?.name === 'super_admin'
  const isTransporter = dataStore?.roles && dataStore.roles[0]?.name === 'transporteur'

  const setTransporterDataStore = useTransporterDataStore(
    (state: TransportState) => state.setTransporterDataStore
  )

  return (
    <div className='p-abso bg-body-tertiary border-end pt-2'>
      {!isTransporter && (
        <>
          <Container className='py-3 menu-link'>
            <Link className='text-decoration-none ' to='/factures'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className=''>
                  {' '}
                  <i className='ri-file-text-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start'>Factures</Col>
              </Row>
            </Link>
          </Container>
          <Container className='py-3 menu-link'>
            <Link className='text-decoration-none ' to='/connaissements'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-sailboat-line fs-5'></i>
                  {/* <i className='ri-anchor-line fs-5'></i> */}
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start responsive-font-small ps-xl-0'>
                  Connaissements
                </Col>
              </Row>
            </Link>
          </Container>
        </>
      )}

      {isTransporter && (
        <>
          <Container
            className='py-3 menu-link'
            onClick={() =>
              setTransporterDataStore({
                title: 'OFFICIALISE',
                status: 'OFFICIALISE',
                borderColor: 'green',
              })
            }
          >
            <Link className='text-decoration-none ' to='/connaissements-transporteur'>
              <Row className=' text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-sailboat-line fs-5 text-green'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start responsive-font-small ps-xl-0'>
                  Officialisés
                </Col>
              </Row>
            </Link>
          </Container>
          <Container
            className='py-3 menu-link'
            onClick={() =>
              setTransporterDataStore({
                title: 'SOUS RESERVE',
                status: 'OFFICIALISE_SOUS_RESERVE',
                borderColor: 'orange',
              })
            }
          >
            <Link className='text-decoration-none ' to='/connaissements-transporteur'>
              <Row className='  text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-file-edit-line fs-5 text-orange'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start responsive-font-small ps-xl-0'>
                  Sous Réserves
                </Col>
              </Row>
            </Link>
          </Container>
          <Container
            className='py-3 menu-link'
            onClick={() =>
              setTransporterDataStore({
                title: 'DEMANDE REFUSEE',
                status: 'DEMANDE_REFUSEE',
                borderColor: 'red',
              })
            }
          >
            <Link className='text-decoration-none ' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-file-close-line fs-5 text-danger'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start responsive-font-small ps-xl-0'>
                  Demande refusée
                </Col>
              </Row>
            </Link>
          </Container>
          <Container
            className='py-3 menu-link'
            onClick={() =>
              setTransporterDataStore({
                title: 'EMBARQUEMENT REFUSE',
                status: 'EMBARQUEMENT_REFUSE',
                borderColor: 'red',
              })
            }
          >
            <Link className='text-decoration-none ' to='/connaissements-transporteur'>
              <Row className='text-center'>
                <Col xs={12} lg={2} className='m-auto'>
                  {' '}
                  <i className='ri-close-line fs-5 danger-text'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start responsive-font-small ps-xl-0'>
                  Embarquements refusés
                </Col>
              </Row>
            </Link>
          </Container>
        </>
      )}
      {isSuperAdmin && (
        <>
          <Container className='py-3  menu-link'>
            <Link className='text-decoration-none ' to='/compagnies'>
              <Row className='text-center'>
                <Col xs={12} lg={2}>
                  {' '}
                  <i className='ri-community-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start'>Compagnies</Col>
              </Row>
            </Link>
          </Container>
        </>
      )}
      {(isAdmin || isSuperAdmin) && (
        <>
          <Container className='py-3  menu-link'>
            <Link className='text-decoration-none ' to='/utilisateurs'>
              <Row className='text-center'>
                <Col xs={12} lg={2}>
                  {' '}
                  <i className='ri-user-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start'>Utilisateurs</Col>
              </Row>
            </Link>
          </Container>
          <Container className='py-3  menu-link'>
            <Link className='text-decoration-none ' to='/notifications'>
              <Row className='text-center'>
                <Col xs={12} lg={2}>
                  {' '}
                  <i className='ri-notification-2-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto d-none d-sm-block text-lg-start'>Notifications</Col>
              </Row>
            </Link>
          </Container>
        </>
      )}
      {/* TODO: ajouter les permissions dans le menu
      <Container className='py-3  menu-link'>
        <Link className='text-decoration-none ' to='/permissions'>
          <Row className=' menu-link text-center'>
            <Col xs={12} lg={2}>
              {' '}
              <i className='ri-list-check-3 fs-5'></i>
            </Col>{' '}
            <Col className='m-auto d-none d-sm-block text-lg-start'>Permissions</Col>
          </Row>
        </Link>
      </Container> */}
    </div>
  )
}
