import React from 'react'
interface BillOfTableTitleType {
  sortConfig: string
  setSortConfig: React.Dispatch<React.SetStateAction<string>>
}

export default function BillOfTableTitle({ BillOfTableTitleProps }: {BillOfTableTitleProps: BillOfTableTitleType}) {
  const { sortConfig, setSortConfig } = BillOfTableTitleProps
  return (
    <thead>
      <tr>
        <th></th>
        <th>
          N°<span className='d-none d-sm-inline'>Connaiss...</span>
        </th>
        <th>Client</th>
        <th>Navire</th>
        <th>Statut</th>
        <th style={{ minWidth: '105px' }}>
          <div className='d-flex align-items-end'>
            <span className='me-1'>Date départ</span>
            <span className='d-flex flex-column justify-content-center pointer'>
              <span
                style={{ height: '16px' }}
                onClick={() => setSortConfig('voyage.dateDepart,asc')}
              >
                <i
                  className={`ri-arrow-up-s-fill ${
                    sortConfig === 'voyage.dateDepart,asc'
                      ? 'text-remora-secondary'
                      : 'text-dark'
                  }`}
                ></i>
              </span>
              <span
                style={{ height: '16px' }}
                onClick={() => {
                  if (setSortConfig) {
                    setSortConfig('voyage.dateDepart,desc')
                  }
                }}
              >
                <i
                  style={{ height: '15px' }}
                  className={`ri-arrow-down-s-fill ${
                    sortConfig === 'voyage.dateDepart,desc'
                      ? 'text-remora-secondary'
                      : 'text-dark'
                  }`}
                ></i>
              </span>
            </span>
          </div>
        </th>
        <th>Ile d'arrivée</th>
        <th style={{ minWidth: '105px' }}>
        <div className='d-flex align-items-end'>
            <span className='me-1'>Date Arrivée</span>
            <span className='d-flex flex-column justify-content-center pointer'>
              <span
                style={{ height: '16px' }}
                onClick={() => setSortConfig('voyage.dateArrivee,asc')}
              >
                <i
                  className={`ri-arrow-up-s-fill ${
                    sortConfig === 'voyage.dateArrivee,asc'
                      ? 'text-remora-secondary'
                      : 'text-dark'
                  }`}
                ></i>
              </span>
              <span
                style={{ height: '16px' }}
                onClick={() => {
                  if (setSortConfig) {
                    setSortConfig('voyage.dateArrivee,desc')
                  }
                }}
              >
                <i
                  style={{ height: '15px' }}
                  className={`ri-arrow-down-s-fill ${
                    sortConfig === 'voyage.dateArrivee,desc'
                      ? 'text-remora-secondary'
                      : 'text-dark'
                  }`}
                ></i>
              </span>
            </span>
          </div>
        
        </th>
        <th>Action</th>
      </tr>
    </thead>
  )
}
