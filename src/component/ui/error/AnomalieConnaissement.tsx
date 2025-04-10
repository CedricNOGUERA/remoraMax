import React from 'react'
import TableLoader from '../Loader/TableLoader'
import NoResult from './NoResult'
import ErrorConnaissementMessage from './ErrorConnaissementMessage'
import { Alert } from 'react-bootstrap'
import { ResultConnaissementType } from '../../../definitions/ConnaissementType'


interface AnomalieConnaissementType {
  isLoading: boolean
  isError: { error: boolean, message: string }
  isFiltering: boolean
  isErrorConnaiss: { error: boolean, message: string }
  isTransporter: boolean | null
  connaissementData: ResultConnaissementType[]
}


export default function AnomalieConnaissement({AnomalieConnaissementProps}: {AnomalieConnaissementProps: AnomalieConnaissementType}) {

    const {isLoading, isError, isFiltering, isErrorConnaiss, isTransporter, connaissementData} = AnomalieConnaissementProps

  return (
    <>
        {isLoading &&
              Array.from({ length: 5 }).map((_: unknown, index: number) => (
                <TableLoader colNumber={8} key={index} />
              ))}

            {!isLoading &&
              !isError.error &&
              isFiltering &&
              connaissementData?.length === 0 && <NoResult />}

            {!isLoading && isErrorConnaiss.error && (
              <ErrorConnaissementMessage
                isTransporter={isTransporter}
                isErrorConnaiss={isErrorConnaiss}
              />
            )}
            {!isLoading && isError.error && (
               <tr>
               <td colSpan={9} className='text-center'>
                 <Alert variant='danger'>{isError?.message}</Alert>
               </td>
             </tr>
            )}
      
    </>
  )
}
