import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, FileText, Eye, Menu, X, Award } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function DashboardProfesor() {
  const [activeTab, setActiveTab] = useState("miTaller")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [selectedTaller, setSelectedTaller] = useState(null)
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

  // Datos de los talleres del profesor
  const misTalleres = [
    {
      id: 1,
      nombre: "Robótica",
      descripcion: "Taller de robótica para todas las edades",
      niveles: ["Básico", "Intermedio", "Avanzado"],
      totalAlumnos: 32,
      estado: "Activo",
      distribucionNiveles: {
        basico: 15,
        intermedio: 10,
        avanzado: 7,
      },
      progreso: 75,
      fechaInicio: "15/03/2025",
      duracion: "6 meses",
      horarios: ["Lunes 14:00-16:00", "Miércoles 14:00-16:00", "Viernes 14:00-16:00"],
      objetivos: [
        "Introducir conceptos básicos de robótica",
        "Desarrollar habilidades de programación",
        "Fomentar el trabajo en equipo",
        "Preparar para competencias regionales",
      ],
      recursos: ["Kit Arduino", "Sensores", "Motores", "Computadores"],
      evaluaciones: [
        { nombre: "Proyecto Robot Seguidor", fecha: "15/04/2025", estado: "Completada" },
        { nombre: "Evaluación Teórica", fecha: "30/04/2025", estado: "Pendiente" },
        { nombre: "Proyecto Final", fecha: "15/05/2025", estado: "Pendiente" },
      ],
    },
    {
      id: 2,
      nombre: "Programación",
      descripcion: "Taller de programación básica y avanzada",
      niveles: ["Básico", "Intermedio"],
      totalAlumnos: 28,
      estado: "Activo",
      distribucionNiveles: {
        basico: 18,
        intermedio: 10,
        avanzado: 0,
      },
      progreso: 60,
      fechaInicio: "01/04/2025",
      duracion: "4 meses",
      horarios: ["Martes 15:00-17:00", "Jueves 15:00-17:00"],
      objetivos: [
        "Aprender fundamentos de programación",
        "Dominar Python básico",
        "Crear proyectos web simples",
        "Desarrollar pensamiento lógico",
      ],
      recursos: ["Computadores", "Software de desarrollo", "Plataforma online"],
      evaluaciones: [
        { nombre: "Quiz Python Básico", fecha: "20/04/2025", estado: "Completada" },
        { nombre: "Proyecto Web", fecha: "05/05/2025", estado: "En progreso" },
        { nombre: "Examen Final", fecha: "25/05/2025", estado: "Pendiente" },
      ],
    },
    {
      id: 3,
      nombre: "Diseño 3D",
      descripcion: "Taller de modelado y diseño en 3D",
      niveles: ["Intermedio", "Avanzado"],
      totalAlumnos: 15,
      estado: "Activo",
      distribucionNiveles: {
        basico: 0,
        intermedio: 8,
        avanzado: 7,
      },
      progreso: 45,
      fechaInicio: "10/03/2025",
      duracion: "5 meses",
      horarios: ["Lunes 16:00-18:00", "Viernes 16:00-18:00"],
      objetivos: [
        "Dominar software de modelado 3D",
        "Crear prototipos digitales",
        "Preparar archivos para impresión 3D",
        "Desarrollar proyectos creativos",
      ],
      recursos: ["Software 3D", "Impresora 3D", "Computadores especializados"],
      evaluaciones: [
        { nombre: "Modelo Básico", fecha: "25/03/2025", estado: "Completada" },
        { nombre: "Proyecto Intermedio", fecha: "15/04/2025", estado: "Completada" },
        { nombre: "Proyecto Final", fecha: "20/05/2025", estado: "Pendiente" },
      ],
    },
  ]

  const totalAlumnos = misTalleres.reduce((sum, taller) => sum + taller.totalAlumnos, 0)
  const talleresActivos = misTalleres.filter((taller) => taller.estado === "Activo").length
  const progresoPromedio = Math.round(
    misTalleres.reduce((sum, taller) => sum + taller.progreso, 0) / misTalleres.length,
  )

  const alumnosDestacados = [
    {
      id: 1,
      nombre: "Laura Martínez",
      taller: "Robótica",
      nivel: "Avanzado",
      progreso: 95,
    },
    {
      id: 2,
      nombre: "Carlos Sánchez",
      taller: "Programación",
      nivel: "Intermedio",
      progreso: 88,
    },
    {
      id: 3,
      nombre: "Ana García",
      taller: "Diseño 3D",
      nivel: "Avanzado",
      progreso: 92,
    },
  ]

  const actividadReciente = [
    {
      id: 1,
      accion: "Evidencia subida: Proyecto de robot seguidor de línea",
      tiempo: "Hace 2 horas",
      usuario: "Tú",
      taller: "Robótica",
    },
    {
      id: 2,
      accion: "Laura Martínez avanzó a nivel Avanzado",
      tiempo: "Hace 1 día",
      usuario: "Sistema",
      taller: "Robótica",
    },
    {
      id: 3,
      accion: "Nuevo alumno registrado: Diego Flores",
      tiempo: "Hace 2 días",
      usuario: "Coordinador",
      taller: "Programación",
    },
    {
      id: 4,
      accion: "Reporte semanal enviado a apoderados",
      tiempo: "Hace 5 días",
      usuario: "Sistema",
      taller: "Todos",
    },
    {
      id: 5,
      accion: "Solicitud de recursos aprobada: Kit de Arduino",
      tiempo: "Hace 1 semana",
      usuario: "Coordinador",
      taller: "Robótica",
    },
  ]

  const openDetallesModal = (taller) => {
    setSelectedTaller(taller)
    setShowDetallesModal(true)
  }

  const closeDetallesModal = () => {
    setShowDetallesModal(false)
    setSelectedTaller(null)
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
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard del Profesor</h1>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mis Talleres</p>
                    <p className="text-3xl font-bold text-gray-900">{talleresActivos}</p>
                    <p className="text-sm text-emerald-600">Talleres activos</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                    <p className="text-3xl font-bold text-gray-900">{progresoPromedio}%</p>
                    <p className="text-sm text-emerald-600">En todos los talleres</p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reportes Pendientes</p>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-orange-600">+2 en la última semana</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
                    <p className="text-3xl font-bold text-gray-900">{totalAlumnos}</p>
                    <p className="text-sm text-emerald-600">En todos los talleres</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navegación de tabs */}
            <div className="mb-8">
              <nav className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <ul className="flex space-x-4">
                  <li>
                    <button
                      onClick={() => setActiveTab("miTaller")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "miTaller"
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Mis Talleres
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("alumnosDestacados")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "alumnosDestacados"
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Alumnos Destacados
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("actividad")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "actividad"
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Actividad Reciente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === "miTaller" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {misTalleres.map((taller) => (
                  <div key={taller.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                      <h2 className="text-xl font-semibold text-gray-900">Taller de {taller.nombre}</h2>
                      <p className="text-gray-600">{taller.descripcion}</p>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Niveles:</span>
                          <div className="flex flex-wrap gap-1">
                            {taller.niveles.map((nivel) => (
                              <span key={nivel} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {nivel}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alumnos:</span>
                          <span className="text-gray-900 font-medium">{taller.totalAlumnos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado:</span>
                          <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                            {taller.estado}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Progreso General</h4>
                        <div className="flex items-center mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${taller.progreso}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">{taller.progreso}%</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => openDetallesModal(taller)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles Completos
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "alumnosDestacados" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Alumnos Destacados</h2>
                      <p className="text-gray-600">Alumnos con mayor progreso en los últimos 30 días</p>
                    </div>
                    <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors">
                      Ver Todos los Alumnos
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumnosDestacados.map((alumno) => (
                      <div key={alumno.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {alumno.nombre.charAt(0)}
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {alumno.nivel}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{alumno.nombre}</h3>
                        <p className="text-sm text-gray-600 mb-2">Taller: {alumno.taller}</p>
                        <p className="text-sm text-gray-600 mb-4">Nivel {alumno.nivel}</p>

                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${alumno.progreso}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">{alumno.progreso}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "actividad" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                  <p className="text-gray-600">Últimas actividades en tus talleres</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {actividadReciente.map((actividad) => (
                      <div key={actividad.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{actividad.accion}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>
                              {actividad.tiempo} por {actividad.usuario}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {actividad.taller}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Detalles Completos */}
      {showDetallesModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Detalles Completos - {selectedTaller.nombre}</h2>
              <button onClick={closeDetallesModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información General */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                    Información General
                  </h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Descripción:</span>
                      <p className="text-gray-900">{selectedTaller.descripcion}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Fecha de Inicio:</span>
                      <p className="text-gray-900">{selectedTaller.fechaInicio}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Duración:</span>
                      <p className="text-gray-900">{selectedTaller.duracion}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total de Alumnos:</span>
                      <p className="text-gray-900 font-semibold">{selectedTaller.totalAlumnos}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Progreso General:</span>
                      <div className="flex items-center mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${selectedTaller.progreso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedTaller.progreso}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Objetivos del Taller */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center mt-6">
                    <Award className="w-5 h-5 mr-2 text-emerald-600" />
                    Objetivos del Taller
                  </h3>
                  <div className="space-y-2 mb-6">
                    {selectedTaller.objetivos.map((objetivo, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{objetivo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribución por Niveles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Niveles</h3>
                  <div className="space-y-3">
                    {selectedTaller.distribucionNiveles.basico > 0 && (
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-gray-900">Básico</span>
                        <span className="text-blue-600 font-bold">
                          {selectedTaller.distribucionNiveles.basico} alumnos
                        </span>
                      </div>
                    )}
                    {selectedTaller.distribucionNiveles.intermedio > 0 && (
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium text-gray-900">Intermedio</span>
                        <span className="text-yellow-600 font-bold">
                          {selectedTaller.distribucionNiveles.intermedio} alumnos
                        </span>
                      </div>
                    )}
                    {selectedTaller.distribucionNiveles.avanzado > 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-900">Avanzado</span>
                        <span className="text-green-600 font-bold">
                          {selectedTaller.distribucionNiveles.avanzado} alumnos
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeDetallesModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
