import React from 'react'
import { Dropdown } from 'react-bootstrap'
import TableLoader from '../ui/Loader/TableLoader'
import { FeedBackStateType, NotificationInternalType } from '../../pages/private/Notifications'
type NotificationBodyTableType = {
  feedbackState: FeedBackStateType
  dataToMap: NotificationInternalType[] | undefined
  setSelectedNotification: React.Dispatch<
    React.SetStateAction<NotificationInternalType | undefined>
  >
  handleShowUpdate: () => void
  handleShowDelete: () => void
}

export default function NotificationBodyTable({
  notificationBodyTableProps,
}: {
  notificationBodyTableProps: NotificationBodyTableType
}) {
  const {
    feedbackState,
    dataToMap,
    setSelectedNotification,
    handleShowUpdate,
    handleShowDelete,
  } = notificationBodyTableProps
  return (
    <tbody>
      {!feedbackState.isLoading &&
        !feedbackState.isError &&
        dataToMap &&
        dataToMap?.length > 0 &&
        dataToMap?.map((item: NotificationInternalType, indx: number) => (
          <tr key={indx}>
            <td className='p-0 p-md-2'>{item?.name}</td>
            <td className='p-0 p-md-2'>{item?.description}</td>
            <td className='p-0 p-md-2'>{item?.recipients}</td>
            <td className='p-0 p-md-2'>{item?.status_demand}</td>
            <td className='p-0 p-md-2'>{item?.company?.name}</td>
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
                      setSelectedNotification(item)
                      handleShowUpdate()
                    }}
                  >
                    <i className='ri-pencil-line'></i> Modifier
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => {
                      setSelectedNotification(item)
                      handleShowDelete()
                    }}
                  >
                    <i className='ri-delete-bin-2-line'></i> Supprimer
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      {feedbackState.isError && (
        <tr>
          <td colSpan={6} className='text-center'>
            {feedbackState.errorMessage}
          </td>
        </tr>
      )}
      {dataToMap && dataToMap?.length === 0 && (
        <tr>
          <td colSpan={6} className='text-center'>
            Aucune notification
          </td>
        </tr>
      )}
      {feedbackState.isLoading &&
        Array.from({ length: 5 }).map((_: unknown, index: number) => (
          <TableLoader colNumber={5} key={index} />
        ))}
    </tbody>
  )
}
