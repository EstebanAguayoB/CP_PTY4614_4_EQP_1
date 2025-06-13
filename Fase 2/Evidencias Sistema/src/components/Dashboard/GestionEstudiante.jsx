import { useState, useEffect } from "react"
import { Search, UserPlus, Edit, ArrowLeft, Menu, GraduationCap, Trash2, Loader2 } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"
import { registrarAccion } from "../../utils/logAccion"

// Componente de Loading Animation
const LoadingSpinner = ({ message = "Cargando información..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
        <div className="absolute inset-0 h-8 w-8 border-2 border-emerald-200 rounded-full animate-pulse"></div>
      </div>
      <p className="text-gray-600 text-sm font-medium">{message}</p>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    </div>
  )
}

export default function GestionEstudiante() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    correo_apoderado: "",
  })

  // Estados para edición
  const [editingStudent, setEditingStudent] = useState(null)
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    correo_apoderado: "",
  })

  // Estados para carga y datos
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  // Añadir useEffect para obtener el usuario
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
      else navigate("/")
    }
    getUser()
  }, [navigate])

  useEffect(() => {
    const getUsuarioDb = async () => {
      if (user && user.id) {
        const { data: usuarioDb } = await supabase
          .from("Usuario")
          .select("id_usuario")
          .eq("uid", user.id)
          .single()
        if (usuarioDb) {
          setUser((prev) => ({ ...prev, id_usuario: usuarioDb.id_usuario }))
        }
      }
    }
    getUsuarioDb()
  }, [user])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const fetchAlumnos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("Estudiante").select(`
          id_estudiante,
          nombre,
          apellido,
          correo_apoderado,
          estado,
          ParticipacionEstudiante:ParticipacionEstudiante(
            id_taller_impartido,
            nivel_actual,
            estado,
            TallerImpartido(
              nombre_publico
            ),
            Nivel(
              numero_nivel
            )
          )
        `)
      if (error) {
        setError(error.message)
      } else {
        setAlumnos(data || [])
        setError(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlumnos()
  }, [])

  console.log("alumnos:", alumnos)
  console.log("Error:", error)

  // Procesa los datos para la tabla
  const alumnosProcesados = alumnos.map((alumno) => {
    // Toma la primera participación activa o la más reciente
    const participacion =
      alumno.ParticipacionEstudiante?.find((p) => p.estado === "EN_PROGRESO" || p.estado === "INSCRITO") ||
      alumno.ParticipacionEstudiante?.[0]
    return {
      ...alumno,
      taller: participacion?.TallerImpartido?.nombre_publico || "No asignado",
      nivel: participacion?.Nivel?.numero_nivel ? `Nivel ${participacion.Nivel.numero_nivel}` : "No asignado",
      estado: participacion?.estado || "No asignado",
      progreso: Math.floor(Math.random() * 100), // Progreso simulado
    }
  })

  const filteredAlumnos = alumnosProcesados.filter(
    (alumno) =>
      alumno.nombre?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      alumno.apellido?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      alumno.taller?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  )

  // Funciones de edición
  const handleEditStudent = (alumno) => {
    setEditingStudent(alumno.id_estudiante)
    setEditForm({
      nombre: alumno.nombre || "",
      apellido: alumno.apellido || "",
      correo_apoderado: alumno.correo_apoderado || "",
    })
  }

  const handleSaveEdit = async () => {
    try {
      setSubmitting(true)
      const { error } = await supabase.from("Estudiante").update(editForm).eq("id_estudiante", editingStudent)
      if (!error) {
        // REGISTRO EN LOGACCION
        await registrarAccion({
          id_usuario: user.id_usuario,
          accion: "Editar Estudiante",
          detalle: `Se editó el estudiante ID ${editingStudent}`,
        })
        await fetchAlumnos()
        setEditingStudent(null)
      } else {
        console.error("Error updating student:", error)
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingStudent(null)
    setEditForm({
      nombre: "",
      apellido: "",
      correo_apoderado: "",
    })
  }

  // Función para eliminar estudiante
  const handleDeleteStudent = async (studentId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este estudiante? Esta acción eliminará también sus participaciones y no se puede deshacer.",
      )
    ) {
      try {
        setSubmitting(true)
        const { error: errorParticipaciones } = await supabase
          .from("ParticipacionEstudiante")
          .delete()
          .eq("id_estudiante", studentId)
        if (errorParticipaciones) {
          console.error("Error deleting participations:", errorParticipaciones)
          return
        }
        const { error: errorEstudiante } = await supabase.from("Estudiante").delete().eq("id_estudiante", studentId)
        if (errorEstudiante) {
          console.error("Error deleting student:", errorEstudiante)
          return
        }
        // REGISTRO EN LOGACCION
        await registrarAccion({
          id_usuario: user.id_usuario,
          accion: "Eliminar Estudiante",
          detalle: `Se eliminó el estudiante ID ${studentId}`,
        })
        await fetchAlumnos()
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddAlumno = async (e) => {
    e.preventDefault()
    if (!form.rut || !form.nombre || !form.apellido || !form.correo_apoderado) return

    try {
      setSubmitting(true)
      const { data, error } = await supabase.from("Estudiante").insert([{ ...form, estado: "ACTIVO" }]).select().single()
      if (!error && data) {
        // REGISTRO EN LOGACCION
        await registrarAccion({
          id_usuario: user.id_usuario,
          accion: "Crear Estudiante",
          detalle: `Se creó el estudiante ${data.nombre} ${data.apellido} (RUT: ${data.rut})`,
        })
        setShowAddForm(false)
        setForm({ rut: "", nombre: "", apellido: "", correo_apoderado: "" })
        await fetchAlumnos()
      } else {
        alert("Error al registrar alumno: " + (error?.message || ""))
      }
    } catch (err) {
      alert("Error al registrar alumno: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (showAddForm) {
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
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Añadir Nuevo Estudiante</h1>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* User info bar - Añadido también para la vista de formulario */}
          <UserInfoBar user={user} onLogout={logout} />

          {/* Contenido principal con scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Añadir Nuevo Alumno</h2>
                <p className="text-gray-600 mb-8">Completa la información para registrar un nuevo alumno</p>

                <form className="space-y-6" onSubmit={handleAddAlumno}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RUT</label>
                    <input
                      type="text"
                      name="rut"
                      value={form.rut}
                      onChange={handleChange}
                      placeholder="RUT del estudiante"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Apellido"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Tutor</label>
                    <input
                      type="email"
                      name="correo_apoderado"
                      value={form.correo_apoderado}
                      onChange={handleChange}
                      placeholder="Correo@institucion.edu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                      disabled={submitting}
                    >
                      {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {submitting ? "Registrando..." : "Registrar alumno"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
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
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h1>
              </div>
            </div>
          </div>
        </header>

        {/* User info bar - Añadido */}
        <UserInfoBar user={user} onLogout={logout} />

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Alumnos</h2>
                    <p className="text-gray-600">Gestiona los alumnos inscritos en los talleres</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Loading y errores */}
              {loading && <LoadingSpinner message="Cargando alumnos..." />}

              {error && !loading && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded mx-6 mb-6">Error: {error}</div>
              )}

              {/* Tabla de alumnos */}
              {!loading && (
                <div className="overflow-x-auto">
                  {filteredAlumnos.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email Tutor
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
                          <tr key={alumno.id_estudiante} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStudent === alumno.id_estudiante ? (
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={editForm.nombre}
                                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                    className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-20"
                                    disabled={submitting}
                                  />
                                  <input
                                    type="text"
                                    value={editForm.apellido}
                                    onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                                    className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-20"
                                    disabled={submitting}
                                  />
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-gray-900">
                                  {alumno.nombre} {alumno.apellido}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStudent === alumno.id_estudiante ? (
                                <input
                                  type="email"
                                  value={editForm.correo_apoderado}
                                  onChange={(e) => setEditForm({ ...editForm, correo_apoderado: e.target.value })}
                                  className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-full"
                                  disabled={submitting}
                                />
                              ) : (
                                <div className="text-sm text-gray-500">{alumno.correo_apoderado}</div>
                              )}
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
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
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
                              {editingStudent === alumno.id_estudiante ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="text-emerald-600 hover:text-emerald-900 transition-colors px-2 py-1 border border-emerald-600 rounded text-xs flex items-center"
                                    disabled={submitting}
                                  >
                                    {submitting && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                    {submitting ? "..." : "Guardar"}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 border border-gray-600 rounded text-xs"
                                    disabled={submitting}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditStudent(alumno)}
                                    className="text-emerald-600 hover:text-emerald-900 transition-colors p-1 rounded hover:bg-emerald-50"
                                    title="Editar estudiante"
                                    disabled={submitting}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(alumno.id_estudiante)}
                                    className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                                    title="Eliminar estudiante"
                                    disabled={submitting}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alumnos disponibles</h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? "No se encontraron alumnos que coincidan con tu búsqueda."
                          : "Los alumnos aparecerán aquí cuando se agreguen al sistema."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
