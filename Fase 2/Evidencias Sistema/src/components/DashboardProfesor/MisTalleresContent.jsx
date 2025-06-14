import { useState, useEffect } from "react"
import { BookOpen, Users, Upload, Menu, FileText, X, Check, Package, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"
import jsPDF from "jspdf"

export default function MisTalleresContent() {
  const [activeTab, setActiveTab] = useState("activos")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showEvidenciaModal, setShowEvidenciaModal] = useState(false)
  const [showReporteModal, setShowReporteModal] = useState(false)
  const [showAlumnosModal, setShowAlumnosModal] = useState(false)
  const [showSolicitudRecursosModal, setShowSolicitudRecursosModal] = useState(false)
  const [showSolicitudActividadModal, setShowSolicitudActividadModal] = useState(false)
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [evidenciaText, setEvidenciaText] = useState("")
  const [reporteGenerado, setReporteGenerado] = useState(false)
  const [misTalleres, setMisTalleres] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Estados para solicitud de recursos
  const [solicitudRecursos, setSolicitudRecursos] = useState({
    taller: "",
    material: "",
    motivos: "",
  })

  // Estados para solicitud de actividad
  const [solicitudActividad, setSolicitudActividad] = useState({
    taller: "",
    actividad: "",
    motivos: "",
  })

  const [formData, setFormData] = useState({
    idTaller: "",
    alumno: "",
    semana: "",
    descripcion: "",
    archivoUrl: "",
    fecha: new Date().toISOString().split("T")[0],
    validadoPor: user?.email || "",
    observaciones: "",
  })

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        await fetchMisTalleres(data.user.email)
      } else {
        navigate("/")
      }
    }
    getUser()
  }, [navigate])

  const fetchMisTalleres = async (userEmail) => {
    try {
      setLoading(true)

      // Primero obtenemos el id_usuario del profesor logueado
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("Usuario")
        .select("id_usuario")
        .eq("correo", userEmail)
        .eq("rol", "PROFESOR")
        .single()

      if (usuarioError) {
        console.error("Error fetching usuario:", usuarioError)
        return
      }

      const profesorId = usuarioData.id_usuario

      // Obtenemos los talleres impartidos por este profesor
      const { data: talleresImpartidos, error: talleresError } = await supabase
        .from("TallerImpartido")
        .select(`id_taller_impartido,nombre_publico,descripcion_publica,estado,
          TallerDefinido (id_taller_definido,nombre,descripcion,objetivos,requisitos,niveles_totales,nivel_minimo,edad_minima,edad_maxima )`)
        .eq("profesor_asignado", profesorId)

      if (talleresError) {
        console.error("Error fetching talleres impartidos:", talleresError)
        return
      }

      // Para cada taller, obtenemos información adicional
      const talleresConInfo = await Promise.all(
        talleresImpartidos.map(async (taller) => {
          // Obtener niveles del taller
          const { data: niveles } = await supabase
            .from("Nivel")
            .select("*")
            .eq("id_taller_definido", taller.TallerDefinido.id_taller_definido)
            .order("numero_nivel")

          // Obtener participaciones de estudiantes
          const { data: participaciones } = await supabase
            .from("ParticipacionEstudiante")
            .select(`id_participacion,estado,nivel_actual,
              Estudiante (id_estudiante,nombre,apellido,correo_apoderado),
              Nivel (numero_nivel,descripcion)`)
            .eq("id_taller_impartido", taller.id_taller_impartido)

          // Obtener evidencias pendientes
          const { data: evidenciasPendientes } = await supabase
            .from("Evidencia")
            .select("id_evidencia")
            .in("id_participacion", participaciones?.map((p) => p.id_participacion) || [])
            .eq("validada_por_profesor", 0)

          // Procesar alumnos
          const alumnos =
            participaciones?.map((participacion) => {
              const estudiante = participacion.Estudiante
              const nivelActual = participacion.Nivel

              // Calcular progreso basado en el nivel actual vs niveles totales
              const progresoCalculado = nivelActual
                ? Math.round((nivelActual.numero_nivel / taller.TallerDefinido.niveles_totales) * 100)
                : 0

              return {
                id: estudiante.id_estudiante,
                nombre: `${estudiante.nombre} ${estudiante.apellido}`,
                nivel: getNivelLabel(nivelActual?.numero_nivel || 1),
                progreso: progresoCalculado,
                email: estudiante.correo_apoderado,
              }
            }) || []

          // Calcular distribución por niveles
          const distribucionNiveles = {
            basico: alumnos.filter((a) => a.nivel === "Básico").length,
            intermedio: alumnos.filter((a) => a.nivel === "Intermedio").length,
            avanzado: alumnos.filter((a) => a.nivel === "Avanzado").length,
          }

          // Calcular progreso promedio del taller
          const progresoPromedio =
            alumnos.length > 0
              ? Math.round(alumnos.reduce((sum, alumno) => sum + alumno.progreso, 0) / alumnos.length)
              : 0

          return {
            id: taller.id_taller_impartido,
            nombre: taller.nombre_publico || taller.TallerDefinido.nombre,
            descripcion: taller.descripcion_publica || taller.TallerDefinido.descripcion,
            niveles: getNivelesLabels(taller.TallerDefinido.niveles_totales),
            totalAlumnos: alumnos.length,
            evidenciasPendientes: evidenciasPendientes?.length || 0,
            estado: taller.estado === "activo" ? "activo" : "inactivo",
            distribucionNiveles,
            progreso: progresoPromedio,
            proximasActividades: [], // Esto se puede implementar más adelante
            alumnos,
          }
        }),
      )

      setMisTalleres(talleresConInfo)
    } catch (error) {
      console.error("Error fetching mis talleres:", error)
    } finally {
      setLoading(false)
    }
  }

  // Función auxiliar para obtener etiquetas de niveles
  const getNivelLabel = (numeroNivel) => {
    if (numeroNivel === 1) return "Básico"
    if (numeroNivel === 2) return "Intermedio"
    return "Avanzado"
  }

  // Función auxiliar para obtener array de niveles
  const getNivelesLabels = (nivelesTotal) => {
    const labels = []
    if (nivelesTotal >= 1) labels.push("Básico")
    if (nivelesTotal >= 2) labels.push("Intermedio")
    if (nivelesTotal >= 3) labels.push("Avanzado")
    return labels
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const openAlumnosModal = (taller) => {
    setSelectedTaller(taller)
    setShowAlumnosModal(true)
  }

  const closeAlumnosModal = () => {
    setShowAlumnosModal(false)
    setSelectedTaller(null)
  }

  const openEvidenciaModal = (taller) => {
    setSelectedTaller(taller)
    setShowEvidenciaModal(true)
  }

  const closeEvidenciaModal = () => {
    setShowEvidenciaModal(false)
    setSelectedTaller(null)
    setSelectedAlumno(null)
    setEvidenciaText("")
  }

  const openReporteModal = (taller) => {
    setSelectedTaller(taller)
    setShowReporteModal(true)
    setReporteGenerado(false)
  }

  const closeReporteModal = () => {
    setShowReporteModal(false)
    setSelectedTaller(null)
    setReporteGenerado(false)
  }

  // Funciones para solicitud de recursos
  const openSolicitudRecursosModal = () => {
    setShowSolicitudRecursosModal(true)
    setSolicitudRecursos({ taller: "", material: "", motivos: "" })
  }

  const closeSolicitudRecursosModal = () => {
    setShowSolicitudRecursosModal(false)
    setSolicitudRecursos({ taller: "", material: "", motivos: "" })
  }

  const openSolicitudActividadModal = () => {
    setShowSolicitudActividadModal(true)
  }

  const closeSolicitudActividadModal = () => {
    setShowSolicitudActividadModal(false)
    setSolicitudActividad({ taller: "", actividad: "", motivos: "" })
  }

  const handleSolicitudRecursosChange = (field, value) => {
    setSolicitudRecursos((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSolicitudActividadChange = (field, value) => {
    setSolicitudActividad((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generarPDFSolicitudRecursos = () => {
    const doc = new jsPDF()
    const tallerSeleccionado = misTalleres.find((t) => t.id.toString() === solicitudRecursos.taller)

    // Configuración del documento
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)

    // Título
    doc.text("SOLICITUD DE RECURSOS", 105, 30, { align: "center" })

    // Línea decorativa
    doc.setLineWidth(0.5)
    doc.setDrawColor(34, 197, 94) // Color emerald
    doc.line(20, 40, 190, 40)

    // Información del profesor
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("INFORMACIÓN DEL SOLICITANTE", 20, 55)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    doc.text(`Profesor: ${user?.email || "No especificado"}`, 20, 70)
    doc.text(`Fecha de solicitud: ${new Date().toLocaleDateString("es-ES")}`, 20, 80)

    // Información del taller
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("TALLER ASOCIADO", 20, 100)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    doc.text(`Nombre del taller: ${tallerSeleccionado?.nombre || "No especificado"}`, 20, 115)
    doc.text(`Descripción: ${tallerSeleccionado?.descripcion || "No especificado"}`, 20, 125)

    // Material solicitado
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("MATERIAL SOLICITADO", 20, 145)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    const materialLines = doc.splitTextToSize(solicitudRecursos.material, 170)
    doc.text(materialLines, 20, 160)

    // Motivos
    const motivosY = 160 + materialLines.length * 7 + 15
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("MOTIVOS DE LA SOLICITUD", 20, motivosY)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    const motivosLines = doc.splitTextToSize(solicitudRecursos.motivos, 170)
    doc.text(motivosLines, 20, motivosY + 15)

    // Firma
    const firmaY = motivosY + 15 + motivosLines.length * 7 + 30
    doc.setLineWidth(0.3)
    doc.setDrawColor(120, 120, 120)
    doc.line(20, firmaY, 80, firmaY)
    doc.text("Firma del Profesor", 20, firmaY + 10)

    // Pie de página
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text("Este documento fue generado automáticamente por el sistema de gestión de talleres", 105, 280, {
      align: "center",
    })

    // Descargar el PDF
    doc.save(
      `Solicitud_Recursos_${tallerSeleccionado?.nombre || "Taller"}_${new Date().toISOString().split("T")[0]}.pdf`,
    )

    // Cerrar modal y mostrar mensaje
    closeSolicitudRecursosModal()
    alert("Solicitud de recursos generada y descargada exitosamente")
  }

  const generarPDFSolicitudActividad = () => {
    const doc = new jsPDF()
    const tallerSeleccionado = misTalleres.find((t) => t.id.toString() === solicitudActividad.taller)

    // Configuración del documento
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)

    // Título
    doc.text("SOLICITUD DE ACTIVIDAD", 105, 30, { align: "center" })

    // Línea decorativa
    doc.setLineWidth(0.5)
    doc.setDrawColor(34, 197, 94) // Color emerald
    doc.line(20, 40, 190, 40)

    // Información del profesor
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("INFORMACIÓN DEL SOLICITANTE", 20, 55)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    doc.text(`Profesor: ${user?.email || "No especificado"}`, 20, 70)
    doc.text(`Fecha de solicitud: ${new Date().toLocaleDateString("es-ES")}`, 20, 80)

    // Información del taller
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("TALLER ASOCIADO", 20, 100)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    doc.text(`Nombre del taller: ${tallerSeleccionado?.nombre || "No especificado"}`, 20, 115)
    doc.text(`Descripción: ${tallerSeleccionado?.descripcion || "No especificado"}`, 20, 125)

    // Actividad solicitada
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("ACTIVIDAD A REALIZAR", 20, 145)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    const actividadLines = doc.splitTextToSize(solicitudActividad.actividad, 170)
    doc.text(actividadLines, 20, 160)

    // Motivos
    const motivosY = 160 + actividadLines.length * 7 + 15
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("MOTIVOS DE LA SOLICITUD", 20, motivosY)

    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    const motivosLines = doc.splitTextToSize(solicitudActividad.motivos, 170)
    doc.text(motivosLines, 20, motivosY + 15)

    // Firma
    const firmaY = motivosY + 15 + motivosLines.length * 7 + 30
    doc.setLineWidth(0.3)
    doc.setDrawColor(120, 120, 120)
    doc.line(20, firmaY, 80, firmaY)
    doc.text("Firma del Profesor", 20, firmaY + 10)

    // Pie de página
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text("Este documento fue generado automáticamente por el sistema de gestión de talleres", 105, 280, {
      align: "center",
    })

    // Descargar el PDF
    doc.save(
      `Solicitud_Actividad_${tallerSeleccionado?.nombre || "Taller"}_${new Date().toISOString().split("T")[0]}.pdf`,
    )

    // Cerrar modal y mostrar mensaje
    closeSolicitudActividadModal()
    alert("Solicitud de actividad generada y descargada exitosamente")
  }

  const handleSubmitSolicitudRecursos = () => {
    // Validaciones
    if (!solicitudRecursos.taller) {
      alert("Por favor seleccione un taller")
      return
    }
    if (!solicitudRecursos.material.trim()) {
      alert("Por favor especifique el material solicitado")
      return
    }
    if (!solicitudRecursos.motivos.trim()) {
      alert("Por favor especifique los motivos de la solicitud")
      return
    }

    // Generar PDF
    generarPDFSolicitudRecursos()
  }

  const handleSubmitSolicitudActividad = () => {
    // Validaciones
    if (!solicitudActividad.taller) {
      alert("Por favor seleccione un taller")
      return
    }
    if (!solicitudActividad.actividad.trim()) {
      alert("Por favor especifique la actividad a realizar")
      return
    }
    if (solicitudActividad.actividad.length > 50) {
      alert("La actividad no puede exceder 50 caracteres")
      return
    }
    if (!solicitudActividad.motivos.trim()) {
      alert("Por favor especifique los motivos de la solicitud")
      return
    }

    // Generar PDF
    generarPDFSolicitudActividad()
  }

  const handleSubmitEvidencia = async () => {
    try {
      const urlEvidencia = document.getElementById("urlEvidencia").value

      // Validar que la URL esté presente
      if (!urlEvidencia.trim()) {
        alert("La URL de evidencia es obligatoria")
        return
      }

      // Obtener la participación del alumno seleccionado
      const { data: participacion } = await supabase
        .from("ParticipacionEstudiante")
        .select("id_participacion")
        .eq("id_estudiante", selectedAlumno.id)
        .eq("id_taller_impartido", selectedTaller.id)
        .single()

      // Get the selected week from the form
      const selectedWeek = document.getElementById("semana").value

      if (participacion) {
        // Insertar la evidencia
        const { error } = await supabase.from("Evidencia").insert({
          id_participacion: participacion.id_participacion,
          semana: Number.parseInt(selectedWeek),
          descripcion: evidenciaText,
          url_evidencia: urlEvidencia, // Agregar la URL de evidencia
          fecha_envio: new Date().toISOString(),
          validada_por_profesor: 1,
          observaciones: `Evidencia registrada por el profesor para ${selectedAlumno.nombre}`,
        })

        if (error) {
          console.error("Error guardando evidencia:", error)
          alert("Error al guardar la evidencia")
        } else {
          alert(`Evidencia guardada con éxito para ${selectedAlumno.nombre}`)
          // Refrescar los datos
          await fetchMisTalleres(user.email)
          closeEvidenciaModal()
        }
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar la evidencia")
    }
  }

  const handleGenerarReporte = () => {
    // Aquí iría la lógica para generar el reporte
    console.log("Generando reporte para el taller:", selectedTaller.nombre)

    // Simulamos que el reporte se ha generado después de 1 segundo
    setTimeout(() => {
      setReporteGenerado(true)
    }, 1000)
  }

  const handleDescargarReporte = () => {
    // Aquí iría la lógica para descargar el reporte
    console.log("Descargando reporte para el taller:", selectedTaller.nombre)
    alert(`Reporte de ${selectedTaller.nombre} descargado con éxito`)
    closeReporteModal()
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
        <DashboardProfeSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Profesor" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando talleres...</p>
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
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Talleres</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* User avatar removed from header */}
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
            <div className="flex flex-col space-y-2">
              <button
                onClick={logout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-3 rounded-lg flex items-center transition-colors text-sm"
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

              {/* Botones de solicitud */}
              <div className="flex space-x-2">
                <button
                  onClick={openSolicitudRecursosModal}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium py-2 px-3 rounded-lg flex items-center transition-colors text-sm"
                >
                  <Package className="h-4 w-4 mr-1" />
                  Solicitud recursos
                </button>
                <button
                  onClick={openSolicitudActividadModal}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium py-2 px-3 rounded-lg flex items-center transition-colors text-sm"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Solicitud Actividad
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Contenido basado en la pestaña activa */}
            {activeTab === "activos" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {misTalleres
                  .filter((taller) => taller.estado === "activo")
                  .map((taller) => (
                    <div key={taller.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <h2 className="text-xl font-semibold text-gray-900">{taller.nombre}</h2>
                        <p className="text-gray-600">{taller.descripcion}</p>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Información General */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Niveles:</span>
                                <div className="flex flex-wrap gap-1">
                                  {taller.niveles.map((nivel) => (
                                    <span
                                      key={nivel}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      {nivel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Alumnos:</span>
                                <span className="text-gray-900 font-medium">{taller.totalAlumnos}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Evidencias Pendientes:</span>
                                <span className="text-orange-600 font-medium">{taller.evidenciasPendientes}</span>
                              </div>
                            </div>
                          </div>

                          {/* Progreso */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso</h3>
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${taller.progreso}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 ml-2">{taller.progreso}%</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => openAlumnosModal(taller)}
                                className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Alumnos
                              </button>
                              <button
                                onClick={() => openEvidenciaModal(taller)}
                                className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                <Upload className="w-4 h-4 mr-1" />
                                Evidencias
                              </button>
                              <button
                                onClick={() => openReporteModal(taller)}
                                className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Reporte
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === "inactivos" && (
              <>
                {misTalleres.filter((taller) => taller.estado === "inactivo").length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {misTalleres
                      .filter((taller) => taller.estado === "inactivo")
                      .map((taller) => (
                        <div key={taller.id} className="bg-white rounded-xl shadow-md overflow-hidden opacity-75">
                          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-xl font-semibold text-gray-900">{taller.nombre}</h2>
                                <p className="text-gray-600">{taller.descripcion}</p>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactivo</span>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Alumnos:</span>
                                    <span className="text-gray-900 font-medium">{taller.totalAlumnos}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Último Progreso:</span>
                                    <span className="text-gray-600">{taller.progreso}%</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                  Reactivar Taller
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes talleres inactivos</h3>
                      <p className="text-gray-500 max-w-md">
                        Actualmente no tienes ningún taller en estado inactivo. Todos tus talleres están en
                        funcionamiento.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal para ver alumnos */}
      {showAlumnosModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Alumnos - {selectedTaller.nombre}</h2>
              <button onClick={closeAlumnosModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <p className="text-gray-600">
                  Total de alumnos: <span className="font-medium text-gray-900">{selectedTaller.alumnos.length}</span>
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
                        Email Apoderado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progreso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTaller.alumnos.map((alumno) => (
                      <tr key={alumno.id} className="hover:bg-gray-50">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{alumno.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              alumno.nivel === "Avanzado"
                                ? "bg-green-100 text-green-800"
                                : alumno.nivel === "Intermedio"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alumno.nivel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${alumno.progreso}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{alumno.progreso}%</span>
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
      )}

      {/* Modal para subir evidencias */}
      {showEvidenciaModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Subir Evidencia - {selectedTaller.nombre}</h2>
              <button onClick={closeEvidenciaModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="alumno" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Alumno
                </label>
                <select
                  id="alumno"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={selectedAlumno ? selectedAlumno.id : ""}
                  onChange={(e) => {
                    const alumnoId = Number.parseInt(e.target.value)
                    const alumno = selectedTaller.alumnos.find((a) => a.id === alumnoId)
                    setSelectedAlumno(alumno)
                  }}
                >
                  <option value="">Seleccione un alumno</option>
                  {selectedTaller.alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre} - {alumno.nivel}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAlumno && (
                <>
                  <div className="mb-6">
                    <label htmlFor="semana" className="block text-sm font-medium text-gray-700 mb-2">
                      Semana *
                    </label>
                    <select
                      id="semana"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="">Seleccionar semana</option>
                      {[...Array(16)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Semana {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="evidencia" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción de la Evidencia
                    </label>
                    <textarea
                      id="evidencia"
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Describa los avances y logros del alumno..."
                      value={evidenciaText}
                      onChange={(e) => setEvidenciaText(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="urlEvidencia" className="block text-sm font-medium text-gray-700 mb-2">
                      Adjuntar url evidencia (Obligatorio) *
                    </label>
                    <input
                      id="urlEvidencia"
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://ejemplo.com/evidencia"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeEvidenciaModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmitEvidencia}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                      disabled={!evidenciaText.trim() || !document.getElementById("urlEvidencia")?.value?.trim()}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Guardar Evidencia
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para generar reporte */}
      {showReporteModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Generar Reporte - {selectedTaller.nombre}</h2>
              <button onClick={closeReporteModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {!reporteGenerado ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Opciones del Reporte</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="completo"
                          name="tipo-reporte"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          defaultChecked
                        />
                        <label htmlFor="completo" className="ml-3 block text-sm font-medium text-gray-700">
                          Reporte completo del taller
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="alumnos"
                          name="tipo-reporte"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="alumnos" className="ml-3 block text-sm font-medium text-gray-700">
                          Solo alumnos y progreso
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="evidencias"
                          name="tipo-reporte"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="evidencias" className="ml-3 block text-sm font-medium text-gray-700">
                          Solo evidencias recientes
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Formato</h3>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="pdf"
                          name="formato"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          defaultChecked
                        />
                        <label htmlFor="pdf" className="ml-2 block text-sm font-medium text-gray-700">
                          PDF
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="excel"
                          name="formato"
                          type="radio"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="excel" className="ml-2 block text-sm font-medium text-gray-700">
                          Excel
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeReporteModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGenerarReporte}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generar Reporte
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¡Reporte generado con éxito!</h3>
                  <p className="text-gray-600 mb-6">
                    El reporte para el taller {selectedTaller.nombre} ha sido generado correctamente.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={closeReporteModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={handleDescargarReporte}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Descargar Reporte
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para solicitud de recursos */}
      {showSolicitudRecursosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Solicitud de Recursos</h2>
              <button onClick={closeSolicitudRecursosModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="profesorSolicitante" className="block text-sm font-medium text-gray-700 mb-2">
                  Profesor Solicitante
                </label>
                <input
                  id="profesorSolicitante"
                  type="text"
                  value={user?.email || ""}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="tallerSolicitud" className="block text-sm font-medium text-gray-700 mb-2">
                  Taller *
                </label>
                <select
                  id="tallerSolicitud"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={solicitudRecursos.taller}
                  onChange={(e) => handleSolicitudRecursosChange("taller", e.target.value)}
                  required
                >
                  <option value="">Seleccione un taller</option>
                  {misTalleres
                    .filter((t) => t.estado === "activo")
                    .map((taller) => (
                      <option key={taller.id} value={taller.id}>
                        {taller.nombre}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="materialSolicitado" className="block text-sm font-medium text-gray-700 mb-2">
                  Material Solicitado *
                </label>
                <textarea
                  id="materialSolicitado"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describa detalladamente el material que necesita..."
                  value={solicitudRecursos.material}
                  onChange={(e) => handleSolicitudRecursosChange("material", e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="motivosSolicitud" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivos de la Solicitud *
                </label>
                <textarea
                  id="motivosSolicitud"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Explique por qué necesita estos recursos..."
                  value={solicitudRecursos.motivos}
                  onChange={(e) => handleSolicitudRecursosChange("motivos", e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeSolicitudRecursosModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitSolicitudRecursos}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Generar Solicitud PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para solicitud de actividad */}
      {showSolicitudActividadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Solicitud de Actividad</h2>
              <button onClick={closeSolicitudActividadModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="profesorSolicitanteActividad" className="block text-sm font-medium text-gray-700 mb-2">
                  Profesor Solicitante
                </label>
                <input
                  id="profesorSolicitanteActividad"
                  type="text"
                  value={user?.email || ""}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="tallerSolicitudActividad" className="block text-sm font-medium text-gray-700 mb-2">
                  Taller *
                </label>
                <select
                  id="tallerSolicitudActividad"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={solicitudActividad.taller}
                  onChange={(e) => handleSolicitudActividadChange("taller", e.target.value)}
                  required
                >
                  <option value="">Seleccione un taller</option>
                  {misTalleres
                    .filter((t) => t.estado === "activo")
                    .map((taller) => (
                      <option key={taller.id} value={taller.id}>
                        {taller.nombre}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="actividadRealizar" className="block text-sm font-medium text-gray-700 mb-2">
                  Actividad a realizar * (máximo 50 caracteres)
                </label>
                <input
                  id="actividadRealizar"
                  type="text"
                  maxLength={50}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describa brevemente la actividad..."
                  value={solicitudActividad.actividad}
                  onChange={(e) => handleSolicitudActividadChange("actividad", e.target.value)}
                  required
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {solicitudActividad.actividad.length}/50 caracteres
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="motivosSolicitudActividad" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivos de la Solicitud *
                </label>
                <textarea
                  id="motivosSolicitudActividad"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Explique por qué necesita realizar esta actividad..."
                  value={solicitudActividad.motivos}
                  onChange={(e) => handleSolicitudActividadChange("motivos", e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeSolicitudActividadModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitSolicitudActividad}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Generar Solicitud PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

