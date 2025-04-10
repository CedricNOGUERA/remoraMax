import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import userStore, { UserState } from '../../../stores/userStore'
import ConnaissementServices from '../../../services/connaissements/ConnaissementServices'
import { ResultConnaissementType } from '../../../definitions/ConnaissementType'
import { Options } from 'react-to-pdf'

interface FooterDetailType {
  selectedConnaissement: ResultConnaissementType
  toPDF: (option?: Options) => void 
  setPdfData: React.Dispatch<React.SetStateAction<string | undefined>>  
  handlePrint: () => void 
  handleCloseDetailConnaiss: () => void
}

export default function FooterDetail({ footerDetailProps }: {footerDetailProps: FooterDetailType}) {
  const { selectedConnaissement, toPDF, setPdfData, handlePrint, handleCloseDetailConnaiss} =
    footerDetailProps
  const dataStore = userStore((state: UserState) => state)
  const numPdt = selectedConnaissement?.numero
    ? selectedConnaissement?.numero
    : selectedConnaissement?.id

   
//DownLoad
  const getPDFConnaissementByEvenement = (
    token: string,
    id: number,
    idEven: number,
    num: string | number,
    setPdfData: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    try {
      ConnaissementServices.getPDFConnaissement(
        token,
        id,
        idEven,
        num,
        setPdfData,
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal.Footer className='sticky-bottom border-0'>
        <React.Fragment>
          {selectedConnaissement?.dernierEtat?.evenementConnaissement !== 'OFFICIALISE' && (
            <Button className='print-button' variant='success' onClick={() => handlePrint()}>
              <i className='ri-printer-fill'></i> Imprimer
            </Button>
          )}
          <Button
            className='print-button'
            variant='warning'
            onClick={() => {
              if (
                selectedConnaissement?.dernierEtat?.evenementConnaissement === 'BROUILLON' ||
                selectedConnaissement?.dernierEtat?.evenementConnaissement === 'DEMANDE'
              ) {
                toPDF()
              } else {
                getPDFConnaissementByEvenement(
                  dataStore.access_token,
                  selectedConnaissement?.id,
                  selectedConnaissement?.dernierEtat?.id,
                  numPdt,
                  setPdfData
                )
              }
            }}
          >
            <i className='ri-download-2-fill'></i> Télécharger
          </Button>
        </React.Fragment>
      <Button className='print-button' variant='secondary' onClick={handleCloseDetailConnaiss}>
        <i className='ri-close-cirlce-fill'></i> Fermer
      </Button>
    </Modal.Footer>
  )
}
