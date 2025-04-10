import axios from "axios";
import { CompanyType } from "../../definitions/CompanyType";


const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT
class CompaniesService {
  getCompanies(token: string | null, page: number) {
    return axios.get(API_URL_TOTARA + '/api/v1/companies?page=' + page, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    })
  }

  addCompany(
    token: string | null,
    data: {
      id_company: string | number | string[] | undefined
      name: string
      client_id: string
      client_secret: string
      username: string
      scope: string
    }
  ) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/companies',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }
    return axios.request(config)
  }

  updateCompany(token: string | null, data: Partial<CompanyType>, id: number | null | undefined) {
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: API_URL_TOTARA + '/api/v1/companies/' + id,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }
    return axios.request(config)
  }
}

const companyServiceInstance = new CompaniesService();
export default companyServiceInstance;