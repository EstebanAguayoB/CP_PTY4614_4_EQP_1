import { useState, useEffect } from "react"
import { Users, Plus, Search, Edit, Trash2, Menu, X, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function AlumnosContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTaller, setSelectedTaller] = useState("")
  const [editingAlumno, setEditingAlumno] = useState(null)
  const [deletingAlumno, setDeletingAlumno] = useState(null)
  const navigate = useNavigate()

  // Datos simulados de base de datos
  const participacionesDisponibles = [
    { id: "P001", descripcion: "Participación Robótica 2025-1" },
    { id: "P002", descripcion: "Participación Programación 2025-1" },
    { id: "P003", descripcion: "Participación Diseño 3D 2025-1" },
    { id: "P004", descripcion: "Participación Robótica 2025-2" },
    { id: "P005", descripcion: "Participación Programación 2025-2" },
  ]

  const estudiantesDisponibles = [
    { rut: "12.345.678-9", nombre: "Laura Martínez Silva" },
    { rut: "98.765.432-1", nombre: "Carlos Sánchez López" },
    { rut: "11.222.333-4", nombre: "Ana García Rodríguez" },
    { rut: "55.666.777-8", nombre: "Miguel Torres Fernández" },
    { rut: "33.444.555-6", nombre: "Sofía Rodríguez Morales" },
    { rut: "77.888.999-0", nombre: "Diego Flores Castillo" },
    { rut: "22.333.444-5", nombre: "Isabella Moreno Vega" },
    { rut: "66.777.888-9", nombre: "Sebastián Vega Herrera" },
  ]

  const talleresDisponibles = [
    { id: 1, nombre: "Robótica", codigo: "ROB-001" },
    { id: 2, nombre: "Programación", codigo: "PROG-001" },
    { id: 3, nombre: "Diseño 3D", codigo: "DIS3D-001" },
    { id: 4, nombre: "Electrónica", codigo: "ELEC-001" },
    { id: 5, nombre: "Inteligencia Artificial", codigo: "IA-001" },
  ]

  // Estados para el formulario
  const [formData, setFormData] = useState({
    idParticipacion: "",
    rutEstudiante: "",
    idTaller: "",
    nivelActual: "",
    estado: "",
    fechaInscripcion: "",
  })

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
    { id: 1, nombre: "Robótica" },
    { id: 2, nombre: "Programación" },
    { id: 3, nombre: "Diseño 3D" },
  ]

  // Datos de alumnos
  const [alumnos, setAlumnos] = useState([
    {
      id: 1,
      idParticipacion: "P001",
      idEstudiante: "12.345.678-9",
      nombre: "Laura Martínez",
      emailApoderado: "laura.martinez@apoderado.edu",
      idTallerImpartido: 1,
      tallerNombre: "Robótica",
      nivelActual: "Avanzado",
      estado: "EN PROGRESO",
      fechaInscripcion: "2025-04-20",
      progreso: 77,
    },
    {
      id: 2,
      idParticipacion: "P002",
      idEstudiante: "98.765.432-1",
      nombre: "Carlos Sánchez",
      emailApoderado: "carlos.sanchez@apoderado.edu",
      idTallerImpartido: 1,
      tallerNombre: "Robótica",
      nivelActual: "Intermedio",
      estado: "EN PROGRESO",
      fechaInscripcion: "2025-04-19",
      progreso: 77,
    },
    {
      id: 3,
      idParticipacion: "P003",
      idEstudiante: "11.222.333-4",
      nombre: "Ana García",
      emailApoderado: "ana.garcia@apoderado.edu",
      idTallerImpartido: 1,
      tallerNombre: "Robótica",
      nivelActual: "Básico",
      estado: "INSCRITO",
      fechaInscripcion: "2025-04-18",
      progreso: 77,
    },
    {
      id: 4,
      idParticipacion: "P004",
      idEstudiante: "55.666.777-8",
      nombre: "Miguel Torres",
      emailApoderado: "miguel.torres@apoderado.edu",
      idTallerImpartido: 2,
      tallerNombre: "Programación",
      nivelActual: "Intermedio",
      estado: "EN PROGRESO",
      fechaInscripcion: "2025-04-17",
      progreso: 77,
    },
    {
      id: 5,
      idParticipacion: "P005",
      idEstudiante: "33.444.555-6",
      nombre: "Sofía Rodríguez",
      emailApoderado: "sofia.rodriguez@apoderado.edu",
      idTallerImpartido: 3,
      tallerNombre: "Diseño 3D",
      nivelActual: "Avanzado",
      estado: "FINALIZADO",
      fechaInscripcion: "2025-04-16",
      progreso: 100,
    },
  ])

  const openAddModal = () => {
    setShowAddModal(true)
    setFormData({
      idParticipacion: "",
      rutEstudiante: "",
      idTaller: "",
      nivelActual: "",
      estado: "",
      fechaInscripcion: "",
    })
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setFormData({
      idParticipacion: "",
      rutEstudiante: "",
      idTaller: "",
      nivelActual: "",
      estado: "",
      fechaInscripcion: "",
    })
  }

  const openEditModal = (alumno) => {
    setEditingAlumno(alumno)
    setFormData({
      idParticipacion: alumno.idParticipacion,
      rutEstudiante: alumno.idEstudiante,
      idTaller: alumno.idTallerImpartido.toString(),
      nivelActual: alumno.nivelActual,
      estado: alumno.estado,
      fechaInscripcion: alumno.fechaInscripcion,
    })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingAlumno(null)
    setFormData({
      idParticipacion: "",
      rutEstudiante: "",
      idTaller: "",
      nivelActual: "",
      estado: "",
      fechaInscripcion: "",
    })
  }

  const openDeleteModal = (alumno) => {
    setDeletingAlumno(alumno)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingAlumno(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar campos requeridos
    if (
      !formData.idParticipacion ||
      !formData.rutEstudiante ||
      !formData.idTaller ||
      !formData.nivelActual ||
      !formData.estado ||
      !formData.fechaInscripcion
    ) {
      alert("Por favor, complete todos los campos")
      return
    }

    // Encontrar datos relacionados
    const estudiante = estudiantesDisponibles.find((e) => e.rut === formData.rutEstudiante)
    const taller = talleresDisponibles.find((t) => t.id === Number.parseInt(formData.idTaller))

    if (editingAlumno) {
      // Editar alumno existente
      const alumnosActualizados = alumnos.map((alumno) =>
        alumno.id === editingAlumno.id
          ? {
              ...alumno,
              idParticipacion: formData.idParticipacion,
              idEstudiante: formData.rutEstudiante,
              nombre: estudiante?.nombre || alumno.nombre,
              idTallerImpartido: Number.parseInt(formData.idTaller),
              tallerNombre: taller?.nombre || "",
              nivelActual: formData.nivelActual,
              estado: formData.estado,
              fechaInscripcion: formData.fechaInscripcion,
            }
          : alumno,
      )
      setAlumnos(alumnosActualizados)
      closeEditModal()
      alert("Alumno actualizado exitosamente")
    } else {
      // Crear nuevo alumno
      const nuevoAlumno = {
        id: alumnos.length + 1,
        idParticipacion: formData.idParticipacion,
        idEstudiante: formData.rutEstudiante,
        nombre: estudiante?.nombre || "",
        emailApoderado: `${estudiante?.nombre.toLowerCase().replace(/\s+/g, ".")}@apoderado.edu`,
        idTallerImpartido: Number.parseInt(formData.idTaller),
        tallerNombre: taller?.nombre || "",
        nivelActual: formData.nivelActual,
        estado: formData.estado,
        fechaInscripcion: formData.fechaInscripcion,
        progreso: 0,
      }

      setAlumnos([...alumnos, nuevoAlumno])
      closeAddModal()
      alert("Alumno registrado exitosamente")
    }
  }

  const handleDelete = () => {
    if (deletingAlumno) {
      const alumnosActualizados = alumnos.filter((alumno) => alumno.id !== deletingAlumno.id)
      setAlumnos(alumnosActualizados)
      closeDeleteModal()
      alert("Alumno eliminado exitosamente")
    }
  }

  // Filtrar alumnos
  const alumnosFiltrados = alumnos.filter((alumno) => {
    const matchesSearch =
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.emailApoderado.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTaller = selectedTaller === "" || alumno.idTallerImpartido === Number.parseInt(selectedTaller)
    return matchesSearch && matchesTaller
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "INSCRITO":
        return "bg-blue-100 text-blue-800"
      case "EN PROGRESO":
        return "bg-green-100 text-green-800"
      case "FINALIZADO":
        return "bg-gray-100 text-gray-800"
      case "RETIRADO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case "Básico":
        return "bg-blue-100 text-blue-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CL")
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
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Alumnos</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Espacio para otros elementos del header si se necesitan en el futuro */}
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

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Controles superiores */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar alumnos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                  />
                </div>

                {/* Filtro por taller */}
                <select
                  value={selectedTaller}
                  onChange={(e) => setSelectedTaller(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Todos los talleres</option>
                  {misTalleres.map((taller) => (
                    <option key={taller.id} value={taller.id}>
                      {taller.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={openAddModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Alumno
              </button>
            </div>

            {/* Tabla de alumnos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Gestiona los alumnos de tus talleres</h2>
                <p className="text-gray-600">Total de alumnos: {alumnosFiltrados.length}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Participación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Estudiante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Apoderado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Inscripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progreso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alumnosFiltrados.map((alumno) => (
                      <tr key={alumno.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alumno.idParticipacion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.idEstudiante}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.emailApoderado}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.tallerNombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelColor(alumno.nivelActual)}`}
                          >
                            {alumno.nivelActual}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(alumno.estado)}`}
                          >
                            {alumno.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(alumno.fechaInscripcion)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${alumno.progreso}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{alumno.progreso}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(alumno)}
                              className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"
                              title="Editar alumno"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(alumno)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Eliminar alumno"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </main>
      </div>

      {/* Modal para añadir/editar alumno */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAlumno ? "Editar Alumno" : "Añadir Nuevo Alumno"}
              </h2>
              <button
                onClick={editingAlumno ? closeEditModal : closeAddModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="idParticipacion" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Participación *
                  </label>
                  <select
                    id="idParticipacion"
                    name="idParticipacion"
                    value={formData.idParticipacion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Seleccionar participación</option>
                    {participacionesDisponibles.map((participacion) => (
                      <option key={participacion.id} value={participacion.id}>
                        {participacion.id} - {participacion.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rutEstudiante" className="block text-sm font-medium text-gray-700 mb-2">
                    RUT Estudiante *
                  </label>
                  <select
                    id="rutEstudiante"
                    name="rutEstudiante"
                    value={formData.rutEstudiante}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Seleccionar estudiante</option>
                    {estudiantesDisponibles.map((estudiante) => (
                      <option key={estudiante.rut} value={estudiante.rut}>
                        {estudiante.rut} - {estudiante.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="idTaller" className="block text-sm font-medium text-gray-700 mb-2">
                    Taller *
                  </label>
                  <select
                    id="idTaller"
                    name="idTaller"
                    value={formData.idTaller}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Seleccionar taller</option>
                    {talleresDisponibles.map((taller) => (
                      <option key={taller.id} value={taller.id}>
                        {taller.codigo} - {taller.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="nivelActual" className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel Actual *
                  </label>
                  <select
                    id="nivelActual"
                    name="nivelActual"
                    value={formData.nivelActual}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Seleccionar nivel</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="INSCRITO">INSCRITO</option>
                    <option value="EN PROGRESO">EN PROGRESO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                    <option value="RETIRADO">RETIRADO</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fechaInscripcion" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inscripción *
                  </label>
                  <input
                    type="date"
                    id="fechaInscripcion"
                    name="fechaInscripcion"
                    value={formData.fechaInscripcion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={editingAlumno ? closeEditModal : closeAddModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingAlumno ? "Actualizar Alumno" : "Registrar Alumno"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && deletingAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar al alumno{" "}
                <span className="font-semibold text-gray-900">{deletingAlumno.nombre}</span>?
              </p>
              <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
