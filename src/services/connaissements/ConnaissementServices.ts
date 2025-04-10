import axios, { AxiosInstance }  from "axios";
import { ConnaissementBrouillonType } from "../../definitions/OrderType";
import { ResultConnaissementType, UpdateNbPaletteType } from "../../definitions/ConnaissementType";

const API_URL = import.meta.env.VITE_APP_END_POINT
const API_URL_TOTARA = import.meta.env.VITE_APP_REMORA_END_POINT

class ConnaissementsService {

  private axiosClient: AxiosInstance;

//////////////////////
// CONSTRUCTOR
//////////////////////
  constructor(client: AxiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_END_POINT, // Point de terminaison commun
      // maxBodyLength: Infinity, // ajouter si erreur : ERR_FR_MAX_BODY_LENGTH_EXCEEDED
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
  })) {
      this.axiosClient = client;
  }

//////////////////////
// POST
//////////////////////
  postBrouillonConnaissement(token: string, data: ConnaissementBrouillonType) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/brouillons`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }
    return axios.request(config)
  }
  
  postDemandeConnaissement(token: string, data: ConnaissementBrouillonType) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }
    return axios.request(config)
  }
//////////////////////
// GET
//////////////////////
  getConnaissement(token: string, page: number, limit: number) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?sort=id,desc&limit=${limit}&page=${page}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  //without constructor
  _getConnaissementSort(token: string, page: number, limit: number, sort: string) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?sort=${sort}&demandesParArmateur=false&limit=${limit}&page=${page}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  //with constructor
  async getConnaissementSort(token: string, page: number, limit: number, sort: string) {
    try {
        const response = await this.axiosClient.get('/api/v1/connaissements/demandes', {
            params: {
                sort: sort,
                demandesParArmateur: false,
                limit: limit,
                page: page
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error fetching data list:', error);
        throw error; // Rejette l'erreur pour être gérée par l'appelant
    }
  }

  //Download
  getPDFConnaissement(token: string, id: number, idEven: number, num: string | number, setData: React.Dispatch<React.SetStateAction<string | undefined>>) 
  {
    axios(`${API_URL}/api/v1/connaissements/${id}/pdf/${idEven}?isDemandeParArmateur=false`, {
      method: 'GET',
      responseType: 'blob', //Force to receive data in a Blob Format
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
  .then(response => {
  //Create a Blob from the PDF Stream
      const file = new Blob(
        [response.data], 
        {type: 'application/pdf'});
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
      
        setData(fileURL);
        
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'connaissement_' + num + '.pdf'); // Nom du fichier à télécharger
      document.body.appendChild(link);
      link.click();
      link.remove();
  })
  .catch(error => {
      console.log(error);
      alert(error.response.data  ? "Le Pdf n'existe pas" : "Une erreur s'est produite" )
  });
  }
  //To print & read
  getPDFConnaissementToRead(token: string, id: number, idEven: number, setData: React.Dispatch<React.SetStateAction<string | undefined>>) 
  {
    axios(`${API_URL}/api/v1/connaissements/${id}/pdf/${idEven}?isDemandeParArmateur=false&timestamp=${new Date().getTime()}`, {
      method: 'GET',
      responseType: 'blob', //Force to receive data in a Blob Format
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
  .then(response => {
  //Create a Blob from the PDF Stream
      const file = new Blob(
        [response.data], 
        {type: 'application/pdf'});
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        setData(fileURL);

  })
  .catch(error => {
      console.log(error);
      
      // setToastData({
      //   bg: "danger",
      //   message: "erreur",
      //   icon: "error-warning"
      // })
      // toggleShowAll()
  });
  }
  
  getMultiPDFConnaissementToRead(token: string, id: number, idEven: number, setPdfData: React.Dispatch<React.SetStateAction<string[]>>) 
  {
    axios(`${API_URL}/api/v1/connaissements/${id}/pdf/${idEven}?isDemandeParArmateur=false`, {
      method: 'GET',
      responseType: 'blob', //Force to receive data in a Blob Format
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
  .then(response => {
  //Create a Blob from the PDF Stream
      const file = new Blob(
        [response.data], 
        {type: 'application/pdf'});
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        
        
        setPdfData((prevData: string[]) => [...prevData, fileURL]);
     
  })
  .catch(error => {
      console.log(error);

  });
  }

  downloadPDFs = async (token: string, selectedInvoices: ResultConnaissementType[]) => {
    const promises = selectedInvoices.map((fact: ResultConnaissementType) => 
      axios(`${API_URL}/api/v1/connaissements/${fact?.id}/pdf/${fact?.dernierEtat?.id}?isDemandeParArmateur=false`, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/pdf',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      }).then(response => {
        return new Blob([response.data], { type: 'application/pdf' });
      })
    );
  
    return Promise.all(promises);
  };

  getFilteredConnaissement(token: string, page: number, filteringData: string, limit: number) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?sort=id,desc&limit=${limit}&page=${page}&${filteringData}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  getFilteredConnaissementSort(token: string, page: number, filteringData: string, limit: number, sort: string) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?demandesParArmateur=false&sort=${sort}&limit=${limit}&page=${page}${filteringData && "&" + filteringData}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  getFilteredTransporterConnaissement(token: string, page: number, filteringData: string) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?sort=id,desc&page=${page}&${filteringData}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  getFilteredTransporterConnaissementByStatus(token: string, page: number, filteringData: string, status: string) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?sort=id,desc&page=${page}&${filteringData}&evenementConnaissement=${status}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  getFilteredTransporterConnaissementByStatusSort(token: string | undefined, page: number, itemPerPage: number, filteringData: string, status: string, sort: string | undefined) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/demandes?sort=${sort}&limit=${itemPerPage}&page=${page}${filteringData && "&" + filteringData}&dernierEvenementConnaissement=${status}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  getrefreshToken(token: string | null, id: number | null  | undefined) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL_TOTARA}/api/v1/companies/${id}/token`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  getPdf(token: string, id: number) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/${id}/etiquette`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }


//////////////////////
// PUT
//////////////////////
  updateConnaissement(token: string, data: {
    evenementConnaissementEnum: string
    demandeParArmateur: boolean
  }, id: number) {
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/${id}/changeretat`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }
    return axios.request(config)
  }
  updateNbPalette(token: string, data: UpdateNbPaletteType | ConnaissementBrouillonType, id: number) {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/v1/connaissements/brouillons/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    }
    return axios.request(config)
  }

  //////////////////////
// DELETE
//////////////////////
  deleteBrouillon(token: string, id: number) {
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,//demandes/43601?isDemandeParArmateur=false
      url: `${API_URL}/api/v1/connaissements/demandes/${id}?isDemandeParArmateur=false`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
    return axios.request(config)
  }
  

 
}

 
// // eslint-disable-next-line import/no-anonymous-default-export
// export default new ConnaissementService();
const ConnaissementService = new ConnaissementsService();
export default ConnaissementService;