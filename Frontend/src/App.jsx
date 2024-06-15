import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header} from './components/index'
import {Footer} from "./components/index"

function App() {

  return (
    <main>
      <Header/>
        <Outlet />
        <Footer/>
    </main>
  )
}

export default App
