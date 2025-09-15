import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import Home from '../components/Home'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
          <Home/>
          </ProtectedRoute>}/>
        <Route path="/register" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
