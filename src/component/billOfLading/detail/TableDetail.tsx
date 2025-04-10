import React from 'react'
import { Container, Col, Row, Table } from 'react-bootstrap'
import { _thousandSeparator } from '../../../utils/functions'
import { WarningTwoTone } from '@ant-design/icons'
import { DetailType, PrestationsComplementairesType, ResultConnaissementType } from '../../../definitions/ConnaissementType'


export default function TableDetail({selectedConnaissement}: {selectedConnaissement : ResultConnaissementType}) {

    const [sortedDetail, setSortedDetail] = React.useState<DetailType[][]>([])

    const totalWeight: string = selectedConnaissement?.detailConnaissements
      ?.reduce((acc: number, product: DetailType) => acc + product.poids, 0)
      ?.toFixed(3)

    const totalVolume: string  = selectedConnaissement?.detailConnaissements
      ?.reduce((acc: number, product: DetailType) => acc + (product?.volume ?? 0), 0)
      ?.toFixed(3)

    // const totalMontant = selectedConnaissement?.detailConnaissements?.reduce(
    //   (acc: any, product: any) => acc + product.montantDeclare,
    //   0
    // )

    const totalColis = selectedConnaissement?.detailConnaissements?.reduce(
      (acc: number, product: DetailType) => acc + product.nbColis,
      0
    )

    const sortingProduct = () => {
      const pgcProd = selectedConnaissement?.detailConnaissements?.filter(
        (prod: DetailType) => prod?.codeTarif?.code === 'PGC'
      )
      const ppnProd = selectedConnaissement?.detailConnaissements?.filter(
        (prod: DetailType) => prod?.codeTarif?.code === 'PPN'
      )
      const frigoProd = selectedConnaissement?.detailConnaissements?.filter(
        (prod: DetailType) => prod?.codeTarif?.code === 'FRIGO'
      )
      const fdgeaProd = selectedConnaissement?.detailConnaissements?.filter(
        (prod: DetailType) => prod?.codeTarif?.code === 'FRIGODGAE'
      )
      const autreProd = selectedConnaissement?.detailConnaissements?.filter(
        (prod: DetailType) => prod?.codeTarif?.code === 'AUTRE'
      )
      setSortedDetail([frigoProd, fdgeaProd, pgcProd, ppnProd, autreProd])
    }

    React.useEffect(() => {
      sortingProduct()
    }, [selectedConnaissement])


  return (
    <Container fluid className='pb-3'>
      <Table striped hover responsive className='border table-connaiss'>
        <thead className='  responsive-font-small font-85'>
          <tr style={{ verticalAlign: 'middle', lineHeight: '0.9' }}>
            <th
              style={{ width: '30px' }}
              className='bg-head text-start ps-1 pt-1 pe-0 pe-sm-2 font-7'
            >
              Nb Colis (Qté)
            </th>
            <th className='bg-head text-start ps-1 ps-sm-2 pe-0 pe-sm-2'>Contenant</th>
            <th className='bg-head text-start ps-1 ps-sm-2 pe-0 pe-sm-2'>Désignation</th>
            <th
              style={{ width: '50px' }}
              className='bg-head text-start ps-1 ps-sm-2 pe-0 pe-sm-2'
            >
              Danger. /Fragile
            </th>
            <th className='bg-head text-center pe-0 pe-sm-2'>
              Volume
              <br /> (m<sup>3</sup>)
            </th>
            <th className='bg-head text-center pe-0 pe-sm-2'>
              Poids
              <br /> ({selectedConnaissement?.detailConnaissements?.[0].unitePoids === 'KILO' ? 'Kg' : 'T'})
            </th>
            {/* <th className='bg-head text-center pe-1 pe-sm-2'>Montant</th> */}
          </tr>
        </thead>
        <tbody className='responsive-font-small'>
          {sortedDetail?.map((detail: DetailType[], index: number) => {
            const sousTotalPoids = detail
              ?.reduce((acc: number, product: DetailType) => acc + product?.poids, 0)
              ?.toFixed(3)
            const sousTotalVolume = detail
              ?.reduce((acc: number, product: DetailType) => acc + (product?.volume ?? 0), 0)
              ?.toFixed(3)

            // const sousTotalMontant = detail?.reduce(
            //   (acc: any, product: any) => acc + product?.montantDeclare,
            //   0
            // )

            return (
              <React.Fragment key={index}>
                {detail?.length !== 0 && (
                  <tr>
                    <td className='bg-code-tarif' colSpan={6}>
                      {detail && detail[0]?.codeTarif?.code} -{' '}
                      {detail && detail[0]?.codeTarif?.libelle}
                    </td>
                  </tr>
                )}
                {detail &&
                  detail?.map((product: DetailType, indexProd: number) => {
                    return (
                      <tr key={indexProd}>
                        <td className='text-end ps-1 pe-0 pe-sm-2'>{product?.nbColis}</td>
                        <td className='text-start pe-0 pe-sm-2'>
                          {product?.contenant?.libelle}
                        </td>
                        <td className='text-start ps-1 ps-sm-2 pe-0 pe-sm-2'>
                          {product?.description}
                        </td>
                        <td className='text-center ps-1 ps-sm-2 pe-0 pe-sm-2'>
                          {product?.matiereDangereuse && (
                            <span>
                              <WarningTwoTone twoToneColor='#ee4848' />
                            </span>
                          )}
                          {product?.matiereDangereuse && product?.fragile && <span> / </span>}
                          {product?.fragile && (
                            <span>
                              <WarningTwoTone twoToneColor='#fa8900' />
                            </span>
                          )}
                        </td>
                        <td className='text-end pe-1 pe-sm-2'>
                          {product?.volume?.toFixed(3)}
                        </td>
                        <td className='text-end pe-1 pe-sm-2'>{product?.poids?.toFixed(3)}</td>
                        {/* <td className='text-end pe-1 pe-sm-2'>
                                {_thousandSeparator(product?.montantDeclare, 'fr-FR')}
                              </td> */}
                      </tr>
                    )
                  })}

                {detail?.length !== 0 && (
                  <tr>
                    <td className='text-end bg-sous-total' colSpan={4}>
                      <b>Sous-total :</b>
                    </td>
                    <td className='text-end bg-sous-total pe-1 pe-sm-2 border'>
                      {sousTotalVolume}{' '}
                    </td>
                    <td className='text-end bg-sous-total pe-1 pe-sm-2 border'>
                      {_thousandSeparator(parseInt(sousTotalPoids), 'fr-FR')}
                    </td>
                    {/* <td className='text-end bg-sous-total pe-1 pe-sm-2'>
                            {_thousandSeparator(sousTotalMontant, 'fr-FR')}
                          </td> */}
                  </tr>
                )}
              </React.Fragment>
            )
          })}
          <tr>
            <td className='text-end'></td>
            <td className='text-end'></td>
            <td className='text-end'></td>
            <td className='text-end'>
              <b>Total :</b>
            </td>
            <td className='text-end pe-1 pe-sm-2 border'>{totalVolume} </td>
            <td className='text-end pe-1 pe-sm-2 border'>
              {_thousandSeparator(parseInt(totalWeight), 'fr-FR')}
            </td>
            {/* <td className='text-end pe-1 pe-sm-2'>
                    {_thousandSeparator(totalMontant, 'fr-FR')}
                  </td> */}
          </tr>
        </tbody>
      </Table>
      <Container>
        <Row className='responsive-font-small'>
          <Col xs={3} className='responsive-font-small'></Col>
          <Col xs={9} className='responsive-font-small mb-3'>
            <strong>
              Ce document n'est pas une facture, cette dernière doit être jointe.
            </strong>
          </Col>

          <Col xs={0} sm={4} className='m-auto text-end responsive-font-small'></Col>
          <Col xs={8} sm={4} className='m-auto text-start responsive-font-small'>
            <strong>Mode de règlement </strong>
          </Col>
          <Col xs={4} sm={4} className='m-auto text-start responsive-font-small'>
            {selectedConnaissement?.paiement}
          </Col>
        </Row>
        <Row className='responsive-font-small'>
          <Col xs={0} sm={4} className=' text-end responsive-font-small'></Col>
          <Col xs={8} sm={4} className=' text-start responsive-font-small'>
            <strong>Prestations complémentaires </strong>
          </Col>
          <Col xs={4} sm={4} className='m-auto text-start responsive-font-small'>
            {selectedConnaissement?.prestationsComplementaires?.length === 0 ? (
              'Non'
            ) : (
              <ul>
                {selectedConnaissement?.prestationsComplementaires?.map(
                  (prestation: PrestationsComplementairesType, index: number) => (
                    <li key={index}>{prestation?.libelle}</li>
                  )
                )}
              </ul>
            )}
          </Col>
        </Row>
        <Row className='responsive-font-small'>
          <Col xs={0} sm={4} className='m-auto text-end responsive-font-small'></Col>
          <Col xs={8} sm={4} className='m-auto text-start responsive-font-small'>
            <strong>{selectedConnaissement?.nombreColisAEmbarquer ? "Nombre de suremballages" : "Nombre de colis"}</strong>
          </Col>
          <Col xs={4} sm={4} className='m-auto text-start responsive-font-small'>
            {selectedConnaissement?.nombreColisAEmbarquer ? selectedConnaissement?.nombreColisAEmbarquer : totalColis}
          </Col>
          <Col xs={0} sm={4} className='m-auto text-end responsive-font-small'></Col>
          <Col xs={8} sm={4} className='m-auto text-start responsive-font-small'>
            <strong>
              Volume total suremballages (m<sup>3</sup>)
            </strong>
          </Col>
          <Col xs={4} sm={4} className='m-auto text-start responsive-font-small'>
            {totalVolume !== '0.000' ? totalVolume : ''}
          </Col>
        </Row>
      </Container>
    </Container>
  )
}
