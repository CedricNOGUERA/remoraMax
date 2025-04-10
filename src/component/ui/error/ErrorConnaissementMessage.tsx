import { Alert } from 'react-bootstrap'

export default function ErrorConnaissementMessage({isTransporter, isErrorConnaiss}: {isTransporter: boolean, isErrorConnaiss: {error: boolean, message: string}}) {
  return (
    <tr>
    <td colSpan={isTransporter ? 10 : 9} className='text-center'>
      <Alert variant='danger'>{isErrorConnaiss?.message}</Alert>
    </td>
  </tr>
  )
}
