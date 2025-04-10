import React, { SetStateAction } from "react"
import { errorType } from "../../definitions/errorType"
import ConnaissementServices from "../../services/connaissements/ConnaissementServices"
import IlesService from "../../services/IlesService"
import NaviresService from "../../services/navires/NaviresService"
import TrajetsService from "../../services/TrajetsService"
import userStore, { CompanyStoreType, UserState } from "../../stores/userStore"
import NomenclaturesService from "../../services/nomenclatures/NomenclaturesService"
import { NomenclatureType } from "../../definitions/NomenclatureType"
import { PDFDocument } from 'pdf-lib';
import ConnaissementServiceInstance from "../../services/connaissements/ConnaissementService11"
import { NavireRevatuaType } from "../../definitions/NavireType"
import { AxiosError } from "axios"
import { FilteringDataTransportType, TrajetDataType } from "../../definitions/ComponentType"
import { ResultConnaissementType } from "../../definitions/ConnaissementType"


/////////////////////
//get Navire list
/////////////////////
export const _getShipments = async (
  token: string | undefined,
  dataStore: UserState,
  setNaviresData: React.Dispatch<
    React.SetStateAction<{
      id: number
      name: string
    }[] | undefined>
  >,
  toggleShowAll: () => void,
  setToastData: React.Dispatch<React.SetStateAction<{
    bg: string
    message: string
    icon: string
  }>>

) => {
  try {
    const response = await NaviresService.getNaviresList(token)
    const navires = response.data?.map((nav: NavireRevatuaType) => {
      return {
        id: nav.id,
        name: nav.nom,
      }
    })
    setNaviresData(navires)
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.message === 'Network Error') {
        setToastData((prev: { bg: string; message: string; icon: string }) => ({
          ...prev,
          bg: 'danger',
          message:
            "Une erreur du serveur Revatua est survenue, actualisez la page. Si l'erreur persiste, contactez votre adminstrateur",
          icon: 'error-warning',
        }))
        toggleShowAll()
      }

      if (error?.response?.data?.error === 'invalid_token') {
        const idCompany = dataStore?.company && dataStore?.company[0]?.id_company
        _refreshToken(dataStore?.token, idCompany)
      }
    }
  }
}

/////////////////////
//Planning controller
/////////////////////


export const _getAIslandByName = async (name: string, setIsland: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      if(name?.length > 1){
      const response = await IlesService.getIslandByName(name)
      if (response?.data?.length > 0) {
        setIsland(response.data?.[0]?.nom)
      }
    }
    } catch (error) {
      console.log(error)
    }
  }

export  const _getTrajetByIslandId = async (
  idIle: string | number | undefined,
  page: number,
  limit: number,
  dateDebut: string,
  dateFin: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsError: React.Dispatch<React.SetStateAction<errorType>>,
  setTrajetIslandData: React.Dispatch<React.SetStateAction<TrajetDataType[]>>,
  initIleArrivee: string,
  searchIleArrivee: string,
  setSelectedTrajet: React.Dispatch<React.SetStateAction<Partial<TrajetDataType>>>,
) => {
  setIsLoading(true)
  setIsError({
    error: false,
    message: '',
  })

  setTrajetIslandData([])

  setSelectedTrajet({} as TrajetDataType)

  try {
    let responseIsland = undefined
    if (initIleArrivee !== '') {
      responseIsland = await IlesService.getIslandByName(initIleArrivee)
    }
    const responseSearchIsland = await IlesService.getIslandByName(searchIleArrivee)

    setIsLoading(false)

    if (responseSearchIsland?.data?.length === 0) {
      setIsError({
        error: true,
        message: "L'île choisie n'existe pas",
      })
      setIsLoading(false)
      setTrajetIslandData([])
    } else if (
      responseIsland?.data?.[0]?.id !== responseSearchIsland?.data?.[0]?.id &&
      responseIsland?.data?.[0]?.id !== undefined
    ) {
      setIsError({
        error: true,
        message: "Attention l'île choisie n'est pas la même que celle du destinataire",
      })
      setIsLoading(false)
      setTrajetIslandData([])
    } else {
      const response = await TrajetsService.getTrajetByIslandId(
        responseSearchIsland?.data?.[0]?.id,
        page,
        limit,
        dateDebut,
        dateFin
      )
      if (response.data.content?.length === 0) {
        setIsError({
          error: true,
          message: 'Aucun trajet trouvé, vérifiez les dates de début et de fin de la période',
        })
        setTrajetIslandData([])
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setTrajetIslandData(response.data?.content)

        setIsError({
          error: false,
          message: '',
        })
      }
    }
    // }

    setIsLoading(false)

    if (responseSearchIsland?.data?.length === 0) {
      setIsError({
        error: true,
        message: "L'île choisie n'existe pas",
      })
      setIsLoading(false)
      setTrajetIslandData([])
    } else if (
      responseIsland?.data?.[0]?.id !== responseSearchIsland?.data?.[0]?.id &&
      responseIsland?.data?.[0]?.id !== undefined
    ) {
      setIsError({
        error: true,
        message: "Attention l'île choisie n'est pas la même que celle du destinataire",
      })
      setIsLoading(false)
      setTrajetIslandData([])
    } else {
      const response = await TrajetsService.getTrajetByIslandId(
        responseSearchIsland?.data?.[0]?.id,
        page,
        limit,
        dateDebut,
        dateFin
      )
      if (response.data.content?.length === 0) {
        setIsError({
          error: true,
          message: 'Aucun trajet trouvé, vérifiez les dates de début et de fin de la période',
        })
        setTrajetIslandData([])
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setTrajetIslandData(response.data?.content)
        setIsError({
          error: false,
          message: '',
        })
      }
    }
    // }
  } catch (error: unknown) {
    console.log(error)
    let messageError = 'Une erreur est survenue, réessayez'
    if (error instanceof AxiosError) {
      const errorCode = error.code === 'ERR_NETWORK' && 'Connectez vous à intrernet'
      const errorResponse = error.response?.data
      try {
        const parsedError = error?.request?.response
          ? JSON.parse(error.request.response)
          : null
        messageError = errorCode
          ? errorCode
          : parsedError?.data?.id_company || errorResponse?.message || messageError
      } catch (parseError) {
        messageError = errorResponse?.message || error.message || messageError || parseError
      }

      setIsError({
        error: true,
        message: messageError,
      })
      return messageError
    }
  } finally {
    setIsLoading(false)
  }
}

/////////////////////
/// Refresh token 
/////////////////////

export const _refreshToken = async (access_token: string | null, id: number | null | undefined) => {
  const newCompany = userStore.getState().company
  try {
    const response = await ConnaissementServices.getrefreshToken(access_token, id)
    const updatedData = newCompany && newCompany.map((company: CompanyStoreType) =>
      company.id_company === id
        ? { ...company, access_token: response?.data?.access_token }
        : company
    );
    console.log(newCompany)
    userStore
      .getState()
      .authLogin(
        null, //id
        null, //name
        null, // role
        null, //email
        "", // token
        updatedData,//company
        undefined, //id_company
        null, //name_compay
        updatedData?.[0]?.access_token, //access_token
      )
      window.location.reload();
  } catch (error) {
    console.log(error)
  }
}

/////////////////////
///Connaissement
/////////////////////


export const _filterConnaissementTransp11 = async (
  token: string | null,
  status: string,
  currentPage: number,
  itemPerPage: number,
  filteringData: FilteringDataTransportType,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>,
  setConnaissementData: React.Dispatch<React.SetStateAction<ResultConnaissementType[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  // selectedIdCompany: number | null,
  selectedId: number | undefined,
  sortConfig: string | undefined,
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true)

  let updatedFilteringData = { ...filteringData }

  if (filteringData?.dateDepart) {
    //Formate les dates de dd/mm/yyyy en yyyy-mm-dd
    const inputDateDepart = filteringData.dateDepart.trim()
    const dateDepart = inputDateDepart.split('/').reverse().join('-') // Convertit en "YYYY-MM-DD"

    updatedFilteringData = {
      ...updatedFilteringData,
      dateDepart: dateDepart,
    }
  }
  // formate les données de updatedFilteringData  => {"key":"value", "key":"value", ...}
  const filteredData = Object.entries(updatedFilteringData)
    .filter(([value]) => value ) // Garde les paires où la valeur est définie (non null, non undefined, non vide)
    // .filter(([value]) => value !== undefined && value !== null && value !== '') // Garde les paires où la valeur est définie (non null, non undefined, non vide)
    .map(([key, value]) => `"${key}":"${encodeURIComponent(value)}"`) // Encode chaque paramètre
    // .map(([key, value]: [string, string | number | undefined]) => `"${key}":"${encodeURIComponent(value as string | number | boolean)}"`) // Encode chaque paramètre
    .join(',')
console.log(filteredData)
  if (filteredData !== `"numero":"","destinataire_denomination":"","nomNavire":"","dateDepart":""`) {
    setIsFiltering(true)
  }

  try {
    await ConnaissementServiceInstance.getFilteredTransporterConnaissementByStatusSort11(
      token,
      status,
      currentPage,
      itemPerPage,
      filteredData,
      // selectedIdCompany,
      selectedId,
      sortConfig
    )
      .then((response) => {
        setTotalPages(response?.data?.meta.last_page)
        setConnaissementData(response?.data.data)
      })
      .catch((error) => {
        if (error) {
          console.log(error)
        }
      })
  } catch (error) {
    console.log(error)
  } finally {
    setIsLoading(false)
  }
}


export const _deleteBrouillonConnaissement = async (
  token: string,
  id: number,
  setIsError: React.Dispatch<React.SetStateAction<errorType>>,
  connaissementDataTable: (currentPage: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>, itemPerPage: number) => void,
  currentPage: number,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>,
  itemPerPage: number,
  toggleShowDeleteSuccess: () => void,
  handleCloseDeleteModal: () => void,
  toggleShowOrderError: () => void

) => {
  setIsError({
    error: false,
    message: '',
  })
  try {
    const response = await ConnaissementServices.deleteBrouillon(token, id)

    if (response.status === 204) {
      connaissementDataTable(currentPage, setTotalPages, itemPerPage)
      toggleShowDeleteSuccess()
      handleCloseDeleteModal()
    }
  } catch (error: unknown) {
    console.log(error)
    if(error instanceof AxiosError){

      setIsError({
        error: true,
        message: error?.response?.data?.message,
      })
      toggleShowOrderError()
    }
  }
}

export const _getPDFConnaissementByEvenement = (
  token: string,
  id: number,
  idEven: number,
  setPdfData: React.Dispatch<React.SetStateAction<string | undefined>>, ) => {
  try{
     ConnaissementServices.getPDFConnaissementToRead(
      token,
      id,
      idEven,
      setPdfData,
    )

  }catch(error){
    console.log(error)
  }
}

  //Merge pdfs in one
  const mergeAndPrintPDFs = async (pdfBlobs: Blob[], setPdfData: React.Dispatch<React.SetStateAction<string | undefined>>) => {
   
    try{

      
      const mergedPdf = await PDFDocument.create();
      
    for (const pdfBlob of pdfBlobs) {
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const pdfToMerge = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }
  
    const mergedPdfBlob = new Blob([await mergedPdf.save()], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(mergedPdfBlob);
    setPdfData(fileURL)
    }catch(error){
      console.log(error)
    }

  };

//Multi Print PDF
export const _printMultiPDFConnaissementByEvenement = async (
    token: string,
    checkedMultiConnaissement: ResultConnaissementType[], setPdfData: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    try{

      
        const response = await ConnaissementServices.downloadPDFs(
        token,
        checkedMultiConnaissement
        
      )
      mergeAndPrintPDFs(response, setPdfData)

    }catch(error){
      console.log(error)
    }
  }

//Multi Download PDF
export const _getMultiPDFConnaissementByEvenement =  (
  token: string,
  checkedMultiConnaissement: ResultConnaissementType[],
  setPdfData: React.Dispatch<React.SetStateAction<string | undefined>>

) => {
  try{
  
        const response = checkedMultiConnaissement?.map((item: ResultConnaissementType) =>
          ConnaissementServices.getPDFConnaissement(
          token,
          item?.id,
          item?.dernierEtat?.id,
          item?.numero,
          setPdfData,
        ))
        Promise.all([
            ...(response || [])
          ]);
  
      }catch(error){
        console.log(error)
      }
}


/////////////////////
// nomenclature douanière
/////////////////////

export const _getNomenclature = async (token: string, designation: string, setData: React.Dispatch<SetStateAction<NomenclatureType[] | undefined>>) => {

  try{
    const response = await NomenclaturesService.getNomenclatureList(token, designation)
    setData(response)

  }catch(error){
    console.log(error)
  }

}