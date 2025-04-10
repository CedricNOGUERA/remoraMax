import axios, { AxiosInstance } from 'axios'
// import { ProductDataType } from '../../definitions/OrderType'

// const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT
class OrdersService11 {
  private axiosClient: AxiosInstance

  //////////////////////
  // CONSTRUCTOR
  //////////////////////
  constructor(
    client: AxiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_REMORA_END_POINT, // Point de terminaison commun
      // maxBodyLength: Infinity, // ajouter si erreur : ERR_FR_MAX_BODY_LENGTH_EXCEEDED
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  ) {
    this.axiosClient = client
  }


  async filteredSortedOrder11(token: string | null, include: string, page: number, itemPerPage: number,   by: string,
    order: string) {
    try {
      const response = await this.axiosClient.get('/api/v1.1/orders/search', {
        params: {
          include: include,
          page: page,
          per_page: itemPerPage,
          sort_by: by,
          sort_order: order
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      console.error('Error fetching data list:', error)
      throw error // Rejette l'erreur pour être gérée par l'appelant
    }
  }
}

const orderServiceInstance11 = new OrdersService11();
export default orderServiceInstance11;