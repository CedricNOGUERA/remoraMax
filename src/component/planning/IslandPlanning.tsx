import React from 'react'
import { Tab, Row, Col, Form, Alert, Container, Button, Spinner, Table, InputGroup, ListGroup } from 'react-bootstrap'
import { DatePicker } from 'rsuite'
import { _getTrajetByIslandId } from '../../utils/api/apiControlerFunctions'
import { SearchIslandDataType, TrajetDataType } from '../../definitions/ComponentType'
import { ConnaissementBrouillonType } from '../../definitions/OrderType'
import { OrderDataType } from '../../definitions/ResponseType'
import { errorType } from '../../definitions/errorType'

interface IslandPlanningType {
  filteredIsland: { id: number; name: string }[]
  setFilteredIsland: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>
  setListIsland: React.Dispatch<React.SetStateAction<string[]>>
  connaissementBrouillon: ConnaissementBrouillonType
  selectedTrajet: TrajetDataType
  errorMessage: string
  searchIslandData: SearchIslandDataType
  setSearchIslandData: React.Dispatch<React.SetStateAction<SearchIslandDataType>>
  searchIslandName: string
  setSearchIslandName: React.Dispatch<React.SetStateAction<string>>
  setConnaissementBrouillon: React.Dispatch<React.SetStateAction<ConnaissementBrouillonType>>
  setSelectedTrajet: React.Dispatch<React.SetStateAction<Partial<TrajetDataType>>>
  setTrajetIslandData: React.Dispatch<React.SetStateAction<TrajetDataType[]>>
  trajetIslandData: TrajetDataType[]
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsError: React.Dispatch<React.SetStateAction<errorType>>
  isErrorDate: boolean
  isLoading: boolean
  isLoadingBrouillon: boolean
  isLoadingDemande: boolean
  isError: {error: boolean,
    message: string
  }
  idConnaissement: number
  handleSelectTrajetIsland: (
      data: TrajetDataType,
      setConnaissementBrouillon: React.Dispatch<React.SetStateAction<ConnaissementBrouillonType>>,
      connaissementBrouillon: ConnaissementBrouillonType
    ) => void
  handlePostBrouillon: (status: string) => void
  handlePostDemande: (status: string) => void
  ordersForConnaissement: OrderDataType[]
  isTrajetIslandOrSelectedData: boolean
}

export default function IslandPlanning({islandPlanningProps}: {islandPlanningProps: IslandPlanningType}) {
    const {
        filteredIsland,
        setFilteredIsland,
        setListIsland,
        connaissementBrouillon,
        selectedTrajet,
        errorMessage,
        searchIslandData,
        setSearchIslandData,
        searchIslandName,
        setSearchIslandName,
        setConnaissementBrouillon,
        setSelectedTrajet,
        trajetIslandData,
        setTrajetIslandData,
        setIsLoading,
        setIsError,
        isErrorDate,
        isLoading,
        isLoadingBrouillon,
        isLoadingDemande,
        isError,
        idConnaissement,
        handleSelectTrajetIsland,
        handlePostBrouillon,
        handlePostDemande,
        ordersForConnaissement,
        isTrajetIslandOrSelectedData,
      } = islandPlanningProps
      console.log(trajetIslandData)
  return (
    <Tab onClick={() => {}} eventKey='iles' title="Ile d'arrivée">
    <Row>
      {/* Island input */}
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
          {filteredIsland?.length > 0 && (
            <ListGroup className='island-list'>
              {filteredIsland?.map(
                (island: { id: number; name: string }, index: number) => (
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
                      setListIsland([])
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
              setSelectedTrajet,
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
                        // trajetIslandData,
                        data,
                        setConnaissementBrouillon,
                        connaissementBrouillon
                      )
                    }}
                  >
                    <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                      {data?.dateArrivee}
                    </td>
                    <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                      {data?.heureArrivee?.hour}:{data?.heureArrivee?.minute}:
                      {data?.heureArrivee?.second}
                    </td>
                    <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                      {data?.nomNavire}
                    </td>

                    <td className={'p-1 pe-0 p-md-2 ' + (isDepartTahiti && 'text-primary')}>
                      {data?.numeroVoyage}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td>{selectedTrajet?.dateArrivee}</td>
                <td>
                {selectedTrajet?.heureArrivee?.hour}:{selectedTrajet?.heureArrivee?.minute}:
                {selectedTrajet?.heureArrivee?.second}
                  {/* {selectedTrajet?.heureArrivee} */}
                  </td>
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
        <Button variant='secondary' onClick={() => handlePostBrouillon('BROUILLON')}>
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
      <i className='ri-error-warning-line text-danger me-2 fs-4'></i> {isError?.message}
    </Alert>
  </Tab>
  )
}
