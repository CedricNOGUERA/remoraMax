import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Order from './pages/private/Order'
import BillOfLading from './pages/private/BillOfLading'
import Companies from './pages/private/Companies'
import Users from './pages/private/Users'
import Auth from './pages/public/Auth'
import NotFound from './pages/NotFound'
import ResetPassword from './pages/public/ResetPassword'
import 'animate.css';
import Notifications from './pages/private/Notifications'
import TransportersAllStatus from './pages/private/transporter/TransportersAllStatus2'
import Dashboard from './pages/private/Dashboard'
// import Dashboard from './pages/private/DashBoard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        element: (
          <React.Fragment>
            <Dashboard />
          </React.Fragment>
        ),
      },
      {
        path: 'factures',
        element: (
          <React.Fragment>
            <Order />
          </React.Fragment>
        ),
      },
      {
        path: 'connaissements',
        element: (
          <React.Fragment>
            <BillOfLading />
          </React.Fragment>
        ),
      },
      {
        path: 'connaissements-transporteur',
        element: (
          <React.Fragment>
            <TransportersAllStatus />
          </React.Fragment>
        ),
      },
      {
        path: 'compagnies',
        element: (
          <React.Fragment>
            <Companies />
          </React.Fragment>
        ),
      },
      {
        path: 'utilisateurs',
        element: (
          <React.Fragment>
            <Users />
          </React.Fragment>
        ),
      },
      {
        path: 'notifications',
        element: (
          <React.Fragment>
            <Notifications />
          </React.Fragment>
        ),
      },
    ],
  },
  {
    path: '/connexion',
    element: <Auth />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
],
//  {
//     future: {
//       //Activer lorsque reat-router-dom v7 sera disponible
//       // v7_startTransition: true, // Active l'optimisation
//       v7_relativeSplatPath: true,
//     },
//   }
)
export default function RoutesApp() {
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  )
}
