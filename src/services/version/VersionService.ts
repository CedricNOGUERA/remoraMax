import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_END_POINT
class VersionsService {
  getVersion() {
    return axios.get(API_URL + '/api/v1/version')
  }
}

const VersionService = new VersionsService();
export default VersionService;