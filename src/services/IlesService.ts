import axios from "axios";

const API_URL = import.meta.env.VITE_APP_END_POINT
class IleService {

    getIslandByName(name: string) {
        return axios.get(API_URL + "/api/v1/public/iles?critere=" + name)
    }
    getIslandVoyage() {
        return axios.get(API_URL + "/api/v1/public/iles/desservies-voyages?dateDebut=2024-08-12&dateFin=2024-08-31")
    }
}


const IlesService = new IleService();
export default IlesService;