import axios, { AxiosInstance }  from "axios";

class ConnaissementService11 {
  private axiosClient: AxiosInstance

  //////////////////////
  // CONSTRUCTOR
  //////////////////////
  constructor(
    client: AxiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_REMORA_END_POINT, // Point de terminaison commun
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  ) {
    this.axiosClient = client
  }

  async getFilteredTransporterConnaissementByStatusSort11(
    token: string | null,
    status: string,
    page: number,
    itemPerPage: number,
    filteredData: string,
    // selectedIdCompany: number | null,
    selectedIdCompany: number | undefined,
    sortConfig: string | undefined
  ) {

    try {
      const response = await this.axiosClient.get('/api/v1.1/bill-of-ladings/search', {
        params: {
          include: 'voyage,expediteur',
          page: page,
          per_page: itemPerPage,
          sort_by: 'dateDepart',
          sort_order: sortConfig,
          filters:  `{"dernierEtat_evenementConnaissement":"${status}","expediteur_id":"${selectedIdCompany}"${filteredData ? ',' + filteredData : ''}}`,
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
const ConnaissementServiceInstance = new ConnaissementService11();
export default ConnaissementServiceInstance;