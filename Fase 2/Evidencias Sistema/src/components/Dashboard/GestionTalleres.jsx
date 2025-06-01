import { useState, useEffect } from "react"
import {Search,Plus,Users,BookOpen,Award,Eye,ToggleRight,ArrowLeft,Menu,Edit,Calendar,Clock,} from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"

export function GestionTalleres() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [activeTab, setActiveTab] = useState("activos")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [newTaller, setNewTaller] = useState({
    nombre: "",
    descripcion: "",
    profesor: "",
    niveles: [],
  })
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const talleres = [
    {
      id: 1,
      nombre: "Robótica",
      descripcion: "Taller de robótica para todas las edades",
      profesor: "Juan Pérez",
      alumnos: 32,
      niveles: ["Básico", "Intermedio", "Avanzado"],
      estado: "activo",
      fechaCreacion: "15/01/2025",
      horario: "Lunes y Miércoles, 15:00 - 17:00",
      ubicacion: "Sala 101, Edificio Principal",
      materiales: ["Kit de Arduino", "Sensores", "Cables", "Motores"],
      objetivos: [
        "Aprender conceptos básicos de electrónica",
        "Desarrollar habilidades de programación",
        "Construir proyectos robóticos funcionales",
      ],
    },
    {
      id: 2,
      nombre: "Pintura",
      descripcion: "Taller de técnicas de pintura y arte visual",
      profesor: "María González",
      alumnos: 28,
      niveles: ["Básico", "Intermedio"],
      estado: "activo",
      fechaCreacion: "20/01/2025",
      horario: "Martes y Jueves, 16:00 - 18:00",
      ubicacion: "Sala de Arte, Edificio B",
      materiales: ["Lienzos", "Pinceles", "Pinturas acrílicas", "Caballetes"],
      objetivos: [
        "Dominar técnicas básicas de pintura",
        "Desarrollar estilo artístico propio",
        "Crear un portafolio de obras",
      ],
    },
    {
      id: 3,
      nombre: "Música",
      descripcion: "Taller de instrumentos musicales y teoría musical",
      profesor: "Ana Rodríguez",
      alumnos: 32,
      niveles: ["Básico", "Intermedio", "Avanzado"],
      estado: "activo",
      fechaCreacion: "10/02/2025",
      horario: "Lunes, Miércoles y Viernes, 14:00 - 15:30",
      ubicacion: "Auditorio, Edificio Principal",
      materiales: ["Instrumentos varios", "Partituras", "Atriles"],
      objetivos: ["Aprender lectura musical", "Dominar un instrumento", "Participar en ensambles musicales"],
    },
    {
      id: 4,
      nombre: "Deportes",
      descripcion: "Actividades deportivas variadas",
      profesor: "Carlos Martínez",
      alumnos: 32,
      niveles: ["Básico", "Intermedio"],
      estado: "activo",
      fechaCreacion: "05/02/2025",
      horario: "Martes y Jueves, 15:00 - 17:00",
      ubicacion: "Gimnasio Principal",
      materiales: ["Balones", "Equipamiento deportivo", "Conos", "Colchonetas"],
      objetivos: ["Desarrollar habilidades físicas", "Fomentar trabajo en equipo", "Mejorar condición física"],
    },
    {
      id: 5,
      nombre: "Fotografía",
      descripcion: "Aprende los fundamentos de la fotografía",
      profesor: "Luis Sánchez",
      alumnos: 32,
      niveles: ["Básico", "Avanzado"],
      estado: "activo",
      fechaCreacion: "12/03/2025",
      horario: "Viernes, 16:00 - 19:00",
      ubicacion: "Laboratorio de Fotografía, Edificio C",
      materiales: ["Cámaras", "Trípodes", "Equipo de iluminación", "Software de edición"],
      objetivos: ["Dominar técnicas fotográficas", "Aprender composición visual", "Crear un portafolio fotográfico"],
    },
    {
      id: 6,
      nombre: "Teatro",
      descripcion: "Expresión corporal y actuación",
      profesor: "Elena Torres",
      alumnos: 22,
      niveles: ["Básico", "Intermedio"],
      estado: "activo",
      fechaCreacion: "20/02/2025",
      horario: "Lunes y Miércoles, 17:00 - 19:00",
      ubicacion: "Auditorio Pequeño, Edificio B",
      materiales: ["Guiones", "Vestuario", "Utilería básica"],
      objetivos: ["Desarrollar expresión corporal", "Mejorar técnicas de actuación", "Montar una obra de teatro"],
    },
    {
      id: 7,
      nombre: "Programación",
      descripcion: "Aprende a programar en diferentes lenguajes",
      profesor: "Pedro Gómez",
      alumnos: 1,
      niveles: ["Básico"],
      estado: "inactivo",
      fechaCreacion: "05/01/2025",
      horario: "Martes y Jueves, 18:00 - 20:00",
      ubicacion: "Laboratorio de Computación",
      materiales: ["Computadoras", "Software de programación", "Material didáctico"],
      objetivos: [
        "Aprender fundamentos de programación",
        "Desarrollar aplicaciones básicas",
        "Comprender lógica computacional",
      ],
    },
  ]

  const profesores = [
    "Juan Pérez",
    "María González",
    "Ana Rodríguez",
    "Carlos Martínez",
    "Luis Sánchez",
    "Elena Torres",
    "Pedro Gómez",
  ]

  const talleresActivos = talleres.filter((t) => t.estado === "activo")
  const talleresInactivos = talleres.filter((t) => t.estado === "inactivo")

  const filteredTalleresActivos = talleresActivos.filter(
    (taller) =>
      taller.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.profesor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTalleresInactivos = talleresInactivos.filter(
    (taller) =>
      taller.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.profesor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNivelChange = (nivel) => {
    if (newTaller.niveles.includes(nivel)) {
      setNewTaller({
        ...newTaller,
        niveles: newTaller.niveles.filter((n) => n !== nivel),
      })
    } else {
      setNewTaller({
        ...newTaller,
        niveles: [...newTaller.niveles, nivel],
      })
    }
  }

  const handleSelectedNivelChange = (nivel) => {
    if (selectedTaller.niveles.includes(nivel)) {
      setSelectedTaller({
        ...selectedTaller,
        niveles: selectedTaller.niveles.filter((n) => n !== nivel),
      })
    } else {
      setSelectedTaller({
        ...selectedTaller,
        niveles: [...selectedTaller.niveles, nivel],
      })
    }
  }

  const handleCreateTaller = (e) => {
    e.preventDefault()
    console.log("Crear taller:", newTaller)
    // Aquí iría la lógica para crear el taller en la base de datos
    alert(`Taller "${newTaller.nombre}" creado exitosamente`)
    setShowAddForm(false)
    setNewTaller({
      nombre: "",
      descripcion: "",
      profesor: "",
      niveles: [],
    })
  }

  const handleEditTaller = (e) => {
    e.preventDefault()
    console.log("Editar taller:", selectedTaller)
    // Aquí iría la lógica para actualizar el taller en la base de datos
    alert(`Taller "${selectedTaller.nombre}" actualizado exitosamente`)
    setShowEditForm(false)
    setSelectedTaller(null)
  }

  const handleViewDetails = (taller) => {
    setSelectedTaller(taller)
    setShowDetailView(true)
  }

  const handleEditClick = (taller) => {
    setSelectedTaller({ ...taller })
    setShowEditForm(true)
  }

  const handleBackToList = () => {
    setShowDetailView(false)
    setShowEditForm(false)
    setSelectedTaller(null)
  }

  // Vista de formulario de creación
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
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Taller</h1>
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
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Taller</h2>
                <p className="text-gray-600 mb-8">Completa la información para crear un nuevo taller</p>

                <form className="space-y-6" onSubmit={handleCreateTaller}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Nombre del taller"
                      value={newTaller.nombre}
                      onChange={(e) => setNewTaller({ ...newTaller, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      placeholder="Descripción del taller"
                      value={newTaller.descripcion}
                      onChange={(e) => setNewTaller({ ...newTaller, descripcion: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profesor</label>
                    <select
                      value={newTaller.profesor}
                      onChange={(e) => setNewTaller({ ...newTaller, profesor: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Seleccione un profesor</option>
                      {profesores.map((profesor) => (
                        <option key={profesor} value={profesor}>
                          {profesor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveles</label>
                    <div className="space-y-2">
                      {["Básico", "Intermedio", "Avanzado"].map((nivel) => (
                        <div key={nivel} className="flex items-center">
                          <input
                            type="checkbox"
                            id={nivel}
                            checked={newTaller.niveles.includes(nivel)}
                            onChange={() => handleNivelChange(nivel)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor={nivel} className="ml-2 block text-sm text-gray-700">
                            {nivel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !newTaller.nombre ||
                        !newTaller.descripcion ||
                        !newTaller.profesor ||
                        newTaller.niveles.length === 0
                      }
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Crear Taller
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

  // Vista de formulario de edición
  if (showEditForm && selectedTaller) {
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
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Editar Taller</h1>
                </div>
              </div>
              <button onClick={handleBackToList} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
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
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Editar Taller: {selectedTaller.nombre}</h2>
                <p className="text-gray-600 mb-8">Modifica la información del taller</p>

                <form className="space-y-6" onSubmit={handleEditTaller}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Nombre del taller"
                      value={selectedTaller.nombre}
                      onChange={(e) => setSelectedTaller({ ...selectedTaller, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      placeholder="Descripción del taller"
                      value={selectedTaller.descripcion}
                      onChange={(e) => setSelectedTaller({ ...selectedTaller, descripcion: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profesor</label>
                    <select
                      value={selectedTaller.profesor}
                      onChange={(e) => setSelectedTaller({ ...selectedTaller, profesor: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Seleccione un profesor</option>
                      {profesores.map((profesor) => (
                        <option key={profesor} value={profesor}>
                          {profesor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveles</label>
                    <div className="space-y-2">
                      {["Básico", "Intermedio", "Avanzado"].map((nivel) => (
                        <div key={nivel} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`edit-${nivel}`}
                            checked={selectedTaller.niveles.includes(nivel)}
                            onChange={() => handleSelectedNivelChange(nivel)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`edit-${nivel}`} className="ml-2 block text-sm text-gray-700">
                            {nivel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Horario</label>
                    <input
                      type="text"
                      placeholder="Horario del taller"
                      value={selectedTaller.horario}
                      onChange={(e) => setSelectedTaller({ ...selectedTaller, horario: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                    <input
                      type="text"
                      placeholder="Ubicación del taller"
                      value={selectedTaller.ubicacion}
                      onChange={(e) => setSelectedTaller({ ...selectedTaller, ubicacion: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBackToList}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !selectedTaller.nombre ||
                        !selectedTaller.descripcion ||
                        !selectedTaller.profesor ||
                        selectedTaller.niveles.length === 0
                      }
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Guardar Cambios
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

  // Vista de detalles
  if (showDetailView && selectedTaller) {
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
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Detalles del Taller</h1>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(selectedTaller)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={handleBackToList} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Encabezado del taller */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTaller.nombre}</h2>
                      <p className="text-gray-600 mt-1">{selectedTaller.descripcion}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 rounded-full">
                      {selectedTaller.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Información general */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Información General
                    </h3>

                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Profesor</p>
                        <p className="text-sm text-gray-900">{selectedTaller.profesor}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Alumnos</p>
                        <p className="text-sm text-gray-900">{selectedTaller.alumnos} estudiantes</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                        <p className="text-sm text-gray-900">{selectedTaller.fechaCreacion}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Horario</p>
                        <p className="text-sm text-gray-900">{selectedTaller.horario}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Detalles Adicionales
                    </h3>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Niveles</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTaller.niveles.map((nivel) => (
                          <span key={nivel} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {nivel}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Ubicación</p>
                      <p className="text-sm text-gray-900">{selectedTaller.ubicacion}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Materiales</p>
                      <ul className="list-disc pl-5 text-sm text-gray-900 space-y-1">
                        {selectedTaller.materiales.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Objetivos */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos del Taller</h3>
                  <ul className="space-y-2">
                    {selectedTaller.objetivos.map((objetivo, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        </div>
                        <span className="ml-3 text-gray-700">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="p-6 border-t border-gray-200 flex flex-wrap gap-4">
                  <button
                    onClick={() => handleEditClick(selectedTaller)}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Taller
                  </button>
                  <button
                    onClick={handleBackToList}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a la Lista
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Vista principal de lista de talleres
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Talleres</h1>
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
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Gestión de Talleres</h2>
                    <p className="text-gray-600">Administra los talleres de la institución</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2 -ml-1" />
                    Crear Taller
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar talleres..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-6 border-b border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("activos")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "activos"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Activos ({filteredTalleresActivos.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("inactivos")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "inactivos"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Inactivos ({filteredTalleresInactivos.length})
                  </button>
                </div>
              </div>

              {activeTab === "activos" && (
                <div className="p-6">
                  {filteredTalleresActivos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTalleresActivos.map((taller) => (
                        <div
                          key={taller.id}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                          <div className="p-5 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{taller.nombre}</h3>
                                <p className="text-sm text-gray-600 mt-1">{taller.descripcion}</p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                Activo
                              </span>
                            </div>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="flex items-center text-sm">
                              <BookOpen className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Profesor:</span>
                              <span className="ml-2 text-gray-600">{taller.profesor}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Alumnos:</span>
                              <span className="ml-2 text-gray-600">{taller.alumnos}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Niveles:</span>
                              <div className="ml-2 flex flex-wrap gap-1">
                                {taller.niveles.map((nivel) => (
                                  <span
                                    key={nivel}
                                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {nivel}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(taller)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </button>
                              <button
                                onClick={() => handleEditClick(taller)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar Taller
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron talleres activos</h3>
                      <p className="text-gray-500">Intenta ajustar tu búsqueda o crear un nuevo taller.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "inactivos" && (
                <div className="p-6">
                  {filteredTalleresInactivos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTalleresInactivos.map((taller) => (
                        <div
                          key={taller.id}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                          <div className="p-5 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{taller.nombre}</h3>
                                <p className="text-sm text-gray-600 mt-1">{taller.descripcion}</p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                Inactivo
                              </span>
                            </div>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="flex items-center text-sm">
                              <BookOpen className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Profesor:</span>
                              <span className="ml-2 text-gray-600">{taller.profesor}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Alumnos:</span>
                              <span className="ml-2 text-gray-600">{taller.alumnos}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Niveles:</span>
                              <div className="ml-2 flex flex-wrap gap-1">
                                {taller.niveles.map((nivel) => (
                                  <span
                                    key={nivel}
                                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {nivel}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(taller)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </button>
                              <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                                <ToggleRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron talleres inactivos</h3>
                      <p className="text-gray-500">Todos los talleres están actualmente activos.</p>
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