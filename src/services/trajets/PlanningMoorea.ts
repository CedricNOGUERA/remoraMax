
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_END_POINT
class PlanningMooz {
  getPlanningNavette(dateDebut: string, dateFin: string, idIleDepart: number) {
    return axios.get(
      API_URL +
        '/api/v1/public/trajets/planning-moorea?dateDebut=' +
        dateDebut +
        '&dateFin=' +
        dateFin +
        '&idIleDepart=' +
        idIleDepart +
        ''
    )
  }
}


const PlanningMoorea = new PlanningMooz();
export default PlanningMoorea;