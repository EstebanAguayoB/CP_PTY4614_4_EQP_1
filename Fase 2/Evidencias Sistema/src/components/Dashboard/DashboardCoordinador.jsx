import { useState } from "react"
import { BookOpen, Users, TrendingUp, FileText, Eye } from "lucide-react"

export default function DashboardCoordinador() {
  const [activeTab, setActiveTab] = useState("talleres")

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-1/3 -left-60 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-4000"></div>

        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>

        {/* Formas geométricas sutiles */}
        <div className="absolute top-32 right-32 w-8 h-8 bg-emerald-200 rounded-lg rotate-45 opacity-20 animate-float"></div>
        <div className="absolute bottom-40 left-32 w-6 h-6 bg-teal-200 rounded-full opacity-25 animate-float-delayed"></div>
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-cyan-200 rotate-12 opacity-20 animate-pulse"></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("talleres")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "talleres" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Talleres
              </button>
              <button
                onClick={() => setActiveTab("profesores")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "profesores" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profesores
              </button>
              <button
                onClick={() => setActiveTab("actividad")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "actividad" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Actividad Reciente
              </button>
            </nav>
          </div>
        </div>
      </header>

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Coordinador</h2>
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300">
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

                    <button className="w-full bg-white border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profesores" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Coordinador</h2>
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300">
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

                    <button className="w-full bg-white border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Ver Perfil</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "actividad" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(8deg);
          }
        }
        
        .animate-blob {
          animation: blob 8s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
        }
        
        .bg-dot-pattern {
          background-image: radial-gradient(circle, rgba(16, 185, 129, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  )
}