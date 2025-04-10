import axios from "axios";

type FormDataType = {
    email: string,
    password: string
}

const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT

class AuthService {
    loginTotara(data: FormDataType) {
        return axios.post(API_URL_TOTARA + '/api/v1/login', 
        data
        )
    }
    logout(token: string | null) {
        const config = {
            method: 'post',
            url: `${API_URL_TOTARA}/api/v1/logout`,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + token,
            }
          }
          return axios.request(config)
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;