import axios, { AxiosInstance } from 'axios'
import { AddProductType, OrderDetailType, ProductDataType } from '../../definitions/OrderType'

const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT
class OrdersService {
  private axiosClient: AxiosInstance

  //////////////////////
  // CONSTRUCTOR
  //////////////////////
  constructor(
    client: AxiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_REMORA_END_POINT, // Point de terminaison commun
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  ) {
    this.axiosClient = client
  }

  async getOrders(token: string | null, page: number, itemPerPage: number) {
    try {
      const response = await this.axiosClient.get('/api/v1/orders/items/company', {
        params: {
          page: page,
          per_page: itemPerPage,
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
  getOrdersByIdConnaissement(token: string | null, id: number | undefined) {
    return axios.get(API_URL_TOTARA + '/api/v1/orders/id_connaissement/' + id, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    })
  }

  updateOrder(token: string | null, order: {
    statut_revatua: string,
    numeroVoyage?: string | null,
    id_connaissement?: number | null,
  }, id: number | null) {
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/orders/' + id,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: order,
    }

    return axios.request(config)
  }
  updateItemsOrder(token: string | null, order: ProductDataType, id: number) {
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/items/' + id,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: order,
    }

    return axios.request(config)
  }
  addItemsOrder(token: string | null, orderData: AddProductType) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/items',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: orderData,
    }

    return axios.request(config)
  }
  filteredOrder(token: string | null, filteringData: string, page: number, itemPerPage: number) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL_TOTARA}/api/v1/orders/search?page=${page}&per_page=${itemPerPage}&${filteringData}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }

    return axios.request(config)
  }

  async filteredSortedOrder(
    token: string | null,
    filteringData: string,
    page: number,
    itemPerPage: number,
    by: string,
    order: string
  ) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL_TOTARA}/api/v1/orders/search?page=${page}&per_page=${itemPerPage}&${filteringData}${
        by ? `&sort_by=${by}&sort_order=${order}` : ''
      }`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }

    return axios.request(config)
  }

  filteredItem(token: string | null, filteringData: OrderDetailType, id: number | null) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL_TOTARA}/api/v1/items/search?id_order=${id}&detail_referenceExterne=${filteringData?.detail_referenceExterne}&detail_nbColis=${filteringData?.detail_nbColis}&detail_description=${filteringData?.detail_description}&detail_poids=${filteringData?.detail_poids}&detail_stockage=${filteringData?.detail_stockage}&detail_codeTarif=${filteringData?.detail_codeTarif}&detail_codeSH=${filteringData?.detail_codeSH}&detail_contenant=${filteringData?.detail_contenant}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }

    return axios.request(config)
  }
}

const orderServiceInstance = new OrdersService();
export default orderServiceInstance;