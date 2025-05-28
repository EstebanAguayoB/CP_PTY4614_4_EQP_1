import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import CoordinatorDashboardPage from "../pages/CoordinatorDashboard"
import StudentManagementPage from "../pages/StudentManagement"

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<CoordinatorDashboardPage />} />
        <Route path="/dashboard/alumnos" element={<StudentManagementPage />} />
      </Routes>
    </Router>
  )
}