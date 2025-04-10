import React from 'react'
import { Dropdown } from 'react-bootstrap'
import userStore, { UserState } from '../../stores/userStore'
import { _userLogout } from '../../utils/api/totaraApi'
import useTransporterDataStore, { TransportState } from '../../stores/transporter/useTransporterDataStore'
import useSelectedIdCompanyStore, { selectedIdCompanyState } from '../../stores/transporter/useSelectedIdCompanyStore'

interface menuDropType {
  isCedsiTransporter?: boolean
  isTransporter: boolean | null
  isDarkMode: boolean
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MenuDrop({ menuDropProps }: { menuDropProps: menuDropType }) {
  const  {isCedsiTransporter, isTransporter, isDarkMode, setIsDarkMode } = menuDropProps
  const authLogout = userStore((state: UserState) => state.authLogout)
  const dataStore = userStore((state: UserState) => state)
  const transporterDataStore = useTransporterDataStore((state: TransportState) => state)
  const resetSelectedId = useSelectedIdCompanyStore(
    (state: selectedIdCompanyState) => state.resetSelectedId
  )

  const isSuperAdmin = dataStore?.roles && dataStore.roles[0]?.name ==='super_admin'
  const isAdmin = dataStore?.roles && dataStore.roles[0]?.name ==='admin'
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          variant='transparent'
          id='dropdown-basic'
          className='border-0 no-chevron'
          name="header-menu"
        >
          <i className='ri-more-2-line fs-4'></i>
        </Dropdown.Toggle>
        <Dropdown.Menu align='end'>
          {isCedsiTransporter ? (
            <div className='px-3'>
              <div className='responsive-font-small text-center border border-secondary rounded-pill px-3'>
                CEDIS
              </div>
            </div>
          ) : (
            isTransporter && (
              <div className='px-3'>
                <div className='responsive-font-small text-center border border-secondary rounded-pill px-3'>
                  LOGIPOL
                </div>
              </div>
            )
          )}
          <div className='px-3'>
             V 1.5.0
          </div>
          <Dropdown.Divider />
          {!isTransporter && (
            <>
              {isSuperAdmin && (
                <Dropdown.Item href='/compagnies' className='d-block d-md-none'>
                  <i className='ri-community-line fs-5'></i> Compagnies
                </Dropdown.Item>
              )}
              {(isSuperAdmin || isAdmin) && (
                <>
                  <Dropdown.Item href='/utilisateurs' className='d-block d-md-none'>
                    <i className='ri-user-line fs-5'></i> Utilisateurs
                  </Dropdown.Item>
                  <Dropdown.Item href='/utilisateurs' className='d-block d-md-none'>
                    <i className='ri-notification-2-line fs-5'></i> Notifications
                  </Dropdown.Item>
                </>
              )}
            </>
          )}
          <Dropdown.Item className='text-secondary' onClick={() => setIsDarkMode(!isDarkMode)}>
            <i className={`ri-${!isDarkMode ? 'moon' : 'sun'}-line fs-4`}></i> Thème
          </Dropdown.Item>
          <Dropdown.Item
            href='/connexion'
            onClick={() => {
              authLogout()
              _userLogout(dataStore.token)
              transporterDataStore.resetAll()
              resetSelectedId()
            }}
          >
            <i className='ri-logout-box-r-line fs-5'></i> Déconnexion
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
