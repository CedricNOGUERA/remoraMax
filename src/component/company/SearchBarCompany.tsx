import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

export default function SearchBarCompany({handleFilterUsers}: {handleFilterUsers: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <div>
      <Form.Group className='mb-3 ' controlId='formBasicEmail'>
        <InputGroup>
          <InputGroup.Text id='basic-addon1' className='bg-secondary border'>
            <i className='ri-search-line text-light'></i>
          </InputGroup.Text>
          <Form.Control
            className='border'
            type='text'
            autoComplete='on'
            placeholder='Recherche'
            onChange={handleFilterUsers}
          />
        </InputGroup>
      </Form.Group>
    </div>
  )
}
