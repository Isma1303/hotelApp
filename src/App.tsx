import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './auth/pages/Login'
import { PrivateRoute } from './auth/components/PrivateRoute'
import { Dashboard } from './dashbaord/pages/Dashboard'
import { useStore } from './shared/store/store'
import { ReservationCalendar } from './dashbaord/components/reservations/ReservationCalendar'

function App() {
  const { isAuthenticated } = useStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/dashboard/reservas' element={<ReservationCalendar />} />
          <Route path='/dashboard/habitaciones' element={<span> in progress</span>} />
          <Route path='/dashboard/huespedes' element={<span> in progress</span>}/>
          <Route path='/dashboard/finanzas' element={<span> in progress</span>} />
          <Route path='/dashboard/configuracion' element={<span> in progress</span>} />
        </Route>
        
        {/* Ruta 404 - Redirigir a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
