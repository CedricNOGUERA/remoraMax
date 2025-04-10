import React from 'react'
import { Alert, Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'
import userStore, { UserState } from '../../stores/userStore'
import CompaniesService from '../../services/companies/CompaniesService'
import { _getCompaniesData } from '../../utils/api/totaraApi'
import { errorType } from '../../definitions/errorType'
import { CompanyType } from '../../definitions/CompanyType'
import { AxiosError } from 'axios'

interface ModalAddCompanyType {
  show: boolean 
  handleClose: () => void
  setShowA: React.Dispatch<React.SetStateAction<boolean>>
  setCompaniesData: React.Dispatch<React.SetStateAction<CompanyType[]>> 
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
interface companyType {
  id_company: string | number | string[] | undefined
  name: string
  client_id: string
  client_secret: string
  username: string
  scope: string
} 

export default function ModalAddCompany(modalAddUserProps: ModalAddCompanyType) {
 
    const { show, handleClose, setShowA, setCompaniesData, setIsLoading } = modalAddUserProps

    const dataStore = userStore((state: UserState) => state)
    const [isLoadingCompany, setIsLoadingCompany] = React.useState<boolean>(false)
    const [isError, setIsError] = React.useState<errorType>({
      error: false,
      message: ''
    })
  
    const [companyData, setCompanyData] = React.useState<companyType>({
      id_company: undefined,
      name: '',
      client_id: '',
      client_secret: '',
      username: '',
      scope: 'email profile',
    })
  
  
    const handleAddCompny = async (e: React.SyntheticEvent) => {
      e.preventDefault()
      setIsLoadingCompany(true)
      setIsError({
        error: false,
        message: ''
      })
      try{

        const response = await CompaniesService.addCompany(dataStore.token, companyData)
  
        if (response) {
          handleClose()
          setIsLoadingCompany(false)
          setShowA(true)
          _getCompaniesData(dataStore.token, setCompaniesData, setIsLoading)
          setCompanyData({
            id_company: undefined,
            name: '',
            client_id: '',
            client_secret: '',
            username: '',
            scope: 'email profile',
          })
          setShowA(true)
        }

      }catch(error: unknown){

        setIsLoadingCompany(false)

        let messageError = "Une erreur est survenue";

        if (error instanceof AxiosError) {
          const errorResponse = error.response?.data;
      
          try {
            const parsedError = error?.request?.response ? JSON.parse(error.request.response) : null;
            messageError = parsedError?.data?.id_company || errorResponse?.message || messageError;
          } catch (parseError) {
            messageError = errorResponse?.message || error.message || messageError || parseError;
          }
      
          setIsError({
            error: true,
            message: `${errorResponse?.message || error.message} : ${messageError}`,
          });
        } else {
          setIsError({
            error: true,
            message: error instanceof Error ? error.message : "Une erreur inconnue est survenue",
          });
        }
     
      }
    }

    // console.log(companyData)
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleAddCompny}>
          <Modal.Header className='border-bottom'>
            <Modal.Title>Ajouter une compagnie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel controlId='company_id' label='id_company *' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='idComp'
                type='number'
                autoComplete='on'
                placeholder='Id_company *'
               
                onChange={(e) => {
                  const id_Company = parseInt(e?.currentTarget?.value)

                  setCompanyData((prevData: companyType) => ({
                    ...prevData,
                    id_company: id_Company,
                  }))
                }}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId='company_name' label='Nom *' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='name'
                type='text'
                autoComplete='on'
                placeholder='Nom *'
          
                onChange={(e) => {
                  const name = e?.currentTarget?.value

                  setCompanyData((prevData: companyType) => ({
                    ...prevData,
                    name: name,
                  }))
                }}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId='client_id' label='client_id' className='mb-3'>
              <Form.Control
                className='border border-1 border-secondary mb-3'
                name='userApi'
                type='text'
                autoComplete='on'
                placeholder='client_id'
         
                onChange={(e) => {
                  const client_id = e?.currentTarget?.value

                  setCompanyData((prevData: companyType) => ({
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
                onChange={(e) => {
                  const client_secret = e?.currentTarget?.value

                  setCompanyData((prevData: companyType) => ({
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
                onChange={(e) => {
                  const username = e?.currentTarget?.value

                  setCompanyData((prevData: companyType) => ({
                    ...prevData,
                    username: username,
                  }))
                }}
              />
            </FloatingLabel>
            <Alert show={isError.error} variant='danger' className='d-flex align-items-center mt-3'>
          <i className='ri-close-circle-line fs-4 text-danger me-2'></i>
          <span className='font-85'>
           {isError.message}
            </span> 
          
          </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              className='bg-remora-secondary border-remora-secondary'
              onClick={() => {
                handleClose()
                setCompanyData({
                  id_company: undefined,
                  name: '',
                  client_id: '',
                  client_secret: '',
                  username: '',
                  scope: 'email profile',
                })
              }}
            >
              <i className='ri-close-circle-line me-1'></i>Annuler
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
                <i className='ri-community-line'></i> Ajouter
              </>
            )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }