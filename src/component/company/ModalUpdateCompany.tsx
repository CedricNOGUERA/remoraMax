import React from 'react'
import { Alert, Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'
import CompaniesService from '../../services/companies/CompaniesService'
import userStore, { UserState } from '../../stores/userStore'
import { _getCompaniesData } from '../../utils/api/totaraApi'
import { useOutletContext } from 'react-router-dom'
import { errorType } from '../../definitions/errorType'
import ErrorMessage from '../ui/error/ErrorMessage'
import { CompanyType } from '../../definitions/CompanyType'
import { AxiosError } from 'axios'

interface ModalUpdateCompanyType { 
  showUpdateCompany: boolean 
  handleCloseUpdateCompany: () => void
  selectedCompanyData: CompanyType
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<CompanyType>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
 }
 interface ContextModalUpdateCompanyType {
  setCompaniesData: React.Dispatch<React.SetStateAction<CompanyType[]>>
  toggleShowUpdateSuccess: () => void
 }



export default function ModalUpdateCompany({modalUpdateCompanyProps}: {modalUpdateCompanyProps: ModalUpdateCompanyType}) {
 
  const {setCompaniesData, toggleShowUpdateSuccess} = useOutletContext<ContextModalUpdateCompanyType>()
    const { showUpdateCompany, handleCloseUpdateCompany, selectedCompanyData, setSelectedCompanyData, setIsLoading } = modalUpdateCompanyProps
    const dataStore = userStore((state: UserState) => state)
    const [isLoadingCompany, setIsLoadingCompany] = React.useState<boolean>(false)
    const [isError, setIsError] = React.useState<errorType>({
      error: false,
      message: ''
    })
    
    const [companyData, setCompanyData] = React.useState<Partial<CompanyType>>({} as CompanyType)
    
    const emptyComp = {
      id_company: null,
      name: '',
      client_id: '',
      client_secret: '',
      username: '',
      scope: '',
      password: '',
      access_token: '',
      refresh_token: '',
      created_at: '',
      updated_at: '',
      numero_tahiti: '',
    }

    React.useEffect(() => {
      setCompanyData({
        client_id: selectedCompanyData?.client_id,
        client_secret: selectedCompanyData.client_secret,
        username: selectedCompanyData.username,
        scope: selectedCompanyData.scope,
        password: selectedCompanyData.password,
      })
    }, [showUpdateCompany])

  
    const handleUpdateCompany = async (e: React.SyntheticEvent) => {
      e.preventDefault()
      setIsLoadingCompany(true)
      setIsError({
        error: false,
        message: '',
      })
      const company_id = companyData ? companyData.id_company : null
      try {
        const response = await CompaniesService.updateCompany(
          dataStore.token,
          companyData,
          company_id
        )

        if (response.status === 200) {
          setIsLoadingCompany(false)

          handleCloseUpdateCompany()
          _getCompaniesData(dataStore.token, setCompaniesData, setIsLoading)
          setSelectedCompanyData({
            id_company: null,
            name: '',
            client_id: '',
            client_secret: '',
            username: '',
            scope: '',
            password: '',
            access_token: '',
            refresh_token: '',
            created_at: '',
            updated_at: '',
            numero_tahiti: '',
          })
          if (toggleShowUpdateSuccess) {
            toggleShowUpdateSuccess()
          }
        }
      } catch (error: unknown) {
        console.log(error)
        if (error instanceof AxiosError) {
          setIsLoadingCompany(false)
          const messageError = JSON.parse(error?.request?.response)?.data.id_company
            ? JSON.parse(error?.request?.response)?.data.id_company
            : error?.response?.data?.message
          setIsError({
            error: true,
            message:
              error?.response?.data?.message + ' : ' + messageError ||
              error?.message ||
              'Une erreur est survenue',
          })
        }
      }
    }

  
    return (
      <Modal show={showUpdateCompany} onHide={handleCloseUpdateCompany}>
        <Form onSubmit={handleUpdateCompany}>
          <Modal.Header className='border-bottom'>
            <Modal.Title>Modifier une compagnie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel controlId='client_id' label='client_id' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='userApi'
                type='text'
                autoComplete='on'
                placeholder='client_id'
                value={companyData?.client_id || ""}
                onChange={(e) => {
                  const client_id = e?.currentTarget?.value

                  setCompanyData((prevData: Partial<CompanyType>) => ({
                    ...prevData,
                    client_id: client_id,
                  }))
                }}
               
              />
            </FloatingLabel>
            <FloatingLabel controlId='client_secret' label='client_secret' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='client_secret'
                type='text'
                autoComplete='on'
                placeholder='client_secret'
                value={companyData?.client_secret || ""}
                onChange={(e) => {
                  const client_secret = e?.currentTarget?.value

                  setCompanyData((prevData: Partial<CompanyType>) => ({
                    ...prevData,
                    client_secret: client_secret,
                  }))
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId='username' label='username' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='username'
                type='text'
                autoComplete='on'
                placeholder='username'
                value={companyData?.username || ""}
                onChange={(e) => {
                  const username = e?.currentTarget?.value

                  setCompanyData((prevData: Partial<CompanyType>) => ({
                    ...prevData,
                    username: username,
                  }))
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId='password' label='password' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='password'
                type='text'
                autoComplete='on'
                placeholder='password'
                value={companyData?.password || ""}
                onChange={(e) => {
                  const password = e?.currentTarget?.value

                  setCompanyData((prevData: Partial<CompanyType>) => ({
                    ...prevData,
                    password: password,
                  }))
                }}
                required
              />
            </FloatingLabel>
            <Alert show={isError.error} variant='danger'>
              <ErrorMessage errorMessageProps={isError} />
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              className='bg-remora-secondary border-remora-secondary'
              onClick={() => {
                handleCloseUpdateCompany()
                setSelectedCompanyData(emptyComp)
              }}
            >
              <i className='ri-close-circle-line me-1'>
                </i>Annuler
            </Button>
            <Button variant='primary'
              className='bg-remora-primary border-remora-primary'
              type='submit'>
            {isLoadingCompany ? (
              <>
                <Spinner variant='light' size='sm' /> Loading
              </>
            ) : (
              <>
                <i className='ri-community-line'></i> Modifier
              </>
            )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }