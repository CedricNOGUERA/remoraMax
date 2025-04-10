export default function NotificationTableTitle() {
    

    const tableTitleData = [
       'Nom',
       'Description',
       'Destinataire',
       'Statut',
       'Compagnie',
       'Action'
    ]


  return (
    <thead className=' d-table-head'>
      <tr>
        {tableTitleData?.map((item: string, index: number) => (
          <th key={index} className='responsive-font-small p-1 p-sm-2'>
            {item}
          </th>
        ))}
      </tr>
    </thead>
  )
}
