import UserService from '../../services/user/UserService'
import CompaniesService from '../../services/companies/CompaniesService'
import OrdersService from '../../services/orders/OrdersService'
import { FormForgotType, UserType } from '../../definitions/UserType'
import React, { SetStateAction } from 'react'
import { CompanyType } from '../../definitions/CompanyType'
import { AddProductType, OrderDetailType, OrderType, ProductDataType } from '../../definitions/OrderType'
import { errorType } from '../../definitions/errorType'
import { UserState } from '../../stores/userStore'
import { _errorForgotPass } from '../errors'
import authServiceInstance from '../../services/Auth/AuthService'
import notificationServiceInstance from '../../services/notifications/NotificationService'
import { FeedBackStateType, NotificationInternalType } from '../../pages/private/Notifications'
import { ToastType } from '../../definitions/ComponentType'
import { NewNotificationDataType } from '../../component/ui/Modal/NotificationModal'
import { NotificationType } from '../../definitions/NotificationType'
import { AxiosError } from 'axios'
import { NavigateFunction } from 'react-router-dom'
import { statusType } from '../../definitions/statusType'
import { OrderDataType } from '../../definitions/ResponseType'
// import { OrderDataType } from '../../definitions/ResponseType'


interface formAttributeType {
  isView: boolean
  isView2: boolean
  isValidPassword: boolean
  isError: boolean
  isLoadingAuth: boolean
  isLodaingReset: boolean
  errorMessage: string | undefined
}

/////////////////////////
///users
////////////////////////

export const _getUsersData = async (
  token: string | null,
  setUserData: React.Dispatch<SetStateAction<UserType[]>>,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
) => {
  setIsLoading(true)
  try {
    let page = 1
    let allUsers: UserType[] = []
    let hasMorePages = true

    while (hasMorePages) {
      const response = await UserService.getUsers(token, page)
      allUsers = [...allUsers, ...response.data.data]

      if (response.data.meta.current_page < response.data.meta.last_page) {
        page++
      } else {
        hasMorePages = false
      }
    }

    // setUserData(response?.data.data)
    if (setUserData) {
      setUserData(allUsers)
    }
    setIsLoading(false)
  } catch (error) {
    console.log(error)
  }
}

export const _forgotPassword = async (
  email: string,
  toastData: ToastType,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void,
  handleCloseForgotPassWord: () => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true)
  try {
    await UserService.forgotUserPassword(email)
    toggleShowAll()
    setToastData({
      ...toastData,
      bg: 'success',
      message: 'Email envoyé',
      icon: 'checkbox-circle',
    })
    handleCloseForgotPassWord()
    setIsLoading(false)
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof AxiosError) {
      toggleShowAll()
      setToastData({
        ...toastData,
        bg: 'danger',
        message: _errorForgotPass(error?.response?.data?.message),
        icon: 'error-warning',
      })
      handleCloseForgotPassWord()
      setIsLoading(false)
    }
  }
}

export const _resetUserPassword = async (
  data: FormForgotType,
  toastData: ToastType,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void,
  navigate: NavigateFunction,
  formAttribute: formAttributeType,
  setFormAttribute: React.Dispatch<React.SetStateAction<formAttributeType>>
) => {
  setFormAttribute({
    ...formAttribute,
    isLoadingAuth: true,
  })
  try {
    await UserService.resetPassword(data)

    toggleShowAll()
    setToastData({
      ...toastData,
      bg: 'success',
      message: 'Votre mot de passe a été réinitialisé, vous allez être redirigé',
      icon: 'checkbox-circle',
    })
    setFormAttribute({
      ...formAttribute,
      isLoadingAuth: false,
    })
    setTimeout(() => {
      navigate('/connexion')
    }, 7000)
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof AxiosError) {
      toggleShowAll()
      setToastData({
        ...toastData,
        bg: 'danger',
        message: _errorForgotPass(error?.response?.data?.message),
        icon: 'error-warning',
      })
      setFormAttribute({
        ...formAttribute,
        isLoadingAuth: false,
      })
    }
  }
}



//delete user

export const _handleDeleteUser = async (
  token: string | null,
  userId: number | null | undefined,
  setIsLoadingModal: React.Dispatch<React.SetStateAction<boolean>>,
  userData: UserType[],
  setUserData: React.Dispatch<React.SetStateAction<UserType[]>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void,
  handleCloseDeleteUser: () => void
) => {
  setIsLoadingModal(true)
  try {
    const response = await UserService.deleteUsers(token, userId)
    // _getUsersData(dataStore.token, setUserData, setIsLoading)
    if (response.status === 200) {
      const filteredUser = userData.filter((user: UserType) => user.id !== userId)
      setUserData(filteredUser)
      setToastData((prev: ToastType) => ({
        ...prev,
        bg: 'success',
        message: 'Utilisateur supprimé avec succès',
        icon: 'checkbox-circle',
      }))
      toggleShowAll()
    }
  } catch (error) {
    console.log(error)
    setToastData((prev: ToastType) => ({
      ...prev,
      bg: 'danger',
      message: 'Une est survenue!!!',
      icon: 'warning-error',
    }))
    toggleShowAll()
  } finally {
    handleCloseDeleteUser()
    setIsLoadingModal(false)
  }
}
 

////////////////////////
///companies
///////////////////////

export const _getCompaniesData = async (
  token: string | null,
  setCompaniesData: React.Dispatch<SetStateAction<CompanyType[]>>,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
) => {
  setIsLoading(true)

  try {
    let page = 1
    let allCompanies: CompanyType[] = []
    let hasMorePages = true

    while (hasMorePages) {
      const response = await CompaniesService.getCompanies(token, page)
      allCompanies = [...allCompanies, ...response.data.data]

      if (response.data.meta.current_page < response.data.meta.last_page) {
        page++
      } else {
        hasMorePages = false
      }
    }
    if(setCompaniesData){
      setCompaniesData(allCompanies)
    }
  } catch (error) {
    setIsLoading(false)
    console.log(error)
  } finally {
    setIsLoading(false)
  }
}

////////////////////////
///Orders
///////////////////////

//formatte orders

export const _transformDataToNested = (data: OrderDataType[]) => {
  const result: OrderType[] = []
  data?.forEach((item: OrderDataType) => {
    result.push({
      expediteur: {
        denomination: item.expediteur_denomination,
        telephone: item.expediteur_telephone,
        mail: item.expediteur_mail,
        numeroTahiti: item.expediteur_numeroTahiti,
      },

      id: item.id,
      id_connaissement: item.id_connaissement,
      id_company: item.company?.id_company,
      numeroVoyage: item.numeroVoyage,
      paiement: item.paiement,
      ileDepart: item.ileDepart,
      ileArrivee: item.ileArrivee,
      lieuArrivee: item.lieuArrivee,
      date_creation: item.date_creation,
      date_etl: item.date_etl,
      dateFacture: item.date_facture,
      dateLivraison: item.date_livraison,
      date_modification: item.date_modification,
      numeroCommande: item.numero_commande,
      navire: item?.bateau?.replace(/Bateau /g, ''),
      stockage: item?.stockage,
      statusRevatua: item.statut_revatua,
      referenceHorsRevatua: item.referenceHorsRevatua,
      destinataire: {
        denomination: item.destinataire_denomination,
        telephone: item.destinataire_telephone,
        mail: item.destinataire_mail,
        numeroTahiti: item.destinataire_numeroTahiti,
      },
      items: item.items,
    })
  })
  return result
}

//switch status order : A_PLANIFIER/A_DEPLANIFIER
export const _switchStatus = async (
  token: string | null,
  status: statusType,
  id: number | null,
  setErrorOrderMessage: React.Dispatch<React.SetStateAction<{
    error: boolean;
    message: string;
}>>,
  dataOrder: OrderType[],
  setDataOrder: React.Dispatch<React.SetStateAction<OrderType[]>>,
  toggleShowErrorOrder: () => void
) => {
  const bodyData = {
    statut_revatua: status,
  }
  setErrorOrderMessage({
    error: false,
    message: '',
  })

  try {
    const orderPromises = await OrdersService.updateOrder(token, bodyData, id)

    if (orderPromises.status === 200) {
      console.log(dataOrder)
      const order = dataOrder?.map((order: OrderType) => {
        if (order.id === id) {
          return {
            ...order,
            statusRevatua: status,
          }
        }
        return order
      })
      console.log(order)
      setDataOrder(order)
    }
  } catch (error: unknown) {
    console.log(error)

    if (error instanceof AxiosError) {
      const messageError = JSON.parse(error?.request.responseText)?.data?.statut_revatua
      ? JSON.parse(error?.request.responseText)?.data?.statut_revatua[0]
      : error?.response?.data?.data?.message
      toggleShowErrorOrder()
      setErrorOrderMessage({
        error: true,
        message: messageError,
      })
    }
  }
}

//Get orders id from connaissement id
export const _getOrdersByOneIdBill = async (
  id: number | undefined,
  idsOrder: number[],
  toggleShowOrderError: () => void,
  dataStore: UserState,
  setIsError: React.Dispatch<SetStateAction<errorType>>,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>,
  setIsClickable: React.Dispatch<SetStateAction<boolean>>
) => {
  setIsError({
    error: false,
    message: '',
  })
  setIsLoading(true)
  setIsClickable(true)
  try {
    await OrdersService.getOrdersByIdConnaissement(dataStore.token, id)
      .then((response) => {
        response?.data?.data?.map((order: OrderType) => {
          setIsLoading(false)
          setIsClickable(false)
          return order.id && idsOrder.push(order?.id)
        })
      })
      .catch((error: unknown) => {
        console.log(error)

        if(error instanceof AxiosError){

          setIsLoading(false)
          setIsClickable(true)
          setIsError({
            error: true,
            message: error?.response?.data?.message,
          })
          toggleShowOrderError()
        }
      })
  } catch (error) {
    console.log(error)
    setIsLoading(false)
    setIsClickable(false)
  }
}

// reset order in DB
export const _resetOrderInDb = (
  token: string | null,
  idsOrder: number[],
  toggleShowOrderError: () => void,
  setIsError: React.Dispatch<SetStateAction<errorType>>,
  setShowOrderError: React.Dispatch<SetStateAction<boolean>>
) => {
  //reset error message
  setIsError({
    error: false,
    message: '',
  })
  //close the error pop up
  setShowOrderError(false)
  //new order(s) values
  const bodyData = {
    statut_revatua: 'A_PLANIFIER',
    numeroVoyage: null,
    id_connaissement: null,
  }

  try {
    //update the order
    idsOrder?.map((id: number) => OrdersService.updateOrder(token, bodyData, id))
    console.log('reset')
  } catch (error: unknown) {
    console.log(error)
    if(error instanceof AxiosError){
      console.log(error)
      setIsError({
        error: true,
        message: error?.response?.data?.message,
      })
      toggleShowOrderError()
    }
  }
}

////////////////////////
///Notifications (user)
///////////////////////
//get alert
export const _getNotification = async (
  token: string | null,
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[] | undefined>>
) => {
  try {
    const response = await notificationServiceInstance.getNotification(token)
   
    setNotifications(response?.data?.data)
  } catch (error) {
    console.log(error)
  }
}
//change notification status to read
export const _patchNotification = async (
  token: string | null,
  id: number,
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[] | undefined>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void
) => {
  try {
    const response = await notificationServiceInstance.patchNotification(token, id)
    _getNotification(token, setNotifications)
    setToastData((prev: ToastType) => ({
      ...prev,
      bg: 'success',
      message: response?.data?.message,
      icon: 'checkbox-circle',
    })
  )
    toggleShowAll()
  } catch (error) {
    console.log(error)
  }
}

////////////////////////
///Notifications (admin)
///////////////////////

export const _getTypeNotification = async (
  token: string | null,
  setNotificationData: React.Dispatch<SetStateAction<NotificationInternalType[] | undefined>>,
  setFeedbackState: React.Dispatch<SetStateAction<FeedBackStateType>>
) => {
  setFeedbackState((prev: FeedBackStateType) => ({
    ...prev,
    isLoading: true,
  }))
  try {
    const response = await notificationServiceInstance.getNoficationTypes(token)
     
    setNotificationData(response?.data?.data)

  } catch (error: unknown) {
    console.log(error)

    let messageError = "Une erreur est survenue";

    if (error instanceof AxiosError) {

      const errorResponse = error.response?.data;
      try {
        const parsedError = error?.request?.response ? JSON.parse(error.request.response) : null;
        messageError = parsedError?.data?.id_company || errorResponse?.message || messageError;
      } catch (parseError) {
        messageError = errorResponse?.message || error.message || messageError || parseError;
      }
      setFeedbackState((prev: FeedBackStateType) => ({
        ...prev,
        isError: true,
        actionErrorMessage: `${errorResponse?.message} : ${messageError}`
      }))

    } else {

      setFeedbackState((prev: FeedBackStateType) => ({
        ...prev,
        isError: true,
        actionErrorMessage: error instanceof Error ? error.message : "Une erreur inconnue est survenue",
      }))
     
    }

  } finally {
    setFeedbackState((prev: FeedBackStateType) => ({
      ...prev,
      isLoading: false,
    }))
  }
}

export const _addTypeNotification = async (
  token: string | null,
  data: NewNotificationDataType,
  setNotificationData: React.Dispatch<SetStateAction<NotificationInternalType[] | undefined>>,
  setFeedbackState: React.Dispatch<SetStateAction<FeedBackStateType>>,
  handleCloseAdd: () => void,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void
) => {
  setFeedbackState((prev: FeedBackStateType) => ({
    ...prev,
    isActionLoading: true,
  }))
  try {
    const response = await notificationServiceInstance.postNotificationType(token, data,
       setToastData, toggleShowAll
      )

    if (response?.status === 201) {
      _getTypeNotification(token, setNotificationData, setFeedbackState)
      handleCloseAdd()
      setToastData((prev: ToastType) => ({
        ...prev,
        bg: 'success',
        message: response?.data?.message,
        icon: 'checkbox-circle',
      }))
      toggleShowAll()
    }
  } catch (error: unknown) {
    console.log(error)
    if(error instanceof AxiosError){

      setFeedbackState((prev: FeedBackStateType) => ({
        ...prev,
      isActionError: true,
      actionErrorMessage: error?.response?.data?.message,
    }))
    const meassgeError = error?.response?.data?.message ? error?.response?.data?.message : "erreur"
    setToastData((prev: ToastType) => ({
      ...prev,
      bg: 'danger',
      message: meassgeError,
      icon: 'error-warning',
    }))
    toggleShowAll()
  }
  } finally {
    setFeedbackState((prev: FeedBackStateType) => ({
      ...prev,
      isActionLoading: false,
    }))
  }
}

export const _updateTypeNotification = async (
  token: string | null,
  data: NewNotificationDataType,
  id: number | undefined,
  setFeedbackState: React.Dispatch<SetStateAction<FeedBackStateType>>,
  setNotificationData: React.Dispatch<SetStateAction<NotificationInternalType[] | undefined>>,
  handleCloseUpdate: () => void,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void
) => {
  setFeedbackState((prev: FeedBackStateType) => ({
    ...prev,
    isActionLoading: true,
  }))
  try {
    const response = await notificationServiceInstance.patchNotificationType(
      token,
      data,
      id,
      setToastData,
      toggleShowAll
    )
    console.log(response)
    if (response?.status === 200) {
      _getTypeNotification(token, setNotificationData, setFeedbackState)
      handleCloseUpdate()
      setToastData((prev: ToastType) => ({
        ...prev,
        bg: 'success',
        message: response?.data?.message ? response?.data?.message : 'Notification modifiée',
        icon: 'checkbox-circle',
      }))
      toggleShowAll()
    }
  } catch (error: unknown) {
    console.log(error)

    if(error instanceof AxiosError){
      setFeedbackState((prev: FeedBackStateType) => ({
        ...prev,
        isActionError: true,
        actionErrorMessage: error?.response?.data?.message
        ? error?.response?.data?.message
        : "Une erreur s'est produite",
      }))
    }
      
  } finally {
    setFeedbackState((prev: FeedBackStateType) => ({
      ...prev,
      isActionLoading: false,
    }))
  }
}

export const _deleteTypeNotification = async (
  token: string | null,
  data: NewNotificationDataType,
  id: number | undefined,
  setFeedbackState: React.Dispatch<SetStateAction<FeedBackStateType>>,
  notificationData: NotificationInternalType[] | undefined,
  setNotificationData: React.Dispatch<SetStateAction<NotificationInternalType[] | undefined>>,
  handleCloseUpdate: () => void,
  setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
  toggleShowAll: () => void
) => {
  setFeedbackState((prev: FeedBackStateType) => ({
    ...prev,
    isActionLoading: true,
  }))
  try {
    const response = await notificationServiceInstance.deleteNotificationType(
      token,
      data,
      id,
      setToastData,
      toggleShowAll
    )

    if (response?.status === 200) {
      _getTypeNotification(token, setNotificationData, setFeedbackState)
      const newData = notificationData?.filter((notif: NotificationInternalType) => notif.id !== id)
      setNotificationData(newData)
      handleCloseUpdate()
      setToastData((prev: ToastType) => ({
        ...prev,
        bg: 'success',
        message: response?.data?.message ? response?.data?.message : 'Notification supprimée',
        icon: 'checkbox-circle',
      }))
      toggleShowAll()
    }
  } catch (error: unknown) {

    console.log(error)

    if (error instanceof AxiosError) {
      setFeedbackState((prev: FeedBackStateType) => ({
        ...prev,
        isActionError: true,
        actionErrorMessage: error?.response?.data?.message,
      }))
      setToastData((prev: ToastType) => ({
        ...prev,
        bg: 'danger',
        message: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Une erreur s'est produite",
        icon: 'error-warning',
      }))
      toggleShowAll()
    }
  } finally {
    setFeedbackState((prev: FeedBackStateType) => ({
      ...prev,
      isActionLoading: false,
    }))
  }
}

////////////////////////
///Products (Orders)
///////////////////////


//add a product in existing order (stand by)
export const _handleAddproduct = async (token: string | null, orderData: AddProductType) => {
  try {
    await OrdersService.addItemsOrder(token, orderData)
  } catch (error) {
    console.log(error)
  }
}

//edit a product
export const _handleUpdateProduct = async (
  token: string | null,
  orderData: ProductDataType,
  id: number,
  setIsError: React.Dispatch<SetStateAction<errorType>>,
  handleCloseUpdateProductModal: () => void,
  setSelectedOrder:  React.Dispatch<SetStateAction<OrderType>>,
  updatedProducts: OrderDetailType[],
  setDataOrder: React.Dispatch<SetStateAction<OrderType[]>>,
  updatedOrder: OrderType[]
) => {
  setIsError({
    error: false,
    message: '',
  })
  const possibleFields = [
    'detail_nbColis',
    'detail_description',
    'detail_codeSH',
    'detail_codeTarif',
    'detail_stockage',
    'detail_poids',
    'detail_referenceExterne',
  ]
  try {
    await OrdersService.updateItemsOrder(token, orderData, id)
    setIsError({
      error: false,
      message: '',
    })

    // Mise à jour de l'état selectedOrder avec les produits mis à jour
    setSelectedOrder((prevOrder: OrderType) => ({
      ...prevOrder,
      items: updatedProducts,
    }))
    // Mise à jour des factures en local
    setDataOrder(updatedOrder)

    handleCloseUpdateProductModal()
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof AxiosError) {
      const customMessage = error?.response?.data?.error

      // Expression régulière pour capturer les champs sous la forme "variable = ?"
      const regex = /`(\w+)` = \?/g
      let match
      const fieldsInError = []

      // Chercher toutes les occurrences de "variable = ?"
      while ((match = regex.exec(customMessage)) !== null) {
        const fieldName = match[1]
        if (possibleFields.includes(fieldName)) {
          fieldsInError.push(fieldName)
        }
      }

      if (fieldsInError.length > 0) {
        setIsError({
          error: true,
          message: `Les champs suivants causent l'erreur: ${fieldsInError.join(', ')}`,
          // message: "La colonne 'detail_stockage' est impliquée dans l'erreur."
        })
      } else {
        setIsError({
          error: true,
          message: error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message === 'Network Error'
            ? 'Une erreur est survenue. Vérifiez votre connexion et réessayer.'
            : error?.message,
        })
      }
    }
  }
}

//////////////////
//auth
//////////////////

export const _userLogout = async (token: string | null) => {
  try {
    const response = await authServiceInstance.logout(token)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}
