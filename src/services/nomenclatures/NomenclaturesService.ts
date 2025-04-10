import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_APP_END_POINT


class NomenclatureService {
  private axiosClient: AxiosInstance;

    constructor(client: AxiosInstance = axios.create({
        baseURL: API_URL, // Point de terminaison commun
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })) {
        this.axiosClient = client;
    }
    async getNomenclatureList(token: string, designation: string) {
      try {
          const response = await this.axiosClient.get('/api/v1/designations', {
              params: {
                  critere: designation,
                  iChercherNomenclature: true,
              },
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          return response.data; // Retourne uniquement les données pertinentes
      } catch (error) {
          console.error('Error fetching nomenclature list:', error);
          throw error; // Rejette l'erreur pour être gérée par l'appelant
      }
  }
    
    
}


const NomenclaturesService = new NomenclatureService();
export default NomenclaturesService;