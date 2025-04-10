import React from 'react'
import {
  Card,
  Form,
  Container,
  Alert,
  InputGroup,
  Button,
  Spinner,
  Image,
  Col,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import logo from '../../styles/images/remora.webp'
import AuthService from '../../services/Auth/AuthService'
import UserService from '../../services/user/UserService'
import userStore, { UserState } from '../../stores/userStore'
import { _handleClearCache } from '../../utils/functions'
import { _forgotPassword } from '../../utils/api/totaraApi'
import { ToastAll } from '../../component/ui/Toast/Toastes'
import ForgotPass from '../../component/ui/Modal/ForgotPass'
import { _errorAxiosPatern } from '../../utils/errors'

interface ToastDataType {
  bg: string
  message: string
  icon: string
}

interface FormDataType {
  email: string
  password: string
}

export default function Auth() {
  const authLogin = userStore((state: UserState) => state?.authLogin)
  const dataStore = userStore((state: UserState) => state)

  const navigate = useNavigate()

  const [isView, setIsView] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingForgot, setIsLoadingForgot] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<string>('')

  const [toastData, setToastData] = React.useState<ToastDataType>({
    bg: "",
    message: "",
    icon: ""
  })
  const [formData, setFormData] = React.useState<FormDataType>({
    email: '',
    password: '',
  })

  const [showForgotPassWord, setShowForgotPassWord] = React.useState(false);

  const handleCloseForgotPassWord = () => setShowForgotPassWord(false);
  const handleShowForgotPassWord = () => setShowForgotPassWord(true);

  ///////////
  //Toast
  ///////////
  const [showAll, setShowAll] = React.useState<boolean>(false)
  const toggleShowAll = () => setShowAll(!showAll)


  React.useEffect(() => {
    if (dataStore.token && dataStore.token?.length > 0) {
      navigate('/')
    }
  }, [])

  React.useEffect(() => {
    if (token && token?.length > 0) {
      getMe(token)
      _handleClearCache()
    }
  }, [token])

  const handleSubmit = () => {
    
    authentificationHandler(formData)
  }

  const getMe = async (token: string) => {
    try {
      const response = await UserService.getMe(token)
      if (response) {
        const access_token = response?.data?.data?.companies?.[0]?.access_token
        authLogin(
          response.data.data?.id,
          response.data.data?.name,
          response.data.data?.role,
          response.data.data?.email,
          token,
          response?.data?.data?.companies,
          response?.data?.data?.company?.id_company,
          response?.data?.data?.company?.name,
          // response?.data?.data?.company?.slug,
          access_token
        )
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const authentificationHandler = async (data: FormDataType) => {
    setIsLoading(true)
    setIsError(false)
    try {
      const response = await AuthService.loginTotara(data)
      setToken(response.data.access_token)
      setIsError(false)
      setIsLoading(false)
    } catch (error: unknown) {
      console.log(error)
     
      setIsError(true)
      setIsLoading(false)
      
      const messageError = ""
      setErrorMessage(_errorAxiosPatern(error, messageError ))
    }
  }


  const handleForgotPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      _forgotPassword(
        formData.email,
        toastData,
        setToastData,
        toggleShowAll,
        handleCloseForgotPassWord,
        setIsLoadingForgot
      )
    } catch (error) {
      console.log(error)
    }
  }

  const forgotPassProps = {
    showForgotPassWord,
    handleCloseForgotPassWord,
    handleForgotPass,
    formData,
    setFormData,
    isLoadingForgot,
  }

const toastAllProps ={showAll, toggleShowAll, toastData}


  return (
    <Container fluid className='d-flex justify-content-center align-items-center vh-100 vw-100'>
      <Col xs={10} md={5} lg={4} xl={3} className='px-0 '>
        <Card className='animate__animated animate__fadeIn rounded border-seondary'>
          <Card.Title className='d-md-flex justify-content-center align-item-center my-3 text-center text-secondary'>
            <Image src={logo} width={80} alt='logo' decoding="async"/>
          </Card.Title>
          <Card.Body className=''>
            <div className='logo-app text-center text-light'></div>
            <Form className='auth-form' onSubmit={
              (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                handleSubmit()}}>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label className='d-none'>Email</Form.Label>
                <InputGroup className='mb-4'>
                  <InputGroup.Text id='basic-addon1' className='bg-transparent  border'>
                    <i className='ri-user-fill text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className=' border'
                    type='email'
                    autoComplete='on'
                    placeholder='Email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label className='d-none'>Mot de passe</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon2' className='bg-transparent  border'>
                    <i className='ri-lock-2-fill text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className=' border border-end-0'
                    type={!isView ? 'password' : 'text'}
                    placeholder='Mot de passe'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <InputGroup.Text
                    id='eyeOrNot'
                    className='bg-transparent border border-start-0'
                    onClick={() => setIsView(!isView)}
                  >
                    {' '}
                    <i className={`ri-${!isView ? 'eye-off' : 'eye'}-fill text-secondary`}></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {isError && (
                <Alert variant='danger' className='d-flex align-items-center mt-2 py-0 m-auto'>
                  <i className='ri-close-circle-line fs-4 text-danger me-2'></i>
                  {errorMessage}
                </Alert>
              )}
              <div className='text-end pointer fonht-75'>
                <u onClick={handleShowForgotPassWord}>Mot de passe oublié ?</u>
              </div>
              <Button type='submit' className='rounded  w-100 py-2 mt-4 ' variant='primary'>
                {isLoading ? (
                  <>
                    <Spinner variant='light' size='sm' /> Loading
                  </>
                ) : (
                  <>
                    <i className='ri-login-box-line'></i> Se connecter
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <ForgotPass forgotPassProps={forgotPassProps} />
      <ToastAll toastAllProps={toastAllProps} />
    </Container>
  )
}
