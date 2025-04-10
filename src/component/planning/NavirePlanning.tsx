import React from 'react'
import { Tab, Row, Col, Form, Alert, Container, Button, Spinner, Table } from 'react-bootstrap'
import { DatePicker, InputPicker } from 'rsuite'
import { _formatDate } from '../../utils/functions'
import { SearchNavireDataType, TrajetDataType } from '../../definitions/ComponentType'
import { UserState } from '../../stores/userStore'
import { ConnaissementBrouillonType } from '../../definitions/OrderType'
import { errorType } from '../../definitions/errorType'

interface NavirePlanningType {
  dataStore: UserState
  navireList: { id: number; name: string }[]
  connaissementBrouillon: ConnaissementBrouillonType
  selectedTrajet: TrajetDataType
  trajetData: TrajetDataType[]
  errorMessage: string
  searchNavireData: SearchNavireDataType
  setSearchNavireData: React.Dispatch<React.SetStateAction<SearchNavireDataType>>
  setConnaissementBrouillon: React.Dispatch<React.SetStateAction<ConnaissementBrouillonType>>
  setSelectedTrajet: React.Dispatch<React.SetStateAction<Partial<TrajetDataType>>>
  setTrajetData: React.Dispatch<React.SetStateAction<TrajetDataType[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsError: React.Dispatch<React.SetStateAction<errorType>>
  isCobiaOrDory: boolean
  isErrorDate: boolean
  isLoading: boolean
  isTrajetOrSelectedData: boolean
  isLoadingBrouillon: boolean
  isLoadingDemande: boolean
  isError: errorType
  idConnaissement: number
  getPlanningOfNavire: (idNavire: string | null | undefined,
    page: string,
    limit: string,
    dateDebut: string,
    dateFin: string,
    setSelectedTrajet: React.Dispatch<React.SetStateAction<Partial<TrajetDataType>>>,
    setTrajetData: React.Dispatch<React.SetStateAction<TrajetDataType[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>> ,
    setIsError: React.Dispatch<React.SetStateAction<errorType>>) => void
  handleSelectTrajet: (
    trajetData: TrajetDataType[],
      data: TrajetDataType,
      setConnaissementBrouillon: React.Dispatch<React.SetStateAction<ConnaissementBrouillonType>>,
      connaissementBrouillon: ConnaissementBrouillonType
    ) => void
    handleDateChange: (value: Date | null) => void
    handleEditBrouillon: (
      idConnaissement: number,
      connaissementBrouillon: ConnaissementBrouillonType,
      accessToken: string) => void
  handlePostBrouillon: (status: string) => void
  handlePostDemande: (status: string) => void
  
}

export default function NavirePlanning({navirePlanningProps}: {navirePlanningProps: NavirePlanningType}) {
    const {
      dataStore,
      navireList,
      connaissementBrouillon,
      selectedTrajet,
      trajetData,
      errorMessage,
      searchNavireData,
      setSearchNavireData,
      setConnaissementBrouillon,
      setSelectedTrajet,
      setTrajetData,
      setIsLoading,
      setIsError,
      isCobiaOrDory,
      isErrorDate,
      isLoading,
      isTrajetOrSelectedData,
      isLoadingBrouillon,
      isLoadingDemande,
      isError,
      idConnaissement,
      getPlanningOfNavire,
      handleSelectTrajet,
      handleDateChange,
      handleEditBrouillon,
      handlePostBrouillon,
      handlePostDemande,
    } = navirePlanningProps
  return (
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
              onChange={(value: string) => {
                const idOfZeNavire = value
                setSearchNavireData({ ...searchNavireData, idNavire: idOfZeNavire })
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
                const nb = parseInt(e.currentTarget.value)
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
        <i className='ri-error-warning-line fs-4 me-2'> </i> Attention, ce bateau applique des
        conditions de validation de connaissance qui lui sont propres
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
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {_formatDate(data?.dateDepart)}
                      </td>
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {data?.heureDepart.hour}:{data?.heureDepart.minute}:
                        {data?.heureDepart.second}
                      </td>
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {data?.destinationDepart}
                      </td>
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {_formatDate(data?.dateArrivee)}
                      </td>
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {data?.heureArrivee.hour}:{data?.heureArrivee.minute}:
                        {data?.heureArrivee.second}
                      </td>
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {' '}
                        {data?.destinationArrivee}
                      </td>
                      <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                        {data?.numeroVoyage}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td>{_formatDate(selectedTrajet?.dateDepart)}</td>
                  <td>
                    {selectedTrajet?.heureDepart.hour}:{selectedTrajet?.heureDepart.minute}:
                    {selectedTrajet?.heureDepart.second}
                  </td>
                  <td>{selectedTrajet?.destinationDepart}</td>
                  <td>{_formatDate(selectedTrajet?.dateArrivee)}</td>
                  <td>
                    {selectedTrajet?.heureArrivee.hour}:{selectedTrajet?.heureArrivee.minute}:
                    {selectedTrajet?.heureArrivee.second}
                  </td>
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
              if (idConnaissement) {
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
            ) : idConnaissement ? (
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
  )
}
