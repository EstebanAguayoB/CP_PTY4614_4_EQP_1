import { useState, useEffect, useCallback } from "react"
import { Search, UserPlus, Edit, ArrowLeft, Menu, UserCheck, ToggleRight, Loader2 } from "lucide-react"
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

export default function GestionProfesores() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    especialidad: "",
    taller: "",
    contrasena: "",
  })
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [talleresDisponibles, setTalleresDisponibles] = useState([])
  const [reloadFlag, setReloadFlag] = useState(false)

  // Estados para edición inline
  const [editingProfesor, setEditingProfesor] = useState(null)
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    especialidad: "",
    nivel_educativo: "",
  })

  const navigate = useNavigate()

  // Obtener el usuario
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  // Refrescar profesores (extrae la función para poder llamarla)
  const fetchProfesores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Trae todos los profesores
      const { data: profesoresData, error: errorProfesores } = await supabase.from("ProfesorDetalle").select(`
          id_usuario,
          especialidad,
          nivel_educativo,
          activo,
          Usuario:Usuario!inner(id_usuario, nombre, apellido, correo)
        `)

      if (errorProfesores) {
        setError(errorProfesores.message)
        return
      }

      const profesoresProcesados = profesoresData.map((profesor) => ({
        id: profesor.id_usuario,
        nombre: profesor.Usuario?.nombre || "",
        apellido: profesor.Usuario?.apellido || "",
        nombreCompleto: `${profesor.Usuario?.nombre || ""} ${profesor.Usuario?.apellido || ""}`,
        correo: profesor.Usuario?.correo || "",
        especialidad: profesor.especialidad,
        nivel_educativo: profesor.nivel_educativo,
        estado: profesor.activo ? "Activo" : "No Activo",
        usuario: profesor.Usuario,
      }))
      setProfesores(profesoresProcesados)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // useEffect para cargar profesores normalmente
  useEffect(() => {
    fetchProfesores()
  }, [fetchProfesores, reloadFlag])

  // useEffect para refrescar al volver a la ruta
  useEffect(() => {
    const handlePopState = () => {
      setReloadFlag((flag) => !flag) // Cambia el flag para forzar el refresco
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Cargar talleres disponibles desde la base
  useEffect(() => {
    const fetchTalleres = async () => {
      const { data, error } = await supabase.from("TallerImpartido").select("id_taller_impartido, nombre_publico")
      if (!error) setTalleresDisponibles(data)
    }
    fetchTalleres()
  }, [])

  // useEffect para refrescar profesores cuando cambia la marca en localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "profesoresNeedsRefresh") {
        fetchProfesores()
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [fetchProfesores])

  // Funciones de edición inline
  const handleEditProfesor = (profesor) => {
    setEditingProfesor(profesor.id)
    setEditForm({
      nombre: profesor.nombre || "",
      apellido: profesor.apellido || "",
      correo: profesor.correo || "",
      especialidad: profesor.especialidad || "",
      nivel_educativo: profesor.nivel_educativo || "",
    })
  }

  const handleSaveEdit = async () => {
    try {
      setIsSubmitting(true)
      // Actualizar tabla Usuario
      const { error: errorUsuario } = await supabase
        .from("Usuario")
        .update({
          nombre: editForm.nombre,
          apellido: editForm.apellido,
          correo: editForm.correo,
        })
        .eq("id_usuario", editingProfesor)

      if (errorUsuario) {
        console.error("Error updating user:", errorUsuario)
        return
      }

      // Actualizar tabla ProfesorDetalle
      const { error: errorDetalle } = await supabase
        .from("ProfesorDetalle")
        .update({
          especialidad: editForm.especialidad,
          nivel_educativo: editForm.nivel_educativo,
        })
        .eq("id_usuario", editingProfesor)

      if (errorDetalle) {
        console.error("Error updating professor details:", errorDetalle)
        return
      }

      // Registrar acción en el log
      await registrarAccion({
        id_usuario: user.id_usuario,
        accion: "Editar Profesor",
        detalle: `Se editó el profesor ID ${editingProfesor}`,
      })

      // Refresh the professors list
      await fetchProfesores()
      setEditingProfesor(null)
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingProfesor(null)
    setEditForm({
      nombre: "",
      apellido: "",
      correo: "",
      especialidad: "",
      nivel_educativo: "",
    })
  }

  // Función para eliminar profesor
  const handleDeleteProfesor = async (profesorId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este profesor? Esta acción eliminará también sus asignaciones y no se puede deshacer.",
      )
    ) {
      try {
        setIsSubmitting(true)
        // Primero eliminar las asignaciones
        const { error: errorAsignaciones } = await supabase
          .from("AsignacionProfesor")
          .delete()
          .eq("id_usuario", profesorId)

        if (errorAsignaciones) {
          console.error("Error deleting assignments:", errorAsignaciones)
          return
        }

        // Luego eliminar el detalle del profesor
        const { error: errorDetalle } = await supabase.from("ProfesorDetalle").delete().eq("id_usuario", profesorId)

        if (errorDetalle) {
          console.error("Error deleting professor details:", errorDetalle)
          return
        }

        // Finalmente eliminar el usuario
        const { error: errorUsuario } = await supabase.from("Usuario").delete().eq("id_usuario", profesorId)

        if (errorUsuario) {
          console.error("Error deleting user:", errorUsuario)
          return
        }

        // Registrar acción en el log
        await registrarAccion({
          id_usuario: user.id_usuario,
          accion: "Eliminar Profesor",
          detalle: `Se eliminó el profesor ID ${profesorId}`,
        })

        // Refresh the professors list
        await fetchProfesores()
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Filtro de búsqueda
  const filteredProfesores = profesores.filter(
    (prof) =>
      prof.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")
    setIsSubmitting(true)

    // Validación básica
    if (!form.nombre || !form.apellido || !form.correo || !form.especialidad || !form.taller || !form.contrasena) {
      setFormError("Completa todos los campos.")
      setIsSubmitting(false)
      return
    }

    try {
      // 1. Registrar usuario en auth.users (Supabase Auth)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.correo,
        password: form.contrasena,
        options: {
          data: {
            nombre: form.nombre,
            apellido: form.apellido,
            rol: "PROFESOR",
          },
        },
      })

      if (signUpError) throw new Error("Error al crear usuario en autenticación: " + signUpError.message)

      // El id del usuario en auth.users
      const uid = signUpData.user?.id
      if (!uid) throw new Error("No se pudo obtener el ID del usuario autenticado.")

      // 2. Insertar en la tabla Usuario usando el uid de auth.users
      const { data: usuario, error: errorUsuario } = await supabase
        .from("Usuario")
        .insert([
          {
            uid: uid,
            nombre: form.nombre,
            apellido: form.apellido,
            correo: form.correo,
            contrasena: form.contrasena, // Aquí se guarda la contraseña ingresada
            rol: "PROFESOR",
            estado: "ACTIVO",
          },
        ])
        .select()
        .single()

      if (errorUsuario) throw new Error("Error al crear usuario en la base de datos: " + errorUsuario.message)

      // 3. Crear detalle de profesor
      const { error: errorDetalle } = await supabase.from("ProfesorDetalle").insert([
        {
          id_usuario: usuario.id_usuario,
          especialidad: form.especialidad,
          nivel_educativo: "BASICA",
          activo: true,
        },
      ])

      if (errorDetalle) throw new Error("Error al crear detalle de profesor: " + errorDetalle.message)

      const { error: errorAsignacion } = await supabase.from("AsignacionProfesor").insert([
        {
          id_usuario: usuario.id_usuario,
          id_taller_impartido: Number.parseInt(form.taller),
          rol: "RESPONSABLE",
          estado_asignacion: "ACTIVA",
        },
      ])

      if (errorAsignacion) throw new Error("Error al asignar taller: " + errorAsignacion.message)

      // Registrar acción en el log
      await registrarAccion({
        id_usuario: user.id_usuario,
        accion: "Crear Profesor",
        detalle: `Se creó el profesor ${form.nombre} ${form.apellido} (${form.correo}) y se asignó al taller ID ${form.taller}`,
      })

      setFormSuccess("¡Profesor registrado exitosamente!")
      setForm({
        nombre: "",
        apellido: "",
        correo: "",
        especialidad: "",
        taller: "",
        contrasena: "",
      })

      // Recargar profesores
      await fetchProfesores()
    } catch (err) {
      setFormError(err.message)
    }
    setIsSubmitting(false)
  }

  // Cambiar estado activo/no activo
  const handleToggleEstado = async (prof) => {
    try {
      setIsSubmitting(true)
      const nuevoEstado = prof.estado === "Activo" ? false : true
      const { error } = await supabase.from("ProfesorDetalle").update({ activo: nuevoEstado }).eq("id_usuario", prof.id)
      if (!error) {
        await fetchProfesores()
      } else {
        alert("Error al cambiar estado: " + error.message)
      }
    } catch (err) {
      alert("Error al cambiar estado: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Opciones para el formulario (puedes obtenerlas dinámicamente si lo deseas)
  const especialidades = [
    "Lenguaje y Comunicación",
    "Matemática",
    "Ciencias Naturales",
    "Historia, Geografía y Ciencias Sociales",
    "Educación Tecnológica",
    "Educación Artística",
    "Educación Física y Salud",
    "Idiomas Extranjeros",
    "Orientación y Convivencia Escolar",
  ]
  const nivelesEducativos = ["BASICA", "MEDIA"]

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
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Añadir Nuevo Profesor</h1>
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

          {/* User info bar */}
          <UserInfoBar user={user} onLogout={logout} />

          {/* Contenido principal con scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Añadir Nuevo Profesor</h2>
                <p className="text-gray-600 mb-8">Completa la información para registrar un nuevo profesor</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Nombre"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="Correo@institucion.edu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                    <select
                      name="especialidad"
                      value={form.especialidad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    >
                      <option value="" disabled hidden>
                        Área de especialidad
                      </option>
                      {especialidades.map((especialidad) => (
                        <option key={especialidad} value={especialidad}>
                          {especialidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taller</label>
                    <select
                      name="taller"
                      value={form.taller}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    >
                      <option value="" disabled hidden>
                        Asignar a taller
                      </option>
                      {talleresDisponibles.map((taller) => (
                        <option key={taller.id_taller_impartido} value={taller.id_taller_impartido}>
                          {taller.nombre_publico}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <input
                      type="password"
                      name="contrasena"
                      value={form.contrasena}
                      onChange={handleChange}
                      placeholder="Contraseña temporal"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formError && <div className="text-red-600">{formError}</div>}
                  {formSuccess && <div className="text-green-600">{formSuccess}</div>}
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {isSubmitting ? "Registrando..." : "Registrar profesor"}
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
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
              </div>
            </div>
          </div>
        </header>

        {/* User info bar */}
        <UserInfoBar user={user} onLogout={logout} />

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Profesores</h2>
                    <p className="text-gray-600">Gestiona a los profesores con talleres</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    disabled={loading}
                  >
                    <UserPlus className="w-5 h-5 mr-2 -ml-1" />
                    Añadir Profesor
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar profesores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Loading y errores */}
              {loading && <LoadingSpinner message="Cargando profesores..." />}

              {error && !loading && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded mx-6 mb-6">Error: {error}</div>
              )}

              {/* Tabla de profesores */}
              {!loading && (
                <div className="overflow-x-auto">
                  {filteredProfesores.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Especialidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nivel Educativo
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
                        {filteredProfesores.map((prof) => (
                          <tr key={prof.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {prof.nombreCompleto.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  {editingProfesor === prof.id ? (
                                    <div className="flex space-x-2">
                                      <input
                                        type="text"
                                        value={editForm.nombre}
                                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                        className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-20"
                                        disabled={isSubmitting}
                                      />
                                      <input
                                        type="text"
                                        value={editForm.apellido}
                                        onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                                        className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-20"
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-sm font-medium text-gray-900">{prof.nombreCompleto}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingProfesor === prof.id ? (
                                <input
                                  type="email"
                                  value={editForm.correo}
                                  onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                                  className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-full"
                                  disabled={isSubmitting}
                                />
                              ) : (
                                <div className="text-sm text-gray-500">{prof.correo}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingProfesor === prof.id ? (
                                <select
                                  value={editForm.especialidad}
                                  onChange={(e) => setEditForm({ ...editForm, especialidad: e.target.value })}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                  disabled={isSubmitting}
                                >
                                  {especialidades.map((especialidad) => (
                                    <option key={especialidad} value={especialidad}>
                                      {especialidad}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {prof.especialidad}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingProfesor === prof.id ? (
                                <select
                                  value={editForm.nivel_educativo}
                                  onChange={(e) => setEditForm({ ...editForm, nivel_educativo: e.target.value })}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                  disabled={isSubmitting}
                                >
                                  {nivelesEducativos.map((nivel) => (
                                    <option key={nivel} value={nivel}>
                                      {nivel}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  {prof.nivel_educativo}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  prof.estado === "Activo"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {prof.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {editingProfesor === prof.id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="text-emerald-600 hover:text-emerald-900 transition-colors px-2 py-1 border border-emerald-600 rounded text-xs flex items-center"
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                    {isSubmitting ? "..." : "Guardar"}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 border border-gray-600 rounded text-xs"
                                    disabled={isSubmitting}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                    title="Editar"
                                    onClick={() => handleEditProfesor(prof)}
                                    disabled={isSubmitting}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Cambiar estado"
                                    onClick={() => handleToggleEstado(prof)}
                                    disabled={isSubmitting}
                                  >
                                    <ToggleRight className="w-4 h-4" />
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
                      <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay profesores disponibles</h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? "No se encontraron profesores que coincidan con tu búsqueda."
                          : "Los profesores aparecerán aquí cuando se agreguen al sistema."}
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