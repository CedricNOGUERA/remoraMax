import React from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import userStore, { UserState } from '../../stores/userStore'
import { UserType } from '../../definitions/UserType'
import { ToastType } from '../../definitions/ComponentType'
import { _handleDeleteUser } from '../../utils/api/totaraApi'

interface MoadlDeleteUserType {
  showDeleteUser: boolean
  handleCloseDeleteUser: () => void
  selectedUserData: UserType | undefined
  isLoadingModal: boolean
  setIsLoadingModal: any
  userData: UserType[]
  setUserData: React.Dispatch<React.SetStateAction<UserType[]>>
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>
  toggleShowAll: () => void
}

export default function MoadlDeleteUser({
  modalDeleteUserProps,
}: {
  modalDeleteUserProps: MoadlDeleteUserType
}) {
  const {
    showDeleteUser,
    handleCloseDeleteUser,
    selectedUserData,
    isLoadingModal,
    setIsLoadingModal,
    userData,
    setUserData,
    setToastData,
    toggleShowAll,
  } = modalDeleteUserProps
  const dataStore = userStore((state: UserState) => state)
  return (
    <Modal show={showDeleteUser} onHide={handleCloseDeleteUser}>
      <Modal.Header closeButton className='border border-3 border-danger border-bottom-0'>
        <Modal.Title>
          {' '}
          <i className='ri-error-warning-line text-danger fs-3'></i> Supprimer un utilisateur
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='border border-3 border-danger border-bottom-0 border-top-0'>
        &Ecirc;tes-vous sûr de vouloir continuer cette action ?
        <br />
        L'utilisateur <strong>{selectedUserData?.name}</strong> sera définitivement supprimer.
      </Modal.Body>
      <Modal.Footer className='border border-3 border-danger border-top-0'>
        <Button variant='secondary' onClick={handleCloseDeleteUser}>
          Annuler
        </Button>
        <Button
          variant='danger'
          // onClick={() => handleDeleteUser(dataStore.token, selectedUserData?.id)}
          onClick={() =>
            _handleDeleteUser(
              dataStore.token,
              selectedUserData?.id,
              setIsLoadingModal,
              userData,
              setUserData,
              setToastData,
              toggleShowAll,
              handleCloseDeleteUser
            )
          }
        >
          {isLoadingModal ? (
            <span className='text-light'>
              <Spinner size='sm' variant='light' /> loading
            </span>
          ) : (
            <span className=''>Supprimer</span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
