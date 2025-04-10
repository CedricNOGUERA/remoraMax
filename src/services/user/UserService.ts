import axios from "axios";
import { FormForgotType, FunctionUserType } from "../../definitions/UserType";


const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT

class UsersService {
  getMe(token: string | null) {
    return axios.get(API_URL_TOTARA + '/api/v1/me', {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    })
  }

  getUsers(token: string | null, page: number) {
    return axios.get(API_URL_TOTARA + '/api/v1/users/company?page=' + page, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    })
  }

  addUsers(token: string | null, data: FunctionUserType) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/register',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }

    return axios.request(config)
    // return axios.post(API_URL_TOTARA + '/api/v1/register', data)
  }

  updateUsers(token: string | null, data: FunctionUserType, userId: number | null | undefined) {
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/users/' + userId,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }

    return axios.request(config)
  }

  deleteUsers(token: string | null, userId: number | null | undefined) {
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/users/' + userId,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }

    return axios.request(config)
  }

  forgotUserPassword(email: string) {
    const data = { email: email }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/forgot-password',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: data,
    }
    return axios.request(config)
  }


  resetPassword(data: FormForgotType){

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/reset-password',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
      },
      data : data
    };
    return axios.request(config)
  }

}


const UserService = new UsersService();
export default UserService;