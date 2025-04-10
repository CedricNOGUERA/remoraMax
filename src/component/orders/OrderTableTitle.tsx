import React from 'react'

interface SortConfigTypeType {
  by: string
  order: string
}
interface OrderTableTitleType {
  sortConfig?: SortConfigTypeType
  setSortConfig?: React.Dispatch<React.SetStateAction<SortConfigTypeType>>
  trigger?: string
}

export default function OrderTableTitle({
  OrderTableTitleProps,
}: {
  OrderTableTitleProps: OrderTableTitleType
}) {
  const { sortConfig, setSortConfig, trigger } = OrderTableTitleProps

  const headerData = [
    { name: 'Date', by: 'date_facture' },
    { name: 'N°Facture', by: 'referenceHorsRevatua' },
    { name: 'Client', by: 'destinataire_denomination' },
    { name: 'N°voyage', by: 'numeroVoyage' },
    { name: 'Statut', by: 'statut_revatua' },
    { name: 'Stockage', by: 'stockage' },
    { name: 'Navire', by: 'bateau' },
    { name: 'Arrivée', by: 'ileArrivee' },
  ]

  return (
    <thead className=''>
      <tr>
        <th className='p-1 p-sm-2'></th>
        {trigger ? (
          // Edit connaissement
          <>
            {headerData.map(
              (header, index) =>
                header?.name !== 'Statut' &&
                // header?.name !== 'Stockage' &&
                header?.name !== 'N°voyage' && (
                  <th key={index} className='responsive-font-small p-1 p-sm-2'>
                    {header?.name}
                  </th>
                )
            )}
          </>
        ) : (
          //Header table Facture
          <>
            {headerData.map((header, index: number) => (
              <th key={index} className='responsive-font-small p-1 p-sm-2'>
                <div className='d-flex align-items-center'>
                  <span className='me-1'>{header.name}</span>
                  <span className='d-flex flex-column pointer'>
                    <span style={{ height: '16px' }} className='d-flex'>
                      <i
                        className={`ri-arrow-up-s-fill  ${
                          sortConfig?.by === header.by && sortConfig?.order === 'ASC'
                            ? 'text-remora-secondary '
                            : 'text-dark'
                        }`}
                        onClick={() => {
                          if (setSortConfig) {
                            setSortConfig({ ...sortConfig, by: header.by, order: 'ASC' })
                          }
                        }}
                      ></i>
                    </span>
                    <span style={{ height: '16px' }} className='d-flex align-items-center'>
                      <i
                        className={`ri-arrow-down-s-fill ${
                          sortConfig?.by === header.by && sortConfig?.order === 'DESC'
                            ? 'text-remora-secondary'
                            : 'text-dark'
                        }`}
                        onClick={() => {
                          if (setSortConfig) {
                            setSortConfig({ ...sortConfig, by: header.by, order: 'DESC' })
                          }
                        }}
                      ></i>
                    </span>
                  </span>
                </div>
              </th>
            ))}
          </>
        )}
        {/* <th className='responsive-font-small p-1 p-sm-2'>Température</th> */}
        <th className='responsive-font-small p-1 p-sm-2'></th>
      </tr>
    </thead>
  )
}
