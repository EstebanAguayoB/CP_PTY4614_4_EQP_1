import { useState, useEffect } from "react"
import { BookOpen, Users, Upload, Menu, FileText, X, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function MisTalleresContent() {
  const [activeTab, setActiveTab] = useState("activos")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showEvidenciaModal, setShowEvidenciaModal] = useState(false)
  const [showReporteModal, setShowReporteModal] = useState(false)
  const [showAlumnosModal, setShowAlumnosModal] = useState(false)
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [evidenciaText, setEvidenciaText] = useState("")
  const [reporteGenerado, setReporteGenerado] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
      else navigate("/")
    }
    getUser()
  }, [navigate])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const misTalleres = [
    {
      id: 1,
      nombre: "Robótica",
      descripcion: "Taller de robótica para todas las edades",
      niveles: ["Básico", "Intermedio", "Avanzado"],
      totalAlumnos: 32,
      evidenciasPendientes: 8,
      estado: "Activo",
      distribucionNiveles: {
        basico: 15,
        intermedio: 10,
        avanzado: 7,
      },
      progreso: 75,
      proximasActividades: [
        {
          nombre: "Competencia interna",
          fecha: "30/04/2025",
        },
        {
          nombre: "Evaluación de nivel",
          fecha: "15/05/2025",
        },
      ],
      alumnos: [
        { id: 1, nombre: "Laura Martínez", nivel: "Avanzado", progreso: 77, email: "laura.martinez@apoderado.ed" },
        { id: 2, nombre: "Carlos Sánchez", nivel: "Intermedio", progreso: 77, email: "carlos.sanchez@apoderado.edu" },
        { id: 3, nombre: "Ana García", nivel: "Básico", progreso: 77, email: "ana.garcia@apoderado.edu" },
        { id: 4, nombre: "Miguel Torres", nivel: "Intermedio", progreso: 77, email: "miguel.torres@apoderado.ed" },
        { id: 5, nombre: "Sofía Rodríguez", nivel: "Avanzado", progreso: 77, email: "sofia.rodriguez@apoderado.edu" },
      ],
    },
    {
      id: 2,
      nombre: "Programación",
      descripcion: "Taller de programación básica y avanzada",
      niveles: ["Básico", "Intermedio"],
      totalAlumnos: 28,
      evidenciasPendientes: 5,
      estado: "Activo",
      distribucionNiveles: {
        basico: 18,
        intermedio: 10,
        avanzado: 0,
      },
      progreso: 60,
      proximasActividades: [
        {
          nombre: "Hackathon escolar",
          fecha: "10/05/2025",
        },
      ],
      alumnos: [
        { id: 6, nombre: "Pedro López", nivel: "Intermedio", progreso: 77, email: "pedro.lopez@apoderado.edu" },
        { id: 7, nombre: "María Fernández", nivel: "Básico", progreso: 65, email: "maria.fernandez@apoderado.edu" },
        { id: 8, nombre: "Diego Ramírez", nivel: "Básico", progreso: 70, email: "diego.ramirez@apoderado.edu" },
        { id: 9, nombre: "Isabella Moreno", nivel: "Intermedio", progreso: 82, email: "isabella.moreno@apoderado.edu" },
        { id: 10, nombre: "Sebastián Vega", nivel: "Básico", progreso: 68, email: "sebastian.vega@apoderado.edu" },
      ],
    },
    {
      id: 3,
      nombre: "Diseño 3D",
      descripcion: "Taller de modelado y diseño en 3D",
      niveles: ["Intermedio", "Avanzado"],
      totalAlumnos: 15,
      evidenciasPendientes: 3,
      estado: "Inactivo",
      distribucionNiveles: {
        basico: 0,
        intermedio: 8,
        avanzado: 7,
      },
      progreso: 45,
      proximasActividades: [],
      alumnos: [
        { id: 11, nombre: "Javier Morales", nivel: "Intermedio", progreso: 45, email: "javier.morales@apoderado.edu" },
        {
          id: 12,
          nombre: "Valentina Castro",
          nivel: "Avanzado",
          progreso: 50,
          email: "valentina.castro@apoderado.edu",
        },
        { id: 13, nombre: "Andrés Silva", nivel: "Intermedio", progreso: 42, email: "andres.silva@apoderado.edu" },
        { id: 14, nombre: "Camila Herrera", nivel: "Avanzado", progreso: 55, email: "camila.herrera@apoderado.edu" },
        { id: 15, nombre: "Nicolás Peña", nivel: "Intermedio", progreso: 38, email: "nicolas.pena@apoderado.edu" },
      ],
    },
  ]

  const openAlumnosModal = (taller) => {
    setSelectedTaller(taller)
    setShowAlumnosModal(true)
  }

  const closeAlumnosModal = () => {
    setShowAlumnosModal(false)
    setSelectedTaller(null)
  }

  const openEvidenciaModal = (taller) => {
    setSelectedTaller(taller)
    setShowEvidenciaModal(true)
  }

  const closeEvidenciaModal = () => {
    setShowEvidenciaModal(false)
    setSelectedTaller(null)
    setSelectedAlumno(null)
    setEvidenciaText("")
  }

  const openReporteModal = (taller) => {
    setSelectedTaller(taller)
    setShowReporteModal(true)
    setReporteGenerado(false)
  }

  const closeReporteModal = () => {
    setShowReporteModal(false)
    setSelectedTaller(null)
    setReporteGenerado(false)
  }

  const handleSubmitEvidencia = () => {
    // Aquí iría la lógica para guardar la evidencia en la base de datos
    console.log("Evidencia guardada para:", selectedAlumno, "del taller:", selectedTaller.nombre)
    console.log("Texto de evidencia:", evidenciaText)

    // Simulamos éxito
    alert(`Evidencia guardada con éxito para ${selectedAlumno.nombre}`)
    closeEvidenciaModal()
  }

  const handleGenerarReporte = () => {
    // Aquí iría la lógica para generar el reporte
    console.log("Generando reporte para el taller:", selectedTaller.nombre)

    // Simulamos que el reporte se ha generado después de 1 segundo
    setTimeout(() => {
      setReporteGenerado(true)
    }, 1000)
  }

  const handleDescargarReporte = () => {
    // Aquí iría la lógica para descargar el reporte
    console.log("Descargando reporte para el taller:", selectedTaller.nombre)
    alert(`Reporte de ${selectedTaller.nombre} descargado con éxito`)
    closeReporteModal()
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
      {/* Sidebar */}
      <DashboardProfeSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Profesor" />

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Botón de menú móvil */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Talleres</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user && user.email.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* User info bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {user && user.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Usuario</p>
                {user && <p className="text-sm text-gray-600">{user.email}</p>}
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("activos")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "activos"
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Activos ({misTalleres.filter((taller) => taller.estado === "Activo").length})
                  </button>
                  <button
                    onClick={() => setActiveTab("inactivos")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "inactivos"
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Inactivos ({misTalleres.filter((taller) => taller.estado === "Inactivo").length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenido basado en la pestaña activa */}
            {activeTab === "activos" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {misTalleres
                  .filter((taller) => taller.estado === "Activo")
                  .map((taller) => (
                    <div key={taller.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <h2 className="text-xl font-semibold text-gray-900">{taller.nombre}</h2>
                        <p className="text-gray-600">{taller.descripcion}</p>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Información General */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Niveles:</span>
                                <div className="flex flex-wrap gap-1">
                                  {taller.niveles.map((nivel) => (
                                    <span
                                      key={nivel}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      {nivel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Alumnos:</span>
                                <span className="text-gray-900 font-medium">{taller.totalAlumnos}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Evidencias Pendientes:</span>
                                <span className="text-orange-600 font-medium">{taller.evidenciasPendientes}</span>
                              </div>
                            </div>
                          </div>

                          {/* Progreso */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso</h3>
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${taller.progreso}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 ml-2">{taller.progreso}%</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => openAlumnosModal(taller)}
                                className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Alumnos
                              </button>
                              <button
                                onClick={() => openEvidenciaModal(taller)}
                                className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                <Upload className="w-4 h-4 mr-1" />
                                Evidencias
                              </button>
                              <button
                                onClick={() => openReporteModal(taller)}
                                className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Reporte
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === "inactivos" && (
              <>
                {misTalleres.filter((taller) => taller.estado === "Inactivo").length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {misTalleres
                      .filter((taller) => taller.estado === "Inactivo")
                      .map((taller) => (
                        <div key={taller.id} className="bg-white rounded-xl shadow-md overflow-hidden opacity-75">
                          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-xl font-semibold text-gray-900">{taller.nombre}</h2>
                                <p className="text-gray-600">{taller.descripcion}</p>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactivo</span>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Alumnos:</span>
                                    <span className="text-gray-900 font-medium">{taller.totalAlumnos}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Último Progreso:</span>
                                    <span className="text-gray-600">{taller.progreso}%</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                  Reactivar Taller
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes talleres inactivos</h3>
                      <p className="text-gray-500 max-w-md">
                        Actualmente no tienes ningún taller en estado inactivo. Todos tus talleres están en
                        funcionamiento.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal para ver alumnos */}
      {showAlumnosModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Alumnos - {selectedTaller.nombre}</h2>
              <button onClick={closeAlumnosModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <p className="text-gray-600">
                  Total de alumnos: <span className="font-medium text-gray-900">{selectedTaller.alumnos.length}</span>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Apoderado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progreso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTaller.alumnos.map((alumno) => (
                      <tr key={alumno.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">{alumno.nombre.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{alumno.nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{alumno.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              alumno.nivel === "Avanzado"
                                ? "bg-green-100 text-green-800"
                                : alumno.nivel === "Intermedio"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alumno.nivel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${alumno.progreso}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{alumno.progreso}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para subir evidencias - SIN FONDO OSCURO */}
      {showEvidenciaModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Subir Evidencia - {selectedTaller.nombre}</h2>
              <button onClick={closeEvidenciaModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="alumno" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Alumno
                </label>
                <select
                  id="alumno"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={selectedAlumno ? selectedAlumno.id : ""}
                  onChange={(e) => {
                    const alumnoId = Number.parseInt(e.target.value)
                    const alumno = selectedTaller.alumnos.find((a) => a.id === alumnoId)
                    setSelectedAlumno(alumno)
                  }}
                >
                  <option value="">Seleccione un alumno</option>
                  {selectedTaller.alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre} - {alumno.nivel}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAlumno && (
                <>
                  <div className="mb-6">
                    <label htmlFor="evidencia" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción de la Evidencia
                    </label>
                    <textarea
                      id="evidencia"
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Describa los avances y logros del alumno..."
                      value={evidenciaText}
                      onChange={(e) => setEvidenciaText(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 mb-2">
                      Adjuntar Archivo (opcional)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="archivo"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Haga clic para cargar</span> o arrastre y suelte
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (MAX. 10MB)</p>
                        </div>
                        <input id="archivo" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeEvidenciaModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmitEvidencia}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                      disabled={!evidenciaText.trim()}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Guardar Evidencia
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para generar reporte - SIN FONDO OSCURO */}
      {showReporteModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Generar Reporte - {selectedTaller.nombre}</h2>
              <button onClick={closeReporteModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {!reporteGenerado ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Opciones del Reporte</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="completo"
                          name="tipo-reporte"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          defaultChecked
                        />
                        <label htmlFor="completo" className="ml-3 block text-sm font-medium text-gray-700">
                          Reporte completo del taller
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="alumnos"
                          name="tipo-reporte"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="alumnos" className="ml-3 block text-sm font-medium text-gray-700">
                          Solo alumnos y progreso
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="evidencias"
                          name="tipo-reporte"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="evidencias" className="ml-3 block text-sm font-medium text-gray-700">
                          Solo evidencias recientes
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Formato</h3>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="pdf"
                          name="formato"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          defaultChecked
                        />
                        <label htmlFor="pdf" className="ml-2 block text-sm font-medium text-gray-700">
                          PDF
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="excel"
                          name="formato"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="excel" className="ml-2 block text-sm font-medium text-gray-700">
                          Excel
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeReporteModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGenerarReporte}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generar Reporte
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¡Reporte generado con éxito!</h3>
                  <p className="text-gray-600 mb-6">
                    El reporte para el taller {selectedTaller.nombre} ha sido generado correctamente.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={closeReporteModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={handleDescargarReporte}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Descargar Reporte
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}






