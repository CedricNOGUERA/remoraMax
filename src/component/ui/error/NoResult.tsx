import { Image } from 'react-bootstrap'
import noResult from '../../../styles/images/no_result.png'

export default function NoResult() {
  return (
    <tr>
      <td></td>
      <td colSpan={7} className='text-center'>
        <Image src={noResult} height={32} /> Votre recherche n'a donné aucun résultat
      </td>
      <td></td>
    </tr>
  )
}
