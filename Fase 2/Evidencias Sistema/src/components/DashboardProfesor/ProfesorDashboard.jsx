import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, FileText, Eye, Menu, X, Award } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardProfeSidebar from "../shared/DashboardProfeSidebar"

export default function DashboardProfesor() {
  const [activeTab, setActiveTab] = useState("miTaller")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [misTalleres, setMisTalleres] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [alumnosDestacados, setAlumnosDestacados] = useState([])
  const [actividadReciente, setActividadReciente] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        await obtenerTalleresProfesor(data.user.email)
      } else {
        navigate("/")
      }
    }
    getUser()
  }, [navigate])

  const obtenerTalleresProfesor = async (email) => {
    try {
      setLoading(true)

      // Primero obtenemos el id del usuario profesor
      const { data: usuario, error: errorUsuario } = await supabase
        .from("Usuario")
        .select("id_usuario")
        .eq("correo", email)
        .eq("rol", "PROFESOR")
        .single()

      if (errorUsuario || !usuario) {
        console.error("Error obteniendo usuario:", errorUsuario)
        return
      }

      // Obtenemos los talleres impartidos por este profesor
      const { data: talleresImpartidos, error: errorTalleres } = await supabase
        .from("TallerImpartido")
        .select(`
          id_taller_impartido,
          nombre_publico,
          descripcion_publica,
          estado,
          TallerDefinido (
            id_taller_definido,
            nombre,
            descripcion,
            objetivos,
            requisitos,
            niveles_totales,
            nivel_minimo,
            edad_minima,
            edad_maxima
          ),
          PeriodoAcademico (
            nombre_periodo,
            fecha_inicio,
            fecha_fin,
            estado
          )
        `)
        .eq("profesor_asignado", usuario.id_usuario)
        .eq("estado", "activo")

      if (errorTalleres) {
        console.error("Error obteniendo talleres:", errorTalleres)
        return
      }

      // Para cada taller, obtenemos información adicional
      const talleresConDetalles = await Promise.all(
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
            .select(`
              id_participacion,
              estado,
              nivel_actual,
              Estudiante (
                id_estudiante,
                nombre,
                apellido,
                estado
              ),
              Nivel (
                numero_nivel,
                descripcion
              )
            `)
            .eq("id_taller_impartido", taller.id_taller_impartido)
            .in("estado", ["INSCRITO", "EN_PROGRESO", "FINALIZADO"])

          // Calcular estadísticas
          const totalAlumnos = participaciones?.length || 0
          const alumnosActivos =
            participaciones?.filter((p) => p.estado === "INSCRITO" || p.estado === "EN_PROGRESO").length || 0

          // Distribución por niveles
          const distribucionNiveles = {
            basico: 0,
            intermedio: 0,
            avanzado: 0,
          }

          participaciones?.forEach((participacion) => {
            if (participacion.Nivel) {
              const numeroNivel = participacion.Nivel.numero_nivel
              if (numeroNivel === 1) distribucionNiveles.basico++
              else if (numeroNivel === 2) distribucionNiveles.intermedio++
              else if (numeroNivel >= 3) distribucionNiveles.avanzado++
            }
          })

          // Calcular progreso promedio (simulado basado en participaciones activas)
          const progreso = totalAlumnos > 0 ? Math.round((alumnosActivos / totalAlumnos) * 100) : 0

          // Formatear fecha de inicio
          const fechaInicio = taller.PeriodoAcademico?.fecha_inicio
            ? new Date(taller.PeriodoAcademico.fecha_inicio).toLocaleDateString("es-ES")
            : "No definida"

          // Calcular duración aproximada
          let duracion = "No definida"
          if (taller.PeriodoAcademico?.fecha_inicio && taller.PeriodoAcademico?.fecha_fin) {
            const inicio = new Date(taller.PeriodoAcademico.fecha_inicio)
            const fin = new Date(taller.PeriodoAcademico.fecha_fin)
            const meses = Math.round((fin - inicio) / (1000 * 60 * 60 * 24 * 30))
            duracion = `${meses} meses`
          }

          // Crear array de niveles disponibles
          const nivelesDisponibles =
            niveles?.map((nivel) => {
              if (nivel.numero_nivel === 1) return "Básico"
              if (nivel.numero_nivel === 2) return "Intermedio"
              return "Avanzado"
            }) || []

          // Objetivos del taller (convertir string a array si es necesario)
          let objetivos = []
          if (taller.TallerDefinido?.objetivos) {
            try {
              objetivos = JSON.parse(taller.TallerDefinido.objetivos)
            } catch {
              objetivos = taller.TallerDefinido.objetivos.split("\n").filter((obj) => obj.trim())
            }
          }

          return {
            id: taller.id_taller_impartido,
            nombre: taller.nombre_publico || taller.TallerDefinido?.nombre || "Sin nombre",
            descripcion: taller.descripcion_publica || taller.TallerDefinido?.descripcion || "Sin descripción",
            niveles: [...new Set(nivelesDisponibles)], // Eliminar duplicados
            totalAlumnos: totalAlumnos,
            estado: taller.estado === "activo" ? "activo" : taller.estado,
            distribucionNiveles: distribucionNiveles,
            progreso: progreso,
            fechaInicio: fechaInicio,
            duracion: duracion,
            horarios: ["Lunes 14:00-16:00", "Miércoles 14:00-16:00"], // Datos simulados
            objetivos:
              objetivos.length > 0
                ? objetivos
                : [
                    "Desarrollar habilidades específicas del taller",
                    "Fomentar el trabajo colaborativo",
                    "Alcanzar los objetivos de aprendizaje",
                    "Preparar para el siguiente nivel",
                  ],
            recursos: ["Materiales especializados", "Equipamiento técnico"], // Datos simulados
            evaluaciones: [
              { nombre: "Evaluación Inicial", fecha: fechaInicio, estado: "Completada" },
              { nombre: "Evaluación Intermedia", fecha: "Pendiente", estado: "Pendiente" },
              { nombre: "Evaluación Final", fecha: "Pendiente", estado: "Pendiente" },
            ],
          }
        }),
      )

      setMisTalleres(talleresConDetalles)

      // Obtener alumnos destacados y actividad reciente
      const [destacados, actividad] = await Promise.all([
        obtenerAlumnosDestacados(email),
        obtenerActividadReciente(email),
      ])

      setAlumnosDestacados(destacados)
      setActividadReciente(actividad)
    } catch (error) {
      console.error("Error obteniendo talleres del profesor:", error)
    } finally {
      setLoading(false)
    }
  }

  const obtenerAlumnosDestacados = async (profesorEmail) => {
    try {
      // Obtener el id del usuario profesor
      const { data: usuario, error: errorUsuario } = await supabase
        .from("Usuario")
        .select("id_usuario")
        .eq("correo", profesorEmail)
        .eq("rol", "PROFESOR")
        .single()

      if (errorUsuario || !usuario) {
        console.error("Error obteniendo usuario:", errorUsuario)
        return []
      }

      // Obtener talleres del profesor
      const { data: talleresProfesor, error: errorTalleres } = await supabase
        .from("TallerImpartido")
        .select("id_taller_impartido, nombre_publico")
        .eq("profesor_asignado", usuario.id_usuario)
        .eq("estado", "activo")

      if (errorTalleres || !talleresProfesor || talleresProfesor.length === 0) {
        return []
      }

      const tallerIds = talleresProfesor.map((t) => t.id_taller_impartido)

      // Obtener participaciones de estudiantes en los talleres del profesor
      const { data: participaciones, error: errorParticipaciones } = await supabase
        .from("ParticipacionEstudiante")
        .select(`
          id_participacion,
          estado,
          nivel_actual,
          id_taller_impartido,
          Estudiante (
            id_estudiante,
            nombre,
            apellido,
            estado
          ),
          Nivel (
            numero_nivel,
            descripcion
          )
        `)
        .in("id_taller_impartido", tallerIds)
        .in("estado", ["EN_PROGRESO", "FINALIZADO"])

      if (errorParticipaciones || !participaciones) {
        return []
      }

      // Obtener evidencias recientes para calcular progreso
      const participacionIds = participaciones.map((p) => p.id_participacion)

      const { data: evidencias, error: errorEvidencias } = await supabase
        .from("Evidencia")
        .select("id_participacion, validada_por_profesor, fecha_envio")
        .in("id_participacion", participacionIds)
        .gte("fecha_envio", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Últimos 30 días

      // Calcular progreso por estudiante
      const estudiantesConProgreso = participaciones.map((participacion) => {
        const evidenciasEstudiante =
          evidencias?.filter((e) => e.id_participacion === participacion.id_participacion) || []
        const evidenciasValidadas = evidenciasEstudiante.filter((e) => e.validada_por_profesor === 1)

        // Calcular progreso basado en evidencias validadas y nivel actual
        let progreso = 0
        if (evidenciasEstudiante.length > 0) {
          progreso = Math.round((evidenciasValidadas.length / evidenciasEstudiante.length) * 100)
          // Ajustar progreso basado en el nivel actual
          if (participacion.Nivel?.numero_nivel === 2) progreso = Math.min(progreso + 10, 100)
          if (participacion.Nivel?.numero_nivel >= 3) progreso = Math.min(progreso + 20, 100)
        }

        const tallerAsociado = talleresProfesor.find((t) => t.id_taller_impartido === participacion.id_taller_impartido)

        let nivelTexto = "Básico"
        if (participacion.Nivel?.numero_nivel === 2) nivelTexto = "Intermedio"
        else if (participacion.Nivel?.numero_nivel >= 3) nivelTexto = "Avanzado"

        return {
          id: participacion.Estudiante.id_estudiante,
          nombre: `${participacion.Estudiante.nombre} ${participacion.Estudiante.apellido}`,
          taller: tallerAsociado?.nombre_publico || "Taller",
          nivel: nivelTexto,
          progreso: progreso,
          evidenciasRecientes: evidenciasEstudiante.length,
        }
      })

      // Filtrar y ordenar por progreso, tomar los top 3
      const alumnosDestacados = estudiantesConProgreso
        .filter((estudiante) => estudiante.progreso >= 70) // Solo estudiantes con buen progreso
        .sort((a, b) => b.progreso - a.progreso)
        .slice(0, 3)

      return alumnosDestacados
    } catch (error) {
      console.error("Error obteniendo alumnos destacados:", error)
      return []
    }
  }

  const obtenerActividadReciente = async (profesorEmail) => {
    try {
      // Obtener el id del usuario profesor
      const { data: usuario, error: errorUsuario } = await supabase
        .from("Usuario")
        .select("id_usuario")
        .eq("correo", profesorEmail)
        .eq("rol", "PROFESOR")
        .single()

      if (errorUsuario || !usuario) {
        return []
      }

      // Obtener talleres del profesor
      const { data: talleresProfesor, error: errorTalleres } = await supabase
        .from("TallerImpartido")
        .select("id_taller_impartido, nombre_publico")
        .eq("profesor_asignado", usuario.id_usuario)
        .eq("estado", "activo")

      if (errorTalleres || !talleresProfesor) {
        return []
      }

      const tallerIds = talleresProfesor.map((t) => t.id_taller_impartido)

      // Obtener logs de acciones relacionadas con el profesor y sus talleres
      const { data: logs, error: errorLogs } = await supabase
        .from("LogAccion")
        .select("*")
        .or(`id_usuario.eq.${usuario.id_usuario},detalle.ilike.%${tallerIds.join("%,detalle.ilike.%")}%`)
        .order("fecha_hora", { ascending: false })
        .limit(5)

      if (errorLogs || !logs) {
        return []
      }

      // Formatear actividades
      const actividades = logs.map((log, index) => {
        const tiempoTranscurrido = calcularTiempoTranscurrido(log.fecha_hora)

        let accionFormateada = log.accion
        const usuario = "Sistema"

        // Personalizar mensaje según el tipo de acción
        if (log.accion.includes("CREATE")) {
          accionFormateada = `Nueva ${log.detalle || "actividad creada"}`
        } else if (log.accion.includes("UPDATE")) {
          accionFormateada = `Actualización: ${log.detalle || "información actualizada"}`
        } else if (log.accion.includes("SEND")) {
          accionFormateada = `Envío: ${log.detalle || "contenido enviado"}`
        } else {
          accionFormateada = log.detalle || log.accion
        }

        // Determinar el taller asociado
        const tallerAsociado = talleresProfesor.find(
          (t) => log.detalle?.includes(t.id_taller_impartido.toString()) || log.detalle?.includes(t.nombre_publico),
        )

        return {
          id: log.id_log,
          accion: accionFormateada,
          tiempo: tiempoTranscurrido,
          usuario: log.id_usuario === usuario.id_usuario ? "Tú" : usuario,
          taller: tallerAsociado?.nombre_publico || "Sistema",
        }
      })

      return actividades
    } catch (error) {
      console.error("Error obteniendo actividad reciente:", error)
      return []
    }
  }

  const calcularTiempoTranscurrido = (fechaHora) => {
    const ahora = new Date()
    const fecha = new Date(fechaHora)
    const diferencia = ahora - fecha

    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (minutos < 60) {
      return `Hace ${minutos} minutos`
    } else if (horas < 24) {
      return `Hace ${horas} horas`
    } else if (dias < 7) {
      return `Hace ${dias} días`
    } else {
      const semanas = Math.floor(dias / 7)
      return `Hace ${semanas} semana${semanas > 1 ? "s" : ""}`
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const totalAlumnos = misTalleres.reduce((sum, taller) => sum + taller.totalAlumnos, 0)
  const talleresActivos = misTalleres.filter((taller) => taller.estado === "activo").length
  const progresoPromedio =
    misTalleres.length > 0
      ? Math.round(misTalleres.reduce((sum, taller) => sum + taller.progreso, 0) / misTalleres.length)
      : 0

  const openDetallesModal = (taller) => {
    setSelectedTaller(taller)
    setShowDetallesModal(true)
  }

  const closeDetallesModal = () => {
    setShowDetallesModal(false)
    setSelectedTaller(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
        <DashboardProfeSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Profesor" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
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
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard del Profesor</h1>
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

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mis Talleres</p>
                    <p className="text-3xl font-bold text-gray-900">{talleresActivos}</p>
                    <p className="text-sm text-emerald-600">Talleres activos</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                    <p className="text-3xl font-bold text-gray-900">{progresoPromedio}%</p>
                    <p className="text-sm text-emerald-600">En todos los talleres</p>
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
                    <p className="text-sm text-orange-600">+2 en la última semana</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
                    <p className="text-3xl font-bold text-gray-900">{totalAlumnos}</p>
                    <p className="text-sm text-emerald-600">En todos los talleres</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navegación de tabs */}
            <div className="mb-8">
              <nav className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <ul className="flex space-x-4">
                  <li>
                    <button
                      onClick={() => setActiveTab("miTaller")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "miTaller"
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Mis Talleres
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("alumnosDestacados")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "alumnosDestacados"
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Alumnos Destacados
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("actividad")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "actividad"
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Actividad Reciente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === "miTaller" && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {misTalleres.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes talleres asignados</h3>
                      <p className="text-gray-600">Contacta al coordinador para que te asigne talleres.</p>
                    </div>
                  ) : (
                    misTalleres.map((taller) => (
                      <div key={taller.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                          <h2 className="text-xl font-semibold text-gray-900">Taller de {taller.nombre}</h2>
                          <p className="text-gray-600">{taller.descripcion}</p>
                        </div>

                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                          <div className="space-y-4">
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
                              <span className="text-gray-600">Alumnos:</span>
                              <span className="text-gray-900 font-medium">{taller.totalAlumnos}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Estado:</span>
                              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                                {taller.estado}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-900 mb-3">Progreso General</h4>
                            <div className="flex items-center mb-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${taller.progreso}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900 font-medium">{taller.progreso}%</span>
                            </div>
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={() => openDetallesModal(taller)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles Completos
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "alumnosDestacados" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Alumnos Destacados</h2>
                      <p className="text-gray-600">Alumnos con mayor progreso en los últimos 30 días</p>
                    </div>
                    <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors">
                      Ver Todos los Alumnos
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumnosDestacados.map((alumno) => (
                      <div key={alumno.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {alumno.nombre.charAt(0)}
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {alumno.nivel}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{alumno.nombre}</h3>
                        <p className="text-sm text-gray-600 mb-2">Taller: {alumno.taller}</p>
                        <p className="text-sm text-gray-600 mb-4">Nivel {alumno.nivel}</p>

                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${alumno.progreso}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">{alumno.progreso}%</span>
                        </div>
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
                  <p className="text-gray-600">Últimas actividades en tus talleres</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {actividadReciente.map((actividad) => (
                      <div key={actividad.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{actividad.accion}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>
                              {actividad.tiempo} por {actividad.usuario}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {actividad.taller}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Detalles Completos */}
      {showDetallesModal && selectedTaller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Detalles Completos - {selectedTaller.nombre}</h2>
              <button onClick={closeDetallesModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información General */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                    Información General
                  </h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Descripción:</span>
                      <p className="text-gray-900">{selectedTaller.descripcion}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Fecha de Inicio:</span>
                      <p className="text-gray-900">{selectedTaller.fechaInicio}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Duración:</span>
                      <p className="text-gray-900">{selectedTaller.duracion}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total de Alumnos:</span>
                      <p className="text-gray-900 font-semibold">{selectedTaller.totalAlumnos}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Progreso General:</span>
                      <div className="flex items-center mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${selectedTaller.progreso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedTaller.progreso}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Objetivos del Taller */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center mt-6">
                    <Award className="w-5 h-5 mr-2 text-emerald-600" />
                    Objetivos del Taller
                  </h3>
                  <div className="space-y-2 mb-6">
                    {selectedTaller.objetivos.map((objetivo, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{objetivo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribución por Niveles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Niveles</h3>
                  <div className="space-y-3">
                    {selectedTaller.distribucionNiveles.basico > 0 && (
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-gray-900">Básico</span>
                        <span className="text-blue-600 font-bold">
                          {selectedTaller.distribucionNiveles.basico} alumnos
                        </span>
                      </div>
                    )}
                    {selectedTaller.distribucionNiveles.intermedio > 0 && (
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium text-gray-900">Intermedio</span>
                        <span className="text-yellow-600 font-bold">
                          {selectedTaller.distribucionNiveles.intermedio} alumnos
                        </span>
                      </div>
                    )}
                    {selectedTaller.distribucionNiveles.avanzado > 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-900">Avanzado</span>
                        <span className="text-green-600 font-bold">
                          {selectedTaller.distribucionNiveles.avanzado} alumnos
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeDetallesModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}