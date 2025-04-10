import React, { SetStateAction } from 'react'
import { Button } from 'react-bootstrap'
import { UserState } from '../../stores/userStore'
import { ResultConnaissementType } from '../../definitions/ConnaissementType'
import { _getMultiPDFConnaissementByEvenement } from '../../utils/api/apiControlerFunctions'
interface multiActionType {
  checkedConnaissement: number[]
  checkedMultiConnaissement: ResultConnaissementType[]
  isNotJustOfficialse: ResultConnaissementType[]
  dataStore: UserState
  setPdfData: React.Dispatch<SetStateAction<string | undefined>>
  handlePrintMulti: () => void
  handleShowUpdateMultiToDemandeModal: () => void
  isNotJustBrouillon: ResultConnaissementType[]
  isDeletable: boolean
  handleShowMultiDeleteModal: () => void
  handleShowMultiPrintModal: () => void
  setCheckedConnaissement: React.Dispatch<SetStateAction<number[]>>
  setCheckedMultiConnaissement: React.Dispatch<SetStateAction<ResultConnaissementType[]>>
}

export default function MultiAction({
  checkedConnaissement,
  checkedMultiConnaissement,
  isNotJustOfficialse,
  dataStore,
  setPdfData,
  handlePrintMulti,
  handleShowUpdateMultiToDemandeModal,
  isNotJustBrouillon,
  isDeletable,
  handleShowMultiDeleteModal,
  handleShowMultiPrintModal,
  setCheckedConnaissement,
  setCheckedMultiConnaissement,
}: multiActionType) {
  return (
    <div className='d-flex flex-md-row flex-column  multi-action px-1 px-md-3  py-2 rounded-2'>
      <div className='d-none d-md-block border-0 border-end pe-2 me-2 d-flex align-items-center text-light'>
        <span className='fs-4 me-2'>{checkedConnaissement?.length}</span> éléments sélectionnés
      </div>
      {/* {isNotJustOfficialse?.length === 0 && ( */}
        <Button
          title='Télécharger'
          className='m-auto  rounded-pill 
              button-primary
               me-md-2 mb-2 mb-md-0'
          onClick={() =>
            _getMultiPDFConnaissementByEvenement(
              dataStore.access_token,
              checkedMultiConnaissement,
              setPdfData
            )
          }
        disabled={isNotJustOfficialse?.length > 0 ? true : false}

        >
          <i className='ri-download-line'></i>
        </Button>
      {/* )} */}
      <Button
        title='Imprimer'
        className='m-auto rounded-pill button-primary me-md-2 mb-2 mb-md-0'
        onClick={() => {
          if (isNotJustOfficialse?.length === 0) {
            handleShowMultiPrintModal()
            // handleShowDetailConnaiss()
         
          } else {
            handlePrintMulti()
          }
        }}
      >
        <i className='ri-printer-line'></i>
      </Button>
      <Button
        title='Valider des brouillons'
        className={`m-auto  rounded-pill 
            button-primary
             me-md-2 mb-2 mb-md-0`}
        onClick={handleShowUpdateMultiToDemandeModal}
        disabled={isNotJustBrouillon?.length > 0 ? true : false}
      >
        <i className='ri-check-double-line'></i>
      </Button>
      {/* {!isDeletable& ( */}
        <Button
          variant='danger'
          title='Supprimer'
          className='m-auto  rounded-pill me-md-2 mb-2 mb-md-0'
          onClick={handleShowMultiDeleteModal}
        disabled={isDeletable}

        >
          <i className='ri-delete-bin-line'></i>
        </Button>
       {/* )} */}
      <div className='d-none d-md-block border-0 border-start me-md-2 mb-2 mb-md-0'></div>
      <div className='text-center'>
        <i
          className='ri-close-line fs-3 text-light ps-md-1 pointer'
          onClick={() => {
            setCheckedConnaissement([])
            setCheckedMultiConnaissement([])
            setPdfData(undefined)
          }}
        ></i>
      </div>
    </div>
  )
}
