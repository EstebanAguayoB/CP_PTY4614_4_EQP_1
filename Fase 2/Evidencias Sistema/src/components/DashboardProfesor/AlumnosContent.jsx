"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Search, Edit, Trash2, Menu, X, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function AlumnosContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profesorId, setProfesorId] = useState(null) // Nuevo estado para el ID del profesor
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTaller, setSelectedTaller] = useState("")
  const [editingAlumno, setEditingAlumno] = useState(null)
  const [deletingAlumno, setDeletingAlumno] = useState(null)
  const navigate = useNavigate()

  // Estados para el formulario
  const [formData, setFormData] = useState({
    rutEstudiante: "",
    idTaller: "",
    nivelActual: "",
    estado: "",
    fechaInscripcion: "",
  })

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        // Obtener el ID del profesor desde la tabla Usuario
        const { data: userData, error } = await supabase
          .from("Usuario")
          .select("id_usuario")
          .eq("correo", data.user.email)
          .single()

        if (userData && !error) {
          setProfesorId(userData.id_usuario)
        }
      } else {
        navigate("/")
      }
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

  // Datos de alumnos
  const [alumnos, setAlumnos] = useState([])
  const [misTalleres, setMisTalleres] = useState([])
  const [estudiante, setEstudiante] = useState([])
  const [Nivel, setNivel] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!profesorId) return // No ejecutar si no tenemos el ID del profesor

    const fetchAlumnos = async () => {
      try {
        // Filtrar alumnos solo de los talleres del profesor actual
        const { data, error } = await supabase
          .from("ParticipacionEstudiante")
          .select(`
            *,
            Estudiante(*),
            TallerImpartido!inner(*),
            Nivel(*)
          `)
          .eq("TallerImpartido.profesor_asignado", profesorId)

        if (error) {
          setError(error)
        } else {
          setAlumnos(data)
        }
      } catch (err) {
        setError(err)
      }
    }

    const misTalleres = async () => {
      try {
        // Filtrar talleres solo del profesor actual
        const { data, error } = await supabase.from("TallerImpartido").select(`*`).eq("profesor_asignado", profesorId)

        if (error) {
          setError(error)
        } else {
          setMisTalleres(data)
        }
      } catch (err) {
        setError(err)
      }
    }

    const estudiante = async () => {
      try {
        // 1. Obtener todos los id_estudiante que ya están en ParticipacionEstudiante
        // pero solo de los talleres del profesor actual
        const { data: participaciones, error: errorParticipaciones } = await supabase
          .from("ParticipacionEstudiante")
          .select(`
            id_estudiante,
            TallerImpartido!inner(profesor_asignado)
          `)
          .eq("TallerImpartido.profesor_asignado", profesorId)

        if (errorParticipaciones) {
          setError(errorParticipaciones)
          return
        }

        // Extraer los ids en un array
        const idsRegistrados = participaciones.map((p) => p.id_estudiante)

        // 2. Obtener los estudiantes que NO están en ese array
        const { data, error } = await supabase
          .from("Estudiante")
          .select("*")
          .not("id_estudiante", "in", `(${idsRegistrados.length > 0 ? idsRegistrados.join(",") : "null"})`)

        if (error) {
          setError(error)
        } else {
          setEstudiante(data)
        }
      } catch (err) {
        setError(err)
      }
    }

    const Nivel = async () => {
      try {
        // Filtrar niveles solo de los talleres del profesor actual
        const { data, error } = await supabase
          .from("Nivel")
          .select(`
            *,
            TallerDefinido!inner(
              TallerImpartido!inner(profesor_asignado)
            )
          `)
          .eq("TallerDefinido.TallerImpartido.profesor_asignado", profesorId)

        if (error) {
          setError(error)
        } else {
          setNivel(data)
        }
      } catch (err) {
        setError(err)
      }
    }

    fetchAlumnos()
    misTalleres()
    estudiante()
    Nivel()
  }, [profesorId]) // Dependencia del profesorId

  console.log("alumnos:", alumnos)
  console.log("estudiante:", estudiante)
  console.log("Nivel:", Nivel)
  console.log("Error:", error)
  console.log("Profesor ID:", profesorId)

  const openAddModal = () => {
    setShowAddModal(true)
    setFormData({
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
      rutEstudiante: alumno.id_estudiante,
      idTaller: alumno.id_taller_impartido.toString(),
      nivelActual: alumno.nivel_actual,
      estado: alumno.estado,
      fechaInscripcion: alumno.fecha_inscripcion,
    })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingAlumno(null)
    setFormData({
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar campos requeridos
    if (
      !formData.rutEstudiante ||
      !formData.idTaller ||
      !formData.nivelActual ||
      !formData.estado ||
      !formData.fechaInscripcion
    ) {
      alert("Por favor, complete todos los campos")
      return
    }

    // Verificar que el taller pertenece al profesor actual
    const tallerSeleccionado = misTalleres.find((t) => t.id_taller_impartido === Number.parseInt(formData.idTaller))
    if (!tallerSeleccionado || tallerSeleccionado.profesor_asignado !== profesorId) {
      alert("No tienes permisos para asignar estudiantes a este taller")
      return
    }

    console.log("Form Data:", formData)

    // Encontrar datos relacionados
    const estudianteSeleccionado = estudiante.find((e) => e.id_estudiante === Number.parseInt(formData.rutEstudiante))
    const taller = misTalleres.find((t) => t.id_taller_impartido === Number.parseInt(formData.idTaller))

    if (editingAlumno) {
      // Editar alumno existente
      const { error } = await supabase
        .from("ParticipacionEstudiante")
        .update({
          id_estudiante: Number.parseInt(formData.rutEstudiante),
          id_taller_impartido: Number.parseInt(formData.idTaller),
          nivel_actual: Number.parseInt(formData.nivelActual),
          estado: formData.estado,
          fecha_inscripcion: formData.fechaInscripcion,
        })
        .eq("id_participacion", editingAlumno.id_participacion)

      if (error) {
        console.log("Error al actualizar:", error)
        alert("Error al actualizar el alumno")
      } else {
        // Recargar datos
        window.location.reload()
        closeEditModal()
        alert("Alumno actualizado exitosamente")
      }
    } else {
      // Crear nuevo alumno
      const nuevoAlumno = {
        id_estudiante: Number.parseInt(formData.rutEstudiante),
        id_taller_impartido: Number.parseInt(formData.idTaller),
        nivel_actual: Number.parseInt(formData.nivelActual),
        estado: formData.estado,
        fecha_inscripcion: formData.fechaInscripcion,
      }
      console.log("Nuevo Alumno:", nuevoAlumno)

      // Insertar nuevo alumno en la base de datos
      const { error } = await supabase.from("ParticipacionEstudiante").insert([nuevoAlumno])
      console.log("error", error)

      if (error) {
        alert("Error al registrar el alumno")
      } else {
        // Recargar datos
        window.location.reload()
        closeAddModal()
        alert("Alumno registrado exitosamente")
      }
    }
  }

  const handleDelete = async () => {
    if (deletingAlumno) {
      const { error } = await supabase
        .from("ParticipacionEstudiante")
        .delete()
        .eq("id_participacion", deletingAlumno.id_participacion)

      if (error) {
        alert("Error al eliminar el alumno")
      } else {
        // Recargar datos
        window.location.reload()
        closeDeleteModal()
        alert("Alumno eliminado exitosamente")
      }
    }
  }

  // Filtrar alumnos
  const alumnosFiltrados = alumnos.filter((alumno) => {
    const matchesSearch =
      alumno.Estudiante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.Estudiante?.correo_apoderado?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTaller =
      selectedTaller === "" || alumno.TallerImpartido.id_taller_impartido === Number.parseInt(selectedTaller)

    return matchesSearch && matchesTaller
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "INSCRITO":
        return "bg-blue-100 text-blue-800"
      case "EN_PROGRESO":
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

  // Mostrar loading mientras se obtiene el profesor ID
  if (!profesorId) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Cargando información del profesor...</p>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">Mis Alumnos</h1>
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
                <p className="text-sm font-medium text-gray-900">Profesor</p>
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
                  <option value="">Todos mis talleres</option>
                  {misTalleres.map((taller) => (
                    <option key={taller.id_taller_impartido} value={taller.id_taller_impartido}>
                      {taller.nombre_publico}
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
                        RUT Estudiante
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
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alumnosFiltrados.map((alumno) => (
                      <tr key={alumno.id_participacion} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.Estudiante?.rut}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">
                                {alumno.Estudiante?.nombre?.charAt(0) || "N"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {alumno.Estudiante?.nombre} {alumno.Estudiante?.apellido}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumno.Estudiante?.correo_apoderado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumno.TallerImpartido?.nombre_publico}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelColor(alumno.Nivel?.descripcion)}`}
                          >
                            {alumno.Nivel?.descripcion || "N/A"}
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
                          {formatDate(alumno.fecha_inscripcion)}
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
                  <label htmlFor="rutEstudiante" className="block text-sm font-medium text-gray-700 mb-2">
                    Estudiante *
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
                    {estudiante.map((est) => (
                      <option key={est.id_estudiante} value={est.id_estudiante}>
                        {est.rut} - {est.nombre} {est.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="idTaller" className="block text-sm font-medium text-gray-700 mb-2">
                    Mis Talleres *
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
                    {misTalleres.map((taller) => (
                      <option key={taller.id_taller_impartido} value={taller.id_taller_impartido}>
                        {taller.nombre_publico}
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
                    {Nivel.map((nivel) => (
                      <option key={nivel.id_nivel} value={nivel.id_nivel}>
                        Nivel {nivel.numero_nivel} - {nivel.descripcion}
                      </option>
                    ))}
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
                    <option value="EN_PROGRESO">EN PROGRESO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                    <option value="RETIRADO">RETIRADO</option>
                  </select>
                </div>

                <div className="md:col-span-2">
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
                <span className="font-semibold text-gray-900">
                  {deletingAlumno.Estudiante?.nombre} {deletingAlumno.Estudiante?.apellido}
                </span>
                ?
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
