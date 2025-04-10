export type BillOfTableTitleType = {
  sortConfig: string | undefined
  setSortConfig: React.Dispatch<React.SetStateAction<string>> | undefined
}

export default function TableTitleTransporter({billOfTableTitleProps}: {billOfTableTitleProps: BillOfTableTitleType}) {

const {sortConfig, setSortConfig} = billOfTableTitleProps


    return (
      <thead>
        <tr>
          <th>
            N°<span className='d-none d-sm-inline'>Connaiss...</span>
          </th>
          {/* <th>Société</th> */}
          <th>Client</th>
          <th>Navire</th>
          <th>
            <div className='d-flex align-items-center'>
              <span className='me-1'>Date départ</span>
              <span className=' pointer'>
                {sortConfig === 'ASC' && (
                  <span
                    style={{ height: '16px' }}
                    onClick={() => {
                      if (setSortConfig) {
                        setSortConfig('DESC')
                      }
                    }}
                  >
                    <i
                      className={`ri-arrow-up-s-fill 
                        `}
                      //   ${
                      //   sortConfig === 'ASC' ? 'text-remora-secondary' : 'text-dark'
                      // }
                    ></i>
                  </span>
                )}
                {sortConfig === 'DESC' && (
                  <span
                    style={{ height: '16px' }}
                    onClick={() => {
                      if (setSortConfig) {
                        setSortConfig('ASC')
                      }
                    }}
                  >
                    <i
                      style={{ height: '15px' }}
                      className={`ri-arrow-down-s-fill 
                        `}
                      //   ${
                      //   sortConfig === 'DESC' ? 'text-remora-secondary' : 'text-dark'
                      // }
                    ></i>
                  </span>
                )}
              </span>
            </div>
          </th>
          <th>Action</th>
        </tr>
      </thead>
    )
  }
  