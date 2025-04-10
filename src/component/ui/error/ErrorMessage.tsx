interface ErrorMessageType {
  isError: {
    message: string
  }
}

export default function ErrorMessage({errorMessageProps}: {errorMessageProps: ErrorMessageType}) {
const {isError} = errorMessageProps

  return (
    <>
     <i className='ri-error-warning-line text-danger me-2 fs-4 '></i>{isError?.message} 
    </>
  )
}
