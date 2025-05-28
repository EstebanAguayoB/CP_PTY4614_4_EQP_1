import { useState } from "react"
import { Search, UserPlus, Edit, ToggleRight, ArrowLeft } from "lucide-react"

export default function GestionEstudiante() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const alumnos = [
    {
      id: 1,
      nombre: "Laura Martínez",
      email: "laura.martinez@estudiante.edu",
      taller: "Robótica",
      nivel: "Avanzado",
      progreso: 77,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Carlos Sánchez",
      email: "carlos.sanchez@estudiante.edu",
      taller: "Robótica",
      nivel: "Intermedio",
      progreso: 77,
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Ana García",
      email: "ana.garcia@estudiante.edu",
      taller: "Deporte",
      nivel: "Básico",
      progreso: 77,
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Miguel Torres",
      email: "miguel.torres@estudiante.edu",
      taller: "Pintura",
      nivel: "Intermedio",
      progreso: 77,
      estado: "Activo",
    },
    {
      id: 5,
      nombre: "Sofía Rodríguez",
      email: "sofia.rodriguez@estudiante.edu",
      taller: "Teatro",
      nivel: "Avanzado",
      progreso: 77,
      estado: "Activo",
    },
    {
      id: 6,
      nombre: "Pedro López",
      email: "pedro.lopez@estudiante.edu",
      taller: "Fotografía",
      nivel: "Intermedio",
      progreso: 77,
      estado: "Activo",
    },
  ]

  const filteredAlumnos = alumnos.filter(
    (alumno) =>
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.taller.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob"></div>
          <div className="absolute top-1/2 -right-40 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-5000"></div>

          {/* Patrón de líneas sutiles */}
          <div className="absolute inset-0 bg-grid-pattern opacity-8"></div>

          {/* Elementos geométricos */}
          <div className="absolute top-24 left-24 w-6 h-6 bg-teal-200 rounded-full opacity-25 animate-float"></div>
          <div className="absolute bottom-32 right-24 w-8 h-8 bg-emerald-200 rounded-lg rotate-45 opacity-20 animate-float-delayed"></div>
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-cyan-200 rotate-12 opacity-25 animate-pulse"></div>
        </div>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button onClick={() => setShowAddForm(false)} className="mr-4 p-2 text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Añadir Nuevo Alumno</h2>
            <p className="text-gray-600 mb-8">Completa la información para registrar un nuevo alumno</p>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Correo@institucion.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taller</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Seleccionar taller</option>
                  <option>Robótica</option>
                  <option>Deportes</option>
                  <option>Música</option>
                  <option>Fotografía</option>
                  <option>Pintura</option>
                  <option>Teatro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Seleccionar nivel</option>
                  <option>Básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                >
                  Registrar alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob"></div>
        <div className="absolute top-1/2 -right-40 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-5000"></div>

        {/* Patrón de líneas sutiles */}
        <div className="absolute inset-0 bg-grid-pattern opacity-8"></div>

        {/* Elementos geométricos */}
        <div className="absolute top-24 left-24 w-6 h-6 bg-teal-200 rounded-full opacity-25 animate-float"></div>
        <div className="absolute bottom-32 right-24 w-8 h-8 bg-emerald-200 rounded-lg rotate-45 opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-cyan-200 rotate-12 opacity-25 animate-pulse"></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Alumnos</h2>
                <p className="text-gray-600">Gestiona los alumnos inscritos en los talleres</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Añadir Alumno</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar alumnos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlumnos.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{alumno.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{alumno.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alumno.taller}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {alumno.nivel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${alumno.progreso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{alumno.progreso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                        {alumno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-emerald-600 hover:text-emerald-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <ToggleRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(25px, -40px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 25px) scale(0.95);
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
            transform: translateY(-12px) rotate(6deg);
          }
        }
        
        .animate-blob {
          animation: blob 9s infinite;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 7s ease-in-out infinite;
          animation-delay: 3.5s;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>
    </div>
  )
}
