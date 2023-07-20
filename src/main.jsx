// eslint-disable-next-line no-unused-vars
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './authentication/Login.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './authentication/Register.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'register',
    element: <Register />
  }
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <div className=''>
    <AuthProvider>

      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
    {/* <App /> */}
    {/* </React.StrictMode>, */}
  </div>
)


















// // eslint-disable-next-line no-unused-vars
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   // <React.StrictMode>
//   <div className=''>

//     <App />
//     {/* </React.StrictMode>, */}
//   </div>
// )
