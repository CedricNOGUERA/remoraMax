import React from 'react';

const DownloadCSV = ({ jsonData, fileName }: any) => {
    const handleDownload = () => {
      if (!jsonData || jsonData.length === 0) {
        console.error('Les données JSON sont vides ou non définies.');
        return;
      }
        const csvData = convertToCsv(jsonData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    
      const convertToCsv = (data: any) => {
        if (!data || data.length === 0) {
          return '';
        }

        const headers = Object?.keys(data?.[0])?.join(',');
        const rows = data?.map((row: any) => Object?.values(row)?.join(','))?.join('\n');
        return `${headers}\n${rows}`;
      };
    
      return (
        <button onClick={handleDownload}>
          Télécharger CSV
        </button>
      );
//   const convertToCSV = (objArray: any) => {
//     const array = typeof objArray !== 'object' ? objArray : objArray;
//     let str = '';

//     for (let i = 0; i < array.length; i++) {
//       let line = '';
//       for (let index in array[i]) {
//         if (line !== '') line += ',';

//         line += array[i][index];
//       }
//       str += line + '\r\n';
//     }
//     return str;
//   };

//   const downloadCSV = () => {
//     const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
//     const csvURL = URL.createObjectURL(csvData);
//     const link = document.createElement('a');
//     link.href = csvURL;
//     link.download = `${fileName}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <button onClick={downloadCSV}>Download CSV</button>
//   );
}

export default DownloadCSV;