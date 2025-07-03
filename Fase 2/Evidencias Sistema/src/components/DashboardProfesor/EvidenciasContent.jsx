import { useState, useEffect } from "react"
import { FileText, Plus, Search, Eye, Check, X, Menu, Upload, Calendar, ClipboardList } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"
import jsPDF from "jspdf"

export default function EvidenciasContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [activeTab, setActiveTab] = useState("pendientes")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedEvidencia, setSelectedEvidencia] = useState(null)
  const [selectedReporte, setSelectedReporte] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const [filterTaller, setFilterTaller] = useState("")
  const [filterNivel, setFilterNivel] = useState("")
  const [filterSemana, setFilterSemana] = useState("")
  const [filterFecha, setFilterFecha] = useState("")

  // Estados para datos de la base de datos
  const [evidencias, setEvidencias] = useState([])
  const [reportes, setReportes] = useState([])
  const [misTalleres, setMisTalleres] = useState([])
  const [alumnosPorTaller, setAlumnosPorTaller] = useState({})
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        console.log("Usuario autenticado:", data.user.email)

        // Obtener el ID del usuario desde la tabla Usuario usando el email
        const { data: userData, error } = await supabase
          .from("Usuario")
          .select("id_usuario, nombre, apellido, rol")
          .eq("correo", data.user.email)
          .single()

        console.log("Datos del usuario en BD:", userData, error)

        if (userData && !error) {
          setCurrentUserId(userData.id_usuario)
          setFormData((prev) => ({
            ...prev,
            validadoPor: data.user.email || "",
          }))
        } else {
        }
      } else {
        navigate("/")
      }
    }
    getUser()
  }, [navigate])

  // Cargar datos cuando se obtiene el ID del usuario
  useEffect(() => {
    if (currentUserId) {
      loadTeacherData()
    }
  }, [currentUserId])

  const loadTeacherData = async () => {
    try {
      setLoading(true)
      console.log("=== INICIANDO CARGA DE DATOS ===")
      console.log("ID del usuario actual:", currentUserId)

      // PASO 1: Verificar si hay evidencias en general
      const { data: allEvidencias, error: allEvidenciasError } = await supabase.from("Evidencia").select("*").limit(5)

      console.log("Todas las evidencias (muestra):", allEvidencias, allEvidenciasError)

      // PASO 2: Obtener talleres asignados al profesor
      const { data: talleresData, error: talleresError } = await supabase
        .from("TallerImpartido")
        .select("*")
        .eq("profesor_asignado", currentUserId)

      console.log("Talleres del profesor:", talleresData, talleresError)

      if (talleresError) {
        console.error("Error fetching talleres:", talleresError)
        throw talleresError
      }

      if (!talleresData || talleresData.length === 0) {
        console.log("No se encontraron talleres para este profesor")
        setMisTalleres([])
        setAlumnosPorTaller({})
        setEvidencias([])
        setReportes([])
        setLoading(false)
        return
      }

      // PASO 3: Obtener nombres de talleres definidos
      const tallerDefinidoIds = [...new Set(talleresData.map((t) => t.id_taller_definido))]
      const { data: tallerDefinidoData, error: tallerDefinidoError } = await supabase
        .from("TallerDefinido")
        .select("id_taller_definido, nombre")
        .in("id_taller_definido", tallerDefinidoIds)

      console.log("Talleres definidos:", tallerDefinidoData, tallerDefinidoError)

      // PASO 4: Combinar datos de talleres
      const talleres = talleresData.map((taller) => {
        const tallerDefinido = tallerDefinidoData?.find((td) => td.id_taller_definido === taller.id_taller_definido)
        return {
          id: taller.id_taller_impartido,
          nombre: taller.nombre_publico || tallerDefinido?.nombre || "Taller sin nombre",
          estado: taller.estado,
        }
      })

      console.log("Talleres procesados:", talleres)
      setMisTalleres(talleres)

      // PASO 5: Obtener participaciones de estudiantes en estos talleres
      const tallerIds = talleres.map((t) => t.id)
      const { data: participacionesData, error: participacionesError } = await supabase
        .from("ParticipacionEstudiante")
        .select("*")
        .in("id_taller_impartido", tallerIds)

      console.log("Participaciones encontradas:", participacionesData, participacionesError)

      if (participacionesError) {
        console.error("Error fetching participaciones:", participacionesError)
        throw participacionesError
      }

      if (!participacionesData || participacionesData.length === 0) {
        console.log("No se encontraron participaciones")
        setAlumnosPorTaller({})
        setEvidencias([])
        setReportes([])
        setLoading(false)
        return
      }

      // PASO 6: Obtener datos de estudiantes
      const estudianteIds = [...new Set(participacionesData.map((p) => p.id_estudiante))]
      const { data: estudiantesData, error: estudiantesError } = await supabase
        .from("Estudiante")
        .select("*")
        .in("id_estudiante", estudianteIds)

      console.log("Estudiantes encontrados:", estudiantesData, estudiantesError)

      // PASO 7: Obtener datos de niveles
      const nivelIds = participacionesData.map((p) => p.nivel_actual).filter(Boolean)
      let nivelesData = []
      if (nivelIds.length > 0) {
        const { data: nivelesResult, error: nivelesError } = await supabase
          .from("Nivel")
          .select("*")
          .in("id_nivel", nivelIds)

        console.log("Niveles encontrados:", nivelesResult, nivelesError)
        nivelesData = nivelesResult || []
      }

      // PASO 8: Organizar alumnos por taller
      const alumnosMap = {}
      participacionesData.forEach((participacion) => {
        const tallerId = participacion.id_taller_impartido
        const estudiante = estudiantesData?.find((e) => e.id_estudiante === participacion.id_estudiante)
        const nivel = nivelesData.find((n) => n.id_nivel === participacion.nivel_actual)

        if (!alumnosMap[tallerId]) {
          alumnosMap[tallerId] = []
        }

        if (estudiante) {
          alumnosMap[tallerId].push({
            id: participacion.id_participacion,
            nombre: `${estudiante.nombre} ${estudiante.apellido}`,
            nivel: nivel?.descripcion || "Sin nivel",
          })
        }
      })

      console.log("Alumnos por taller:", alumnosMap)
      setAlumnosPorTaller(alumnosMap)

      // PASO 9: Obtener evidencias de estas participaciones
      const participacionIds = participacionesData.map((p) => p.id_participacion)
      console.log("IDs de participaciones para buscar evidencias:", participacionIds)

      if (participacionIds.length > 0) {
        const { data: evidenciasData, error: evidenciasError } = await supabase
          .from("Evidencia")
          .select("*")
          .in("id_participacion", participacionIds)
          .order("fecha_envio", { ascending: false })

        console.log("Evidencias encontradas:", evidenciasData, evidenciasError)

        if (evidenciasError) {
          console.error("Error fetching evidencias:", evidenciasError)
          throw evidenciasError
        }

        // PASO 10: Formatear evidencias
        const evidenciasFormateadas =
          evidenciasData?.map((evidencia) => {
            const participacion = participacionesData.find((p) => p.id_participacion === evidencia.id_participacion)
            const taller = talleres.find((t) => t.id === participacion?.id_taller_impartido)
            const estudiante = estudiantesData?.find((e) => e.id_estudiante === participacion?.id_estudiante)
            const nivel = nivelesData.find((n) => n.id_nivel === participacion?.nivel_actual)

            console.log("Procesando evidencia:", {
              evidencia_id: evidencia.id_evidencia,
              validada_por_profesor: evidencia.validada_por_profesor,
              participacion: participacion?.id_participacion,
              taller: taller?.nombre,
              estudiante: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "No encontrado",
            })

            return {
              id: evidencia.id_evidencia,
              idTaller: participacion?.id_taller_impartido || 0,
              tallerNombre: taller?.nombre || "Taller desconocido",
              alumno: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "Estudiante desconocido",
              nivel: nivel?.descripcion || "Sin nivel",
              semana: `Semana ${evidencia.semana}`,
              descripcion: evidencia.descripcion || "",
              tipo: "Documento",
              fecha: evidencia.fecha_envio,
              validadoPor: user?.email || "",
              observaciones: evidencia.observaciones || "",
              estado: evidencia.validada_por_profesor === 1 ? "Aprobado" : "Pendiente",
              archivoUrl: evidencia.archivo_url || "",
            }
          }) || []

        console.log("Evidencias formateadas:", evidenciasFormateadas)
        setEvidencias(evidenciasFormateadas)

        // PASO 11: Obtener reportes de desempeño creados por este profesor
        const { data: reportesData, error: reportesError } = await supabase
          .from("ReporteDesempeno")
          .select(`
            *,
            ParticipacionEstudiante!inner(
              id_estudiante,
              TallerImpartido!inner(
                profesor_asignado,
                id_taller_definido,
                nombre_publico
              )
            )
          `)
          .eq("ParticipacionEstudiante.TallerImpartido.profesor_asignado", currentUserId)
          .order("fecha_generacion", { ascending: false })

        console.log("Reportes del profesor encontrados:", reportesData, reportesError)

        if (!reportesError && reportesData) {
          const reportesFormateados = reportesData.map((reporte) => {
            const participacion = participacionesData.find((p) => p.id_participacion === reporte.id_participacion)
            const taller = talleres.find((t) => t.id === participacion?.id_taller_impartido)
            const estudiante = estudiantesData?.find((e) => e.id_estudiante === participacion?.id_estudiante)

            return {
              id: reporte.id_reporte,
              idParticipacion: reporte.id_participacion,
              tallerNombre: taller?.nombre || "Taller desconocido",
              alumno: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "Estudiante desconocido",
              fechaGeneracion: reporte.fecha_generacion,
              resumenSemana: reporte.resumen_semana || "",
              recomendaciones: reporte.recomendaciones || "",
              entregado: reporte.entregado === 1,
            }
          })

          console.log("Reportes formateados del profesor:", reportesFormateados)
          setReportes(reportesFormateados)
        }

        // Contar por estado
        const pendientes = evidenciasFormateadas.filter((e) => e.estado === "Pendiente").length
        const aprobadas = evidenciasFormateadas.filter((e) => e.estado === "Aprobado").length
        console.log(`Estados: ${pendientes} pendientes, ${aprobadas} aprobadas`)
      } else {
        console.log("No hay IDs de participaciones")
        setEvidencias([])
        setReportes([])
      }

      console.log("=== CARGA DE DATOS COMPLETADA ===")
    } catch (error) {
      console.error("Error loading teacher data:", error)
      alert(`Error al cargar los datos del profesor: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
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

  const openReportModal = (reporte) => {
    setSelectedReporte(reporte)
    setShowReportModal(true)
  }

  const closeReportModal = () => {
    setShowReportModal(false)
    setSelectedReporte(null)
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

    try {
      console.log("Enviando evidencia con datos:", formData)

      const semanaNumero = formData.semana.replace(/\D/g, "") || "1"

      const evidenciaData = {
        id_participacion: Number.parseInt(formData.alumno),
        semana: Number.parseInt(semanaNumero),
        descripcion: formData.descripcion,
        archivo_url: formData.archivoUrl || null,
        fecha_envio: formData.fecha,
        validada_por_profesor: 1, // Cambié a 1 para que aparezca como aprobada
        observaciones: formData.observaciones || null,
      }

      console.log("Datos a insertar:", evidenciaData)

      const { data, error } = await supabase.from("Evidencia").insert(evidenciaData).select()

      if (error) {
        console.error("Error insertando evidencia:", error)
        throw error
      }

      console.log("Evidencia insertada:", data)

      await loadTeacherData()
      closeUploadModal()
      alert("Evidencia subida exitosamente")
    } catch (error) {
      console.error("Error uploading evidence:", error)
      alert(`Error al subir la evidencia: ${error.message}`)
    }
  }

  const handleAprobar = async (evidenciaId) => {
    try {
      const { error } = await supabase
        .from("Evidencia")
        .update({ validada_por_profesor: 1 })
        .eq("id_evidencia", evidenciaId)

      if (error) throw error

      const evidenciasActualizadas = evidencias.map((evidencia) =>
        evidencia.id === evidenciaId ? { ...evidencia, estado: "Aprobado" } : evidencia,
      )
      setEvidencias(evidenciasActualizadas)
      alert("Evidencia aprobada exitosamente")
    } catch (error) {
      console.error("Error approving evidence:", error)
      alert("Error al aprobar la evidencia")
    }
  }

  const resetFilters = () => {
    setFilterTaller("")
    setFilterNivel("")
    setFilterSemana("")
    setFilterFecha("")
    setSearchTerm("")
  }

  // Filtrar evidencias
  const evidenciasFiltradas = evidencias
    .filter((evidencia) => {
      const matchesTab = activeTab === "pendientes" ? evidencia.estado === "Pendiente" : evidencia.estado === "Aprobado"

      const matchesSearch =
        evidencia.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evidencia.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evidencia.tallerNombre.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTaller = filterTaller === "" || evidencia.idTaller === Number.parseInt(filterTaller)
      const matchesNivel = filterNivel === "" || evidencia.nivel === filterNivel
      const matchesSemana = filterSemana === "" || evidencia.semana === filterSemana
      const matchesFecha = filterFecha === "" || evidencia.fecha.includes(filterFecha)

      return matchesSearch && matchesTab && matchesTaller && matchesNivel && matchesSemana && matchesFecha
    })
    .map((evidencia) => ({
      ...evidencia,
      estado: "Aprobada", // Fuerza el estado visual a "Aprobada"
    }))

  // Filtrar reportes
  const reportesFiltrados = reportes.filter((reporte) => {
    const matchesSearch =
      reporte.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.resumenSemana.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.tallerNombre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTaller = filterTaller === "" || reporte.tallerNombre.includes(filterTaller)
    const matchesFecha = filterFecha === "" || reporte.fechaGeneracion.includes(filterFecha)

    return matchesSearch && matchesTaller && matchesFecha
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Aprobado":
      case "Aprobada": // Añade esta línea
        return "bg-green-100 text-green-800 border-green-300"
      case "Entregado":
        return "bg-blue-100 text-blue-800 border-blue-300"
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

  const evidenciasPendientes = evidencias.filter((e) => e.estado === "Pendiente").length
  const evidenciasAprobadas = evidencias.filter((e) => e.estado === "Aprobado").length
  const reportesEntregados = reportes.filter((r) => r.entregado).length
  const reportesPendientes = reportes.filter((r) => !r.entregado).length

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
              <h1 className="text-2xl font-bold text-gray-900">Evidencias y Reportes</h1>
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
              <p className="text-gray-600">
                Gestiona las evidencias de progreso y reportes de desempeño de tus alumnos
              </p>

              <button
                onClick={openUploadModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Subir Evidencia
              </button>
            </div>

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
                    {Array.from(new Set(evidencias.map((e) => e.nivel)))
                      .sort()
                      .map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex-1">
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

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("pendientes")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "pendientes"
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Evidencias Aprobadas ({evidenciasPendientes})
                  </button>
                  <button
                    onClick={() => setActiveTab("reportes")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reportes"
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Historial de Reportes ({reportes.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenido de las tabs */}
            {activeTab === "pendientes" ? (
              /* Tabla de evidencias */
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Evidencias Aprobadas</h2>
                  <p className="text-gray-600">Evidencias que ya han sido aprobadas</p>
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
                                <span className="text-emerald-600 font-medium text-sm">
                                  {evidencia.alumno.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{evidencia.alumno}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {evidencia.tallerNombre}
                          </td>
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
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getEstadoColor(evidencia.estado)}`}
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evidencias aprobadas</h3>
                      <p className="text-gray-500 max-w-md">No hay evidencias aprobadas para mostrar.</p>
                      {evidencias.length === 0 && (
                        <div className="mt-4 text-sm text-gray-400">
                          Total de evidencias cargadas: {evidencias.length}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tabla de reportes */
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Historial de Reportes de Desempeño
                  </h2>
                  <p className="text-gray-600">
                    Reportes generados para el seguimiento del progreso de los estudiantes
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
                          Taller
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Generación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resumen
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportesFiltrados.map((reporte) => (
                        <tr key={reporte.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">{reporte.alumno.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{reporte.alumno}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.tallerNombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(reporte.fechaGeneracion)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                            {reporte.resumenSemana}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openReportModal(reporte)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              title="Ver detalles del reporte"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {reportesFiltrados.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <ClipboardList className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes generados</h3>
                      <p className="text-gray-500 max-w-md">No se han generado reportes de desempeño para mostrar.</p>
                      {reportes.length === 0 && (
                        <div className="mt-4 text-sm text-gray-400">Total de reportes: {reportes.length}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
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
                    disabled={!formData.idTaller}
                  >
                    <option value="">Seleccionar alumno</option>
                    {formData.idTaller &&
                      alumnosPorTaller[formData.idTaller]?.map((alumno) => (
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
                    type="text"
                    id="semana"
                    name="semana"
                    value={formData.semana}
                    onChange={handleInputChange}
                    placeholder="Ej: Semana 8"
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
                    onChange={handleInputChange}
                    placeholder="Nombre del profesor"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getEstadoColor(selectedEvidencia.estado)}`}
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

      {/* Modal para ver detalles de reporte */}
      {showReportModal && selectedReporte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                Detalles del Reporte de Desempeño
              </h2>
              <button onClick={closeReportModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Alumno</h3>
                  <p className="text-gray-900 font-medium">{selectedReporte.alumno}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Taller</h3>
                  <p className="text-gray-900">{selectedReporte.tallerNombre}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha de Generación</h3>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(selectedReporte.fechaGeneracion)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen Semanal</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 leading-relaxed">
                      {selectedReporte.resumenSemana || "No hay resumen disponible"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Recomendaciones</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-900 leading-relaxed">
                      {selectedReporte.recomendaciones || "No hay recomendaciones disponibles"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={closeReportModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  onClick={() => {
                    // Crear PDF usando jsPDF
                    const doc = new jsPDF()

                    // Configurar fuente y título
                    doc.setFontSize(20)
                    doc.text("REPORTE DE DESEMPEÑO", 20, 30)

                    // Información del estudiante
                    doc.setFontSize(12)
                    doc.text(`Alumno: ${selectedReporte.alumno}`, 20, 50)
                    doc.text(`Taller: ${selectedReporte.tallerNombre}`, 20, 60)
                    doc.text(`Fecha de Generación: ${formatDate(selectedReporte.fechaGeneracion)}`, 20, 70)

                    // Resumen semanal
                    doc.setFontSize(14)
                    doc.text("RESUMEN SEMANAL:", 20, 90)
                    doc.setFontSize(10)

                    const resumenText = selectedReporte.resumenSemana || "No hay resumen disponible"
                    const resumenLines = doc.splitTextToSize(resumenText, 170)
                    doc.text(resumenLines, 20, 100)

                    // Recomendaciones
                    const yPosition = 100 + resumenLines.length * 5 + 10
                    doc.setFontSize(14)
                    doc.text("RECOMENDACIONES:", 20, yPosition)
                    doc.setFontSize(10)

                    const recomendacionesText = selectedReporte.recomendaciones || "No hay recomendaciones disponibles"
                    const recomendacionesLines = doc.splitTextToSize(recomendacionesText, 170)
                    doc.text(recomendacionesLines, 20, yPosition + 10)

                    // Descargar el PDF
                    const fileName = `Reporte_${selectedReporte.alumno.replace(/\s+/g, "_")}_${formatDate(selectedReporte.fechaGeneracion).replace(/\//g, "-")}.pdf`
                    doc.save(fileName)
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Descargar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
