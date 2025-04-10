import React from 'react'
import { Container, Image } from 'react-bootstrap'
import ItemTransporter from '../ItemTransporter'
import ItemTransportLoader from '../../ui/Loader/ItemTransportLoader'
import { ResultConnaissementType } from '../../../definitions/ConnaissementType'
import { errorType } from '../../../definitions/errorType'

interface MobileViewType {
  isLoading: boolean
  isError: errorType
  isFiltering: boolean
  connaissementData: ResultConnaissementType[]
  setSelectedConnaissement: React.Dispatch<React.SetStateAction<ResultConnaissementType>>
  handleShowDetailConnaiss: () => void
  handleShowQrcode: () => void
  borderColor: string
  status: string
  noResult: string
}

export default function MobileView({ mobileViewProps }: { mobileViewProps: MobileViewType }) {
    
  const {
    isLoading,
    isError,
    isFiltering,
    connaissementData,
    setSelectedConnaissement,
    handleShowDetailConnaiss,
    handleShowQrcode,
    borderColor,
    status,
    noResult,
  } = mobileViewProps

  
  return (
    <Container fluid className='d-block d-md-none mb-3 px-2'>
      {!isLoading &&
        connaissementData?.length > 0 &&
        connaissementData?.map((connaissement: ResultConnaissementType, indx: number) => {
          const itemTransporterProps = {
            connaissement,
            setSelectedConnaissement,
            handleShowDetailConnaiss,
            borderColor,
            handleShowQrcode,
          }

          return (
            <React.Fragment key={indx}>
           {connaissement?.dernierEtat?.evenementConnaissement === status && (
                <ItemTransporter itemTransporterProps={itemTransporterProps} />
               )}
            </React.Fragment>
          )
        })}

      {!isLoading && !isError.error && isFiltering && connaissementData?.length === 0 && (
      <Container fluid className='d-block d-md-none mb-3 px-2'>
            <Image src={noResult} height={32} /> Votre recherche n'a donné aucun résultat
         </Container>
      )}
      {isLoading &&
        Array.from({ length: 10 })?.map((_: unknown, indx: number) => (
          <ItemTransportLoader key={indx} />
        ))}
    </Container>
  )
}
