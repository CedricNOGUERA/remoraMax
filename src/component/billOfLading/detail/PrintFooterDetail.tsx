import { ResultConnaissementType } from "../../../definitions/ConnaissementType"

export default function PrintFooterDetail({ selectedConnaissement }: {selectedConnaissement: ResultConnaissementType}) {
  const dateLastEvent =
    new Date(
      selectedConnaissement?.dernierEtat?.dateEvenement.slice(0, 10)
    ).toLocaleDateString('fr-FR', {
      timeZone: 'UTC',
    }) +
    ' ' +
    selectedConnaissement?.dernierEtat?.dateEvenement.slice(11, 19)
  return (
    <div className='footer-connaissement'>
      <div className='printermulti'>
        REVATUA - Le {dateLastEvent} édition du connaissement n°
        {selectedConnaissement?.numero}
      </div>
    </div>
  )
}
