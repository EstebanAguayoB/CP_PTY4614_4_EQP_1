import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, FileText, Menu, Loader2, X } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"

export default function DashboardCoordinador() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [taller_impartido, setTaller_impartido] = useState([])
  const [profesores, setProfesores] = useState([])
  const [profesoresActivos, setProfesoresActivos] = useState([])
  const [loadingProfesores, setLoadingProfesores] = useState(true)
  const [errorProfesores, setErrorProfesores] = useState(null)
  const [actividadReciente, setActividadReciente] = useState([])
  const [error, setError] = useState(null)
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null)
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [totalTalleres, setTotalTalleres] = useState(0)
  const [totalEvidencias, setTotalEvidencias] = useState(0)
  const [totalReportes, setTotalReportes] = useState(0)
  const [totalProfesoresActivos, setTotalProfesoresActivos] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)
  const navigate = useNavigate()

  // Efecto para cargar el usuario
  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      try {
        const { data, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        if (isMounted) {
          if (data.user) {
            setUser(data.user)
            setIsLoading(false)
          } else {
            navigate("/")
          }
        }
      } catch (err) {
        console.error("Error al obtener usuario:", err)
        if (isMounted) {
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    getUser()
    return () => {
      isMounted = false
    }
  }, [navigate])

  // Efecto para cargar talleres completos
  useEffect(() => {
    const fetchTalleresCompletos = async () => {
      try {
        const { data, error } = await supabase.from("TallerImpartido").select(`
            *,
            Usuario(id_usuario, nombre, apellido),
            TallerDefinido(
              id_taller_definido, 
              nombre, 
              descripcion, 
              niveles_totales, 
              Nivel(numero_nivel, descripcion)
            ),
            ParticipacionEstudiante(
              id_participacion, 
              estado,
              id_estudiante,
              Estudiante(id_estudiante, nombre, apellido)
            )
          `)
        if (error) {
          console.error("Error al cargar talleres:", error)
          setError(error.message)
        } else {
          console.log("Datos de talleres cargados:", data) // Para debug
          setTaller_impartido(data || [])
          setProfesores(data || [])
        }
      } catch (err) {
        console.error("Error en fetchTalleresCompletos:", err)
        setError(err.message)
      }
    }
    fetchTalleresCompletos()
  }, [])

  useEffect(() => {
    const fetchProfesoresActivos = async () => {
      setLoadingProfesores(true)
      try {
        const { data, error } = await supabase.from("TallerImpartido").select(`
          profesor_asignado,
          Usuario (
            id_usuario,
            nombre,
            apellido,
            correo,
            ProfesorDetalle (
              nivel_educativo,
              especialidad
            )
          ),
          TallerDefinido (nombre)
        `)

        if (error) {
          console.error("Error al cargar profesores:", error)
          setErrorProfesores(error)
          setLoadingProfesores(false)
          return
        }

        if (!data) {
          setProfesoresActivos([])
          setLoadingProfesores(false)
          return
        }

        // Agrupar talleres por profesor
        const profesoresMap = {}
        data.forEach((taller) => {
          const profId = taller.profesor_asignado
          if (!profesoresMap[profId] && taller.Usuario) {
            profesoresMap[profId] = {
              id_usuario: taller.Usuario.id_usuario,
              nombre: taller.Usuario.nombre || "N/A",
              apellido: taller.Usuario.apellido || "N/A",
              correo: taller.Usuario.correo || "N/A",
              nivel_educativo: taller.Usuario.ProfesorDetalle?.nivel_educativo || "N/A",
              especialidad: taller.Usuario.ProfesorDetalle?.especialidad || "N/A",
              talleres: [],
            }
          }
          if (taller.TallerDefinido?.nombre && profesoresMap[profId]) {
            profesoresMap[profId].talleres.push(taller.TallerDefinido.nombre)
          }
        })

        // Convertir a array y agregar cantidad de talleres
        const profesoresArray = Object.values(profesoresMap).map((prof) => ({
          ...prof,
          cantidad_talleres: prof.talleres.length,
          nombres_talleres: prof.talleres.join(", ") || "Sin talleres asignados",
        }))

        setProfesoresActivos(profesoresArray)
      } catch (err) {
        console.error("Error en fetchProfesoresActivos:", err)
        setErrorProfesores(err)
      } finally {
        setLoadingProfesores(false)
      }
    }

    fetchProfesoresActivos()
  }, [])

  // Efecto para cargar estadísticas del dashboard
  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoadingStats(true)
      try {
        // Obtener total de talleres impartidos
        const { data: talleresData, error: talleresError } = await supabase
          .from("TallerImpartido")
          .select("id_taller_impartido", { count: "exact" })
          .eq("estado", "activo")

        if (talleresError) throw talleresError
        setTotalTalleres(talleresData?.length || 0)

        // Obtener total de evidencias
        const { data: evidenciasData, error: evidenciasError } = await supabase
          .from("Evidencia")
          .select("id_evidencia", { count: "exact" })

        if (evidenciasError) throw evidenciasError
        setTotalEvidencias(evidenciasData?.length || 0)

        // Obtener total de evidencias
        const { data: reportesData, error: reportesError } = await supabase
          .from("ReporteDesempeno")
          .select("id_reporte", { count: "exact" })

        if (reportesError) throw evidenciasError
        setTotalReportes(reportesData?.length || 0)

        // Obtener profesores activos
        const { data: profesoresData, error: profesoresError } = await supabase
          .from("ProfesorDetalle")
          .select("id_usuario", { count: "exact" })
          .eq("activo", "TRUE")

        if (profesoresError) throw profesoresError
        setTotalProfesoresActivos(profesoresData?.length || 0)
      } catch (err) {
        console.error("Error al cargar estadísticas:", err)
        setError(err.message)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchEstadisticas()
  }, [])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
      setError(err.message)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Efecto para cargar actividad reciente
  useEffect(() => {
    const fetchActividadReciente = async () => {
      try {
        const { data, error } = await supabase
          .from("LogAccion")
          .select(`
            id_log,
            accion,
            fecha_hora,
            detalle,
            Usuario:Usuario(id_usuario, nombre, apellido)
          `)
          .order("fecha_hora", { ascending: false })
          .limit(10)

        if (!error && data) {
          setActividadReciente(
            data.map((a) => ({
              id: a.id_log,
              accion: a.accion || "Acción no especificada",
              tiempo: calcularTiempoTranscurrido(a.fecha_hora),
              usuario: a.Usuario
                ? `${a.Usuario.nombre || ""} ${a.Usuario.apellido || ""}`.trim() || "Usuario desconocido"
                : "Sistema",
            })),
          )
        } else if (error) {
          console.error("Error al cargar actividad reciente:", error)
          setActividadReciente([])
        }
      } catch (err) {
        console.error("Error en fetchActividadReciente:", err)
        setActividadReciente([])
      }
    }
    fetchActividadReciente()
  }, [])

  // Función para mostrar tiempo relativo
  function calcularTiempoTranscurrido(fecha) {
    const ahora = new Date()
    const fechaLog = new Date(fecha)
    const diffMs = ahora - fechaLog
    const minutos = Math.floor(diffMs / 60000)
    if (minutos < 60) return `Hace ${minutos} minutos`
    const horas = Math.floor(minutos / 60)
    if (horas < 24) return `Hace ${horas} horas`
    const dias = Math.floor(horas / 24)
    return `Hace ${dias} días`
  }

  const talleresProcesados = (taller_impartido || []).map((taller) => {
    // Contar alumnos inscritos/en progreso - validar que ParticipacionEstudiante existe
    const participaciones = taller.ParticipacionEstudiante || []
    console.log(`Taller: ${taller.nombre_publico}, Participaciones:`, participaciones) // Debug

    const alumnos = participaciones.filter((p) => p.estado === "INSCRITO" || p.estado === "EN_PROGRESO").length

    console.log(`Taller: ${taller.nombre_publico}, Alumnos contados: ${alumnos}`) // Debug

    // Obtener niveles (array de objetos) - validar que TallerDefinido y Nivel existen
    const tallerDefinido = taller.TallerDefinido || {}
    const nivelesArray = tallerDefinido.Nivel || []
    const niveles =
      nivelesArray.length > 0
        ? nivelesArray
            .sort((a, b) => (a.numero_nivel || 0) - (b.numero_nivel || 0))
            .map((n) => `Nivel ${n.numero_nivel || "N/A"}: ${n.descripcion || "Sin descripción"}`)
            .join(", ")
        : "Sin niveles definidos"

    return {
      ...taller,
      alumnos,
      niveles,
      // Agregar valores por defecto para evitar errores de renderizado
      nombre_publico: taller.nombre_publico || tallerDefinido.nombre || "Taller sin nombre",
      descripcion_publica: taller.descripcion_publica || tallerDefinido.descripcion || "Sin descripción",
      Usuario: taller.Usuario || { nombre: "N/A", apellido: "" },
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-red-600 text-lg font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const handleVerDetalles = (profesor) => {
    setProfesorSeleccionado(profesor)
    setShowDetallesModal(true)
  }

  const handleCerrarModal = () => {
    setShowDetallesModal(false)
    setProfesorSeleccionado(null)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Coordinador" />

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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Coordinador</h1>
              </div>
            </div>
          </div>
        </header>

        <UserInfoBar user={user} onLogout={logout} />

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Talleres Activos</p>
                    <p className="text-3xl font-bold text-gray-900">{loadingStats ? "..." : totalTalleres}</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Evidencias</p>
                    <p className="text-3xl font-bold text-gray-900">{loadingStats ? "..." : totalEvidencias}</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Reportes Generados</p>
                    <p className="text-3xl font-bold text-gray-900">{loadingStats ? "..." : totalReportes}</p>
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
                    <p className="text-3xl font-bold text-gray-900">{loadingStats ? "..." : totalProfesoresActivos}</p>
                    <p className="text-sm text-emerald-600">desde el último periodo</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Talleres */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Talleres Activos</h2>
                </div>
              </div>

              <div className="p-6">
                {talleresProcesados.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay talleres activos en este momento</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {talleresProcesados.map((taller) => (
                      <div
                        key={taller.id_taller_impartido || `taller-${Math.random()}`}
                        className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{taller.nombre_publico}</h3>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Activo</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{taller.descripcion_publica}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Profesor:</span>
                            <span className="text-gray-900">
                              {taller.Usuario?.nombre || "N/A"} {taller.Usuario?.apellido || ""}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Alumnos:</span>
                            <span className="text-gray-900 font-semibold">{taller.alumnos || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Profesores */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Profesores Activos</h2>
              </div>
              <div className="p-6">
                {loadingProfesores ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
                    <span>Cargando profesores...</span>
                  </div>
                ) : errorProfesores ? (
                  <div className="text-center py-8">
                    <div className="text-red-600">Error: {errorProfesores.message}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : profesoresActivos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay profesores activos en este momento</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profesoresActivos.map((prof) => (
                      <div
                        key={prof.id_usuario || `prof-${Math.random()}`}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {prof.nombre} {prof.apellido}
                            </h3>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-700">Email:</span> {prof.correo}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-700">Nivel educativo:</span> {prof.nivel_educativo}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-700">Especialidad:</span> {prof.especialidad}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-700">Cantidad de talleres:</span>{" "}
                            {prof.cantidad_talleres}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-700">Talleres:</span> {prof.nombres_talleres}
                          </div>
                        </div>
                        <button
                          className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
                          onClick={() => handleVerDetalles && handleVerDetalles(prof)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                <p className="text-gray-600">Últimas actividades en el sistema</p>
              </div>

              <div className="p-6">
                {actividadReciente.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay actividad reciente registrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {actividadReciente.map((actividad) => (
                      <div
                        key={actividad.id || `actividad-${Math.random()}`}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
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
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showDetallesModal && profesorSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={handleCerrarModal}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2">{profesorSeleccionado.nombre}</h2>
            <span
              className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold ${profesorSeleccionado.estado === "Activo" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}
            >
              {profesorSeleccionado.estado}
            </span>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email:</span> {profesorSeleccionado.correo}
              </div>
              <div>
                <span className="font-medium">Especialidad:</span> {profesorSeleccionado.especialidad}
              </div>
              <div>
                <span className="font-medium">Nivel educativo:</span> {profesorSeleccionado.nivel_educativo}
              </div>
              <div>
                <span className="font-medium">Talleres:</span> {profesorSeleccionado.talleres || "-"}
              </div>
              <div>
                <span className="font-medium">Alumnos asignados:</span> {profesorSeleccionado.alumnos ?? "-"}
              </div>
              {/* Puedes agregar más información relevante aquí */}
            </div>
            {/* Si tienes más detalles, puedes agregarlos aquí */}
          </div>
        </div>
      )}
    </div>
  )
}
