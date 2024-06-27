import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header} from './components/index'
import {Footer} from "./components/index"
import { AuthProvider } from './utils/AuthProvider.jsx';

function App() {

  return (
    <AuthProvider>
    <main>
      <Header/>
        <Outlet />
        <Footer/>
    </main>
    </AuthProvider>
  )
}

export default App
