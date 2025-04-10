import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const PdfViewer = ({ pdfUrl }: {pdfUrl: string | undefined}) => {
  const defaultLayout = defaultLayoutPlugin()
  if (!pdfUrl) {
    return <div>PDF non disponible ou en chargement</div>; // Gérer l'absence d'URL
  }
  return (
    <div style={{ height: '100vh', width: '100%' }} className="pb-5">
      <Worker workerUrl={`/pdf.worker.min.js`}>
        <div style={{ marginBottom: '20px' }}>
          <Viewer fileUrl={pdfUrl} plugins={[defaultLayout]} />
        </div>
      </Worker>
      
    </div>
  )
}

export default PdfViewer
