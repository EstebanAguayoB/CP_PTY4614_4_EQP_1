import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import CoordinatorDashboardPage from "../pages/CoordinatorDashboard"
import StudentManagementPage from "../pages/StudentManagement"
import { TalleresManagement } from "../pages/TalleresManagement"
import ProfesoresManagementPage from "../pages/ProfesoresManagement"
import ReportesManagementPage from "../pages/ReportesManagement"
import DashboardProfesorPage from "../pages/DashboardProfesor"
import MisTalleresPage from "../pages/MisTalleres"
import AlumnosProfesorPage from "../pages/AlumnosProfesor"
import EvidenciasProfesorPage from "../pages/EvidenciasProfesor"
import ProtectedRoute from "../components/protected_route"

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas para Coordinador */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["COORDINADOR"]}>
              <CoordinatorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/alumnos"
          element={
            <ProtectedRoute allowedRoles={["COORDINADOR"]}>
              <StudentManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/talleres"
          element={
            <ProtectedRoute allowedRoles={["COORDINADOR"]}>
              <TalleresManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profesores"
          element={
            <ProtectedRoute allowedRoles={["COORDINADOR"]}>
              <ProfesoresManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reportes"
          element={
            <ProtectedRoute allowedRoles={["COORDINADOR"]}>
              <ReportesManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas para Profesor */}
        <Route
          path="/dashboardprofesor"
          element={
            <ProtectedRoute allowedRoles={["PROFESOR"]}>
              <DashboardProfesorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardprofesor/talleres"
          element={
            <ProtectedRoute allowedRoles={["PROFESOR"]}>
              <MisTalleresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardprofesor/alumnos"
          element={
            <ProtectedRoute allowedRoles={["PROFESOR"]}>
              <AlumnosProfesorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardprofesor/evidencias"
          element={
            <ProtectedRoute allowedRoles={["PROFESOR"]}>
              <EvidenciasProfesorPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
