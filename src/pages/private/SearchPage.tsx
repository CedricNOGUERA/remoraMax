import React from 'react'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import IlesService from '../../services/IlesService'
import TrajetsService from '../../services/TrajetsService'
import { TrajetType } from '../../definitions/TrajetType'
import VersionService from '../../services/version/VersionService'
import navireId from '../../data/navires/navires.json'

export default function SearchPage() {
  const [islandName, setIslandName] = React.useState<string>('')
  const [searchIslandName, setSearchIslandName] = React.useState<string>('')
  const [listIsland, setListIsland] = React.useState<any>([])
  const [trajetData, setTrajetData] = React.useState<TrajetType>()

  const [searchData, setSearchData] = React.useState<any>({
    idIle: '',
    page: '0',
    limit: '10',
    dateDebut: '',
    dateFin: '',
  })
  const [searchNavireData, setSearchNavireData] = React.useState<any>({
    idNavire: '',
    page: '0',
    limit: '10',
    dateDebut: '',
    dateFin: '',
  })

  const navireIdData = navireId

  React.useEffect(() => {
    if (searchIslandName !== '') {
      getIslandByName(searchIslandName)
    } else {
      setListIsland([])
    }
  }, [searchIslandName])


  const getIslandByName = async (name: string) => {
    try {
      const response = await IlesService.getIslandByName(name)
      if (response.data.length > 0) {
        setListIsland(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getTrajetByIslandId = async (
    idIle: string | null,
    page: number,
    limit: number,
    dateDebut: string,
    dateFin: string
  ) => {
    try {
      const response = await TrajetsService.getTrajetByIslandId(
        idIle,
        page,
        limit,
        dateDebut,
        dateFin
      )
      if (response.data.length > 0) {
        setTrajetData(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getPlaningOfNavire = async (
    idNavire: string | null,
    page: string,
    limit: string,
    dateDebut: string,
    dateFin: string
  ) => {
    try {
      const response = await TrajetsService.getTrajetByNavireId(
        idNavire,
        page,
        limit,
        dateDebut,
        dateFin
      )
      if (response.data.length > 0) {
        setTrajetData(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(searchNavireData)

  return (
    <div className='p-3'>
      <div className=''>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label className=''>Iles</Form.Label>
          <InputGroup className=''>
            <InputGroup.Text id='basic-addon1' className='bg-secondary border'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              className='border'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              // value={islandName}
              required
              onChange={(e) => setSearchIslandName(e.target.value)}
            />
          </InputGroup>
          {listIsland?.length > 0 && (
            <Card className='shadow border-0 p-3 p-abso'>
              {listIsland?.map((island: any) => (
                <div
                  className='mb-2 pointer muted-hover'
                  onClick={(e) => {
                    const id = island?.id
                    setSearchData({ ...searchData, idIle: id })
                    setSearchIslandName('')
                    setIslandName(island?.nom)
                  }}
                >
                  {island?.nom}
                </div>
              ))}
            </Card>
          )}
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label className='d-'>Période</Form.Label>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border-0'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              className='shadow border-0'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              required
              onChange={(e) => {
                setSearchData({ ...searchData, dateDebut: e.target.value })
              }}
            />
          </InputGroup>
        </Form.Group>
        au
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label className='d-'> </Form.Label>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border-0'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              className='shadow border-0'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              required
              onChange={(e) => {
                setSearchData({ ...searchData, dateFin: e.target.value })
              }}
            />
          </InputGroup>
        </Form.Group>
      </div>
      <Button
        onClick={() =>
          getTrajetByIslandId(
            searchData?.idIle,
            searchData?.page,
            searchData?.limit,
            searchData?.dateDebut,
            searchData?.dateFin
          )
        }
      >
        Rechercher
      </Button>
      <Form.Select
        size='sm'
        name={'selectNavire'}
        onChange={(e) => {
          const idOfZeNavire = e.target.value
          setSearchNavireData({...searchNavireData, idNavire: idOfZeNavire })
        }}
        aria-label='zone'
        className='border border-1 border-secondary my-2 text-ui-second '
        required
      >
        <option value='' className='text-ui-second'>
          Sélectionner un navire*
        </option>
        {navireIdData?.map((navire: any, index: any) => (
          <option key={navire?.id} value={navire?.id}>
            {navire?.name}
          </option>
        ))}
      </Form.Select>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label className='d-'>Période</Form.Label>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border-0'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              className='shadow border-0'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              required
              onChange={(e) => {
                setSearchNavireData({ ...searchNavireData, dateDebut: e.target.value })
              }}
            />
          </InputGroup>
        </Form.Group>
        au
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label className='d-'> </Form.Label>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border-0'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              className='shadow border-0'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              required
              onChange={(e) => {
                setSearchNavireData({ ...searchNavireData, dateFin: e.target.value })
              }}
            />
          </InputGroup>
        </Form.Group>
        <Button
        variant="secondary"
        onClick={() =>
          getPlaningOfNavire(
            searchNavireData?.idNavire,
            searchNavireData?.page,
            searchNavireData?.limit,
            searchNavireData?.dateDebut,
            searchNavireData?.dateFin
          )
        }
      >
        Rechercher
      </Button>
    </div>
  )
}
