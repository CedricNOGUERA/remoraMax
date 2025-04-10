import axios from "axios";

const API_URL: string | undefined  = import.meta.env.VITE_APP_END_POINT

class TrajetService {
  getTrajetByNavireId(
    idNavire: string | null | undefined,
    page: string,
    limit: string,
    dateDebut: string,
    dateFin: string
  ) {
    return axios.get(
      `${API_URL}/api/v1/public/trajets?idNavire=${idNavire}&page=${page}&limit=${limit}&sort=dateDepart,heureDepart,asc&dateDebut=${dateDebut}&dateFin=${dateFin}`
    )
  }
  getTrajetByIslandId(
    idIle: string | null | undefined,
    page: number,
    limit: number,
    dateDebut: string,
    dateFin: string
  ) {
    return axios.get(
      API_URL +
        '/api/v1/public/trajets/destinations?idIle=' +
        idIle +
        '&page=' +
        page +
        '&limit=' +
        limit +
        '&sort=dateDepart,heureDepart,asc&dateDebut=' +
        dateDebut +
        '&dateFin=' +
        dateFin +
        ''
    )
  }
  getPlanningNavette(
    idNavire: number,
    idIleDepart: number,
    dateDebut: string,
    dateFin: string
  ) {
    return axios.get(
      API_URL +
        '/api/v1/public/trajets/planning-navette?idNavire=' +
        idNavire +
        '&idIleDepart=' +
        idIleDepart +
        '&dateDebut=' +
        dateDebut +
        '&dateFin=' +
        dateFin +
        ''
    )
  }
 
  getPlanningMoorea(
    idNavire: number,
    dateDebut: string,
    dateFin: string,
    idIleDepart: number
  ) {
    return axios.get(
      API_URL +
        '/api/v1/public/trajets/planning-moorea?idNavire=' +
        idNavire +
        '&dateDebut=' +
        dateDebut +
        '&dateFin=' +
        dateFin +
        '&idIleDepart=' +
        idIleDepart +
        '&limit=5'
    )
  }
}


const TrajetsService = new TrajetService();
export default TrajetsService