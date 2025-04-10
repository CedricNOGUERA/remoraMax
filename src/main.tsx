// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoutesApp from './routesApp.tsx';
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import 'rsuite/DatePicker/styles/index.css';
import 'rsuite/InputPicker/styles/index.css';
import 'rsuite/Tag/styles/index.css';
import 'rsuite/CheckPicker/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import 'animate.css';

const root = createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RoutesApp />);


