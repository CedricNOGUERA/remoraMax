import React from 'react'
import { Dropdown, Form, InputGroup, Table } from 'react-bootstrap'
import FloatingAddButton from '../../component/ui/FloatingAddButton'
import ModalUpdateUser from '../../component/users/ModalUpdateUser';
import userStore, { CompanyStoreType, UserState } from '../../stores/userStore';
import { _getUsersData } from '../../utils/api/totaraApi';
import { ToastAll } from '../../component/ui/Toast/Toastes';
import { useOutletContext } from 'react-router-dom';
import { UserType } from '../../definitions/UserType';
import TableLoader from '../../component/ui/Loader/TableLoader';
import MoadlDeleteUser from '../../component/users/MoadlDeleteUser';
import { ToastType } from '../../definitions/ComponentType';

interface ContextUserType {
  userData: UserType[] 
  setUserData: React.Dispatch<React.SetStateAction<UserType[]>>
}

export default function Users() {
  const {userData, setUserData} = useOutletContext<ContextUserType>()
  const dataStore = userStore((state: UserState) => state)
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = React.useState<boolean>(false);
  const [selectedUserData, setSelectedUserData] = React.useState<UserType | undefined>();
  const [toastData, setToastData] = React.useState<ToastType>({
    bg: "",
    message: "",
    icon: ""
  })

  //Modal update user
  const [showUpdateUser, setShowUpdateUser] = React.useState<boolean>(false);
  const handleCloseUpdateUser = () => setShowUpdateUser(false);
  const handleShowUpdateUser = () => setShowUpdateUser(true);
  //Modal delete user
  const [showDeleteUser, setShowDeleteUser] = React.useState<boolean>(false);
  const handleCloseDeleteUser: () => void = () => setShowDeleteUser(false);
  const handleShowDeleteUser = () => setShowDeleteUser(true);

  ///////////
  //Toast
  ///////////
  const [showAll, setShowAll] = React.useState<boolean>(false)
  const toggleShowAll = () => setShowAll(!showAll)



  React.useEffect(() => {
    _getUsersData(dataStore.token, setUserData, setIsLoading)
  }, [dataStore.token, setUserData])

  const handleFilterUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
   
    const filteredData = userData?.filter((item: UserType) => {
      return (
        item?.id?.toLocaleString()?.toLowerCase().includes(value?.toLowerCase()) ||
        item?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        (item?.role && item?.role[0]?.name?.toLowerCase()?.includes(value?.toLowerCase())) ||
        (item?.companies &&
          item?.companies[0]?.name?.toLowerCase()?.includes(value?.toLowerCase())) ||
        item?.email?.toLowerCase()?.includes(value?.toLowerCase())
      )
    })
    if (setUserData) {
      setUserData(filteredData)
    }
    
    if (value.length === 0) {
      _getUsersData(dataStore.token, setUserData, setIsLoading)
    }
  }

  ////////////////////
  //Props
  ////////////////////
  const modalUpdateUserProps = {
    showUpdateUser,
    handleCloseUpdateUser,
    selectedUserData,
    setSelectedUserData,
    userData,
    setUserData,
    setIsLoading,
    isLoading,
    setToastData,
    toggleShowAll,
  
  }
  const modalDeleteUserProps = {
    showDeleteUser,
    handleCloseDeleteUser,
    selectedUserData,
    isLoadingModal,
    setIsLoadingModal,
    userData,
    setUserData,
    setToastData,
    toggleShowAll,
  }
  const floatingAddButtonProps = { setToastData, toggleShowAll }
  const toastAllProps ={showAll, toggleShowAll, toastData}

  return (
    <div className='p-1 p-lg-3 pb-5 mb-5 w-100'>
      <h3 className='text-secondary'>Utilisateurs</h3>
      <div>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1' className='bg-secondary shadow border-0'>
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
      <Table striped hover responsive className='responsive-font-small border  py-5 mb-5'>
        <thead className=''>
          <tr>
            <th>Id</th>
            <th>Compagnies</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            userData?.map((user: UserType, indx: number) => (
              <tr key={indx}>
                <td className='pointer p-0 p-md-2'>{user.id}</td>
                <td className='pointer p-0 p-md-2'>
                  {user?.companies?.map((company: CompanyStoreType, index: number) => (
                    <span key={index}>
                      {company.name} {user?.companies?.length !== index + 1 && '/ '}
                    </span>
                  ))}
                </td>
                <td className='pointer p-0 p-md-2'>{user.name}</td>
                <td className='pointer p-0 p-md-2'>{user.email}</td>
                <td className='pointer p-0 p-md-2'>{user.role && user.role[0]?.name}</td>
                <td className='pointer p-0 p-md-2'>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant='transparent'
                      id='dropdown-basic'
                      className='border-0 no-chevron'
                    >
                      <b>
                        {' '}
                        <i className='ri-more-2-line'></i>
                      </b>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align='end'>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedUserData(user)
                          handleShowUpdateUser()
                        }}
                      >
                        <i className='ri-pencil-line'></i> Modifier
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          setSelectedUserData(user)
                          handleShowDeleteUser()
                        }}
                      >
                        <i className='ri-delete-bin-2-line'></i> Supprimer
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          {isLoading &&
            Array.from({ length: 5 }).map((_: unknown, index: number) => (
              <TableLoader colNumber={5} key={index} />
            ))}
        </tbody>
      </Table>

      <ModalUpdateUser {...modalUpdateUserProps} />
      <FloatingAddButton floatingAddButtonProps={floatingAddButtonProps} />
      <MoadlDeleteUser modalDeleteUserProps={modalDeleteUserProps} />
      <ToastAll toastAllProps={toastAllProps} />
    </div>
  )
}
