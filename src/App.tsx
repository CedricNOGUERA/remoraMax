import React from 'react'
import './App.css'
import { Col, Row } from 'react-bootstrap'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from './component/layout/Header'
import SideMenu from './component/layout/SideMenu'
import userStore, { CompanyStoreType, UserState } from './stores/userStore'
import { ToastAll, ToastUpdateUserSuccess } from './component/ui/Toast/Toastes'
import BottomNavBar from './component/layout/BottomNavBar'
import { _getShipments } from './utils/api/apiControlerFunctions'
import { UserType } from './definitions/UserType'
import { CompanyType } from './definitions/CompanyType'
import HeaderTransporter from './component/transporter/HeaderTransporter'
import { _getNotification } from './utils/api/totaraApi'
import { filteringDataConnaissementtype } from './definitions/ComponentType'
import { ResultConnaissementType } from './definitions/ConnaissementType'
import { NotificationType } from './definitions/NotificationType'
import { _getVersion } from './utils/functions'

function App() {
  const dataStore = userStore((state: UserState) => state)
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isTransporter = dataStore?.roles && dataStore.roles[0]?.name === 'transporteur'

  const [tokenTab, setTokenTab] = React.useState<string[] | undefined>()
  const [companyTab, setCompanyTab] = React.useState<CompanyStoreType[]>(
    dataStore.company
      ? dataStore.company.map((comp: CompanyStoreType) => {
          return comp
        })
      : []
  )
  const [headerData, setHeaderData] = React.useState<{ title: string; borderColor: string }>({
    title: '',
    borderColor: '',
  })
  const [companiesData, setCompaniesData] = React.useState<CompanyType[]>([])
  const [naviresData, setNaviresData] = React.useState<
    | {
        id: number
        name: string
      }[]
    | undefined
  >([])
  const [filteringData, setFilteringData] = React.useState<filteringDataConnaissementtype>({
    numeroConnaissement: '',
    expediteur_denomination: '',
    destinataire: '',
    idNavire: '',
    dernierEvenementConnaissement: '',
    dateDepart: '',
    nomIleArrivee: '',
    dateArrivee: '',
  })
  const [sortConfig, setSortConfig] = React.useState<string | undefined>('ASC')

  const [userData, setUserData] = React.useState<UserType[]>()
  const [connaissementData, setConnaissementData] = React.useState<ResultConnaissementType[]>(
    []
  )
  const [isNotification, setIsNotification] = React.useState<boolean>(false)
  const [notifications, setNotifications] = React.useState<NotificationType[]>()
  const [showUpdateSuccess, setShowUpdateSuccess] = React.useState<boolean>(false)
  const toggleShowUpdateSuccess = () => setShowUpdateSuccess(!showUpdateSuccess)

  const [toastData, setToastData] = React.useState<{
    bg: string
    message: string
    icon: string
  }>({
    bg: '',
    message: '',
    icon: '',
  })

  ///////////
  //Toast section
  ///////////
  const [showAll, setShowAll] = React.useState<boolean>(false)
  const toggleShowAll = React.useCallback(() => {
    setShowAll((prev) => !prev)
  }, [])

  React.useEffect(() => {
    _getVersion()
    if (
      !dataStore.token ||
      dataStore.token === undefined ||
      dataStore.token === null ||
      dataStore.token === ''
    ) {
      navigate('/connexion')
    }

    if (isTransporter) {
      navigate('/connaissements-transporteur')
    }
    if (isHomePage) {
      navigate('/factures')
    }
    const transportTokens = dataStore?.company?.map((comp: CompanyStoreType) => {
      return comp.access_token
    })
    setTokenTab(transportTokens)
  }, [])

  React.useEffect(() => {
    if (
      dataStore.access_token &&
      dataStore.access_token !== undefined &&
      dataStore.access_token !== ''
    ) {
      _getShipments(
        dataStore.company?.[0]?.access_token,
        dataStore,
        setNaviresData,
        toggleShowAll,
        setToastData
      )
      if (!isTransporter) {
        _getNotification(dataStore?.token, setNotifications)
      }
    }
  }, [dataStore, isTransporter, toggleShowAll])


  ///////////////////////
  //Components props
  ///////////////////////

  const toastUpdateUserSuccessProps = { showUpdateSuccess, toggleShowUpdateSuccess }
  const headerProps = {
    notifications,
    setNotifications,
    filteringData,
    setFilteringData,
    setIsNotification,
  }
  const toastAllProps = { showAll, toggleShowAll, toastData }
  return (
    <div className='bg-body-tertiary pe-0'>
      {!isTransporter ? <Header headerProps={headerProps} /> : <HeaderTransporter />}
      <div className='bg-body-tertiary'>
        <Row className='gx-0'>
          <Col className='vh-100 d-none d-md-block' xs={2} sm={2} md={2} lg={2} xl={2}>
            <SideMenu />
          </Col>
          <Col xs={12} sm={12} md={10} lg={10} xl={10} className='ps-0 pe-0'>
            <Outlet
              context={{
                userData,
                setUserData,
                companiesData,
                setCompaniesData,
                toggleShowUpdateSuccess,
                naviresData,
                headerData,
                setHeaderData,
                filteringData,
                setFilteringData,
                connaissementData,
                setConnaissementData,
                isNotification,
                setIsNotification,
                sortConfig,
                setSortConfig,
                tokenTab,
                setTokenTab,
                companyTab,
                setCompanyTab,
              }}
            />
          </Col>
        </Row>
        <BottomNavBar />
      </div>
      <ToastAll toastAllProps={toastAllProps} />
      <ToastUpdateUserSuccess toastUpdateUserSuccessProps={toastUpdateUserSuccessProps} />
    </div>
  )
}

export default App
