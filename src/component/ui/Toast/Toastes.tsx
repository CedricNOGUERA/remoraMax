import React from 'react';
import { ToastContainer, Toast, Alert } from 'react-bootstrap'
import { ToastAllType, ToastCurrentTripType, ToastInfoType, ToastSendedBrouillonType } from '../../../definitions/ComponentType';


export  function ToastCurrentTrip({toastCurrentTripProps}: {toastCurrentTripProps: ToastCurrentTripType}) {
    const {showA, toggleShowA} = toastCurrentTripProps;
  return (
    <ToastContainer  containerPosition='fixed' position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
        <Toast show={showA} onClose={toggleShowA} delay={5000} autohide>
          <Alert
            variant='danger'
            className='p-3 mb-0 d-flex justify-content-start align-items-center'
          >
            <i className='ri-close-circle-line text-danger fs-3 me-2'></i>{' '}
            <strong className=''>Ce voyage est en cours, choisissez en un autre !</strong>
          </Alert>
        </Toast>
      </ToastContainer>
  )
}

export  function ToastSendedBrouillon({toastSendedBrouillonProps}: {toastSendedBrouillonProps: ToastSendedBrouillonType}) {
    const {showBrouillon, toggleShowBrouillon} = toastSendedBrouillonProps;
  return (
    <ToastContainer  containerPosition='fixed' position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
        <Toast show={showBrouillon} onClose={toggleShowBrouillon} delay={5000} autohide>
          <Alert
            variant='success'
            className='p-3 mb-0 d-flex justify-content-start align-items-center'
          >
            <i className='ri-checkbox-circle-line text-success fs-3 me-2'></i>{' '}
            <strong className=''>Brouillon créé avec Success !</strong>
          </Alert>
        </Toast>
      </ToastContainer>
  )
}

export function ToastUpdateUserSuccess({toastUpdateUserSuccessProps}: {toastUpdateUserSuccessProps: ToastUpdateUserSuccessType}) {
const {showUpdateSuccess, toggleShowUpdateSuccess} = toastUpdateUserSuccessProps;
  return (
    <ToastContainer containerPosition='fixed' position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
        <Toast
          show={showUpdateSuccess}
          onClose={toggleShowUpdateSuccess}
            delay={3000} autohide
        >
          <Alert  
            variant='success'
            className='p-3 mb-0 d-flex justify-content-start align-items-center'
          >
            <i className='ri-checkbox-circle-line text-success fs-3 me-2'></i>{' '}
            <strong className=''>Modification effectuée avec succès !</strong>
          </Alert>
        </Toast>
      </ToastContainer>
  )
}

export function ToastDeleteSuccess({toastDeleteSuccessProps}: any) {
const {showDeleteSuccess, toggleShowDeleteSuccess} = toastDeleteSuccessProps;
  return (
    <ToastContainer containerPosition='fixed' position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
        <Toast
          show={showDeleteSuccess}
          onClose={toggleShowDeleteSuccess}
            delay={3000} autohide
        >
          <Alert  
            variant='success'
            className='p-3 mb-0 d-flex justify-content-start align-items-center'
          >
            <i className='ri-checkbox-circle-line text-success fs-3 me-2'></i>{' '}
            <strong className=''>Suppression effectuée avec succès !</strong>
          </Alert>
        </Toast>
      </ToastContainer>
  )
}

export function ToastDeleteError({toastDeleteErrorProps}: any){

  const {showDeleteError, toggleShowDeleteError} = toastDeleteErrorProps

  return(
    <ToastContainer containerPosition='fixed' position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
    <Toast show={showDeleteError} onClose={toggleShowDeleteError} delay={5000} autohide>
      <Alert
        variant='warning'
        className='p-3 mb-0 d-flex justify-content-start align-items-center'
      >
      <i className='ri-error-warning-line text-danger me-2 fs-4'></i> {' '} Ce connaissement ne peut être supprimé, mais ces commandes ont été réinitialisées 
      </Alert>
    </Toast>
  </ToastContainer>
  )
}

export function ToastError({toastErrorProps}: any) {
  const {showOrderError, toggleShowOrderError, isError} = toastErrorProps; 

  return(
    <ToastContainer containerPosition='fixed' position='top-end' className='mt-2 me-2' style={{ zIndex: 1500000 }}>
    <Toast show={showOrderError} onClose={toggleShowOrderError} delay={5000} autohide>
      <Alert
        variant='danger'
        className='p-3 mb-0 d-flex justify-content-start align-items-center'
      >
      <i className='ri-error-warning-line text-danger me-2 fs-4'></i> {' '} {isError?.message}
      </Alert>
    </Toast>
  </ToastContainer>
  )
}

export function ToastErrorOrder({toastErrorOrderProps}: any) {
  const {showErrorOrder, toggleShowErrorOrder, errorOrderMessage} = toastErrorOrderProps;

  return (

    <React.Fragment>
      {errorOrderMessage?.error && (
      <ToastContainer
        containerPosition='fixed'
        position='top-end'
        className='mt-2 me-2'
        style={{ zIndex: 1500000 }}
      >
        <Toast
          show={showErrorOrder}
          onClose={toggleShowErrorOrder}
          bg='danger'
          className='text-light p-3'
          delay={10000}
          autohide
        >
          <i className='ri-error-warning-line fs-2 text-light  me-3'></i>
          {errorOrderMessage?.message}
        </Toast>
      </ToastContainer>
      )}
    </React.Fragment>
  )
}

export function ToastInfo({toastInfoProps}: {toastInfoProps: ToastInfoType}) {

  const {showInfo, toggleShowInfo, infoOrder} = toastInfoProps;

  return (
    <ToastContainer
          containerPosition='fixed'
          position='top-center'
          className='mt-2 me-2'
          style={{ zIndex: 1500000 }}
        >
          <Toast
            show={showInfo}
            onClose={toggleShowInfo}
            
            className='d-flex align-items-center bg-remora-primary text-light py-3 px-2'
            delay={5000}
            autohide
          >
            <i className='ri-error-warning-line fs-2 text-light  me-2'></i>
            {infoOrder}
         
          </Toast>
        </ToastContainer>
  )
}

export function ToastAll({toastAllProps}: {toastAllProps: ToastAllType}) {

  const {showAll, toggleShowAll, toastData} = toastAllProps;

  return (
    <ToastContainer
      containerPosition='fixed'
      position='top-center'
      className='mt-2 me-2'
      style={{ zIndex: 1500000 }}
    >
      <Toast show={showAll} onClose={toggleShowAll} delay={6000} autohide>
        <Alert
          variant={toastData?.bg}
          className='p-3 mb-0 d-flex justify-content-start align-items-center'
        >
          <i className={`ri-${toastData?.icon}-line fs-2 text-${toastData?.bg} me-2`}></i>
          {toastData?.message}
        </Alert>
      </Toast>
    </ToastContainer>
  )
}