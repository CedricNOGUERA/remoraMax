import React, { SetStateAction } from 'react'
import { Modal, Form, InputGroup, Button, Spinner } from 'react-bootstrap'
interface FormDataType {
    email: string
    password: string
}
type ForgotPassType = {
    showForgotPassWord: boolean
    handleCloseForgotPassWord: () => void
    handleForgotPass: React.FormEventHandler<HTMLFormElement> | undefined
    formData: FormDataType
    setFormData: React.Dispatch<SetStateAction<FormDataType>>
    isLoadingForgot: boolean
}

export default function ForgotPass({ forgotPassProps }: { forgotPassProps: ForgotPassType }) {
  const {
    showForgotPassWord,
    handleCloseForgotPassWord,
    handleForgotPass,
    formData,
    setFormData,
    isLoadingForgot,
  } = forgotPassProps
  return (
    <Modal centered show={showForgotPassWord} onHide={handleCloseForgotPassWord}>
      <Form id='forgot_pass' onSubmit={handleForgotPass}>
        <Modal.Header>
          <Modal.Title>Mot de passe oublié</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='my-3'>
            <InputGroup>
              <InputGroup.Text id='emailForgotPass' className='bg-transparent  border'>
                <i className='ri-at-line text-secondary'></i>
              </InputGroup.Text>
              <Form.Control
                className=' border'
                name='forgot'
                type='email'
                autoComplete='on'
                placeholder='Email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='transparent'
            className='button-secondary text-light'
            onClick={handleCloseForgotPassWord}
          >
            Annuler
          </Button>
          <Button variant='transparent' className='button-primary text-light' type='submit'>
            {isLoadingForgot ? (
              <Spinner variant='light' size='sm' className='me-2' />
            ) : (
              <i className='ri-send-plane-fill me-2'></i>
            )}
            Envoyer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
