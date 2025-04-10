import React from 'react'
import { Alert, Button, Card, Container, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { _resetUserPassword } from '../../utils/api/totaraApi'
import { ToastAll } from '../../component/ui/Toast/Toastes'
import { ToastType } from '../../definitions/ComponentType'
import { _errorAxiosPatern } from '../../utils/errors'

interface formForgotType {
  email: string | null
  password: string
  password_confirmation: string
  token: string | null
}
interface formAttributeType {
  isView: boolean
  isView2: boolean
  isValidPassword: boolean
  isError: boolean
  isLoadingAuth: boolean
  isLodaingReset: boolean
  errorMessage: string | undefined
}

export default function ResetPassword() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams?.get('token')
  const email = searchParams?.get('email') 
  const navigate = useNavigate();

  const [formForgotData, setFormForgotData] = React.useState<formForgotType>({
    email: email,
    password: '',
    password_confirmation: '',
    token: token,
  })
  const [toastData, setToastData] = React.useState<ToastType>({
    bg: '',
    message: '',
    icon: ''
  })

  const [formAttribute, setFormAttribute] = React.useState<formAttributeType>({
    isView: false,
    isView2: false,
    isValidPassword: false,
    isError: false,
    isLoadingAuth: false,
    isLodaingReset: false,
    errorMessage: ""
  })

  const isSame = formForgotData?.password !== formForgotData?.password_confirmation

  ///////////
  //Toast
  ///////////
  const [showAll, setShowAll] = React.useState<boolean>(false)
  const toggleShowAll = () => setShowAll(!showAll)

  const toastAllProps = { showAll, toggleShowAll, toastData }

  ///////////////////////
  //useEffect
  ///////////////////////
  React.useEffect(() => {
   

    if (formForgotData?.password?.length > 8) {
      validatePassword()
    }
  }, [formForgotData?.password])

  ///////////////////////
  //Events
  ///////////////////////
  const validatePassword = () => {
    //schema email regex
    const regex: RegExp = /^(?=.{8,})(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/
    //password check
    const match = regex?.test(formForgotData?.password)
    //update validation
    setFormAttribute({
      ...formAttribute,
      isValidPassword: match ? true : false,
    })
  }

  const handleUpdatePass = () => {
    setFormAttribute({
      ...formAttribute,
      isError: false,
      errorMessage: ""
    })
    try{
      if (formAttribute?.isValidPassword) {
        _resetUserPassword(formForgotData, toastData, setToastData, toggleShowAll, navigate, formAttribute, setFormAttribute)
      } 
    }catch(error: unknown){

      let messageError = "Une erreur est survenue"

      const message = _errorAxiosPatern(error, messageError )
            
      setFormAttribute({
        ...formAttribute,
        isError: true,
        errorMessage: message
      })

    }
  }

  return (
    <Container fluid className='d-flex justify-content-center align-items-center vh-100 w-100'>
      <Container fluid className='col-10 col-md-5 col-lg-4 col-xl-4 px-0 '>
        <Card className='p-3'>
          <Card.Title className='text-center mb-4 '>
            <i className='ri-user-settings-line fs-1'></i>
            <Container>Modifier votre mot de passe</Container>
          </Card.Title>
          <Form className='auth-form' onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          handleUpdatePass()
          }}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label className='d-none'>nouveau password</Form.Label>
              <InputGroup className='mb-3'>
                <InputGroup.Text id='basic-addon1' className='bg-secondary border-0'>
                  <i className='ri-lock-unlock-fill text-light'></i>
                </InputGroup.Text>
                <Form.Control
                  className='border border-end-0'
                  type={formAttribute?.isView ? 'text' : 'password'}
                  placeholder='Nouveau mot de passe'
                  name='password'
                  value={formForgotData?.password}
                  onChange={(e) =>
                    setFormForgotData({
                      ...formForgotData,
                      password: e.currentTarget.value,
                    })
                  }
                  required
                />
                <InputGroup.Text
                  id='eyeOrNot'
                  className='bg-transparent rounded-0 rounded-end border border-start-0 pointer'
                  onClick={() =>
                    setFormAttribute({
                      ...formAttribute,
                      isView: !formAttribute.isView,
                    })
                  }
                >
                  {' '}
                  <i
                    className={`ri-${
                      !formAttribute?.isView ? 'eye-off-fill' : 'eye-fill'
                    } text-secondary`}
                  ></i>
                </InputGroup.Text>
              </InputGroup>
              {!formAttribute?.isValidPassword && (
                <Alert variant='warning' className=' d-flex align-items-center  py-1 mt-1 '>
                  <i className='ri-error-warning-line fs-3 text-warning me-2'></i>{' '}
                  <span className='font-75'>
                    Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule
                    ,un caractère spécial et un chiffre.
                  </span>
                </Alert>
              )}
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label className='d-none'>Mot de passe de confirmation</Form.Label>
              <InputGroup className='mb-3'>
                <InputGroup.Text id='basic-addon1' className='bg-secondary border-0'>
                  <i className='ri-rotate-lock-fill text-light'></i>
                </InputGroup.Text>
                <Form.Control
                  className='border border-end-0'
                  style={{ position: 'relative' }}
                  type={formAttribute?.isView2 ? 'text' : 'password'}
                  name='formForgotData?.password_confirmation'
                  placeholder='Confirmez votre mot de passe'
                  value={formForgotData?.password_confirmation}
                  min={8}
                  onChange={(e) =>
                    setFormForgotData({
                      ...formForgotData,
                      password_confirmation: e.currentTarget.value,
                    })
                  }
                  required
                />
                <InputGroup.Text
                  id='eyeOrNot'
                  className='bg-transparent rounded-0 rounded-end border border-start-0 pointer'
                  onClick={() =>
                    setFormAttribute({
                      ...formAttribute,
                      isView2: !formAttribute.isView2,
                    })
                  }
                >
                  {' '}
                  <i
                    className={`ri-${
                      !formAttribute?.isView2 ? 'eye-off-fill' : 'eye-fill'
                    } text-secondary`}
                  ></i>
                </InputGroup.Text>
              </InputGroup>
              {isSame && (
                <Alert variant='warning' className=' d-flex align-items-center mt-2 py-0'>
                  <i className={`ri-error-warning-line text-warning fs-3 me-2`}></i>
                  <span className='font-75'>Vous devez saisir le même mot de passe</span>
                </Alert>
              )}
            </Form.Group>
            {formAttribute?.isError && (
              <Alert variant='danger' className=' d-flex align-items-center mt-2 py-0'>
                <i className={`ri-error-warning-line text-danger`}></i>
                <span>Vous devez saisir le même mot de passe</span>
              </Alert>
            )}
            <Container className='text-center'>
              <Button
                variant='transparent'
                className='button-secondary px-4 py-2 mt-2 text-light me-2'
                href='/connexion'
              >
                <i className='ri-arrow-left-circle-line'></i>  Retour
              </Button>
              <Button
                type='submit'
                variant='transparent'
                className='button-primary px-4 py-2 mt-2 text-light'
                disabled={
                  formForgotData?.password &&
                  formForgotData?.password_confirmation &&
                  formForgotData?.password !== formForgotData?.password_confirmation
                    ? true
                    : false
                }
              >
                {formAttribute?.isLoadingAuth ? (
                  <Spinner variant='light' size='sm' />
                ) : (
                  <i className='ri-check-line me-2'></i>
                )}
                Valider
              </Button>
            </Container>
          </Form>
        </Card>
      </Container>

      <ToastAll toastAllProps={toastAllProps} />
    </Container>
  )
}
