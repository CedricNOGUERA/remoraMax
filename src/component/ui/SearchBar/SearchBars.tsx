import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

export function SearchBarOrder() {
  return (
    <Form.Group className='mb-3' controlId='formBasicEmail'>
      <InputGroup className=''>
        <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border'>
          <i className='ri-search-line text-light'></i>
        </InputGroup.Text>
        <Form.Control
          className=' border'
          type='text'
          autoComplete='on'
          placeholder='Recherche'
        />
      </InputGroup>
    </Form.Group>
  )
}
