import { Form, InputGroup } from 'react-bootstrap'

export default function SearchBar({handleFilterConnaissement}: {handleFilterConnaissement: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <div>
        <Form.Group className='mb-3' controlId='searchBar'>
          <InputGroup className=''>
            <InputGroup.Text id='basic' className='bg-secondary border'>
              <i className='ri-search-line text-light'></i>
            </InputGroup.Text>
            <Form.Control
              name="searchBillOfLaing"
              className='border'
              type='text'
              autoComplete='on'
              placeholder='Recherche'
              onChange={handleFilterConnaissement}
            />
          </InputGroup>
        </Form.Group>
      </div>
  )
}
