import React from 'react'
import { Button, Container, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'
import userStore, { UserState } from '../../../stores/userStore'
import {
  _addTypeNotification,
  _deleteTypeNotification,
  _updateTypeNotification,
} from '../../../utils/api/totaraApi'
import waneCompanies from '../../../data/companies/waneCompanies.json'
import { status } from '../../../data/commandes/divers'
import { FeedBackStateType, NotificationInternalType } from '../../../pages/private/Notifications'
import { ToastType } from '../../../definitions/ComponentType'

export type NewNotificationDataType = {
  id_company: number | undefined
  name: string | undefined
  description: string | undefined
  recipients: string | undefined
  status_demand: string | undefined
  trigger_at: string | undefined
}
type InputNotifDataType = {
  type: string
  placeHolder: string
  name: keyof NewNotificationDataType
}
type NotificationModalType = {
  feedbackState: FeedBackStateType
  setFeedbackState: React.Dispatch<React.SetStateAction<FeedBackStateType>>
  setNotificationData: React.Dispatch<React.SetStateAction<NotificationInternalType[] | undefined>>
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>
  toggleShowAll: () => void
}

// Props spécifiques à chaque modal
type AddNotificationModalType = NotificationModalType & {
  showAdd: boolean
  handleCloseAdd: () => void
}

type UpdateNotificationModalType = NotificationModalType & {
  showUpdate: boolean
  handleCloseUpdate: () => void
  selectedNotification: NotificationInternalType | undefined
}

type DeleteNotificationModalType = NotificationModalType & {
  showDelete: boolean
  handleCloseDelete: () => void
  selectedNotification: NotificationInternalType | undefined
  notificationData: NotificationInternalType[] | undefined
}

export function AddNotificationModal({
  addNotificationModalProps,
}: {
  addNotificationModalProps: AddNotificationModalType
}) {
  const dataStore = userStore((state: UserState) => state)
  const isSuperAdmin = dataStore?.roles && dataStore.roles[0]?.name ==='super_admin'
  const companyData: { id_company: number; name: string }[] = isSuperAdmin
  ? waneCompanies
  : waneCompanies?.filter(
      (comp: { id_company: number; name: string }) =>
        comp?.id_company === dataStore?.company?.[0]?.id_company
    )

  const {
    showAdd,
    handleCloseAdd,
    feedbackState,
    setFeedbackState,
    setNotificationData,
    setToastData,
    toggleShowAll,
  } = addNotificationModalProps

  const [newNotificationData, setNewNotificationData] =
    React.useState<NewNotificationDataType>({
      id_company: isSuperAdmin ? undefined : dataStore?.company?.[0]?.id_company,
      name: '',
      description: '',
      recipients: '',
      status_demand: '',
      trigger_at: '',
    })

  const inputNotifData: InputNotifDataType[] = [
    { type: 'text', placeHolder: 'Nom de la notification', name: 'name' },
    { type: 'text', placeHolder: 'Description', name: 'description' },
    { type: 'text', placeHolder: 'Destinataire (email)', name: 'recipients' },
    { type: 'text', placeHolder: 'Déclenchement', name: 'trigger_at' },
  ]

  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          _addTypeNotification(
            dataStore.token,
            newNotificationData,
            setNotificationData,
            setFeedbackState,
            handleCloseAdd,
            setToastData,
            toggleShowAll
          )
        }}
      >
        <Modal.Header className='border-bottom'>
          <Modal.Title>Ajouter une notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId='id_company' label='Compagnie*' className='mb-3'>
            <Form.Select
              name='id_company'
              value={newNotificationData?.id_company || undefined}
              onChange={(e) => {
                const id_company = parseInt(e?.currentTarget?.value)
                setNewNotificationData((prevData: NewNotificationDataType) => ({
                  ...prevData,
                  id_company: id_company,
                }))
              }}
              aria-label='zone'
              className='border border-1 border-secondary my-2 text-ui-second '
              required
            >
              <option value='' className='text-ui-second'>
                Choisir une compagnie
              </option>
              {companyData?.map(
                (comp: { id_company: number; name: string }, index: number) => (
                  <option key={index} value={comp?.id_company}>
                    {comp?.name}
                  </option>
                )
              )}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId='status' label='Statut*' className='mb-3'>
            <Form.Select
              name='status'
              onChange={(e) => {
                const status = e?.currentTarget?.value
                setNewNotificationData((prevData: NewNotificationDataType) => ({
                  ...prevData,
                  status_demand: status,
                }))
              }}
              aria-label='zone'
              className='border border-1 border-secondary my-2 text-ui-second '
              required
            >
              <option value='' className='text-ui-second'>
                Choisir un statut
              </option>
              {status?.map((etat: string, index: number) => (
                <option key={index} value={etat}>
                  {etat}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          {inputNotifData?.map((item: InputNotifDataType, index: number) => (
            <FloatingLabel
              key={index}
              controlId={item?.name}
              label={item?.placeHolder}
              className='mb-3'
            >
              <Form.Control
                className='border border-1 border-secondary'
                name={item?.name}
                type={item?.type}
                autoComplete='on'
                placeholder={item?.placeHolder}
                onChange={(e) => {
                  const data =
                    item?.type === 'number'
                      ? parseInt(e?.currentTarget?.value)
                      : e?.currentTarget?.value
                  setNewNotificationData((prevData: NewNotificationDataType) => ({
                    ...prevData,
                    [item?.name]: data,
                  }))
                }}
                required
              />
            </FloatingLabel>
          ))}
        </Modal.Body>
        <Modal.Footer className='border-0 justify-content-end'>
          <Button variant='secondary' className='' onClick={handleCloseAdd}>
            <i className='ri-close-line me-2'></i>
            Fermer
          </Button>
          <Button type='submit' variant='transparent' className='button-primary'>
            {feedbackState?.isActionLoading ? (
              <span>
                <Spinner size='sm' />{' '}
              </span>
            ) : (
              <i className='ri-check-line me-2'></i>
            )}
            valider
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
export function UpdateNotificationModal({
  updateNotificationModalProps,
}: {
  updateNotificationModalProps: UpdateNotificationModalType
}) {
  const dataStore = userStore((state: UserState) => state)
  const isSuperAdmin = dataStore?.roles && dataStore.roles[0]?.name ==='super_admin'
  const companyData: { id_company: number; name: string }[] = isSuperAdmin
  ? waneCompanies
  : waneCompanies?.filter(
      (comp: { id_company: number; name: string }) =>
        comp?.id_company === dataStore?.company?.[0]?.id_company
    )

  const {
    showUpdate,
    handleCloseUpdate,
    feedbackState,
    setFeedbackState,
    selectedNotification,
    setNotificationData,
    setToastData,
    toggleShowAll,
  } = updateNotificationModalProps

  const [newNotificationData, setNewNotificationData] =
    React.useState<NewNotificationDataType>({
      id_company: undefined,
      name: '',
      description: '',
      recipients: '',
      status_demand: '',
      trigger_at: '',
    })

  const inputNotifData: InputNotifDataType[] = [
    { type: 'text', placeHolder: 'Nom de la notification', name: 'name' },
    { type: 'text', placeHolder: 'Description', name: 'description' },
    { type: 'text', placeHolder: 'Destinataire (email)', name: 'recipients' },
    { type: 'text', placeHolder: 'Déclenchement', name: 'trigger_at' },
  ]

  React.useEffect(() => {
    setNewNotificationData({
      id_company: selectedNotification?.id_company,
      name: selectedNotification?.name,
      description: selectedNotification?.description,
      recipients: selectedNotification?.recipients,
      status_demand: selectedNotification?.status_demand,
      trigger_at: selectedNotification?.trigger_at,
    })
  }, [showUpdate, selectedNotification])

  return (
    <Modal show={showUpdate} onHide={handleCloseUpdate}>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          _updateTypeNotification(
            dataStore.token,
            newNotificationData,
            selectedNotification?.id,
            setFeedbackState,
            setNotificationData,
            handleCloseUpdate,
            setToastData,
            toggleShowAll
          )
        }}
      >
        <Modal.Header className='border-bottom'>
          <Modal.Title>Modifier une notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId='id_company' label='Compagnie*' className='mb-3'>
            <Form.Select
              name='id_company'
              value={newNotificationData?.id_company || undefined}
              onChange={(e) => {
                const id_company = parseInt(e?.currentTarget?.value)
                setNewNotificationData((prevData: NewNotificationDataType) => ({
                  ...prevData,
                  id_company: id_company,
                }))
              }}
              aria-label='zone'
              className='border border-1 border-secondary my-2 text-ui-second '
              required
            >
              <option value='' className='text-ui-second'>
                Choisir une compagnie
              </option>
              {companyData?.map(
                (comp: { id_company: number; name: string }, index: number) => (
                  <option key={index} value={comp?.id_company}>
                    {comp?.name}
                  </option>
                )
              )}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId='status' label='Statut*' className='mb-3'>
            <Form.Select
              name='status'
              value={newNotificationData?.status_demand || ''}
              onChange={(e) => {
                const status = e?.currentTarget?.value
                setNewNotificationData((prevData: NewNotificationDataType) => ({
                  ...prevData,
                  status_demand: status,
                }))
              }}
              aria-label='zone'
              className='border border-1 border-secondary my-2 text-ui-second '
              required
            >
              <option value='' className='text-ui-second'>
                Choisir un statut
              </option>
              {status?.map((etat: string, index: number) => (
                <option key={index} value={etat}>
                  {etat}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          {inputNotifData?.map((item: InputNotifDataType, index: number) => (
            <FloatingLabel
              key={index}
              controlId={item?.name}
              label={item?.placeHolder}
              className='mb-3'
            >
              <Form.Control
                className='border border-1 border-secondary'
                name={item?.name}
                type={item?.type}
                autoComplete='on'
                placeholder={item?.placeHolder}
                value={
                  (newNotificationData?.[item?.name] as keyof NewNotificationDataType) || ''
                }
                onChange={(e) => {
                  const data =
                    item?.type === 'number'
                      ? parseInt(e?.currentTarget?.value)
                      : e?.currentTarget?.value
                  setNewNotificationData((prevData: NewNotificationDataType) => ({
                    ...prevData,
                    [item?.name]: data,
                  }))
                }}
                required
              />
            </FloatingLabel>
          ))}
        </Modal.Body>
        <Modal.Footer className='border-0 justify-content-end'>
          <Button variant='secondary' className='' onClick={handleCloseUpdate}>
            <i className='ri-close-line me-2'></i>
            Fermer
          </Button>
          <Button type='submit' variant='transparent' className='button-primary'>
            {feedbackState?.isActionLoading ? (
              <span>
                <Spinner size='sm' />{' '}
              </span>
            ) : (
              <i className='ri-check-line me-2'></i>
            )}
            valider
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
export function DeleteNotificationModal({
  deleteNotificationModalProps,
}: {
  deleteNotificationModalProps: DeleteNotificationModalType
}) {
  const dataStore = userStore((state: UserState) => state)
  const {
    showDelete,
    handleCloseDelete,
    feedbackState,
    setFeedbackState,
    selectedNotification,
    notificationData,
    setNotificationData,
    setToastData,
    toggleShowAll,
  } = deleteNotificationModalProps
  const [newNotificationData, setNewNotificationData] =
    React.useState<NewNotificationDataType>({
      id_company: undefined,
      name: '',
      description: '',
      recipients: '',
      status_demand: '',
      trigger_at: '',
    })

  React.useEffect(() => {
    setNewNotificationData({
      id_company: selectedNotification?.id_company,
      name: selectedNotification?.name,
      description: selectedNotification?.description,
      recipients: selectedNotification?.recipients,
      status_demand: selectedNotification?.status_demand,
      trigger_at: selectedNotification?.trigger_at,
    })
  }, [showDelete, selectedNotification])

  return (
    <Modal show={showDelete} onHide={handleCloseDelete}>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          _deleteTypeNotification(
            dataStore.token,
            newNotificationData,
            selectedNotification?.id,
            setFeedbackState,
            notificationData,
            setNotificationData,
            handleCloseDelete,
            setToastData,
            toggleShowAll
          )
        }}
      >
        <Modal.Header className='border border-3 border-danger border-bottom-0'>
          <Modal.Title>Supprimer une notification</Modal.Title>
        </Modal.Header>
        <Modal.Body className='border border-3 border-danger border-bottom-0 border-top-0'>
          <Container fluid>
            &Ecirc;tes vous sur de vouloir supprimer cette notification{' '}
          </Container>
        </Modal.Body>
        <Modal.Footer className='border border-3 border-danger border-top-0 justify-content-end'>
          <Button variant='secondary' className='' onClick={handleCloseDelete}>
            <i className='ri-close-line me-2'></i>
            Annuler
          </Button>
          <Button type='submit' variant='danger' className=''>
            {feedbackState?.isActionLoading ? (
              <span>
                <Spinner size='sm' />{' '}
              </span>
            ) : (
              <i className='ri-delete-bin-2-line me-2'></i>
            )}
            Supprimer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
