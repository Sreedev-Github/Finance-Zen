import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import {Button, Footer} from './components/index'
import Home from './pages/Home'
import User from './pages/User'
import Signup from './pages/Signup'
import Login from './pages/Login'
import AddTransaction from './pages/AddTransaction'
import FinaceChart from './components/Chart'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/signup",
        element: <Signup/>,
      },
      {
        path: "/user",
        element: <User/>,
      },
      {
        path: "/add-transaction",
        element: <AddTransaction/>,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/chart",
        element: <FinaceChart/>
      },
      {
        path: "/footer",
        element: <Footer/>
      },

    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
