import React from 'react'
import { Button } from 'react-bootstrap'
import ModalAddUser from '../users/ModalAddUser';
import { ToastType } from '../../definitions/ComponentType';

interface FloatingAddButtonType {
  setToastData :React.Dispatch<React.SetStateAction<ToastType>>
  toggleShowAll: () => void
}

export default function FloatingAddButton({floatingAddButtonProps}: {floatingAddButtonProps: FloatingAddButtonType}) {
  const { setToastData, toggleShowAll } = floatingAddButtonProps
  const [isVisible, setIsVisible] = React.useState<boolean>(true)

  const [show, setShow] = React.useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 
  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY < 260) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])


  const modalAddUserProps = {show, handleClose, setToastData, toggleShowAll}


  return (
    <React.Fragment>
      <Button
        variant='light'
        className={`fab rounded-pill button-primary `}
        onClick={handleShow}
      >
        <i className='ri-add-circle-line'></i>{' '}
        {isVisible && (
          <span className={`disp-none border-start ps-2`}> Ajouter un utilisateur</span>
        )}
      </Button>
      <ModalAddUser {...modalAddUserProps} />
     
    </React.Fragment>
  )
}
