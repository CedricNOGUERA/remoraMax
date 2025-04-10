import React from 'react'
import { Button, Form, InputGroup, Table } from 'react-bootstrap'
import userStore, { UserState } from '../../stores/userStore'
import { _getTypeNotification } from '../../utils/api/totaraApi'
import NotificationTableTitle from '../../component/notification/NotificationTableTitle'
import {
  AddNotificationModal,
  DeleteNotificationModal,
  UpdateNotificationModal,
} from '../../component/ui/Modal/NotificationModal'
import { ToastAll } from '../../component/ui/Toast/Toastes'
import NotificationBodyTable from '../../component/notification/NotificationBodyTable'



interface CompanyNotificationType {
  id_company: number
  name: string
  numero_tahiti: string
  access_token: string
  created_at: string
  updated_at: string
}

export type NotificationInternalType = {
  id: number
  id_company: number
  name: string
  description: string
  recipients: string
  status_demand: string
  trigger_at: string
  created_at: string
  updated_at: string
  company: CompanyNotificationType
}

export type FeedBackStateType = {
  isLoading: boolean
  isError: boolean
  errorMessage: string
  isActionError: boolean
  actionErrorMessage: string
  isActionLoading: boolean
  isInfo: boolean
  infoMessage: string
  isFiltering: boolean
}

export default function Notifications() {
  const dataStore = userStore((state: UserState) => state)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const [feedbackState, setFeedbackState] = React.useState<FeedBackStateType>({
    isLoading: false,
    isError: false,
    errorMessage: '',
    isActionError: false,
    actionErrorMessage: '',
    isActionLoading: false,
    isInfo: false,
    infoMessage: '',
    isFiltering: false,
  })
  const [notificationData, setNotificationData] = React.useState<
    NotificationInternalType[] | undefined
  >([])
  const [selectedNotification, setSelectedNotification] = React.useState<
    NotificationInternalType | undefined
  >()
  const [filteredData, setFilteredData] = React.useState<
    NotificationInternalType[] | undefined
  >([])
 
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
  const toggleShowAll = () => setShowAll(!showAll)

  ////////////////
  //Modal Section
  ////////////////
  //add notification modal
  const [showAdd, setShowAdd] = React.useState(false)
  const handleCloseAdd = () => setShowAdd(false)
  const handleShowAdd = () => setShowAdd(true)

  //update notification modal
  const [showUpdate, setShowUpdate] = React.useState(false)
  const handleCloseUpdate = () => setShowUpdate(false)
  const handleShowUpdate = () => setShowUpdate(true)

  //delete notification modal
  const [showDelete, setShowDelete] = React.useState(false)
  const handleCloseDelete = () => setShowDelete(false)
  const handleShowDelete = () => setShowDelete(true)
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

  React.useEffect(() => {
    _getTypeNotification(dataStore?.token, setNotificationData, setFeedbackState)
  }, [dataStore?.token])

  const handleFilterNotification = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const filteredData = notificationData?.filter((item: NotificationInternalType) => {
      return (
        item?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.description?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.recipients?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.company?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.status_demand?.toLowerCase()?.includes(value?.toLowerCase())
      )
    })
    if (setFilteredData) {
      if (filteredData && filteredData?.length > 0) {
        setFilteredData(filteredData)
      } else {
        setFeedbackState({
          ...feedbackState,
          isError: true,
          errorMessage: 'Aucun résultat',
        })
      }
    }
    if (value.length === 0) {
      _getTypeNotification(dataStore?.token, setNotificationData, setFeedbackState)
    }
  }

  const dataToMap = filteredData && filteredData?.length > 0 ? filteredData : notificationData

  const notificationBodyTableProps = {
    feedbackState,
    dataToMap,
    setSelectedNotification,
    handleShowUpdate,
    handleShowDelete,
  }

  const addNotificationModalProps = {
    showAdd,
    handleCloseAdd,
    feedbackState,
    setFeedbackState,
    setNotificationData,
    setToastData,
    toggleShowAll,
  }
  const updateNotificationModalProps = {
    showUpdate,
    handleCloseUpdate,
    feedbackState,
    setFeedbackState,
    selectedNotification,
    setNotificationData,
    setToastData,
    toggleShowAll,
  }
  const deleteNotificationModalProps = {
    showDelete,
    handleCloseDelete,
    feedbackState,
    setFeedbackState,
    selectedNotification,
    notificationData,
    setNotificationData,
    setToastData,
    toggleShowAll,
  }
  const toastAllProps = { showAll, toggleShowAll, toastData }

  return (
    <div className='p-1 p-lg-3 pb-5 mb-5 w-100'>
      <h3 className='text-secondary'>Notification</h3>
      <div>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border-0'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              className='border'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              onChange={handleFilterNotification}
            />
          </InputGroup>
        </Form.Group>
      </div>
      <Form>
        <Table striped hover responsive className='responsive-font-small border  py-5 mb-5'>
          <NotificationTableTitle />
          <NotificationBodyTable notificationBodyTableProps={notificationBodyTableProps} />
        </Table>
      </Form>
      <Button className='m-auto fab rounded-pill button-primary ' onClick={handleShowAdd}>
      <i className='ri-add-circle-line'></i>{' '}
        {isVisible && (
          <span className='disp-none border-start ps-2'> Ajouter une notification</span>
        )}
      </Button>
      <AddNotificationModal addNotificationModalProps={addNotificationModalProps} />
      <UpdateNotificationModal updateNotificationModalProps={updateNotificationModalProps} />
      <DeleteNotificationModal deleteNotificationModalProps={deleteNotificationModalProps} />
      <ToastAll toastAllProps={toastAllProps} />
    </div>
  )
}
