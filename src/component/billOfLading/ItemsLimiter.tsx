import React from 'react'
import { Form } from 'react-bootstrap'
interface ItemsLimiterType {
  itemPerPage: number 
  setItemPerPage: React.Dispatch<React.SetStateAction<number>>
}

export default function ItemsLimiter({itemPerPage, setItemPerPage}: ItemsLimiterType) {
  return (
    <React.Fragment>
       <div className='ms-3'>éléments par page </div>
        <Form.Select
          name='idNavire'
          value={itemPerPage}
          onChange={(e) => {
            const item = e.currentTarget.value
            setItemPerPage(parseInt(item))
          }}
          aria-label='zone'
          className='w-auto border-0 border-bottom rounded-0'
          required
        >
          <option value='' className='text-ui-second'></option>
          {[10, 20, 30, 40, 100]?.map((nb: number, index: number) => (
            <option key={index} value={nb}>
              {nb}
            </option>
          ))}
        </Form.Select>
    </React.Fragment>
  )
}
