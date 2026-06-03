import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/room/:roomCode' element={<Room />}/>
      </Routes>
    </div>
  )
}

export default App