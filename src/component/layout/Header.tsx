import React from 'react'
import { Badge, Image, Navbar } from 'react-bootstrap'
import logo from '../../styles/images/remora.webp'
import userStore, { CompanyStoreType, UserState } from '../../stores/userStore'
import MenuDrop from '../ui/MenuDrop'
import { NotificationModal } from '../ui/Modal/Modals'
import { NotificationType } from '../../definitions/NotificationType'
import { filteringDataConnaissementtype } from '../../definitions/ComponentType'

interface HeaderType {
  notifications: NotificationType[] | undefined
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[] | undefined>> 
  filteringData: filteringDataConnaissementtype
  setFilteringData: React.Dispatch<React.SetStateAction<filteringDataConnaissementtype>>
  setIsNotification: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({headerProps}: {headerProps: HeaderType}) {
  const {notifications, setNotifications, filteringData, setFilteringData, setIsNotification}= headerProps
  const dataStore = userStore((state: UserState) => state)
  const isTransporter = dataStore?.roles && dataStore.roles[0]?.name ==='transporteur'
  
  const isCedsiTransporter = dataStore.roles?.[0]?.name === 'transporteur' && dataStore.company?.[0]?.id_company === 15
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false)

  const companyName =
    dataStore?.company &&
    dataStore?.company?.some((company: CompanyStoreType) => company.name === 'CEDIS') &&
    dataStore?.company?.length >= 9
      ? 'ALL COMPANY'
      : dataStore?.company?.length === 1
      ? dataStore?.company && dataStore?.company[0]?.name
      : dataStore?.company &&
        dataStore?.company?.length > 1 &&
        dataStore?.roles &&
        dataStore?.roles[0]?.name === 'transporteur'
      ? 'LOGIPOL'
      : ''

  //Notifications modal
  const [showNotifModal, setShowNotifModal] = React.useState(false)
  const handleCloseNotifModal = () => {
    setShowNotifModal(false)
  }
  const handleShowNotifModal = () => {
    setShowNotifModal(true)
  }

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

  const menuDropProps = {isCedsiTransporter, isTransporter, isDarkMode, setIsDarkMode}
  const notificationProps = {showNotifModal, handleCloseNotifModal, notifications, setNotifications, filteringData, setFilteringData, setIsNotification}

  const badgePadding = notifications && notifications?.length > 9 ? 'px-1' : ''

  return (
    <header className='sticky-top border-bottom'>
      <Navbar className='bg-body-tertiary px-3 py-0 py-md-2'>
        <Navbar.Brand className='d-flex align-items-center'>
          <Image src={logo} width={50} alt='logo' className='me-2' decoding="async" />
          <div className='responsive-font-small border border-secondary rounded-pill px-3'>
            {companyName}
          </div>
        </Navbar.Brand>
        <div className='d-flex ms-auto responsive-font-medium'>
          <div className='d-flex align-items-center me-2 me-sm-4'>{dataStore.name}</div>
          {notifications && notifications?.length > 0 && (
            <div
              className='d-flex align-items-center me-2 me-sm-4 notification-zone pointer'
              onClick={handleShowNotifModal}
            >
              <i className='ri-notification-2-line fs-4 animate__animated animate__swing '></i>{' '}
              <Badge
                bg='danger'
                className={`m-auto rounded-circle font-65 notification-badge ${badgePadding}`}
              >
                {notifications?.length}
              </Badge>
            </div>
          )}
          <MenuDrop menuDropProps={menuDropProps} />
        </div>
      </Navbar>
      <NotificationModal notificationProps={notificationProps} />
    </header>
  )
}
