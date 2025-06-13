import { useState, useEffect } from "react"
import { Users, Plus, Search, Edit, UserX, Menu, X, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function AlumnosContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profesorId, setProfesorId] = useState(null) // Nuevo estado para el ID del profesor
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTaller, setSelectedTaller] = useState("")
  const [deletingAlumno, setDeletingAlumno] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Estados para el formulario
  const [formData, setFormData] = useState({
    rutEstudiante: "",
    idTaller: "",
    nivelActual: "",
    estado: "",
    fechaInscripcion: "",
  })

  // Estados para edición inline
  const [editingAlumno, setEditingAlumno] = useState(null)
  const [editForm, setEditForm] = useState({
    rutEstudiante: "",
    idTaller: "",
    nivelActual: "",
    estado: "",
    fechaInscripcion: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const [activeTab, setActiveTab] = useState("activos")

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
  const [nivelesDisponibles, setNivelesDisponibles] = useState([])
  const [error, setError] = useState(null)

  // Función para obtener niveles del taller seleccionado
  const getNivelesPorTaller = (idTallerImpartido) => {
    if (!idTallerImpartido) return []

    const tallerSeleccionado = misTalleres.find((t) => t.id_taller_impartido === Number.parseInt(idTallerImpartido))
    if (!tallerSeleccionado) return []

    return Nivel.filter((nivel) => nivel.id_taller_definido === tallerSeleccionado.id_taller_definido)
  }

  useEffect(() => {
    if (!profesorId) return // No ejecutar si no tenemos el ID del profesor

    const fetchAlumnos = async () => {
      try {
        setLoading(true)
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
        // Obtener todos los estudiantes que ya están participando en talleres del profesor actual
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

        // Extraer los IDs de estudiantes ya registrados
        const idsRegistrados = participaciones.map((p) => p.id_estudiante)

        // Obtener estudiantes que NO están en esa lista
        let query = supabase.from("Estudiante").select("*").eq("estado", "ACTIVO") // Solo estudiantes activos

        if (idsRegistrados.length > 0) {
          query = query.not("id_estudiante", "in", `(${idsRegistrados.join(",")})`)
        }

        const { data, error } = await query.order("nombre", { ascending: true })

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
        // Obtener los IDs de los talleres definidos que están siendo impartidos por el profesor actual
        const { data: talleresImpartidos, error: errorTalleres } = await supabase
          .from("TallerImpartido")
          .select("id_taller_definido")
          .eq("profesor_asignado", profesorId)

        if (errorTalleres) {
          setError(errorTalleres)
          return
        }

        const idsTalleresDefinidos = talleresImpartidos.map((t) => t.id_taller_definido)

        if (idsTalleresDefinidos.length === 0) {
          setNivel([])
          return
        }

        // Obtener los niveles de esos talleres definidos
        const { data, error } = await supabase
          .from("Nivel")
          .select("*")
          .in("id_taller_definido", idsTalleresDefinidos)
          .order("numero_nivel", { ascending: true })

        if (error) {
          setError(error)
        } else {
          setNivel(data)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    const loadAllData = async () => {
      await Promise.all([fetchAlumnos(), misTalleres(), estudiante(), Nivel()])
    }

    loadAllData()
  }, [profesorId]) // Dependencia del profesorId

  // Actualizar niveles disponibles cuando cambie el taller seleccionado
  useEffect(() => {
    const nivelesDelTaller = getNivelesPorTaller(formData.idTaller)
    setNivelesDisponibles(nivelesDelTaller)

    // Si el nivel actual ya no está disponible, resetear
    if (formData.nivelActual && !nivelesDelTaller.find((n) => n.id_nivel === Number.parseInt(formData.nivelActual))) {
      setFormData((prev) => ({ ...prev, nivelActual: "" }))
    }
  }, [formData.idTaller, Nivel, misTalleres])

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

  // Funciones de edición inline
  const handleEditAlumno = (alumno) => {
    setEditingAlumno(alumno.id_participacion)
    setEditForm({
      rutEstudiante: alumno.id_estudiante, // Mantener el ID pero no será editable
      idTaller: alumno.id_taller_impartido.toString(), // No será editable
      nivelActual: alumno.nivel_actual.toString(), // Será input manual
      estado: alumno.estado,
      fechaInscripcion: alumno.fecha_inscripcion,
    })
  }

  const handleSaveEdit = async () => {
    try {
      setSubmitting(true)

      // Validar que todos los campos requeridos estén presentes
      if (!editForm.nivelActual || !editForm.estado || !editForm.fechaInscripcion) {
        alert("Por favor, complete todos los campos requeridos")
        setSubmitting(false)
        return
      }

      // Obtener el alumno que estamos editando
      const alumnoActual = alumnos.find((a) => a.id_participacion === editingAlumno)
      if (!alumnoActual) {
        alert("No se encontró el alumno que está editando")
        setSubmitting(false)
        return
      }

      // Preparar los datos para la actualización (solo campos editables)
      const datosActualizados = {
        nivel_actual: Number(editForm.nivelActual),
        estado: editForm.estado,
        fecha_inscripcion: editForm.fechaInscripcion,
      }

      console.log("Actualizando alumno con datos:", datosActualizados)

      // Usar el cliente de Supabase sin RLS para evitar problemas de políticas
      const { data, error } = await supabase
        .from("ParticipacionEstudiante")
        .update(datosActualizados)
        .eq("id_participacion", editingAlumno)

      if (error) {
        console.error("Error al actualizar alumno:", error)
        alert(`Error al actualizar: ${error.message}`)
        return
      }

      // Actualizar los datos localmente sin recargar la página
      setAlumnos(
        alumnos.map((alumno) =>
          alumno.id_participacion === editingAlumno
            ? {
                ...alumno,
                nivel_actual: Number(editForm.nivelActual),
                estado: editForm.estado,
                fecha_inscripcion: editForm.fechaInscripcion,
              }
            : alumno,
        ),
      )

      // Mostrar mensaje de éxito
      alert("Alumno actualizado exitosamente")

      // Limpiar el estado de edición
      setEditingAlumno(null)
    } catch (err) {
      console.error("Error en la actualización:", err)
      alert(`Error inesperado: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingAlumno(null)
    setEditForm({
      rutEstudiante: "",
      idTaller: "",
      nivelActual: "",
      estado: "",
      fechaInscripcion: "",
    })
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

    // Verificar que el estudiante no esté ya registrado en este taller
    const estudianteYaRegistrado = alumnos.find(
      (a) =>
        a.id_estudiante === Number.parseInt(formData.rutEstudiante) &&
        a.id_taller_impartido === Number.parseInt(formData.idTaller),
    )

    if (estudianteYaRegistrado) {
      alert("Este estudiante ya está registrado en el taller seleccionado")
      return
    }

    // Verificar que el nivel pertenece al taller seleccionado
    const nivelValido = nivelesDisponibles.find((n) => n.id_nivel === Number.parseInt(formData.nivelActual))
    if (!nivelValido) {
      alert("El nivel seleccionado no pertenece al taller elegido")
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

  const handleDesactivar = async () => {
    if (deletingAlumno) {
      const nuevoEstado = deletingAlumno.estado === "RETIRADO" ? "EN_PROGRESO" : "RETIRADO"

      const { error } = await supabase
        .from("ParticipacionEstudiante")
        .update({ estado: nuevoEstado })
        .eq("id_participacion", deletingAlumno.id_participacion)

      if (error) {
        alert("Error al cambiar el estado del alumno")
      } else {
        // Actualizar los datos localmente sin recargar la página
        setAlumnos(
          alumnos.map((alumno) =>
            alumno.id_participacion === deletingAlumno.id_participacion ? { ...alumno, estado: nuevoEstado } : alumno,
          ),
        )

        closeDeleteModal()
        alert(`Alumno ${nuevoEstado === "RETIRADO" ? "desactivado" : "reactivado"} exitosamente`)
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

    // Filtro por pestaña activa
    const matchesTab =
      activeTab === "activos"
        ? alumno.estado === "INSCRITO" || alumno.estado === "EN_PROGRESO" || alumno.estado === "FINALIZADO"
        : alumno.estado === "RETIRADO"

    return matchesSearch && matchesTaller && matchesTab
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

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
        <DashboardProfeSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Profesor" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando alumnos...</p>
          </div>
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

            {/* Pestañas */}
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
                    Activos (
                    {
                      alumnos.filter(
                        (a) => a.estado === "INSCRITO" || a.estado === "EN_PROGRESO" || a.estado === "FINALIZADO",
                      ).length
                    }
                    )
                  </button>
                  <button
                    onClick={() => setActiveTab("desactivados")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "desactivados"
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Desactivados ({alumnos.filter((a) => a.estado === "RETIRADO").length})
                  </button>
                </nav>
              </div>
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
                          {editingAlumno === alumno.id_participacion ? (
                            <input
                              type="number"
                              name="nivelActual"
                              value={editForm.nivelActual}
                              onChange={handleEditFormChange}
                              min="1"
                              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Ingrese nivel"
                            />
                          ) : (
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelColor(alumno.Nivel?.descripcion)}`}
                            >
                              {alumno.Nivel?.descripcion || `Nivel ${alumno.nivel_actual}`}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingAlumno === alumno.id_participacion ? (
                            <select
                              name="estado"
                              value={editForm.estado}
                              onChange={handleEditFormChange}
                              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="">Seleccionar estado</option>
                              <option value="INSCRITO">INSCRITO</option>
                              <option value="EN_PROGRESO">EN PROGRESO</option>
                              <option value="FINALIZADO">FINALIZADO</option>
                              <option value="RETIRADO">RETIRADO</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(alumno.estado)}`}
                            >
                              {alumno.estado === "EN_PROGRESO" ? "EN PROGRESO" : alumno.estado}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingAlumno === alumno.id_participacion ? (
                            <input
                              type="date"
                              name="fechaInscripcion"
                              value={editForm.fechaInscripcion}
                              onChange={handleEditFormChange}
                              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          ) : (
                            formatDate(alumno.fecha_inscripcion)
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingAlumno === alumno.id_participacion ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={submitting}
                                className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"
                                title="Guardar"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={submitting}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                                title="Cancelar"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditAlumno(alumno)}
                                className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"
                                title="Editar alumno"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(alumno)}
                                className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors"
                                title={alumno.estado === "RETIRADO" ? "Reactivar alumno" : "Desactivar alumno"}
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            </div>
                          )}
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
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Añadir Nuevo Alumno</h2>
              <button onClick={closeAddModal} className="text-gray-500 hover:text-gray-700">
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
                    {nivelesDisponibles.map((nivel) => (
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
                  onClick={closeAddModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Registrar Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para desactivar/reactivar */}
      {showDeleteModal && deletingAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {deletingAlumno.estado === "RETIRADO" ? "Reactivar Alumno" : "Desactivar Alumno"}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas {deletingAlumno.estado === "RETIRADO" ? "reactivar" : "desactivar"} al
                alumno{" "}
                <span className="font-semibold text-gray-900">
                  {deletingAlumno.Estudiante?.nombre} {deletingAlumno.Estudiante?.apellido}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-600">
                {deletingAlumno.estado === "RETIRADO"
                  ? "El alumno volverá a estar activo en el taller."
                  : "El alumno será marcado como retirado del taller."}
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDesactivar}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
                  deletingAlumno.estado === "RETIRADO"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                <UserX className="w-4 h-4 mr-2" />
                {deletingAlumno.estado === "RETIRADO" ? "Reactivar" : "Desactivar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}