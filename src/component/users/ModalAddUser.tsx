import React from 'react'
import {
  Alert,
  Button,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from 'react-bootstrap'
import UserService from '../../services/user/UserService'
import userStore from '../../stores/userStore'
import CompaniesService from '../../services/companies/CompaniesService'
import { useOutletContext } from 'react-router-dom'
import { _getUsersData } from '../../utils/api/totaraApi'
import { CheckPicker } from 'rsuite'
import waneCompanies from '../../data/companies/waneCompanies.json'
import { ToastType } from '../../definitions/ComponentType'

type errorType = {
  error: boolean
  message: string
}

interface ModalAddUserType {
  show: boolean
  handleClose: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>
  toggleShowAll: () => void
}

export default function ModalAddUser(modalAddUserProps: ModalAddUserType) {
  const { show, handleClose, setToastData, toggleShowAll } = modalAddUserProps

  const { setUserData } = useOutletContext<any>()

  const dataStore = userStore((state: any) => state)

  const [isView, setIsView] = React.useState<boolean>(false)
  const [isView2, setIsView2] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<errorType>({
    error: false,
    message: '',
  })
  const [companies, setCompanies] = React.useState<any>([])
  const [newUserData, setNewUserData] = React.useState<any>({
    name: '',
    email: '',
    role: '',
    companies: [],
    password: '',
    password_confirmation: '',
  })

  const roleTab = ['user', 'transporteur', 'comptable', 'admin', 'super_admin']

  React.useEffect(() => {
    getCompaniesData()
  }, [])
  
  React.useEffect(() => {
    // if (newUserData?.companies?.includes(15) && newUserData?.role === 'transporteur') {
    //   alert('La compagnie CEDIS ne peut être associé au rôle transporteur')
    // }
    if (newUserData?.companies?.length > 1 && newUserData?.role !== 'transporteur') {
      setIsLoading(false)
      alert('Seul le rôle transporteur peut être associé à plusieurs compâgnies')
    }
  }, [newUserData])

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

  const handleAddUser = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    if (newUserData?.companies?.length > 1 && newUserData.role !== 'transporteur') {
      setIsLoading(false)
      alert('Seul le rôle transporteur peut être associé à plusieurs compâgnies')
    } 
    // else if (newUserData?.companies.includes(15) && newUserData.role === 'transporteur') {
    //   alert('La compagnie CEDIS ne peut être associé au rôle transporteur')
    // } 
    else {
      try {
        
        const response = await UserService.addUsers(dataStore.token, newUserData)

        console.log(response.status)

        if (response.status === 201) {
          handleClose()
          _getUsersData(dataStore.token, setUserData, setIsLoading)
          setNewUserData({
            name: '',
            email: '',
            role: '',
            companies: [],
            password: '',
            password_confirmation: '',
          })
          setIsError({
            error: false,
            message: '',
          })
          setToastData((prev: ToastType) => ({
            ...prev,
            bg:"success",
            message: "Ajout de l'utilisateur effectué avec succès",
            icon: "checkbox-circle"
          }))
          toggleShowAll()

        }
      } catch (error: any) {
        
        console.log(error)
        const messageError = JSON.parse(error?.request.responseText)?.errors.password
          ? 'Le mot de passe doit comporter au moins 12 caractères et doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.'
          : error?.response?.data?.message
        setIsError({
          error: true,
          message: messageError,
        })
        setToastData((prev: ToastType) => ({
          ...prev,
          bg:"danger",
          message: messageError,
          icon: "checkbox-circle"
        }))
        toggleShowAll()
      } finally{
        setIsLoading(false)
      }
    }
  }

  const waneCompaniesData = waneCompanies.map((item: any) => ({
    label: item.name,
    value: item.id_company,
  }))

  const data = companies.map((item: any) => ({ label: item.name, value: item.id_company }))

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleAddUser}>
        <Modal.Header className='border-bottom'>
          <Modal.Title>Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId='user_name' label='Nom*' className='mb-3'>
            <Form.Control
              className='border border-1 border-secondary'
              name='lastName'
              type='text'
              autoComplete='on'
              placeholder='Nom'
              onChange={(e) => {
                const name = e?.currentTarget?.value
                setNewUserData((prevData: any) => ({
                  ...prevData,
                  name: name,
                }))
              }}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId='user_email' label='Email*' className='mb-3'>
            <Form.Control
              className='border border-1 border-secondary'
              name='email'
              type='email'
              autoComplete='on'
              placeholder='Email'
              onChange={(e) => {
                const email = e?.currentTarget?.value

                setNewUserData((prevData: any) => ({
                  ...prevData,
                  email: email,
                }))
              }}
            />
          </FloatingLabel>
          <FloatingLabel controlId='user_role' label='Rôle*' className='mb-3'>
            <Form.Select
              name='role'
              onChange={(e) => {
                const userRole = e?.currentTarget?.value
                setNewUserData((prevData: any) => ({
                  ...prevData,
                  role: userRole,
                }))
              }}
              aria-label='zone'
              className='border border-1 border-secondary my-2 text-ui-second '
              required
            >
              <option value='' className='text-ui-second'>
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
            className='text-dark mb-3'
            data={newUserData?.role === 'transporteur' ? waneCompaniesData : data}
            searchable={false}
            style={{ width: '100%' }}
            value={newUserData?.companies}
            onChange={(value: number[]) => {
              const companies: number[] = value
              setNewUserData((prevData: any) => ({
                ...prevData,
                companies: companies,
              }))
            }}
            // disabledItemValues={newUserData?.role === 'transporteur' ? [15] : []}
          />
          <InputGroup className='mb-3'>
            <FloatingLabel controlId='password' label='Mot de passe*' className=''>
              <Form.Control
                className='border border-1 border-secondary'
                name='password'
                type={!isView ? 'password' : 'text'}
                placeholder='Mot de passe'
                onChange={(e) => {
                  const password = e?.currentTarget?.value

                  setNewUserData((prevData: any) => ({
                    ...prevData,
                    password: password,
                  }))
                }}
                required
              />
            </FloatingLabel>
            <InputGroup.Text
              id='eyeOrNot'
              className='bg-transparent border border-1 border-secondary border-start-0'
              onClick={() => setIsView(!isView)}
            >
              {' '}
              <i className={`ri-${!isView ? 'eye-off' : 'eye'}-fill text-secondary`}></i>
            </InputGroup.Text>
          </InputGroup>
          <InputGroup className='mb-3'>
            <FloatingLabel
              controlId='password_confirmation'
              label='Mot de passe de confirmation*'
              className=''
            >
              <Form.Control
                className='border border-1 border-secondary'
                name='passwordConfirmation'
                type={!isView2 ? 'password' : 'text'}
                placeholder='Mot de passe confirmation'
                onChange={(e) => {
                  const passwordConfirmation = e?.currentTarget?.value
                  setNewUserData((prevData: any) => ({
                    ...prevData,
                    password_confirmation: passwordConfirmation,
                  }))
                }}
                required
              />
            </FloatingLabel>
            <InputGroup.Text
              id='eyeOrNot'
              className='bg-transparent border border-1 border-secondary border-start-0'
              onClick={() => setIsView2(!isView2)}
            >
              {' '}
              <i className={`ri-${!isView2 ? 'eye-off' : 'eye'}-fill text-secondary`}></i>
            </InputGroup.Text>
          </InputGroup>

          <Alert
            show={
              newUserData.password !== newUserData.password_confirmation &&
              newUserData.password_confirmation?.length > 2
            }
            variant='danger'
            className='d-flex align-items-center mt-3'
          >
            <i className='ri-close-circle-line fs-4 text-danger me-2'></i>
            <span className='font-85'>
              Attention le mot de passe de confirmation doit être identique au mot de passe
            </span>
          </Alert>
          <Alert
            show={isError.error}
            variant='danger'
            className='d-flex align-items-center mt-3'
          >
            <i className='ri-close-circle-line fs-4 text-danger me-2'></i>
            <span className='font-85'>{isError.message}</span>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            className='bg-remora-secondary border-remora-secondary '
            onClick={() => {
              handleClose()
              setIsError({
                error: false,
                message: '',
              })
              setNewUserData({
                name: '',
                email: '',
                role: '',
                id_company: '',
                password: '',
                password_confirmation: '',
              })
            }}
          >
            <i className='ri-close-circle-line me-1'></i>Annuler
          </Button>
          <Button variant='secondary'
          className='bg-remora-primary border-remora-primary' type='submit'>
            {isLoading ? (
              <>
                <Spinner variant='light' size='sm' /> Loading
              </>
            ) : (
              <>
                <i className='ri-add-line'></i> Ajouter
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
