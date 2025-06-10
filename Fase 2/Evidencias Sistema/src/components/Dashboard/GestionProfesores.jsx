import { useState, useEffect, useCallback } from "react"
import { Search, UserPlus, Edit, ToggleRight, ArrowLeft, Menu, UserCheck } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"

export default function GestionProfesores() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profesores, setProfesores] = useState([])
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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({ id: null, especialidad: "", nivel_educativo: "" })
  const [editLoading, setEditLoading] = useState(false)
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  // Refrescar profesores (extrae la función para poder llamarla)
  const fetchProfesores = useCallback(async () => {
    // 1. Trae todos los profesores
    const { data: profesoresData, error: errorProfesores } = await supabase
      .from("ProfesorDetalle")
      .select(`
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
      nombre: `${profesor.Usuario?.nombre || ""} ${profesor.Usuario?.apellido || ""}`,
      correo: profesor.Usuario?.correo || "",
      especialidad: profesor.especialidad,
      nivel_educativo: profesor.nivel_educativo,
      estado: profesor.activo ? "Activo" : "No Activo",
    }))
    setProfesores(profesoresProcesados)
  }, [])

  // useEffect para cargar profesores normalmente
  useEffect(() => {
    fetchProfesores()
  }, [fetchProfesores, reloadFlag])

  // useEffect para refrescar al volver a la ruta
  useEffect(() => {
    const handlePopState = () => {
      setReloadFlag(flag => !flag) // Cambia el flag para forzar el refresco
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Cargar talleres disponibles desde la base
  useEffect(() => {
    const fetchTalleres = async () => {
      const { data, error } = await supabase
        .from("TallerImpartido")
        .select("id_taller_impartido, nombre_publico")
      if (!error) setTalleresDisponibles(data)
    }
    fetchTalleres()
  }, [])

  // useEffect para refrescar profesores cuando cambia la marca en localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "profesoresNeedsRefresh") {
        fetchProfesores();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchProfesores]);

  // Filtro de búsqueda
  const filteredProfesores = profesores.filter(
    (prof) =>
      prof.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.talleres.some(t => t.nombreTaller.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    // Validación básica
    if (!form.nombre || !form.apellido || !form.correo || !form.especialidad || !form.taller || !form.contrasena) {
      setFormError("Completa todos los campos.");
      setIsSubmitting(false);
      return;
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
            rol: "PROFESOR"
          }
        }
      });

      if (signUpError) throw new Error("Error al crear usuario en autenticación: " + signUpError.message);

      // El id del usuario en auth.users
      const uid = signUpData.user?.id;
      if (!uid) throw new Error("No se pudo obtener el ID del usuario autenticado.");

      // 2. Insertar en la tabla Usuario usando el uid de auth.users
      const { data: usuario, error: errorUsuario } = await supabase
        .from("Usuario")
        .insert([{
          uid: uid,
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          contrasena: form.contrasena, // Aquí se guarda la contraseña ingresada
          rol: "PROFESOR",
          estado: "ACTIVO"
        }])
        .select()
        .single();

      if (errorUsuario) throw new Error("Error al crear usuario en la base de datos: " + errorUsuario.message);

      // 3. Crear detalle de profesor
      const { error: errorDetalle } = await supabase
        .from("ProfesorDetalle")
        .insert([{
          id_usuario: usuario.id_usuario,
          especialidad: form.especialidad,
          nivel_educativo: "BASICA",
          activo: true
        }]);

      if (errorDetalle) throw new Error("Error al crear detalle de profesor: " + errorDetalle.message);


      const { error: errorAsignacion } = await supabase
        .from("AsignacionProfesor")
        .insert([{
          id_usuario: usuario.id_usuario,
          id_taller_impartido: parseInt(form.taller),
          rol: "RESPONSABLE",
          estado_asignacion: "ACTIVA"
        }]);

      if (errorAsignacion) throw new Error("Error al asignar taller: " + errorAsignacion.message);

      setFormSuccess("¡Profesor registrado exitosamente!");
      setForm({
        nombre: "",
        apellido: "",
        correo: "",
        especialidad: "",
        taller: "",
        contrasena: "",
      });

    } catch (err) {
      setFormError(err.message);
    }
    setIsSubmitting(false);
  }

  // Abrir modal de edición
  const handleEdit = (prof) => {
    setEditForm({
      id: prof.id,
      especialidad: prof.especialidad,
      nivel_educativo: prof.nivel_educativo,
    })
    setEditModalOpen(true)
  }

  // Guardar cambios de edición
  const handleEditSave = async () => {
    setEditLoading(true)
    const { error } = await supabase
      .from("ProfesorDetalle")
      .update({
        especialidad: editForm.especialidad,
        nivel_educativo: editForm.nivel_educativo,
      })
      .eq("id_usuario", editForm.id)
    setEditLoading(false)
    if (!error) {
      setEditModalOpen(false)
      fetchProfesores()
    } else {
      alert("Error al actualizar: " + error.message)
    }
  }

  // Cambiar estado activo/no activo
  const handleToggleEstado = async (prof) => {
    const nuevoEstado = prof.estado === "Activo" ? false : true
    const { error } = await supabase
      .from("ProfesorDetalle")
      .update({ activo: nuevoEstado })
      .eq("id_usuario", prof.id)
    if (!error) fetchProfesores()
    else alert("Error al cambiar estado: " + error.message)
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
    "Orientación y Convivencia Escolar"
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                    <select
                      name="especialidad"
                      value={form.especialidad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="" disabled hidden>Área de especialidad</option>
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
                    >
                      <option value="" disabled hidden>Asignar a taller</option>
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
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      disabled={isSubmitting}
                    >
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
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
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
                              {prof.nombre.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{prof.nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{prof.correo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {prof.especialidad}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {prof.nivel_educativo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${prof.estado === "Activo" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}>
                            {prof.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Editar"
                              onClick={() => handleEdit(prof)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              title="Cambiar estado"
                              onClick={() => handleToggleEstado(prof)}
                            >
                              <ToggleRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProfesores.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron profesores</h3>
                  <p className="text-gray-500">Intenta ajustar tu búsqueda o añadir un nuevo profesor.</p>
                </div>
              )}
              {error && (
                <div className="text-center py-4 text-red-600">
                  Error al cargar profesores: {error}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de edición */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg max-w-md mx-auto p-6 z-50 relative">
            <h2 className="text-lg font-bold mb-4">Editar Profesor</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={editForm.especialidad}
                onChange={e => setEditForm({ ...editForm, especialidad: e.target.value })}
              >
                <option value="" disabled>Selecciona especialidad</option>
                {especialidades.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Educativo</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={editForm.nivel_educativo}
                onChange={e => setEditForm({ ...editForm, nivel_educativo: e.target.value })}
              >
                <option value="" disabled>Selecciona nivel</option>
                {nivelesEducativos.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setEditModalOpen(false)}
                disabled={editLoading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded"
                onClick={handleEditSave}
                disabled={editLoading}
              >
                {editLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}