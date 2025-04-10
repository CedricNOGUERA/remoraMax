
export default function HeaderTableCompany({
  headerTableData,
}: {
  headerTableData: string[]
}) {
  return (
    <thead className=''>
      <tr>
        {headerTableData.map((header: string, index: number) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </thead>
  )
}
