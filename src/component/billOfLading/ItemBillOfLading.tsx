import { Button, Col, Dropdown, Form, Row } from 'react-bootstrap'
import { _formatDate, _tagStatus } from '../../utils/functions'
import { Tag } from 'rsuite'
import { WarningTwoTone } from '@ant-design/icons'
import { PeripleType, ResultConnaissementType } from '../../definitions/ConnaissementType'

interface ItemBillOfLadingType {
  isRedBackGround: boolean
  connaissement: ResultConnaissementType
  checkedConnaissement: number[]
  handleSelectConnaissement: (bill: number) => void
  multiselected: (bill: ResultConnaissementType) => void
  setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>
  handleShowDetailConnaiss: () => void
  isTransporter: boolean | null
  dateDArrivee: PeripleType
  isDangerous: boolean
  isFragile: boolean
  isRefusee: boolean
  handleShowQrcode: () => void
  isNotBrouillon: boolean
  handleShowUpdateToDemandeModal: () => void
  handleShowUpdatePalette: () => void
  handleShowDeleteModal: () => void
  handleShowUpdate: () => void
}

export default function ItemBillOfLading({ItemBillOfLadingProps}: {ItemBillOfLadingProps: ItemBillOfLadingType}) {

    const {
      isRedBackGround,
      connaissement,
      checkedConnaissement,
      handleSelectConnaissement,
      multiselected,
      setSelectedConnaissement,
      handleShowDetailConnaiss,
      isTransporter,
      dateDArrivee,
      isDangerous,
      isFragile,
      isRefusee,
      handleShowQrcode,
      isNotBrouillon,
      handleShowUpdateToDemandeModal,
      handleShowUpdatePalette,
      handleShowDeleteModal,
      handleShowUpdate,
    } = ItemBillOfLadingProps


  return (
    <tr  className=''>
      <td
        className={`p-1 p-sm-2 ${isRedBackGround && 'bg-danger'}`}
   
      >
        <Form.Check
          type='checkbox'
          id={`${connaissement.id}`}
          onChange={() => {
            handleSelectConnaissement(connaissement?.id)
            multiselected(connaissement)
          }}
          checked={checkedConnaissement && checkedConnaissement?.includes(connaissement.id)}
          value={connaissement.id}
        />
      </td>
      <td
        onClick={() => {
          setSelectedConnaissement(connaissement)
          handleShowDetailConnaiss()
        }}
        className='pointer p-1 pe-0 p-md-2'
      >
        {connaissement?.numero ? connaissement?.numero : connaissement?.id}{' '}
      </td>
      {isTransporter && (
        <td
          onClick={() => {
            setSelectedConnaissement(connaissement)
            handleShowDetailConnaiss()
          }}
          className='pointer p-1 pe-0 p-md-2'
        >
          {connaissement?.expediteur?.denomination}{' '}
        </td>
      )}
      <td
        onClick={() => {
          setSelectedConnaissement(connaissement)
          handleShowDetailConnaiss()
        }}
        className='pointer p-1 pe-0 p-md-2'
      >
        {connaissement?.destinataire?.denomination}{' '}
      </td>
      <td
        onClick={() => {
          setSelectedConnaissement(connaissement)
          handleShowDetailConnaiss()
        }}
        className='pointer p-1 pe-0 p-md-2'
      >
        {connaissement?.voyage?.nomNavire}
      </td>
      <td
        onClick={() => {
          setSelectedConnaissement(connaissement)
          handleShowDetailConnaiss()
        }}
        className='pointer p-1 pe-0 p-md-2 responsive-font-small'
      >
        <Tag
          className={`responsive-font-small ${connaissement?.dernierEtat?.evenementConnaissement === "EMBARQUE" && 'bg-success'}`}
          size='sm'
          color={_tagStatus(connaissement?.dernierEtat?.evenementConnaissement)}
        >
          {connaissement?.dernierEtat?.evenementConnaissement}
        </Tag>
      </td>
      <td
        onClick={() => {
          setSelectedConnaissement(connaissement)
          handleShowDetailConnaiss()
        }}
        className='pointer p-1 pe-0 p-md-2'
      >
        {_formatDate(connaissement?.voyage?.dateDepart)}
      </td>
      {!isTransporter && (
        <>
          <td
            onClick={() => {
              setSelectedConnaissement(connaissement)
              handleShowDetailConnaiss()
            }}
            className='pointer p-1 pe-0 p-md-2'
          >
            {connaissement?.ileArrivee?.nom}
          </td>
          <td
            onClick={() => {
              setSelectedConnaissement(connaissement)
              handleShowDetailConnaiss()
            }}
            className='pointer p-1 pe-0 p-md-2'
          >
            {_formatDate(dateDArrivee.dateArrivee)}
          </td>
        </>
      )}
      <td className='pointer p-1 pe-0 p-md-2 text-center'>
        <Row className='w-100 '>
          <Col xs={4}>
            {isDangerous && (
              <div>
                <WarningTwoTone twoToneColor='#ee4848' />
              </div>
            )}
            {isFragile && (
              <div>
                <WarningTwoTone twoToneColor='#fa8900' />
              </div>
            )}
          </Col>
          <Col xs={4}>
            {isNotBrouillon && (
              <Button
            variant="trnasparent"
                className='button-transparent p-1'
                onClick={() => {
                  setSelectedConnaissement(connaissement)
                  handleShowQrcode()
                }}
              >
                <i className='ri-qr-code-line fs-4'></i>
              </Button>
            )}
          </Col>
          {!isTransporter && (
            <Col xs={4}>
              <Dropdown>
                <Dropdown.Toggle
                  variant='transparent'
                  id='dropdown-basic'
                  className='border-0 no-chevron button-transparent'
                >
                  <b>
                    {' '}
                    <i className='ri-more-2-line'></i>
                  </b>
                </Dropdown.Toggle>
                <Dropdown.Menu align='end'>
                  {isNotBrouillon && (
                    <Dropdown.Item
                      className='d-flex align-items-center '
                      onClick={() => {
                        handleShowQrcode()
                        setSelectedConnaissement(connaissement)
                      }}
                    >
                      <i className='ri-qr-code-line fs-4 me-2'></i> Qrcode
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    className='d-flex align-items-center '
                    onClick={() => {
                      handleShowDetailConnaiss()
                      setSelectedConnaissement(connaissement)
                    }}
                  >
                    <i className='ri-file-list-2-line text-info fs-4 me-2'></i> Détail
                  </Dropdown.Item>
                  {!isNotBrouillon && (
                    <>
                      <Dropdown.Item
                        className='d-flex align-items-center '
                        onClick={() => {
                          handleShowUpdate()
                          setSelectedConnaissement(connaissement)
                        }}
                      >
                        <i className='ri-file-edit-line fs-4 me-2 text-remora-primary'></i>{' '}
                        Editer un connaissement{' '}
                      </Dropdown.Item>
                      <Dropdown.Item
                        className='d-flex align-items-center '
                        onClick={() => {
                          handleShowUpdateToDemandeModal()
                          setSelectedConnaissement(connaissement)
                        }}
                      >
                        <i className='ri-check-line fs-4 me-2 text-success'></i> BROUILLON{' '}
                        <i className='ri-arrow-right-line text-primary'></i>
                        DEMANDE
                      </Dropdown.Item>
                      <Dropdown.Item
                        className='d-flex align-items-center '
                        onClick={() => {
                          handleShowUpdatePalette()
                          setSelectedConnaissement(connaissement)
                        }}
                      >
                        <i className='ri-pencil-line fs-4 me-2 text-warning'></i> Modifier suremballage{' '}{' '}
                      </Dropdown.Item>
                      <Dropdown.Item
                        className='d-flex align-items-center '
                        onClick={() => {
                          handleShowDeleteModal()
                          setSelectedConnaissement(connaissement)
                        }}
                      >
                        <i className='ri-close-circle-line fs-4 me-2 text-danger'></i>{' '}
                        Supprimer
                      </Dropdown.Item>
                    </>
                  )}
                  {isRefusee && (
                    <Dropdown.Item
                      className='d-flex align-items-center '
                      onClick={() => {
                        handleShowDeleteModal()
                        setSelectedConnaissement(connaissement)
                      }}
                    >
                      <i className='ri-close-circle-line fs-4 me-2 text-danger'></i> Supprimer
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          )}
        </Row>
      </td>
    </tr>
  )
}
