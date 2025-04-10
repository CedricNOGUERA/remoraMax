import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function MultiPdf({ pdfData }: {pdfData: string[]}) {
    const defaultLayout = defaultLayoutPlugin();
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Worker workerUrl={`/pdf.worker.min.js`}>
        {pdfData?.map((pdf: string, index: number) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <Viewer fileUrl={pdf} plugins={[defaultLayout]} />
          </div>
        ))}
      </Worker>
    </div>
  )
}
