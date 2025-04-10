import React from 'react'
import { Alert, Button, Toast, ToastContainer } from 'react-bootstrap'
import ModalAddCompany from '../company/ModalAddCompany';
import { CompanyType } from '../../definitions/CompanyType';

interface FloatingAddButtonType {
  setCompaniesData: React.Dispatch<React.SetStateAction<CompanyType[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>> 
}

export default function FloatingAddButton({floatingAddCompanyButtonProps}: {floatingAddCompanyButtonProps: FloatingAddButtonType}) {
  const {setCompaniesData, setIsLoading} = floatingAddCompanyButtonProps;
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
    const [show, setShow] = React.useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showA, setShowA] = React.useState<boolean>(false);
  const toggleShowA = () => setShowA(!showA);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY < 260) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const modalAddCompaniesProps = {show, handleClose, setShowA, setCompaniesData, setIsLoading}

  return (
    <React.Fragment>
      <Button variant='light' className='fab rounded-pill button-primary' onClick={handleShow}>
        <i className='ri-add-circle-line'></i>{' '}
        {isVisible && (
          <span className='disp-none border-start ps-2'> Ajouter une compagnie</span>
        )}
      </Button>
      <ModalAddCompany {...modalAddCompaniesProps} />
      <ToastContainer position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
        <Toast show={showA} onClose={toggleShowA} delay={3000} autohide>
          <Alert
            variant='success'
            className='p-3 mb-0 d-flex justify-content-start align-items-center'
          >
            <i className='ri-checkbox-circle-line text-success fs-3 me-2'></i>{' '}
            <strong className=''>Compagnie ajouté avec succès !</strong>
          </Alert>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  )
}
