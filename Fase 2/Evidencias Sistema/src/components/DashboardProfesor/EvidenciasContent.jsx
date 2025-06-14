import { useState, useEffect } from "react"
import { FileText, Plus, Search, Eye, Check, X, Menu, Upload, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function EvidenciasContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEvidencia, setSelectedEvidencia] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [filterTaller, setFilterTaller] = useState("")
  const [filterNivel, setFilterNivel] = useState("")
  const [filterSemana, setFilterSemana] = useState("")
  const [filterFecha, setFilterFecha] = useState("")

  // Estados para el formulario de subir evidencia
  const [formData, setFormData] = useState({
    idTaller: "",
    alumno: "",
    semana: "",
    descripcion: "",
    archivoUrl: "",
    fecha: "",
    validadoPor: "",
    observaciones: "",
  })

  const [evidencias, setEvidencias] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        // Pre-llenar el campo "Validado por" con el email del usuario
        setFormData((prev) => ({
          ...prev,
          validadoPor: data.user.email || "",
        }))
        // Cargar historial de evidencias
        cargarEvidencias()
        // Simular carga de datos
        setTimeout(() => {
          setLoading(false)
        }, 1500)
      } else {
        navigate("/")
      }
    }
    getUser()
  }, [navigate])

  const cargarEvidencias = async () => {
    try {
      setLoading(true)

      // Obtener las evidencias de la base de datos
      const { data, error } = await supabase
        .from("Evidencia")
        .select(`
          *,
          ParticipacionEstudiante:id_participacion (
            Estudiante:id_estudiante (nombre, apellido),
            TallerImpartido:id_taller_impartido (
              nombre_publico,
              TallerDefinido:id_taller_definido (nombre)
            ),
            nivel_actual
          )
        `)
        .order("fecha_envio", { ascending: false })

      if (error) {
        console.error("Error al cargar evidencias:", error)
        return
      }

      // Transformar los datos para adaptarlos al formato esperado
      const evidenciasFormateadas = data.map((evidencia) => {
        const estudiante = evidencia.ParticipacionEstudiante?.Estudiante
        const taller = evidencia.ParticipacionEstudiante?.TallerImpartido
        const nombreTaller = taller?.nombre_publico || taller?.TallerDefinido?.nombre || "Sin nombre"

        return {
          id: evidencia.id_evidencia,
          idTaller: taller?.id_taller_impartido,
          tallerNombre: nombreTaller,
          alumno: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "Desconocido",
          nivel: evidencia.ParticipacionEstudiante?.nivel_actual || "No especificado",
          semana: evidencia.semana,
          descripcion: evidencia.descripcion || "Sin descripción",
          tipo: evidencia.archivo_url ? evidencia.archivo_url.split(".").pop() || "Documento" : "Documento",
          fecha: evidencia.fecha_envio,
          validadoPor: evidencia.validada_por_profesor ? "Validado" : "Pendiente",
          observaciones: evidencia.observaciones || "",
          estado: evidencia.validada_por_profesor ? "Aprobada" : "Pendiente",
          archivoUrl: evidencia.archivo_url || "",
        }
      })

      setEvidencias(evidenciasFormateadas)
    } catch (error) {
      console.error("Error al cargar evidencias:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Cuando cambia el taller seleccionado, resetear el alumno seleccionado
    if (formData.idTaller) {
      setFormData((prev) => ({
        ...prev,
        alumno: "", // Resetear el alumno seleccionado
      }))
    }
  }, [formData.idTaller])

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

  // Datos de alumnos por taller
  const alumnosPorTaller = {
    1: [
      { id: 1, nombre: "Laura Martínez", nivel: "Avanzado" },
      { id: 2, nombre: "Carlos Sánchez", nivel: "Intermedio" },
      { id: 3, nombre: "Ana García", nivel: "Básico" },
    ],
    2: [
      { id: 4, nombre: "Miguel Torres", nivel: "Intermedio" },
      { id: 5, nombre: "Sofía Rodríguez", nivel: "Avanzado" },
    ],
    3: [
      { id: 6, nombre: "Diego Flores", nivel: "Intermedio" },
      { id: 7, nombre: "Isabella Moreno", nivel: "Básico" },
    ],
  }

  const openUploadModal = () => {
    setShowUploadModal(true)
    setFormData({
      idTaller: "",
      alumno: "",
      semana: "",
      descripcion: "",
      archivoUrl: "",
      fecha: new Date().toISOString().split("T")[0],
      validadoPor: user?.email || "",
      observaciones: "",
    })
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
    setFormData({
      idTaller: "",
      alumno: "",
      semana: "",
      descripcion: "",
      archivoUrl: "",
      fecha: "",
      validadoPor: "",
      observaciones: "",
    })
  }

  const openViewModal = (evidencia) => {
    setSelectedEvidencia(evidencia)
    setShowViewModal(true)
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setSelectedEvidencia(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Validación especial para el campo semana
    if (name === "semana") {
      const numValue = Number.parseInt(value)
      if (value === "" || (numValue >= 1 && numValue <= 16)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar campos requeridos
    if (
      !formData.idTaller ||
      !formData.alumno ||
      !formData.semana ||
      !formData.descripcion ||
      !formData.fecha ||
      !formData.validadoPor
    ) {
      alert("Por favor, complete todos los campos obligatorios")
      return
    }

    const taller = misTalleres.find((t) => t.id === Number.parseInt(formData.idTaller))
    const alumnos = alumnosPorTaller[formData.idTaller] || []
    const alumno = alumnos.find((a) => a.id === Number.parseInt(formData.alumno))

    const nuevaEvidencia = {
      id: evidencias.length + 1,
      idTaller: Number.parseInt(formData.idTaller),
      tallerNombre: taller?.nombre || "",
      alumno: alumno?.nombre || "",
      nivel: alumno?.nivel || "",
      semana: formData.semana,
      descripcion: formData.descripcion,
      tipo: "Documento", // Por defecto
      fecha: formData.fecha,
      validadoPor: formData.validadoPor,
      observaciones: formData.observaciones,
      estado: "Pendiente",
      archivoUrl: formData.archivoUrl,
    }

    setEvidencias([...evidencias, nuevaEvidencia])
    closeUploadModal()
    alert("Evidencia subida exitosamente")
  }

  const handleAprobar = (evidenciaId) => {
    const evidenciasActualizadas = evidencias.map((evidencia) =>
      evidencia.id === evidenciaId ? { ...evidencia, estado: "Aprobada" } : evidencia,
    )
    setEvidencias(evidenciasActualizadas)
    alert("Evidencia aprobada exitosamente")
  }

  const resetFilters = () => {
    setFilterTaller("")
    setFilterNivel("")
    setFilterSemana("")
    setFilterFecha("")
    setSearchTerm("")
  }

  const evidenciasFiltradas = evidencias.filter((evidencia) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      evidencia.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidencia.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidencia.tallerNombre.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtros avanzados
    const matchesTaller = filterTaller === "" || evidencia.idTaller === Number.parseInt(filterTaller)
    const matchesNivel = filterNivel === "" || evidencia.nivel === filterNivel
    const matchesSemana = filterSemana === "" || evidencia.semana === filterSemana
    const matchesFecha = filterFecha === "" || evidencia.fecha.includes(filterFecha)

    return matchesSearch && matchesTaller && matchesNivel && matchesSemana && matchesFecha
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Aprobada":
        return "bg-green-100 text-green-800"
      case "Histórico":
        return "bg-blue-100 text-blue-800"
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
        <DashboardProfeSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Profesor" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando evidencias...</p>
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
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Evidencias</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar evidencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                />
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

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">


            {/* Filtros avanzados */}
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <label htmlFor="filterTaller" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Taller
                  </label>
                  <select
                    id="filterTaller"
                    value={filterTaller}
                    onChange={(e) => setFilterTaller(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Todos los talleres</option>
                    {misTalleres.map((taller) => (
                      <option key={taller.id} value={taller.id}>
                        {taller.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="filterNivel" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Nivel
                  </label>
                  <select
                    id="filterNivel"
                    value={filterNivel}
                    onChange={(e) => setFilterNivel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Todos los niveles</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filterSemana" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Semana
                  </label>
                  <select
                    id="filterSemana"
                    value={filterSemana}
                    onChange={(e) => setFilterSemana(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Todas las semanas</option>
                    {Array.from(new Set(evidencias.map((e) => e.semana)))
                      .sort()
                      .map((semana) => (
                        <option key={semana} value={semana}>
                          {semana}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="filterFecha" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Fecha
                  </label>
                  <input
                    type="date"
                    id="filterFecha"
                    value={filterFecha}
                    onChange={(e) => setFilterFecha(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex-none self-end mt-6">
                  <button
                    onClick={resetFilters}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 py-4">
                  Historial de Evidencias ({evidencias.length})
                </h2>
              </div>
            </div>

            {/* Tabla de evidencias */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Historial de Evidencias</h2>
                <p className="text-gray-600">Historial completo de evidencias generadas en talleres</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semana
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
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
                    {evidenciasFiltradas.map((evidencia) => (
                      <tr key={evidencia.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">{evidencia.alumno.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{evidencia.alumno}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evidencia.tallerNombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelColor(evidencia.nivel)}`}
                          >
                            {evidencia.nivel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evidencia.semana}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {evidencia.descripcion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(evidencia.fecha)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(evidencia.estado)}`}
                          >
                            {evidencia.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openViewModal(evidencia)}
                              className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {evidencia.estado === "Pendiente" && (
                              <button
                                onClick={() => handleAprobar(evidencia.id)}
                                className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                                title="Aprobar evidencia"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {evidenciasFiltradas.length === 0 && (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evidencias en el historial</h3>
                    <p className="text-gray-500 max-w-md">No hay registros históricos de evidencias para mostrar.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal para subir evidencia */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Subir Nueva Evidencia</h2>
              <button onClick={closeUploadModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {misTalleres.map((taller) => (
                      <option key={taller.id} value={taller.id}>
                        {taller.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="alumno" className="block text-sm font-medium text-gray-700 mb-2">
                    Alumno *
                  </label>
                  <select
                    id="alumno"
                    name="alumno"
                    value={formData.alumno}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Seleccionar alumno</option>
                    {formData.idTaller &&
                      (alumnosPorTaller[formData.idTaller] || []).map((alumno) => (
                        <option key={alumno.id} value={alumno.id}>
                          {alumno.nombre} - {alumno.nivel}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="semana" className="block text-sm font-medium text-gray-700 mb-2">
                    Semana *
                  </label>
                  <input
                    type="number"
                    id="semana"
                    name="semana"
                    value={formData.semana}
                    onChange={handleInputChange}
                    min="1"
                    max="16"
                    placeholder="Ingrese número de semana (1-16)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe la evidencia del progreso del alumno..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="archivoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo URL
                  </label>
                  <input
                    type="url"
                    id="archivoUrl"
                    name="archivoUrl"
                    value={formData.archivoUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/archivo.pdf"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="validadoPor" className="block text-sm font-medium text-gray-700 mb-2">
                    Validado por *
                  </label>
                  <input
                    type="text"
                    id="validadoPor"
                    name="validadoPor"
                    value={formData.validadoPor}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Observaciones adicionales sobre el progreso del alumno..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Evidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver detalles de evidencia */}
      {showViewModal && selectedEvidencia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Detalles de la Evidencia</h2>
              <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Alumno</h3>
                  <p className="text-gray-900">{selectedEvidencia.alumno}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Taller</h3>
                  <p className="text-gray-900">{selectedEvidencia.tallerNombre}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Nivel</h3>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelColor(selectedEvidencia.nivel)}`}
                  >
                    {selectedEvidencia.nivel}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Semana</h3>
                  <p className="text-gray-900">{selectedEvidencia.semana}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha</h3>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(selectedEvidencia.fecha)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Estado</h3>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(selectedEvidencia.estado)}`}
                  >
                    {selectedEvidencia.estado}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Descripción</h3>
                  <p className="text-gray-900">{selectedEvidencia.descripcion}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Validado por</h3>
                  <p className="text-gray-900">{selectedEvidencia.validadoPor}</p>
                </div>

                {selectedEvidencia.archivoUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Archivo</h3>
                    <a
                      href={selectedEvidencia.archivoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-800 underline"
                    >
                      Ver archivo
                    </a>
                  </div>
                )}

                {selectedEvidencia.observaciones && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Observaciones</h3>
                    <p className="text-gray-900">{selectedEvidencia.observaciones}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                {selectedEvidencia.estado === "Pendiente" && (
                  <button
                    onClick={() => {
                      handleAprobar(selectedEvidencia.id)
                      closeViewModal()
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar Evidencia
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}