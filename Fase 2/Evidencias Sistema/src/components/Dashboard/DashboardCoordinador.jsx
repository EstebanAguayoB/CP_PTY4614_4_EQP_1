import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, FileText, Eye } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from 'react-router-dom'


export default function DashboardCoordinador() {
  const [activeTab, setActiveTab] = useState("talleres")

  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
      else navigate('/')
    }
    getUser()
  }, [navigate])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }
  
  const talleres = [
    {
      id: 1,
      nombre: "Robótica",
      descripcion: "Taller de robótica para todas las edades",
      profesor: "Juan Pérez",
      alumnos: 32,
      niveles: ["Básico", "Intermedio", "Avanzado"],
      estado: "activo",
    },
    {
      id: 2,
      nombre: "Deportes",
      descripcion: "Actividades deportivas variadas",
      profesor: "Carlos Martínez",
      alumnos: 45,
      niveles: ["Básico", "Avanzado"],
      estado: "activo",
    },
    {
      id: 3,
      nombre: "Música",
      descripcion: "Taller de instrumentos musicales y teoría musical",
      profesor: "María González",
      alumnos: 28,
      niveles: ["Todos los niveles"],
      estado: "activo",
    },
    {
      id: 4,
      nombre: "Fotografía",
      descripcion: "Aprende los fundamentos de la fotografía",
      profesor: "Luis Sánchez",
      alumnos: 15,
      niveles: ["Intermedio", "Avanzado"],
      estado: "activo",
    },
    {
      id: 5,
      nombre: "Pintura",
      descripcion: "Técnicas de pintura y expresión artística",
      profesor: "Ana Rodríguez",
      alumnos: 24,
      niveles: ["Básico"],
      estado: "activo",
    },
    {
      id: 6,
      nombre: "Teatro",
      descripcion: "Expresión corporal y actuación",
      profesor: "Elena Torres",
      alumnos: 22,
      niveles: ["Básico", "Intermedio"],
      estado: "activo",
    },
  ]

  const profesores = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@institucion.edu",
      taller: "Robótica",
      especialidad: "Robótica",
      talleres: 1,
      alumnos: 32,
      estado: "activo",
    },
    {
      id: 2,
      nombre: "Carlos Martínez",
      email: "carlos.martinez@institucion.edu",
      taller: "Educación Física",
      especialidad: "Deportes",
      talleres: 1,
      alumnos: 45,
      estado: "activo",
    },
    {
      id: 3,
      nombre: "Ana Rodríguez",
      email: "ana.rodriguez@institucion.edu",
      taller: "Música",
      especialidad: "Música",
      talleres: 1,
      alumnos: 28,
      estado: "activo",
    },
    {
      id: 4,
      nombre: "Luis Sánchez",
      email: "luis.sanchez@institucion.edu",
      taller: "Teatro",
      especialidad: "Arte",
      talleres: 1,
      alumnos: 15,
      estado: "activo",
    },
    {
      id: 5,
      nombre: "María González",
      email: "maria.gonzalez@institucion.edu",
      taller: "Fotografía",
      especialidad: "Arte",
      talleres: 1,
      alumnos: 24,
      estado: "activo",
    },
    {
      id: 6,
      nombre: "Elena Torres",
      email: "elena.torres@institucion.edu",
      taller: "Artes Visuales",
      especialidad: "Arte",
      talleres: 1,
      alumnos: 22,
      estado: "activo",
    },
  ]

  const actividadReciente = [
    {
      id: 1,
      accion: "Taller de Pintura: Nuevo alumno registrado",
      tiempo: "Hace 10 minutos",
      usuario: "Prof. María González",
    },
    {
      id: 2,
      accion: "Taller de Robótica: Evidencia subida",
      tiempo: "Hace 25 minutos",
      usuario: "Prof. Juan Pérez",
    },
    {
      id: 3,
      accion: "Taller de Música: Alumno avanzó a nivel intermedio",
      tiempo: "Hace 1 hora",
      usuario: "Prof. Ana Rodríguez",
    },
    {
      id: 4,
      accion: "Taller de Deportes: Reporte semanal enviado",
      tiempo: "Hace 2 horas",
      usuario: "Prof. Carlos Martínez",
    },
    {
      id: 5,
      accion: "Nuevo taller creado: Fotografía",
      tiempo: "Hace 3 horas",
      usuario: "Coord. Luis Sánchez",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        }}
      ></div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => setActiveTab("talleres")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "talleres" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Talleres
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("profesores")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "profesores" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Profesores
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("actividad")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "actividad" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Actividad Reciente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
       <div >
            {user && <p> {user.email}</p>}
            <button onClick={logout}>cerrar sesion</button>
        </div>           
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Talleres</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-emerald-600">desde el último periodo</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avances de Nivel</p>
                <p className="text-3xl font-bold text-gray-900">245</p>
                <p className="text-sm text-emerald-600">+32 desde el último periodo</p>
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
                <p className="text-sm text-orange-600">desde el último periodo</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profesores Activos</p>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-sm text-emerald-600">desde el último periodo</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "talleres" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Coordinador</h2>
                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
                  Crear Taller
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talleres.map((taller) => (
                  <div key={taller.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{taller.nombre}</h3>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Activo</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{taller.descripcion}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Profesor:</span>
                        <span className="text-gray-900">{taller.profesor}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Alumnos:</span>
                        <span className="text-gray-900">{taller.alumnos}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Niveles:</span>
                        <span className="text-gray-900">{taller.niveles.join(", ")}</span>
                      </div>
                    </div>

                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full flex items-center justify-center">
                      <Eye className="mr-2 w-4 h-4" />
                      Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profesores" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Coordinador</h2>
                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
                  Añadir Profesor
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profesores.map((profesor) => (
                  <div key={profesor.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{profesor.nombre}</h3>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Activo</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900 text-xs">{profesor.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Talleres:</span>
                        <span className="text-gray-900">{profesor.talleres}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Alumnos:</span>
                        <span className="text-gray-900">{profesor.alumnos}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Especialidad:</span>
                        <span className="text-gray-900">{profesor.especialidad}</span>
                      </div>
                    </div>

                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full flex items-center justify-center">
                      <Eye className="mr-2 w-4 h-4" />
                      Ver Perfil
                    </button>
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
              <p className="text-gray-600">Últimas actividades en el sistema</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {actividadReciente.map((actividad) => (
                  <div key={actividad.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{actividad.accion}</p>
                      <p className="text-sm text-gray-500">
                        {actividad.tiempo} por {actividad.usuario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
