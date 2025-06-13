import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, FileText, Eye, Menu, Loader2, X } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from '../shared/UserInfoBar'

// Datos estáticos
const PROFESORES = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    talleres: "Taller de React, Taller de Node.js",
    alumnos: 25,
    especialidad: "Desarrollo Web",
  },
  {
    id: 2,
    nombre: "María Gómez",
    email: "maria.gomez@example.com",
    talleres: "Taller de Angular, Taller de PHP",
    alumnos: 30,
    especialidad: "Desarrollo Web",
  },
  {
    id: 3,
    nombre: "Luis Rodríguez",
    email: "luis.rodriguez@example.com",
    talleres: "Taller de Python, Taller de Django",
    alumnos: 20,
    especialidad: "Desarrollo Web",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana.martinez@example.com",
    talleres: "Taller de Java, Taller de Spring",
    alumnos: 28,
    especialidad: "Desarrollo Web",
  },
  {
    id: 5,
    nombre: "Carlos Fernández",
    email: "carlos.fernandez@example.com",
    talleres: "Taller de C#, Taller de .NET",
    alumnos: 22,
    especialidad: "Desarrollo Web",
  },
  {
    id: 6,
    nombre: "Laura López",
    email: "laura.lopez@example.com",
    talleres: "Taller de Swift, Taller de iOS",
    alumnos: 18,
    especialidad: "Desarrollo Móvil",
  },
]

export default function DashboardCoordinador() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [taller_impartido, setTaller_impartido] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [profesoresActivos, setProfesoresActivos] = useState([])
  const [loadingProfesores, setLoadingProfesores] = useState(true)
  const [errorProfesores, setErrorProfesores] = useState(null)
  const [actividadReciente, setActividadReciente] = useState([])
  const [error, setError] = useState(null)
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null)
  const [showDetallesModal, setShowDetallesModal] = useState(false)
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

  // Efecto para cargar talleres
  useEffect(() => {
    const profesores = async () => {
      try {
        let { data, error } = await supabase
          .from("TallerImpartido")
          .select(`
            *,
            Usuario(nombre, apellido),
            TallerDefinido(id_taller_definido, nombre, niveles_totales, Nivel(numero_nivel, descripcion)),
            ParticipacionEstudiante(id_participacion, estado)
          `);;
        if (error) setError(error);
        else setProfesores(data);
      } catch (err) {
        setError(err);
      }
    };
    profesores();
  }, []);

  //efecto para profesores
  // Efecto para cargar talleres
  useEffect(() => {
    const taller_impartido = async () => {
      try {
        let { data, error } = await supabase.from("TallerImpartido").select("*, Usuario(nombre, apellido)");;
        if (error) setError(error);
        else setTaller_impartido(data);
      } catch (err) {
        setError(err);
      }
    };
    taller_impartido();
  }, []);

  useEffect(() => {
    const fetchProfesoresActivos = async () => {
      setLoadingProfesores(true)
      const { data, error } = await supabase
        .from('TallerImpartido')
        .select(`
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
        setErrorProfesores(error)
        setLoadingProfesores(false)
        return
      }

      // Agrupar talleres por profesor
      const profesoresMap = {}
      data.forEach((taller) => {
        const profId = taller.profesor_asignado
        if (!profesoresMap[profId]) {
          profesoresMap[profId] = {
            id_usuario: taller.Usuario?.id_usuario,
            nombre: taller.Usuario?.nombre,
            apellido: taller.Usuario?.apellido,
            correo: taller.Usuario?.correo,
            nivel_educativo: taller.Usuario?.ProfesorDetalle?.nivel_educativo,
            especialidad: taller.Usuario?.ProfesorDetalle?.especialidad,
            talleres: [],
          }
        }
        if (taller.TallerDefinido?.nombre) {
          profesoresMap[profId].talleres.push(taller.TallerDefinido.nombre)
        }
      })

      // Convertir a array y agregar cantidad de talleres
      const profesoresArray = Object.values(profesoresMap).map((prof) => ({
        ...prof,
        cantidad_talleres: prof.talleres.length,
        nombres_talleres: prof.talleres.join(", "),
      }))

      setProfesoresActivos(profesoresArray)
      setLoadingProfesores(false)
    }

    fetchProfesoresActivos()
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

  useEffect(() => {
    const fetchActividadReciente = async () => {
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
        setActividadReciente(data.map(a => ({
          id: a.id_log,
          accion: a.accion,
          tiempo: calcularTiempoTranscurrido(a.fecha_hora),
          usuario: a.Usuario ? `${a.Usuario.nombre} ${a.Usuario.apellido}` : "Sistema"
        })))
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

  const talleresProcesados = taller_impartido.map((taller) => {
    // Contar alumnos inscritos/en progreso
    const alumnos = (taller.ParticipacionEstudiante || []).filter(
      (p) => p.estado === "INSCRITO" || p.estado === "EN_PROGRESO"
    ).length

    // Obtener niveles (array de objetos)
    const nivelesArray = taller.TallerDefinido?.Nivel || []
    const niveles =
      nivelesArray.length > 0
        ? nivelesArray
          .sort((a, b) => a.numero_nivel - b.numero_nivel)
          .map((n) => `Nivel ${n.numero_nivel}: ${n.descripcion}`)
          .join(", ")
        : "-"

    return {
      ...taller,
      alumnos,
      niveles,
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
                    <p className="text-sm font-medium text-gray-600">Total Talleres</p>
                    <p className="text-3xl font-bold text-gray-900">12</p>
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
                    <p className="text-sm font-medium text-gray-600">Avances de Nivel</p>
                    <p className="text-3xl font-bold text-gray-900">245</p>
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
                    <p className="text-sm font-medium text-gray-600">Reportes Pendientes</p>
                    <p className="text-3xl font-bold text-gray-900">8</p>
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
                    <p className="text-3xl font-bold text-gray-900">6</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {talleresProcesados.map((taller) => (
                    <div key={taller.id_taller_impartido} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{taller.nombre_publico}</h3>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Activo</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{taller.descripcion_publica}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Profesor:</span>
                          <span className="text-gray-900">{taller.Usuario?.nombre} {taller.Usuario?.apellido}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Alumnos:</span>
                          <span className="text-gray-900">{taller.alumnos}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección de Profesores */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Profesores Activos</h2>
              </div>
              <div className="p-6">
                {loadingProfesores ? (
                  <div>Cargando...</div>
                ) : errorProfesores ? (
                  <div className="text-red-600">Error: {errorProfesores.message}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profesoresActivos.map((prof) => (
                      <div key={prof.id_usuario} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{prof.nombre} {prof.apellido}</h3>
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
                            <span className="font-medium text-gray-700">Cantidad de talleres:</span> {prof.cantidad_talleres}
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
                <div className="space-y-4">
                  {actividadReciente.map((actividad) => (
                    <div key={actividad.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
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
              </div>
            </div>
          </div>
        </main>
      </div>

      {showDetallesModal && profesorSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={handleCerrarModal}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2">{profesorSeleccionado.nombre}</h2>
            <span className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold ${profesorSeleccionado.estado === "Activo" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}>
              {profesorSeleccionado.estado}
            </span>
            <div className="space-y-2">
              <div><span className="font-medium">Email:</span> {profesorSeleccionado.correo}</div>
              <div><span className="font-medium">Especialidad:</span> {profesorSeleccionado.especialidad}</div>
              <div><span className="font-medium">Nivel educativo:</span> {profesorSeleccionado.nivel_educativo}</div>
              <div><span className="font-medium">Talleres:</span> {profesorSeleccionado.talleres || "-"}</div>
              <div><span className="font-medium">Alumnos asignados:</span> {profesorSeleccionado.alumnos ?? "-"}</div>
              {/* Puedes agregar más información relevante aquí */}
            </div>
            {/* Si tienes más detalles, puedes agregarlos aquí */}
          </div>
        </div>
      )}
    </div>
  )
}
