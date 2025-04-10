import { Placeholder } from 'react-bootstrap'

export default function TableLoader({colNumber, itemNumber}: {colNumber: number, itemNumber: number}) {
  return (
    <>
      {Array.from({ length: itemNumber }).map((_: unknown, index: number) => (
        <Placeholder key={index} as='tr' animation='glow' className='m-auto'>
          {Array.from({ length: colNumber }).map((_: unknown, indx: number) => (
            <td key={indx}>
              <Placeholder
                xs={12}
                as='p'
                className='bg-secondary rounded-1'
                style={{ height: '25px' }}
              />
            </td>
          ))}
          <td className='text-end'>
            <Placeholder
              xs={4}
              as='p'
              className='bg-secondary rounded-1'
              style={{ height: '25px' }}
            />
          </td>
        </Placeholder>
      ))}
    </>
  )
}
