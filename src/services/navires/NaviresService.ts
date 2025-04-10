import axios from "axios";

const API_URL = import.meta.env.VITE_APP_END_POINT

class NavireService {
    getNaviresList(token: string | undefined) {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${API_URL}/api/v1/public/navires`,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + token,
            }
          }
          return axios.request(config)
    }
}

// export default new NaviresService();
const NaviresService = new NavireService();
export default NaviresService;