import React, { ReactNode } from 'react'
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap'
import {
  _formatDate,
  _getIdIsland,
  _getIdNavire,
  _idOrders,
  _numFacture,
  _reduceTabProduct,
  _totalVolume,
} from '../../utils/functions'
import {
  _getAIslandByName,
  _getTrajetByIslandId,
  _refreshToken,
} from '../../utils/api/apiControlerFunctions'
import { DatePicker, InputPicker } from 'rsuite'
import userStore, { UserState } from '../../stores/userStore'
import OrdersService from '../../services/orders/OrdersService'
import ConnaissementServices from '../../services/connaissements/ConnaissementServices'
import { errorType } from '../../definitions/errorType'
import TrajetsService from '../../services/TrajetsService'
import { SearchIslandDataType, SearchNavireDataType, SearchPlanningType, TrajetDataType } from '../../definitions/ComponentType'
import { ConnaissementBrouillonType, OrderType } from '../../definitions/OrderType'
import islandData from '../../data/iles/islandData.json'
import IlesService from '../../services/IlesService'
import { statusType } from '../../definitions/statusType'
import { AxiosError } from 'axios'
import { UpdateNbPaletteType } from '../../definitions/ConnaissementType'
import { InputItemDataType } from 'rsuite/esm/InputPicker'

interface SearchTestProps {
  searchPlanningProps: SearchPlanningType
}

interface IslandData {
  id: number
  name: string
}

interface OrderUpdateData {
  statut_revatua: string
  numeroVoyage?: string | null
  id_connaissement?: number | null
}

export default function SearchTest({ searchPlanningProps }: SearchTestProps) {
  const {
    ordersForConnaissement,
    setOrdersForConnaissement,
    handleCloseSearchPlanning,
    toggleShowBrouillon,
    naviresData,
    versionBill,
    handleCloseUpdate,
    setIsEdit,
    orderInConnaiss,
  } = searchPlanningProps

  const dataStore = userStore((state: UserState) => state)

  const [filteredIsland, setFilteredIsland] = React.useState<IslandData[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingBrouillon, setIsLoadingBrouillon] = React.useState<boolean>(false)
  const [isLoadingDemande, setIsLoadingDemande] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<errorType>({
    error: false,
    message: '',
  })

  const [idConnaissement, setIdConnaissement] = React.useState<number | null>(null)
  const [connaissementBrouillon, setConnaissementBrouillon] = React.useState<ConnaissementBrouillonType>({
    version: versionBill,
    numeroVoyage: ordersForConnaissement?.[0]?.numeroVoyage,
    paiement: ordersForConnaissement?.[0]?.paiement,
    ileDepart: 'Tahiti',
    lieuDepart: 'PAPEETE',
    statusRevatua: ordersForConnaissement?.[0]?.statusRevatua,
    expediteur: {
      denomination: dataStore.company && dataStore.company?.[0]?.name,
      numeroTahiti: dataStore.company?.[0]?.numero_tahiti,
      telephone: ordersForConnaissement?.[0]?.expediteur?.telephone,
      mail: ordersForConnaissement?.[0]?.expediteur?.mail,
    },
    destinataire: {
      denomination: ordersForConnaissement?.[0]?.destinataire?.denomination,
      telephone: ordersForConnaissement?.[0]?.destinataire?.telephone,
      mail: ordersForConnaissement?.[0]?.destinataire?.mail,
      numeroTahiti: ordersForConnaissement?.[0]?.destinataire?.numeroTahiti,
    },
    ileArrivee: ordersForConnaissement?.[0]?.ileArrivee,
    lieuArrivee: ordersForConnaissement?.[0]?.ileArrivee === 'Moorea' ? 'VAIARE' : ordersForConnaissement?.[0]?.lieuArrivee,
    detailConnaissementDTO: ordersForConnaissement?.[0]?.items && _reduceTabProduct(ordersForConnaissement, versionBill),
    referenceHorsRevatua: _numFacture(ordersForConnaissement),
    nombreColisAEmbarquer: ordersForConnaissement?.[0]?.nombreColisAEmbarquer || null,
    volumeAEmbarquer: _totalVolume(ordersForConnaissement),
    demandeParArmateur: false,
  })

  const [searchIslandName, setSearchIslandName] = React.useState<string>('')
  const [idOrderForConnaiss, setIdOrderForConnaiss] = React.useState<(number | null)[] | undefined>([])

  //Update order in DB
  const handleUpdateOrder = async (
    token: string | null,
    orderData: OrderUpdateData,
    idOrderForConnaiss: (number | null)[] | undefined
  ) => {
    try {
      if (idOrderForConnaiss) {
        await Promise.all(
          idOrderForConnaiss.map((id: number | null) => {
            if (id) {
              return OrdersService.updateOrder(token, orderData, id)
            }
            return Promise.resolve()
          })
        )
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const [key, setKey] = React.useState<string>('navires')

  const [isCobiaOrDory, setIsCobiaOrDory] = React.useState<boolean>(false)
  const [isErrorDate, setIsErrorDate] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const [navireList, setNavireList] = React.useState<InputItemDataType<string | number>[]>([])
  const [trajetIslandData, setTrajetIslandData] = React.useState<TrajetDataType[]>([])
  const [selectedTrajet, setSelectedTrajet] = React.useState<Partial<TrajetDataType>>({})
  const [searchIslandData, setSearchIslandData] = React.useState<SearchIslandDataType>({
    idNavire: '',
    nameNavire: '',
    page: '0',
    limit: '30',
    dateDebut: '',
    dateFin: '',
    ileArrivee: ordersForConnaissement?.[0]?.ileArrivee === '' ? '' : _getIdIsland(ordersForConnaissement?.[0]?.ileArrivee, islandData),
    nameIleArrivee: ordersForConnaissement?.[0]?.ileArrivee === '' ? '' : ordersForConnaissement?.[0]?.ileArrivee,
  })
  const [trajetData, setTrajetData] = React.useState<TrajetDataType[]>([])
  const [searchNavireData, setSearchNavireData] = React.useState<SearchNavireDataType>({
    idNavire: '',
    nameNavire: '',
    page: '0',
    limit: '30',
    dateDebut: '',
    dateFin: '',
    ileArrivee: ordersForConnaissement?.[0]?.ileArrivee,
  })

  React.useEffect(() => {
    if (searchIslandName?.length > 1) {
      const findingIsland: IslandData[] = islandData?.filter((island: IslandData) => {
        return island?.name?.toLowerCase().includes(searchIslandName.toLowerCase())
      })
      setFilteredIsland(findingIsland)
    }
    if (searchIslandName?.length === 0) {
      setFilteredIsland([])
      setTrajetData([])
      setSelectedTrajet({} as TrajetDataType)
    }
  }, [searchIslandName])

  React.useEffect(() => {
    if (ordersForConnaissement?.[0]?.id_connaissement !== null) {
      setIdConnaissement(ordersForConnaissement[0].id_connaissement)
    }
    if (ordersForConnaissement?.[0]?.ileArrivee !== '') {
      setSearchNavireData({} as SearchNavireDataType)
      _getAIslandByName(ordersForConnaissement?.[0]?.ileArrivee, setSearchIslandName)
    }
  }, [ordersForConnaissement])

  React.useEffect(() => {
    setIdOrderForConnaiss(_idOrders(ordersForConnaissement))
    if (ordersForConnaissement?.[0]?.ileArrivee) {
      setSearchNavireData({
        ...searchNavireData,
        ileArrivee: ordersForConnaissement[0]?.ileArrivee,
      })
    }
  }, [connaissementBrouillon, ordersForConnaissement])

  React.useEffect(() => {
    if(naviresData){
      setNavireList(naviresData?.map((item: {
        id: number;
        name: string;
      }) => ({ label: item.name, value: `${item.id}` })))
    }
    }, [naviresData])

  React.useEffect(() => {
    setSearchNavireData({
      ...searchNavireData,
      idNavire: _getIdNavire(ordersForConnaissement?.[0]?.navire, naviresData),
    })
  }, [navireList])

  React.useEffect(() => {
    if (searchNavireData?.idNavire === '4' || searchNavireData?.idNavire === '5') {
      setIsCobiaOrDory(true)
    } else {
      setIsCobiaOrDory(false)
    }
  }, [searchNavireData])

  const editOrderInDbNLocalAplanifier = (missingFromTab2: OrderType[] | undefined, status: statusType) => {
    const updatedData = {
      id_connaissement: null,
      numeroVoyage: '',
      statut_revatua: status,
    }
    console.log(_idOrders(missingFromTab2))
    handleUpdateOrder(dataStore?.token, updatedData, _idOrders(missingFromTab2))
  }

  const editOrderInDbNLocal = (
    connaissementBrouillon: ConnaissementBrouillonType,
    numeroVoyage: string | undefined,
    id: number | undefined,
    status: statusType,
    navire: string | null | undefined | ReactNode
  ) => {
    const updatedData = {
      id_connaissement: id,
      numeroVoyage: numeroVoyage,
      statut_revatua: status,
      navire: navire,
    }
    handleUpdateOrder(dataStore?.token, updatedData, idOrderForConnaiss)
  }

  const handlePostBrouillon = async (status: statusType) => {
    setIsLoadingBrouillon(true)
    setIsError({
      error: false,
      message: '',
    })
    if (connaissementBrouillon?.lieuArrivee === '' || connaissementBrouillon?.lieuArrivee === null) {
      delete connaissementBrouillon?.lieuArrivee
    }
    if (connaissementBrouillon?.lieuDepart === '' || connaissementBrouillon?.lieuDepart === null) {
      delete connaissementBrouillon?.lieuDepart
    }
    if (!idConnaissement) {
      delete connaissementBrouillon?.version
    }

    try {
      const response = await ConnaissementServices.postBrouillonConnaissement(
        dataStore.access_token,
        connaissementBrouillon
      )

      if (response.status === 201) {
        setIsLoadingBrouillon(false)
        setIsError({
          error: false,
          message: '',
        })
        if(selectedTrajet){
          editOrderInDbNLocal(
            connaissementBrouillon,
            selectedTrajet.numeroVoyage,
            response.data?.id,
            status,
            searchNavireData.nameNavire
          )
        }

        handleCloseSearchPlanning()
        toggleShowBrouillon()
        setOrdersForConnaissement([])
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        setIsLoadingBrouillon(false)
        const errorMessage =
        error?.response?.data?.detail !== ''
        ? `${error?.response?.data?.message} : ${error?.response?.data?.detail}`
        : error?.response?.data?.message
        
        setIsError({
          error: true,
          message: errorMessage,
        })
        if (error?.response?.data?.error === 'invalid_token') {
          const idCompany = dataStore?.company && dataStore?.company[0]?.id_company
          _refreshToken(dataStore?.token, idCompany)
        }
      }
    }
  }

  const handlePostDemande = async (status: statusType) => {
    setIsLoadingDemande(true)
    setIsError({
      error: false,
      message: '',
    })
    if (connaissementBrouillon?.lieuArrivee === '' || connaissementBrouillon?.lieuArrivee === null) {
      delete connaissementBrouillon?.lieuArrivee
    }
    if (connaissementBrouillon?.lieuDepart === '' || connaissementBrouillon?.lieuDepart === null) {
      delete connaissementBrouillon?.lieuDepart
    }
    try {
      const response = await ConnaissementServices.postDemandeConnaissement(
        dataStore.access_token,
        connaissementBrouillon
      )
      if (response.status === 201) {
        editOrderInDbNLocal(
          connaissementBrouillon,
          selectedTrajet?.numeroVoyage,
          response.data?.id,
          status,
          searchNavireData.nameNavire
        )

        handleCloseSearchPlanning()
        toggleShowBrouillon()
        setOrdersForConnaissement([])
        setIsLoadingDemande(false)
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        setIsLoadingDemande(false)
        const errorMessage =
        error?.response?.data?.detail !== ''
        ? `${error?.response?.data?.message} : ${error?.response?.data?.detail}`
        : error?.response?.data?.message
        
        setIsError({
          error: true,
          message: errorMessage,
        })
      }
    }
  }

  const handleEditBrouillon = async (id: number, bodyData: UpdateNbPaletteType | ConnaissementBrouillonType, token: string) => {
    setIsLoadingBrouillon(true)
    setIsError({
      error: false,
      message: '',
    })
    const missingFromTab2 = orderInConnaiss?.filter(
      (obj1: OrderType | undefined) => !ordersForConnaissement.some((obj2: OrderType | undefined) => obj1?.id === obj2?.id)
    )

    try {
      const response = await ConnaissementServices.updateNbPalette(token, bodyData, id)
      if (response.status === 200) {
        setIsLoadingBrouillon(false)
        setIsError({
          error: false,
          message: '',
        })

        editOrderInDbNLocal(
          connaissementBrouillon,
          selectedTrajet?.numeroVoyage,
          response.data?.id,
          'BROUILLON',
          searchNavireData.nameNavire
        )

        if (missingFromTab2 && missingFromTab2?.length > 0) {
          editOrderInDbNLocalAplanifier(missingFromTab2, 'A_PLANIFIER')
        }

        handleCloseSearchPlanning()
        toggleShowBrouillon()
        setOrdersForConnaissement([])
        if (setIsEdit) {
          setIsEdit(true)
        }
        if (handleCloseUpdate) {
          handleCloseUpdate()
        }
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        setIsLoadingBrouillon(false)
        const errorMessage =
        error?.response?.data?.detail !== ''
        ? `${error?.response?.data?.message} : ${error?.response?.data?.detail}`
          : error?.response?.data?.message

      setIsError({
        error: true,
        message: errorMessage,
      })
      if (error?.response?.data?.error === 'invalid_token') {
        const idCompany = dataStore?.company && dataStore?.company[0]?.id_company
        _refreshToken(dataStore?.token, idCompany)
      }
    }
  }
  }

  const handleSelectTrajetIsland = (
    data: TrajetDataType,
    setConnaissementBrouillon: React.Dispatch<React.SetStateAction<ConnaissementBrouillonType>>,
    connaissementBrouillon: ConnaissementBrouillonType
  ) => {
    setSelectedTrajet({
      numeroVoyage: data?.numeroVoyage,
      nomNavire: data?.nomNavire,
      abreviationNavire: data?.abreviationNavire,
      archipelDestinationArrivee: data?.archipelDestinationArrivee,
      destinationDepart: 'Tahiti',
      dateDepart: data?.dateDepart,
      heureDepart: data?.heureDepart,
      destinationArrivee: data?.ileDestination,
      dateArrivee: data?.dateArrivee,
      heureArrivee: data?.heureArrivee,
    })

    setConnaissementBrouillon({
      ...connaissementBrouillon,
      ileArrivee: data?.ileDestination,
      lieuArrivee: data?.lieuDestination ? data?.lieuDestination : '',
      lieuDepart: data?.lieuDestination ? 'PAPEETE' : '',
      numeroVoyage: data?.numeroVoyage,
    })

    setTrajetIslandData([])
  }

  const handleSelectTrajet = (
    trajetData: TrajetDataType[],
    data: TrajetDataType,
    setConnaissementBrouillon: React.Dispatch<React.SetStateAction<ConnaissementBrouillonType>>,
    connaissementBrouillon: ConnaissementBrouillonType
  ) => {
    const filteredData = trajetData?.filter(
      (navire: TrajetDataType) => navire.numeroVoyage === data.numeroVoyage
    )[0]
    if (filteredData) {
      const [ileArrivee, lieuArrivee]: string[] = data.destinationArrivee.split('/')
      const [ileDepart, lieuDepart]: string[] = data.destinationDepart.split('/')
      console.log(ileDepart)
      setSelectedTrajet({
        id: data.id,
        numeroVoyage: data.numeroVoyage,
        nomNavire: data.nomNavire,
        abreviationNavire: data.abreviationNavire,
        archipelDestinationDepart: filteredData?.archipelDestinationDepart,
        archipelDestinationArrivee: data?.archipelDestinationArrivee,
        destinationDepart: filteredData.destinationDepart,
        dateDepart: filteredData.dateDepart,
        heureDepart: filteredData.heureDepart,
        destinationArrivee: data.destinationArrivee,
        dateArrivee: data.dateArrivee,
        heureArrivee: data.heureArrivee,
        dateDepartVoyage: data?.dateDepartVoyage,
        dateRetourVoyage: data.dateRetourVoyage,
        croisiere: data.croisiere,
        codeZoneTarifaireArrivee: data.codeZoneTarifaireArrivee,
      })

      setConnaissementBrouillon({
        ...connaissementBrouillon,
        ileArrivee: ileArrivee,
        lieuArrivee: lieuArrivee ? lieuArrivee : '',
        lieuDepart: lieuDepart ? lieuDepart : '',
        numeroVoyage: data.numeroVoyage,
      })

      setTrajetData([])
    }
  }

  const getPlanningOfNavire = async (
    idNavire: string | null | undefined,
    page: string,
    limit: string,
    dateDebut: string,
    dateFin: string,
    setSelectedTrajet: React.Dispatch<React.SetStateAction<Partial<TrajetDataType>>>,
    setTrajetData: React.Dispatch<React.SetStateAction<TrajetDataType[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsError: React.Dispatch<React.SetStateAction<errorType>>
  ) => {
    setIsLoading(true)
    setIsError({
      error: false,
      message: '',
    })
    setTrajetData([])
    setSelectedTrajet({} as TrajetDataType)
    try {
      let responseIsland = undefined
      if (searchNavireData.ileArrivee !== '') {
        responseIsland = await IlesService.getIslandByName(searchNavireData.ileArrivee)
      }

      const response = await TrajetsService.getTrajetByNavireId(
        idNavire,
        page,
        limit,
        dateDebut,
        dateFin
      )

      if (response.data.content?.length === 0) {
        setIsError({
          error: true,
          message: 'Aucun trajet trouvé',
        })
        setSelectedTrajet({} as TrajetDataType)
        setTrajetData([])
      } else if (response.data.content.length > 0) {
        const depart = response.data.content?.filter(
          (navire: TrajetDataType) =>
            navire.destinationDepart === 'Tahiti' ||
            navire.destinationDepart === 'Tahiti/PAPEETE'
        )
        
        const arrivee = response.data.content?.filter((trajet: TrajetDataType) =>
          trajet?.destinationArrivee
          ?.toLowerCase()
          .includes(searchNavireData.ileArrivee.toLowerCase())
        )

        const voyagesFusionnes = depart.map((dep: TrajetDataType) => {
          const arr = arrivee.find((arr: TrajetDataType) => arr.numeroVoyage === dep.numeroVoyage)
          if (arr) {
            return {
              numeroVoyage: dep.numeroVoyage,
              nomNavire: dep.nomNavire,
              abreviationNavire: dep.abreviationNavire,
              archipelDestinationDepart: dep.archipelDestinationDepart,
              archipelDestinationArrivee: dep.archipelDestinationArrivee,
              destinationDepart: dep.destinationDepart,
              dateDepart: dep.dateDepart,
              heureDepart: dep.heureDepart,
              destinationArrivee: arr.destinationArrivee,
              dateArrivee: arr.dateArrivee,
              heureArrivee: arr.heureArrivee,
              dateDepartVoyage: dep.dateDepartVoyage,
              dateRetourVoyage: dep.dateRetourVoyage,
              croisiere: dep.croisiere,
              codeZoneTarifaireArrivee: dep.codeZoneTarifaireArrivee,
            }
          }
          return dep
        })

        if (
          responseIsland?.data?.length === 0 ||
          responseIsland?.data?.[0]?.id === undefined
        ) {
          setTrajetData(response.data.content)
        } else {
          if (arrivee?.length === 0) {
            setIsError({
              error: true,
              message: 'Ce navire ne touche pas votre île de destination.',
            })
            setTrajetData([])
          } else {
            setTrajetData(voyagesFusionnes)
          }
        }
        
        setIsLoading(false)
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        setIsError({
          error: true,
          message: error?.response?.data?.message,
        })
      }else{
        setIsError({
          error: true,
          message: "Une erreur s'est produite",
        })
      }
    }finally{
      setIsLoading(false)
    }
  }

  const handleDateChange = (value: Date | null) => {
    setErrorMessage('')
    setIsErrorDate(false)
    if (value !== null) {
      const dateDebut = new Date(
        Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
      ).toLocaleDateString('fr-FR', { timeZone: 'UTC' })
      const selectedDate = new Date(value)
      const [day, month, year] = dateDebut.split('/')

      const formattedDate = `${year}-${month}-${day}`
      const currentDate = new Date()

      selectedDate.setHours(0, 0, 0, 0)
      currentDate.setHours(0, 0, 0, 0)

      if (selectedDate < currentDate) {
        setIsErrorDate(true)
        setErrorMessage('La date choisie ne peut pas être inférieure à la date du jour.')
      } else {
        setIsErrorDate(false)
        setErrorMessage('')
        setSearchNavireData({ ...searchNavireData, dateDebut: formattedDate })
      }
    }
  }

  const isTrajetOrSelectedData = trajetData?.length > 0 || selectedTrajet !== undefined
  const isTrajetIslandOrSelectedData =
  trajetIslandData && (trajetIslandData?.length > 0 || selectedTrajet) !== undefined

  

  return (
    <div className='p-3'>
      <div className='text-center'>
        <h5>{ordersForConnaissement?.[0]?.destinataire?.denomination}</h5>
      </div>
      <Tabs
        activeKey={key}
        onSelect={(k) => {
          setKey(k ?? '')
          setSelectedTrajet({} as TrajetDataType )
        }}
        id='schudleTab'
        className='mb-3'
        transition={true}
      >
        <Tab onClick={() => {}} eventKey='navires' title='Navires'>
          <Row>
            <Col>
              <Form.Group className='mb-3 px-2'>
                <Form.Label className='d-flex ' htlmfor='navire'>
                  Navire
                </Form.Label>
                <InputPicker
                  id='navire'
                  name='navire'
                  data={navireList}
                  style={{ width: 224 }}
                  className='text-dark'
                  value={searchNavireData?.idNavire || ''}
                  placeholder='Sélectionnez un navire'
                  onChange={(value) => {
                    const idOfZeNavire = value
                    const nameNavire = navireList?.filter((nav: InputItemDataType<string | number>) => nav.value === value)[0]

                    setSearchNavireData({
                      ...searchNavireData,
                      idNavire: idOfZeNavire,
                      nameNavire: nameNavire?.label,
                    })
                  }}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className='mb-3 px-2'>
                <Form.Label className='d-flex'>Période du</Form.Label>
                <DatePicker
                  id='start'
                  oneTap
                  format='dd-MM-yyyy'
                  placeholder='Date de début'
                  style={{ width: 'auto' }}
                  onChange={handleDateChange}
                />
                {errorMessage && (
                  <div style={{ position: 'absolute', color: 'red', marginTop: '8px' }}>
                    {errorMessage}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3 px-2'>
                <Form.Label className='d-flex'> au</Form.Label>
                <DatePicker
                  id='end'
                  oneTap
                  format='dd-MM-yyyy'
                  placeholder='Date de fin'
                  style={{ width: 'auto' }}
                  onChange={(value: Date | null) => {
                    if (value !== null) {
                      const dateDebut = value?.toLocaleDateString('fr-FR')
                      const [day, month, year]: string[] = dateDebut.split('/')
                      const formattedDate = `${year}-${month}-${day}`
                      setSearchNavireData({ ...searchNavireData, dateFin: formattedDate })
                    }
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={searchNavireData?.ileArrivee === 'MOOREA' ? 12 : 6}>
              <Form.Group className='mb-3 px-2'>
                <Form.Label className='d-flex'>
                  Nombre de suremballages (palettes, conteneurs...)
                </Form.Label>
                <Form.Control
                  id='nombrePalette1'
                  name='nombrePalette'
                  type='number'
                  placeholder='Saisissez un nombre'
                  style={{ width: 'auto' }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const nb = parseInt(e.target.value)
                    setConnaissementBrouillon({
                      ...connaissementBrouillon,
                      nombreColisAEmbarquer: nb,
                    })
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Alert
            show={isCobiaOrDory}
            variant='danger'
            className='d-flex align-items-center py-2'
            style={{ marginTop: '10px' }}
          >
            <i className='ri-error-warning-line fs-4 me-2'> </i> Attention, ce bateau applique
            des conditions de validation de connaissance qui lui sont propres
          </Alert>

          <Container fluid className='text-end px-0'>
            <Button
              variant='warning'
              disabled={
                isErrorDate ||
                searchNavireData?.idNavire === undefined ||
                searchNavireData?.nameNavire === ''
              }
              className='mb-3'
              onClick={() => {
                if (!isErrorDate) {
                  getPlanningOfNavire(
                    searchNavireData?.idNavire,
                    searchNavireData?.page,
                    searchNavireData?.limit,
                    searchNavireData?.dateDebut,
                    searchNavireData?.dateFin,
                    setSelectedTrajet,
                    setTrajetData,
                    setIsLoading,
                    setIsError
                  )
                }
              }}
            >
              {isLoading ? (
                <span className='text-light'>
                  <Spinner size='sm' variant='light' /> Rechercher
                </span>
              ) : (
                <span className='text-light'>Rechercher</span>
              )}
            </Button>
          </Container>

          {isTrajetOrSelectedData && (
            <React.Fragment>
              <div>Résultat</div>
              <Table striped hover responsive className=''>
                <thead>
                  <tr className='responsive-font-small text-center'>
                    <th></th>
                    <th>Départ</th>
                    <th className='border-end'></th>
                    <th></th>
                    <th>Arrivée</th>
                    <th className='border-end'></th>
                    <th></th>
                  </tr>
                </thead>
                <thead>
                  <tr className='responsive-font-small text-center'>
                    <th className=''>Date</th>
                    <th className=''>Heure</th>
                    <th className=' border-end'>Lieu</th>
                    <th className=''>Date</th>
                    <th className=''>Heure</th>
                    <th className=' border-end'>Lieu</th>
                    <th>N°voyage</th>
                  </tr>
                </thead>
                <tbody className='responsive-font-small text-center'>
                  {selectedTrajet === undefined ? (
                    trajetData?.map((data: TrajetDataType, index: number) => {
                      const isDepartTahiti =
                        data?.destinationDepart === 'Tahiti/PAPEETE' ||
                        data?.destinationDepart === 'Tahiti'
                      const isArriveeTahiti =
                        data?.destinationArrivee === 'Tahiti/PAPEETE' ||
                        data?.destinationArrivee === 'Tahiti'

                      return (
                        <tr
                          key={index}
                          className={'py-3 ' + (isArriveeTahiti ? 'not-allowed' : 'pointer')}
                          onClick={() => {
                            if (
                              data?.destinationArrivee !== 'Tahiti' &&
                              data?.destinationArrivee !== 'Tahiti/PAPEETE'
                            ) {
                              handleSelectTrajet(
                                trajetData,
                                data,
                                setConnaissementBrouillon,
                                connaissementBrouillon
                              )
                            } else {
                              alert(
                                'Attention, vous essayez de sélectionner un voyage de retour sur Tahiti'
                              )
                            }
                          }}
                        >
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {_formatDate(data?.dateDepart)}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.heureDepart?.hour}:{data?.heureDepart?.minute}:{data?.heureDepart?.second}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.destinationDepart}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {_formatDate(data?.dateArrivee)}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.heureArrivee?.hour}:{data?.heureArrivee?.minute}:{data?.heureArrivee?.second}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {' '}
                            {data?.destinationArrivee}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.numeroVoyage}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td>{_formatDate(selectedTrajet?.dateDepart)}</td>
                      <td>{selectedTrajet?.heureDepart?.hour}:{selectedTrajet?.heureDepart?.minute}:{selectedTrajet?.heureDepart?.second}</td>
                      <td>{selectedTrajet?.destinationDepart}</td>
                      <td>{_formatDate(selectedTrajet?.dateArrivee)}</td>
                      <td>{selectedTrajet?.heureArrivee?.hour}:{selectedTrajet?.heureArrivee?.minute}:{selectedTrajet?.heureArrivee?.second}</td>
                      <td> {selectedTrajet?.destinationArrivee}</td>
                      <td>{selectedTrajet?.numeroVoyage}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </React.Fragment>
          )}

          {selectedTrajet !== undefined && (
            <Container fluid className='text-end px-0'>
              <Button
                variant='secondary'
                onClick={() => {
                  if (idConnaissement && connaissementBrouillon?.version !== undefined) {
                    handleEditBrouillon(
                      idConnaissement,
                      connaissementBrouillon,
                      dataStore?.access_token
                    )
                  } else {
                    handlePostBrouillon('BROUILLON')
                  }
                }}
              >
                {isLoadingBrouillon ? (
                  <span className='text-light'>
                    <Spinner size='sm' variant='light' />{' '}
                    {idConnaissement ? <span>Valider</span> : <span>Brouillon</span>}
                  </span>
                ) : idConnaissement && connaissementBrouillon?.version !== undefined ? (
                  <span>Editer</span>
                ) : (
                  <span>Brouillon</span>
                )}
              </Button>{' '}
              {!idConnaissement && (
                <Button variant='success' onClick={() => handlePostDemande('DEMANDE')}>
                  {isLoadingDemande ? (
                    <span className='text-light'>
                      <Spinner size='sm' variant='light' /> Demande
                    </span>
                  ) : (
                    <span className=''>Demande</span>
                  )}
                </Button>
              )}
            </Container>
          )}
          <Alert show={isError?.error} variant='danger' className='mt-3'>
            <i className='ri-error-warning-line text-danger me-2 fs-4'></i>
            {isError?.message}
          </Alert>
        </Tab>
        <Tab onClick={() => {}} eventKey='iles' title="Ile d'arrivée">
          <Row>
            <Col>
              <Form.Group className='mb-3 island-input'>
                <Form.Label className=''>Iles</Form.Label>

                <InputGroup className=''>
                  <Form.Control
                    id='iles'
                    className='border'
                    name='iles'
                    type='text'
                    autoComplete='on'
                    placeholder='Saisissez votre île'
                    value={searchIslandName}
                    required
                    onChange={(e) => setSearchIslandName(e.target.value)}
                  />
                </InputGroup>
                {filteredIsland && filteredIsland?.length > 0 && (
                  <ListGroup className='island-list'>
                    {filteredIsland?.map(
                      (island: IslandData, index: number) => (
                        <ListGroup.Item
                          action
                          variant='light'
                          className='island-item'
                          key={index}
                          onClick={() => {
                            const ileArrivee = island?.id
                            setSearchIslandData({
                              ...searchIslandData,
                              ileArrivee: ileArrivee,
                              nameIleArrivee: island?.name,
                            })
                            setSearchIslandName(island?.name)
                            setFilteredIsland([])
                          }}
                        >
                          {' '}
                          {island?.name}
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3 px-2'>
                <Form.Label className='d-flex'>Période du</Form.Label>
                <DatePicker
                  id='startDate'
                  oneTap
                  name='startDate'
                  format='dd-MM-yyyy'
                  placeholder='Date de début'
                  style={{ width: 'auto' }}
                  onChange={(value) => {
                    if (value !== null) {
                      const dateDebut = value?.toLocaleDateString('fr-FR')
                      const [day, month, year]: string[] = dateDebut.split('/')
                      const formattedDate = `${year}-${month}-${day}`
                      setSearchIslandData({ ...searchIslandData, dateDebut: formattedDate })
                    }
                  }}
                />
                {errorMessage && (
                  <div style={{ position: 'absolute', color: 'red', marginTop: '8px' }}>
                    {errorMessage}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3 px-2'>
                <Form.Label className='d-flex'> au</Form.Label>
                <DatePicker
                  id='endDate'
                  name='endDate'
                  oneTap
                  format='dd-MM-yyyy'
                  placeholder='Date de fin'
                  style={{ width: 'auto' }}
                  onChange={(value) => {
                    if (value !== null) {
                      const dateDebut = value?.toLocaleDateString('fr-FR')
                      const [day, month, year]: string[] = dateDebut.split('/')
                      const formattedDate = `${year}-${month}-${day}`
                      setSearchIslandData({ ...searchIslandData, dateFin: formattedDate })
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className='mb-3 px-2'>
            <Form.Label className='d-flex'>
              Nombre de suremballages (palettes, conteneurs...)
            </Form.Label>
            <Form.Control
              id='nombrePalette2'
              name='nombrePalette'
              type='number'
              placeholder='Saisissez un nombre'
              style={{ width: 'auto' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const nb = parseInt(e.currentTarget.value)
                setConnaissementBrouillon({
                  ...connaissementBrouillon,
                  nombreColisAEmbarquer: nb,
                })
              }}
            />
          </Form.Group>
          <Container fluid className='text-end px-0'>
            <Button
              variant='warning'
              disabled={isErrorDate}
              className='mb-3'
              onClick={() => {
                if (!isErrorDate) {
                  _getTrajetByIslandId(
                    searchIslandData.ileArrivee,
                    0,
                    30,
                    searchIslandData.dateDebut,
                    searchIslandData.dateFin,
                    setIsLoading,
                    setIsError,
                    setTrajetIslandData,
                    ordersForConnaissement?.[0]?.ileArrivee,
                    searchIslandName,
                    setSelectedTrajet
                  )
                }
              }}
            >
              {isLoading ? (
                <span className='text-light'>
                  <Spinner size='sm' variant='light' /> Rechercher
                </span>
              ) : (
                <span className='text-light'>Rechercher</span>
              )}
            </Button>
          </Container>

          {isTrajetIslandOrSelectedData && (
            <React.Fragment>
              <div>Résultat</div>
              <Table striped hover responsive className=''>
                <thead>
                  <tr className='responsive-font-small text-center'>
                    <th colSpan={2} className='border-end'>
                      Arrivée : {searchIslandData.nameIleArrivee}
                    </th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <thead>
                  <tr className='responsive-font-small text-center'>
                    <th className=''>Date</th>
                    <th className='border-end'>Heure</th>
                    <th className=''>Navire</th>
                    <th>N°voyage</th>
                  </tr>
                </thead>
                <tbody className='responsive-font-small text-center'>
                  {selectedTrajet === undefined ? (
                    trajetIslandData?.map((data: TrajetDataType, index: number) => {
                      const isDepartTahiti =
                        data?.destinationDepart === 'Tahiti/PAPEETE' ||
                        data?.destinationDepart === 'Tahiti'
                      const isArriveeTahiti =
                        data?.destinationArrivee === 'Tahiti/PAPEETE' ||
                        data?.destinationArrivee === 'Tahiti'

                      return (
                        <tr
                          key={index}
                          className={'py-3 ' + (isArriveeTahiti ? 'not-allowed' : 'pointer')}
                          onClick={() => {
                            handleSelectTrajetIsland(
                              data,
                              setConnaissementBrouillon,
                              connaissementBrouillon
                            )
                          }}
                        >
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.dateArrivee}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                           {data?.heureArrivee?.hour}:{data?.heureArrivee?.minute}:{data?.heureArrivee?.second}
                          </td>
                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.nomNavire}
                          </td>

                          <td
                            className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}
                          >
                            {data?.numeroVoyage}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td>{selectedTrajet?.dateArrivee}</td>
                      <td>{selectedTrajet?.heureArrivee?.hour}:{selectedTrajet?.heureArrivee?.minute}:{selectedTrajet?.heureArrivee?.second}</td>
                      <td> {selectedTrajet?.nomNavire}</td>
                      <td>{selectedTrajet?.numeroVoyage}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </React.Fragment>
          )}

          {selectedTrajet !== undefined && (
            <Container fluid className='text-end px-0'>
              <Button
                variant='secondary'
                onClick={() => {
                  if (idConnaissement && connaissementBrouillon?.version !== undefined) {
                    handleEditBrouillon(
                      idConnaissement,
                      connaissementBrouillon,
                      dataStore?.access_token
                    )
                  } else {
                    handlePostBrouillon('BROUILLON')
                  }
                }}
              >
                {isLoadingBrouillon ? (
                  <span className='text-light'>
                    <Spinner size='sm' variant='light' />{' '}
                    {idConnaissement && connaissementBrouillon?.version !== undefined ? (
                      <span>Valider</span>
                    ) : (
                      <span>Brouillon</span>
                    )}
                  </span>
                ) : idConnaissement ? (
                  <span>Editer</span>
                ) : (
                  <span>Brouillon</span>
                )}
              </Button>{' '}
              {!idConnaissement && (connaissementBrouillon.version === undefined) && (
                <Button variant='success' onClick={() => handlePostDemande('DEMANDE')}>
                  {isLoadingDemande ? (
                    <span className='text-light'>
                      <Spinner size='sm' variant='light' /> Demande
                    </span>
                  ) : (
                    <span className=''>Demande</span>
                  )}
                </Button>
              )}
            </Container>
          )}
          <Alert show={isError?.error} variant='danger' className='mt-3'>
            <i className='ri-error-warning-line text-danger me-2 fs-4'></i> {isError?.message}
          </Alert>
        </Tab>
      </Tabs>
    </div>
  )
}
