import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import userStore, { UserState } from '../../stores/userStore'
import tots from '../../styles/images/remora.webp'
import MenuDrop from '../ui/MenuDrop'
import useTransporterDataStore, { TransportState } from '../../stores/transporter/useTransporterDataStore'



export default function HeaderTransporter() {
  
  const dataStore = userStore((state: UserState) => state)
  const isTransporter = dataStore.roles?.[0]?.name === 'transporteur'
  const isCedsiTransporter = dataStore.roles?.[0]?.name === 'transporteur' && dataStore.company?.[0]?.id_company === 15
  const transporterDataStore = useTransporterDataStore((state: TransportState) => state)
  const title = transporterDataStore?.title
  const borderColor = transporterDataStore?.borderColor

  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false)
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-bs-theme', 'dark')
    } else {
      document.body.setAttribute('data-bs-theme', 'light')
    }

    return () => {
      document.body.removeAttribute('data-bs-theme')
    }
  }, [isDarkMode])

  const menuDropProps = { isCedsiTransporter, isTransporter, isDarkMode, setIsDarkMode }

  return (

    <header className='sticky-top border-bottom w-100 mb-3'>
      {/* <Row className='w-100 bg-secondary-gray gx-0 py-1 py-sm-2'> */}
      <Row className='w-100 bg-body-tertiary gx-0 py-1 py-sm-2'>
        <Col xs={3} md={4} className=' text-start ps-2'>
          <Image src={tots} width={50} alt='logo' className='me-2' />
        </Col>
        <Col xs={6} md={4} className='m-auto text-center'>
          <div
            className={`responsive-font-small border-${borderColor} rounded-pill px-3 py-2 ubuntu-font fs-6 fw-bold `}
          >
            {title}
          </div>
        </Col>
        <Col xs={3} md={4} className='m-auto ms-auto text-end'>
          <div className=' ms-auto responsive-font-medium'>
            <MenuDrop menuDropProps={menuDropProps} />
          </div>
        </Col>
      </Row>
    </header>
  )
}
