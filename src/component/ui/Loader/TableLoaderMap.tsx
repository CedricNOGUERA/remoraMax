import { Placeholder } from 'react-bootstrap'
interface TableLoaderMapType {
  colNumber: number
  repetition: number
}

export default function TableLoaderMap({ colNumber, repetition }: TableLoaderMapType) {
  return (
    <>
      {Array.from({ length: repetition }).map((_: unknown, index: number) => (
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
              xs={12}
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
