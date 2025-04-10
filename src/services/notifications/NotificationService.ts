import axios, { AxiosError, AxiosInstance } from 'axios'
import { ToastType } from '../../definitions/ComponentType'
import { NewNotificationDataType } from '../../component/ui/Modal/NotificationModal'

const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT
class NotificationService {
  private axiosClient: AxiosInstance

  //////////////////////
  // CONSTRUCTOR
  //////////////////////
  constructor(
    client: AxiosInstance = axios.create({
      baseURL: API_URL_TOTARA,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  ) {
    this.axiosClient = client
  }

  ////////////////////////
///Notifications (admin)
///////////////////////

  async getNoficationTypes(token: string | null) {
    try {
      const response = await this.axiosClient.get('/api/v1/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  async postNotificationType(
    token: string | null,
    data: NewNotificationDataType,
    setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
    toggleShowAll: () => void
  ) {
    try {
      // const response = await this.axiosClient.post('/api/v1/notifications',   {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   data: data,
      // })
      // return response
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_URL_TOTARA}/api/v1/notifications`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
        data: data,
      }
      return axios.request(config)
    } catch(error) {
      console.log(error)

        setToastData((prev: ToastType) => ({
          ...prev,
          bg: 'danger',
          message: "Une erreur s'est produite lors de l'ajout",
          icon: 'error-warning',
        }))
        toggleShowAll()
    }
  }

  async patchNotificationType(
    token: string | null,
    data: NewNotificationDataType,
    id: number | undefined,
    setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
    toggleShowAll: () => void
  ) {
    try {
      const response = await this.axiosClient.patch(`/api/v1/notifications/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      console.log(error)
        setToastData((prev: ToastType) => ({
          ...prev,
          bg: 'danger',
          message: "Une erreur s'est produite lors de la modification",
          icon: 'error-warning',
        }))
        toggleShowAll()
    }
  }

  async deleteNotificationType(
    token: string | null,
    data: NewNotificationDataType,
    id: number | undefined,
    setToastData: React.Dispatch<React.SetStateAction<ToastType>>,
    toggleShowAll: () => void
  ) {
    try {
      const response = await this.axiosClient.delete(`/api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      })
      return response
    } catch (error: unknown) {
      console.log(error)
      setToastData((prev: ToastType) => ({
        ...prev,
        bg: 'danger',
        message:  "Une erreur s'est produite lors de la suppression",
        icon: 'error-warning',
      }))
      toggleShowAll()
    }
  }

  ////////////////////////
///Notifications (user)
///////////////////////
  //liste des notifications envoyés aux utilisateurs d'une compagnie
  async getNotification(token: string | null) {
    try {
      const response = await this.axiosClient.get('/api/v1/notifications/latest', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      console.log('Error fetching data list:', error)
      throw error
    }
  }

  //Marque comme lue la notification sélectionnée
  async patchNotification(token: string | null, id: number) {
    if (!token) {
      throw new Error('Token is missing or invalid')
    }
    try {
      const response = await this.axiosClient.patch(
        `/api/v1/notifications/history/${id}/read`,
        {}, // corps vide
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response
    } catch (error: unknown) {
      console.error('Error patching data :', error)
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Response error:', error.response.data)
        } else if (error.request) {
          console.error('Request error:', error.request)
        } else {
          console.error('Unknown error:', error.message)
        }
        throw error
      }
    }
  }
}

const notificationServiceInstance = new NotificationService()
export default notificationServiceInstance
