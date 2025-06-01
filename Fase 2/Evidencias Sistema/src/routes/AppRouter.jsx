import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import CoordinatorDashboardPage from "../pages/CoordinatorDashboard"
import StudentManagementPage from "../pages/StudentManagement"
import { TalleresManagement } from '../pages/TalleresManagement'
import ProtectedRoute from "../components/protected_route"

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <CoordinatorDashboardPage /></ProtectedRoute>}/>
        <Route path="/dashboard/alumnos" element={<ProtectedRoute> <StudentManagementPage /> </ProtectedRoute> } />
        <Route path="/dashboard/talleres" element={<ProtectedRoute><TalleresManagement /></ProtectedRoute>} />
      </Routes>
    </Router>
  )

}
