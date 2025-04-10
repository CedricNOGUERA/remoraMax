import React from 'react'
import { Alert, Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'
import UserService from '../../services/user/UserService'
import userStore from '../../stores/userStore'
import { _getUsersData } from '../../utils/api/totaraApi'
import CompaniesService from '../../services/companies/CompaniesService'
import waneCompanies from '../../data/companies/waneCompanies.json'
import { CheckPicker } from 'rsuite'
import { ToastType } from '../../definitions/ComponentType'
import { UserType } from '../../definitions/UserType'

interface ModalUpdateUserType {
  showUpdateUser: boolean
  handleCloseUpdateUser: () => void
  selectedUserData: UserType | undefined
  setSelectedUserData: React.Dispatch<React.SetStateAction<UserType | undefined>>
  userData: UserType[]
  setUserData: React.Dispatch<React.SetStateAction<UserType[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>
  toggleShowAll: () => void
}

export default function ModalUpdateUser(modalUpdateUserProps: ModalUpdateUserType) {
  const {
    showUpdateUser,
    handleCloseUpdateUser,
    selectedUserData,
    setSelectedUserData,
    userData,
    setUserData,
    setIsLoading,
    isLoading,
    setToastData,
    toggleShowAll,
  } = modalUpdateUserProps

  const dataStore = userStore((state: any) => state)
  const [companies, setCompanies] = React.useState<any>([])
  const [updatedUserData, setUpdatedUserData] = React.useState<any>({
    name: '',
    email: '',
    role: '',
    companies: [],
  })
  const [errorUpdateMessage, setErrorUpdateMessage] = React.useState<any>({
    message: '',
    isError: false,
  })

  const roleTab = ['user', 'transporteur', 'comptable', 'admin', 'super_admin']

  React.useEffect(() => {
    const newCompaniesData = selectedUserData?.companies?.map((companies: any) => {
      return companies?.id_company
    })

    setSelectedUserData((prevData: any) => ({
      ...prevData,
      role: selectedUserData?.role && selectedUserData?.role[0]?.name,
      companies: newCompaniesData,
    }))
  }, [showUpdateUser])

  React.useEffect(() => {
    setUpdatedUserData(selectedUserData)
    getCompaniesData()
  }, [selectedUserData])

  const handleUpdateUser = async (e: any) => {
    e.preventDefault()

    const userId = selectedUserData && selectedUserData.id

    if (
      updatedUserData?.companies?.length > 1 &&
      updatedUserData.role !== 'transporteur' &&
      updatedUserData.role !== 'super_admin'
    ) {
      alert(
        'Seul le rôle transporteur ou les supers admins peuvent être associé à plusieurs compâgnies'
      )
    } else if (
      updatedUserData?.companies.includes(15) &&
      updatedUserData.role === 'transporteur'
    ) {
      alert('La compagnie CEDIS ne peut être associé au rôle transporteur')
    } else {
      const data =
        selectedUserData && selectedUserData.email === updatedUserData.email
          ? {
              name: updatedUserData?.name,
              role: updatedUserData?.role,
              companies: updatedUserData?.companies,
            }
          : {
              name: updatedUserData.name,
              email: updatedUserData.email,
              role: updatedUserData.role,
              companies: updatedUserData?.companies,
            }
      if (userData?.length === 0) {
        setIsLoading(true)
      }

      try {
        const response = await UserService.updateUsers(dataStore.token, data, userId)

        if (response.status === 200) {
          handleCloseUpdateUser()
          _getUsersData(dataStore.token, setUserData, setIsLoading)
          setSelectedUserData(undefined)
          setToastData((prev: ToastType) => ({
            ...prev,
            bg: 'success',
            message: 'Modification effectuée avec succès',
            icon: 'checkbox-circle',
          }))
          toggleShowAll()
          setErrorUpdateMessage({
            message: '',
            isError: false,
          })
        }
      } catch (error: any) {
        console.log(error)
        setErrorUpdateMessage({
          message: error?.message,
          isError: true,
        })
        setToastData((prev: ToastType) => ({
          ...prev,
          bg: 'danger',
          message: "Une erreur s'est produite",
          icon: 'warning-error',
        }))
        toggleShowAll()
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getCompaniesData = async () => {
    try {
      let page = 1
      let allCompanies: any = []
      let hasMorePages = true

      while (hasMorePages) {
        const response = await CompaniesService.getCompanies(dataStore.token, page)
        allCompanies = [...allCompanies, ...response.data.data]
        allCompanies = allCompanies.sort((a: any, b: any) => a.name.localeCompare(b.name))

        if (response.data.meta.current_page < response.data.meta.last_page) {
          page++
        } else {
          hasMorePages = false
        }
      }
      setCompanies(allCompanies)
    } catch (error) {
      console.log(error)
    }
  }

  const waneCompaniesData = waneCompanies.map((item: any) => ({
    label: item.name,
    value: item.id_company,
  }))

  const data = companies.map((item: any) => ({ label: item.name, value: item.id_company }))

  return (
    <Modal show={showUpdateUser} onHide={handleCloseUpdateUser}>
      <Form onSubmit={handleUpdateUser}>
        <Modal.Header className='border-bottom'>
          <Modal.Title>Modifier un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId='user_name' label='Nom' className='mb-3'>
            <Form.Control
              className='border border-1 border-secondary'
              name='lastName'
              type='text'
              autoComplete='on'
              placeholder='Nom'
              value={updatedUserData?.name || ''}
              onChange={(e) => {
                const lastname = e?.currentTarget?.value
                setUpdatedUserData((prevData: any) => ({
                  ...prevData,
                  name: lastname,
                }))
              }}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId='user_email' label='Email' className='mb-3'>
            <Form.Control
              className='border border-1 border-secondary'
              name='email'
              type='email'
              autoComplete='on'
              placeholder='Email'
              value={updatedUserData?.email || ''}
              onChange={(e) => {
                const email = e?.currentTarget?.value

                setUpdatedUserData((prevData: any) => ({
                  ...prevData,
                  email: email,
                }))
              }}
            />
          </FloatingLabel>
          <FloatingLabel controlId='user_role' label='Rôle' className='mb-3'>
            <Form.Select
              value={
                Array.isArray(updatedUserData?.role)
                  ? selectedUserData?.role && selectedUserData?.role[0]?.name
                  : updatedUserData?.role || ''
              }
              onChange={(e) => {
                const userRole = e?.currentTarget?.value
                setUpdatedUserData((prevData: any) => ({
                  ...prevData,
                  role: userRole,
                }))
              }}
              aria-label='zone'
              className='border border-1 border-secondary my-2 text-ui-second '
              required
            >
              <option value='' className='role-option'>
                Choisir un rôle
              </option>
              {roleTab?.map((role: any, index: any) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <CheckPicker
            size='lg'
            label='Compagnie'
            name='companies'
            className='text-dark'
            data={updatedUserData?.role === 'transporteur' ? waneCompaniesData : data}
            searchable={false}
            style={{ width: '100%' }}
            value={updatedUserData?.companies || []}
            onChange={(value: number[], e: any) => {
              const companies: number[] = value
              setUpdatedUserData((prevData: any) => ({
                ...prevData,
                companies: companies,
              }))
            }}
            disabledItemValues={updatedUserData?.role === 'transporteur' ? [15] : []}
          />

          <Alert variant='danger' show={errorUpdateMessage.isError} className='mt-3'>
            {errorUpdateMessage.message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            className='bg-remora-secondary border-remora-secondary '
            onClick={() => {
              handleCloseUpdateUser()
              setSelectedUserData(undefined)
              setUpdatedUserData({})
            }}
          >
            <i className='ri-close-circle-line me-1'></i>Annuler
          </Button>
          <Button
            variant='primary'
            className='bg-remora-primary border-remora-primary'
            type='submit'
          >
            {isLoading ? (
              <>
                <Spinner variant='light' size='sm' /> Modifier
              </>
            ) : (
              <>
                <i className='ri-edit-2-line'></i> Modifier
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
