import { useState } from "react"
import { Search, UserPlus, Edit, ToggleRight, ArrowLeft, BookOpen } from "lucide-react"

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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "url(/bg-decorative.svg) repeat",
            opacity: 0.1,
            zIndex: -1,
          }}
        />
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <button onClick={() => setShowAddForm(false)} className="mr-4 p-2 text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

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
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "url(/bg-decorative.svg) repeat",
          opacity: 0.1,
          zIndex: -1,
        }}
      />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Alumnos</h2>
                <p className="text-gray-600">Gestiona los alumnos inscritos en los talleres</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <UserPlus className="w-5 h-5 mr-2 -ml-1" />
                Añadir Alumno
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
    </div>
  )
}
