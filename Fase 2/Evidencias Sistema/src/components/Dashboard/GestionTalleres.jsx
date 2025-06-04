import { useState, useEffect } from "react"
import {Search, Plus, Users, BookOpen, Award, Eye, ArrowLeft, Menu, Edit, Calendar, Clock, Settings, Filter, X, Power, PowerOff,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"

export function GestionTalleres() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [activeTab, setActiveTab] = useState("activos")
  const [preconfiguraciones, setPreconfiguraciones] = useState([]) // Estado para almacenar preconfiguraciones
  const [talleresCreados, setTalleresCreados] = useState([]) // Estado para talleres creados localmente
  const [selectedPeriod, setSelectedPeriod] = useState("") // Estado para el filtro de periodo
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [selectedPreconfiguracion, setSelectedPreconfiguracion] = useState(null)
  const [selectedPreconfiguracionId, setSelectedPreconfiguracionId] = useState("") // Para el dropdown
  // Modificar el estado inicial de newTaller para incluir profesor_a_cargo
  const [newTaller, setNewTaller] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    requisitos: "",
    niveles_totales: "",
    creado_por: "",
    nivel_educativo_minimo: "",
    edad_minima: "",
    edad_maxima: "",
    periodo: "", // Nuevo campo para el periodo
    profesor_a_cargo: "", // Nuevo campo para el profesor a cargo
  })
  const navigate = useNavigate()
  const [addingType, setAddingType] = useState("taller") // "taller" or "preconfiguracion"

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
  const [taller_impartido, setTalleres] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const { data, error } = await supabase.from("TallerImpartido").select("*, Usuario(nombre)")
        if (error) setError(error)
        else setTalleres(data)
      } catch (err) {
        setError(err)
      }
    }
    fetchTalleres()
  }, [])

  // Combinar talleres de la base de datos con talleres creados localmente
  const todosLosTalleresActivos = [
    ...taller_impartido.filter((t) => t.estado?.toLowerCase() === "activo"),
    ...talleresCreados.filter((t) => t.estado === "activo"),
  ]

  // Incluir talleres creados localmente en los inactivos
  const talleresInactivos = [
    ...taller_impartido.filter((t) => t.estado?.toLowerCase() === "inactivo"),
    ...talleresCreados.filter((t) => t.estado === "inactivo"),
  ]

  // Obtener todos los periodos únicos para el filtro
  const todosLosPeriodos = [
    ...new Set([
      ...todosLosTalleresActivos.map((t) => t.periodo).filter(Boolean),
      ...talleresCreados.map((t) => t.periodo).filter(Boolean),
    ]),
  ].sort()

  // Aplicar filtros de búsqueda y periodo
  const filteredTalleresActivos = todosLosTalleresActivos.filter((taller) => {
    const matchesSearch =
      (taller.nombre_publico || taller.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (taller.Usuario?.nombre || taller.creado_por || taller.profesor_a_cargo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (taller.descripcion_publica || taller.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPeriod = selectedPeriod === "" || taller.periodo === selectedPeriod

    return matchesSearch && matchesPeriod
  })

  const filteredTalleresInactivos = talleresInactivos.filter((taller) => {
    const matchesSearch =
      (taller.nombre_publico || taller.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (taller.Usuario?.nombre || taller.creado_por || taller.profesor_a_cargo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (taller.descripcion_publica || taller.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const filteredPreconfiguraciones = preconfiguraciones.filter(
    (preconfig) =>
      preconfig.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preconfig.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Modificar la función handlePreconfiguracionSelect para manejar el caso cuando no hay preconfiguraciones seleccionadas
  const handlePreconfiguracionSelect = (preconfiguracionId) => {
    setSelectedPreconfiguracionId(preconfiguracionId)

    // Buscar la preconfiguración seleccionada
    const preconfig = preconfiguraciones.find((p) => p.id.toString() === preconfiguracionId)
    if (preconfig) {
      // Llenar el formulario con los datos de la preconfiguración
      setNewTaller({
        ...newTaller,
        nombre: preconfig.nombre,
        descripcion: preconfig.descripcion,
        objetivos: Array.isArray(preconfig.objetivos) ? preconfig.objetivos.join("\n") : preconfig.objetivos,
        requisitos: preconfig.requisitos,
        niveles_totales: preconfig.niveles_totales,
        creado_por: preconfig.creado_por,
        nivel_educativo_minimo: preconfig.nivel_educativo_minimo,
        edad_minima: preconfig.edad_minima,
        edad_maxima: preconfig.edad_maxima,
        // Mantener el periodo y profesor si ya se habían ingresado
        periodo: newTaller.periodo,
        profesor_a_cargo: newTaller.profesor_a_cargo,
      })
    }
  }

  // Añadir lista de profesores para el dropdown
  const profesoresACargo = [
    { id: 1, nombre: "María González Rodríguez" },
    { id: 2, nombre: "Carlos Martínez Sánchez" },
    { id: 3, nombre: "Ana López Fernández" },
  ]

  // Modificar la función handleCreateTaller para incluir el profesor a cargo
  const handleCreateTaller = (e) => {
    e.preventDefault()

    if (addingType === "taller") {
      // Crear un nuevo taller y añadirlo a la lista de talleres activos
      const nuevoTaller = {
        id: Date.now(), // Generar un ID único
        nombre: newTaller.nombre,
        nombre_publico: newTaller.nombre,
        descripcion: newTaller.descripcion,
        descripcion_publica: newTaller.descripcion,
        objetivos: newTaller.objetivos.split("\n").filter((obj) => obj.trim() !== ""),
        requisitos: newTaller.requisitos,
        niveles_totales: Number.parseInt(newTaller.niveles_totales),
        creado_por: newTaller.creado_por,
        nivel_educativo_minimo: newTaller.nivel_educativo_minimo,
        edad_minima: Number.parseInt(newTaller.edad_minima),
        edad_maxima: Number.parseInt(newTaller.edad_maxima),
        periodo: newTaller.periodo,
        profesor_a_cargo: newTaller.profesor_a_cargo,
        estado: "activo",
        fechaCreacion: new Date().toLocaleDateString("es-ES"),
        alumnos: 0, // Inicialmente sin alumnos
        niveles: ["Básico"], // Nivel por defecto
        horario: "Por definir",
        ubicacion: "Por definir",
        materiales: [],
        Usuario: {
          nombre: newTaller.profesor_a_cargo,
        },
        // Añadir flag para identificar talleres creados localmente
        isLocallyCreated: true,
      }

      // Añadir el nuevo taller al estado
      setTalleresCreados([...talleresCreados, nuevoTaller])

      console.log("Crear taller:", nuevoTaller)
      alert(`Taller "${newTaller.nombre}" creado exitosamente`)

      // Cambiar a la pestaña de activos para ver el nuevo taller
      setActiveTab("activos")
    } else {
      // Crear una nueva preconfiguración
      const nuevaPreconfiguracion = {
        id: Date.now(), // Generar un ID único basado en timestamp
        nombre: newTaller.nombre,
        descripcion: newTaller.descripcion,
        objetivos: newTaller.objetivos.split("\n").filter((obj) => obj.trim() !== ""), // Convertir texto a array
        requisitos: newTaller.requisitos,
        niveles_totales: newTaller.niveles_totales,
        creado_por: newTaller.creado_por,
        nivel_educativo_minimo: newTaller.nivel_educativo_minimo,
        edad_minima: newTaller.edad_minima,
        edad_maxima: newTaller.edad_maxima,
        ...(newTaller.periodo && { periodo: newTaller.periodo }), // Solo incluir periodo si existe
        fechaCreacion: new Date().toLocaleDateString("es-ES"),
        tipo: "Estándar",
      }

      // Añadir la nueva preconfiguración al array
      setPreconfiguraciones([...preconfiguraciones, nuevaPreconfiguracion])

      // Mostrar mensaje de éxito
      alert(`Pre configuración "${nuevaPreconfiguracion.nombre}" creada exitosamente`)

      // Cambiar a la pestaña de preconfiguraciones
      setActiveTab("preconfiguraciones")
    }

    // Cerrar el formulario y resetear los valores
    setShowAddForm(false)
    setSelectedPreconfiguracionId("")
    setNewTaller({
      nombre: "",
      descripcion: "",
      objetivos: "",
      requisitos: "",
      niveles_totales: "",
      creado_por: "",
      nivel_educativo_minimo: "",
      edad_minima: "",
      edad_maxima: "",
      periodo: "", // Resetear el periodo
      profesor_a_cargo: "", // Resetear el profesor a cargo
    })
  }

  // Modificar la función handleEditTaller para manejar talleres creados localmente
  const handleEditTaller = (e) => {
    e.preventDefault()

    // Verificar si es un taller creado localmente
    if (selectedTaller.isLocallyCreated) {
      // Actualizar el taller en el estado de talleres creados
      const talleresActualizados = talleresCreados.map((taller) => {
        if (taller.id === selectedTaller.id) {
          return {
            ...taller,
            nombre: selectedTaller.nombre,
            nombre_publico: selectedTaller.nombre,
            descripcion: selectedTaller.descripcion,
            descripcion_publica: selectedTaller.descripcion,
            objetivos: Array.isArray(selectedTaller.objetivos)
              ? selectedTaller.objetivos
              : selectedTaller.objetivos.split("\n").filter((obj) => obj.trim() !== ""),
            requisitos: selectedTaller.requisitos,
            niveles_totales: Number.parseInt(selectedTaller.niveles_totales),
            creado_por: selectedTaller.creado_por,
            nivel_educativo_minimo: selectedTaller.nivel_educativo_minimo,
            edad_minima: Number.parseInt(selectedTaller.edad_minima),
            edad_maxima: Number.parseInt(selectedTaller.edad_maxima),
            periodo: selectedTaller.periodo,
            profesor_a_cargo: selectedTaller.profesor_a_cargo,
            estado: selectedTaller.estado,
            horario: selectedTaller.horario || "Por definir",
            ubicacion: selectedTaller.ubicacion || "Por definir",
            Usuario: {
              nombre: selectedTaller.profesor_a_cargo,
            },
          }
        }
        return taller
      })

      setTalleresCreados(talleresActualizados)
      alert(`Taller "${selectedTaller.nombre}" actualizado exitosamente`)
    } else {
      // Lógica para talleres de la base de datos (mantener la original)
      console.log("Editar taller:", selectedTaller)
      alert(`Taller "${selectedTaller.nombre}" actualizado exitosamente`)
    }

    setShowEditForm(false)
    setSelectedTaller(null)
  }

  const handleViewDetails = (taller) => {
    setSelectedTaller(taller)
    setShowDetailView(true)
  }

  const handleViewPreconfiguracionDetails = (preconfiguracion) => {
    setSelectedPreconfiguracion(preconfiguracion)
    setShowDetailView(true)
  }

  const handleEditClick = (taller) => {
    // Preparar el taller para edición, asegurando que todos los campos estén disponibles
    const tallerParaEditar = {
      ...taller,
      objetivos: Array.isArray(taller.objetivos) ? taller.objetivos.join("\n") : taller.objetivos || "",
      requisitos: taller.requisitos || "",
      niveles_totales: taller.niveles_totales || "",
      creado_por: taller.creado_por || "",
      nivel_educativo_minimo: taller.nivel_educativo_minimo || "",
      edad_minima: taller.edad_minima || "",
      edad_maxima: taller.edad_maxima || "",
      periodo: taller.periodo || "",
      profesor_a_cargo: taller.profesor_a_cargo || taller.Usuario?.nombre || "",
      horario: taller.horario || "Por definir",
      ubicacion: taller.ubicacion || "Por definir",
    }

    setSelectedTaller(tallerParaEditar)
    setShowEditForm(true)
  }

  const handleBackToList = () => {
    setShowDetailView(false)
    setShowEditForm(false)
    setSelectedTaller(null)
    setSelectedPreconfiguracion(null)
  }

  // Función para limpiar el filtro de periodo
  const clearPeriodFilter = () => {
    setSelectedPeriod("")
  }

  // Función para cambiar el estado del taller
  const toggleTallerEstado = () => {
    const nuevoEstado = selectedTaller.estado === "activo" ? "inactivo" : "activo"
    setSelectedTaller({
      ...selectedTaller,
      estado: nuevoEstado,
    })
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
                    {addingType === "taller" ? (
                      <BookOpen className="w-5 h-5 text-white" />
                    ) : (
                      <Settings className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {addingType === "taller" ? "Añadir Taller" : "Añadir Pre configuración"}
                  </h1>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {addingType === "taller" ? "Añadir Nuevo Taller" : "Añadir Nueva Pre configuración"}
                </h2>
                <p className="text-gray-600 mb-8">
                  {addingType === "taller"
                    ? "Completa la información para crear un nuevo taller"
                    : "Completa la información para crear una nueva pre configuración"}
                </p>

                <form className="space-y-6" onSubmit={handleCreateTaller}>
                  {/* Modificar la sección del formulario donde se selecciona la preconfiguración
                  Reemplazar el bloque del formulario donde está el dropdown de preconfiguraciones con este código: */}
                  {addingType === "taller" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar pre configuración <span className="text-red-500">*</span>
                      </label>
                      {preconfiguraciones.length > 0 ? (
                        <select
                          value={selectedPreconfiguracionId}
                          onChange={(e) => handlePreconfiguracionSelect(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        >
                          <option value="" disabled>
                            Selecciona una pre configuración
                          </option>
                          {preconfiguraciones.map((preconfig) => (
                            <option key={preconfig.id} value={preconfig.id}>
                              {preconfig.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-amber-800 text-sm">
                            No hay preconfiguraciones disponibles. Debes crear al menos una preconfiguración antes de
                            poder crear un taller.
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Selecciona una pre configuración para crear el taller
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {addingType === "taller" ? "Nombre del taller" : "Nombre de la pre configuración"}
                    </label>
                    <input
                      type="text"
                      placeholder={addingType === "taller" ? "Nombre del taller" : "Nombre de la pre configuración"}
                      value={newTaller.nombre}
                      onChange={(e) => setNewTaller({ ...newTaller, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      placeholder="Descripción detallada del taller"
                      value={newTaller.descripcion}
                      onChange={(e) => setNewTaller({ ...newTaller, descripcion: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
                    <textarea
                      placeholder="Objetivos del taller (uno por línea)"
                      value={newTaller.objetivos}
                      onChange={(e) => setNewTaller({ ...newTaller, objetivos: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
                    <textarea
                      placeholder="Requisitos para participar en el taller"
                      value={newTaller.requisitos}
                      onChange={(e) => setNewTaller({ ...newTaller, requisitos: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Niveles totales</label>
                      <input
                        type="number"
                        placeholder="Número de niveles"
                        min="1"
                        value={newTaller.niveles_totales}
                        onChange={(e) => setNewTaller({ ...newTaller, niveles_totales: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Creado por</label>
                      <input
                        type="text"
                        placeholder="Nombre del creador"
                        value={newTaller.creado_por}
                        onChange={(e) => setNewTaller({ ...newTaller, creado_por: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nivel educativo mínimo</label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="basica"
                          name="nivel_educativo"
                          value="BASICA"
                          checked={newTaller.nivel_educativo_minimo === "BASICA"}
                          onChange={(e) => setNewTaller({ ...newTaller, nivel_educativo_minimo: e.target.value })}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                          required
                        />
                        <label htmlFor="basica" className="ml-2 block text-sm text-gray-700">
                          BÁSICA
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="media"
                          name="nivel_educativo"
                          value="MEDIA"
                          checked={newTaller.nivel_educativo_minimo === "MEDIA"}
                          onChange={(e) => setNewTaller({ ...newTaller, nivel_educativo_minimo: e.target.value })}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <label htmlFor="media" className="ml-2 block text-sm text-gray-700">
                          MEDIA
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rango de edad</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Edad mínima</label>
                        <input
                          type="number"
                          placeholder="Ej: 8"
                          min="1"
                          max="100"
                          value={newTaller.edad_minima}
                          onChange={(e) => setNewTaller({ ...newTaller, edad_minima: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Edad máxima</label>
                        <input
                          type="number"
                          placeholder="Ej: 18"
                          min="1"
                          max="100"
                          value={newTaller.edad_maxima}
                          onChange={(e) => setNewTaller({ ...newTaller, edad_maxima: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    {newTaller.edad_minima &&
                      newTaller.edad_maxima &&
                      Number.parseInt(newTaller.edad_minima) >= Number.parseInt(newTaller.edad_maxima) && (
                        <p className="text-red-500 text-sm mt-1">La edad mínima debe ser menor que la edad máxima</p>
                      )}
                  </div>

                  {/* Añadir el campo de profesor a cargo antes del campo de periodo */}
                  {addingType === "taller" && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profesor a cargo <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newTaller.profesor_a_cargo}
                        onChange={(e) => setNewTaller({ ...newTaller, profesor_a_cargo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      >
                        <option value="" disabled>
                          Selecciona un profesor
                        </option>
                        {profesoresACargo.map((profesor) => (
                          <option key={profesor.id} value={profesor.nombre}>
                            {profesor.nombre}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Selecciona el profesor que estará a cargo del taller</p>
                    </div>
                  )}

                  {addingType === "taller" && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
                      <input
                        type="date"
                        value={newTaller.periodo}
                        onChange={(e) => setNewTaller({ ...newTaller, periodo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Selecciona la fecha de inicio del periodo</p>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    {/* Modificar la validación del botón de envío para incluir el profesor a cargo */}
                    <button
                      type="submit"
                      disabled={
                        !newTaller.nombre ||
                        !newTaller.descripcion ||
                        !newTaller.objetivos ||
                        !newTaller.requisitos ||
                        !newTaller.niveles_totales ||
                        !newTaller.creado_por ||
                        !newTaller.nivel_educativo_minimo ||
                        !newTaller.edad_minima ||
                        !newTaller.edad_maxima ||
                        (addingType === "taller" && !newTaller.periodo) ||
                        (addingType === "taller" && !newTaller.profesor_a_cargo) ||
                        (addingType === "taller" && !selectedPreconfiguracionId) ||
                        Number.parseInt(newTaller.edad_minima) >= Number.parseInt(newTaller.edad_maxima)
                      }
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {addingType === "taller" ? "Crear Taller" : "Crear Pre configuración"}
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
          <UserInfoBar user={user} onLogout={logout} />

          {/* Contenido principal con scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Editar Taller: {selectedTaller.nombre}</h2>
                    <p className="text-gray-600">Modifica la información del taller</p>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleEditTaller}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Nombre del taller"
                      value={selectedTaller.nombre}
                      onChange={(e) => setSelectedTaller({ ...selectedTaller, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
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
                      required
                    />
                  </div>

                  {/* Campos adicionales para talleres creados localmente */}
                  {selectedTaller.isLocallyCreated && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
                        <textarea
                          placeholder="Objetivos del taller (uno por línea)"
                          value={selectedTaller.objetivos}
                          onChange={(e) => setSelectedTaller({ ...selectedTaller, objetivos: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows="3"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
                        <textarea
                          placeholder="Requisitos para participar en el taller"
                          value={selectedTaller.requisitos}
                          onChange={(e) => setSelectedTaller({ ...selectedTaller, requisitos: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows="3"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Niveles totales</label>
                          <input
                            type="number"
                            placeholder="Número de niveles"
                            min="1"
                            value={selectedTaller.niveles_totales}
                            onChange={(e) => setSelectedTaller({ ...selectedTaller, niveles_totales: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Creado por</label>
                          <input
                            type="text"
                            placeholder="Nombre del creador"
                            value={selectedTaller.creado_por}
                            onChange={(e) => setSelectedTaller({ ...selectedTaller, creado_por: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nivel educativo mínimo</label>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="edit-basica"
                              name="edit_nivel_educativo"
                              value="BASICA"
                              checked={selectedTaller.nivel_educativo_minimo === "BASICA"}
                              onChange={(e) =>
                                setSelectedTaller({ ...selectedTaller, nivel_educativo_minimo: e.target.value })
                              }
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                            />
                            <label htmlFor="edit-basica" className="ml-2 block text-sm text-gray-700">
                              BÁSICA
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="edit-media"
                              name="edit_nivel_educativo"
                              value="MEDIA"
                              checked={selectedTaller.nivel_educativo_minimo === "MEDIA"}
                              onChange={(e) =>
                                setSelectedTaller({ ...selectedTaller, nivel_educativo_minimo: e.target.value })
                              }
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                            />
                            <label htmlFor="edit-media" className="ml-2 block text-sm text-gray-700">
                              MEDIA
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rango de edad</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Edad mínima</label>
                            <input
                              type="number"
                              placeholder="Ej: 8"
                              min="1"
                              max="100"
                              value={selectedTaller.edad_minima}
                              onChange={(e) => setSelectedTaller({ ...selectedTaller, edad_minima: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Edad máxima</label>
                            <input
                              type="number"
                              placeholder="Ej: 18"
                              min="1"
                              max="100"
                              value={selectedTaller.edad_maxima}
                              onChange={(e) => setSelectedTaller({ ...selectedTaller, edad_maxima: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profesor a cargo</label>
                        <select
                          value={selectedTaller.profesor_a_cargo}
                          onChange={(e) => setSelectedTaller({ ...selectedTaller, profesor_a_cargo: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        >
                          <option value="" disabled>
                            Selecciona un profesor
                          </option>
                          {profesoresACargo.map((profesor) => (
                            <option key={profesor.id} value={profesor.nombre}>
                              {profesor.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
                        <input
                          type="date"
                          value={selectedTaller.periodo}
                          onChange={(e) => setSelectedTaller({ ...selectedTaller, periodo: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estado del taller</p>
                        <p className="text-xs text-gray-500">El taller está actualmente {selectedTaller.estado}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            selectedTaller.estado === "activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedTaller.estado === "activo" ? "Activo" : "Inactivo"}
                        </span>
                        <button
                          type="button"
                          onClick={toggleTallerEstado}
                          className={`flex items-center px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                            selectedTaller.estado === "activo"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {selectedTaller.estado === "activo" ? (
                            <>
                              <PowerOff className="w-4 h-4 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-1" />
                              Activar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
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
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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

  // Vista de detalles de taller
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
          <UserInfoBar user={user} onLogout={logout} />

          {/* Contenido principal con scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Encabezado del taller */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedTaller.nombre || selectedTaller.nombre_publico}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {selectedTaller.descripcion || selectedTaller.descripcion_publica}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        selectedTaller.estado === "activo"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
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
                        <p className="text-sm text-gray-900">
                          {selectedTaller.profesor_a_cargo ||
                            selectedTaller.profesor ||
                            selectedTaller.Usuario?.nombre ||
                            selectedTaller.creado_por}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Alumnos</p>
                        <p className="text-sm text-gray-900">{selectedTaller.alumnos || 0} estudiantes</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                        <p className="text-sm text-gray-900">{selectedTaller.fechaCreacion}</p>
                      </div>
                    </div>

                    {selectedTaller.periodo && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-emerald-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Periodo</p>
                          <p className="text-sm text-gray-900">{selectedTaller.periodo}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Horario</p>
                        <p className="text-sm text-gray-900">{selectedTaller.horario || "Por definir"}</p>
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
                        {(selectedTaller.niveles || ["Básico"]).map((nivel) => (
                          <span key={nivel} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {nivel}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Ubicación</p>
                      <p className="text-sm text-gray-900">{selectedTaller.ubicacion || "Por definir"}</p>
                    </div>

                    {selectedTaller.materiales && selectedTaller.materiales.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Materiales</p>
                        <ul className="list-disc pl-5 text-sm text-gray-900 space-y-1">
                          {selectedTaller.materiales.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Objetivos */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos del Taller</h3>
                  <ul className="space-y-2">
                    {(selectedTaller.objetivos || []).map((objetivo, index) => (
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

  // Vista de detalles de preconfiguración
  if (showDetailView && selectedPreconfiguracion) {
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
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Detalles de Pre configuración</h1>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleBackToList} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* User info bar */}
          <UserInfoBar user={user} onLogout={logout} />

          {/* Contenido principal con scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Encabezado de la preconfiguración */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPreconfiguracion.nombre}</h2>
                      <p className="text-gray-600 mt-1">{selectedPreconfiguracion.descripcion}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      Pre configuración
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
                      <Settings className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Tipo</p>
                        <p className="text-sm text-gray-900">{selectedPreconfiguracion.tipo}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                        <p className="text-sm text-gray-900">{selectedPreconfiguracion.fechaCreacion}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Creado por</p>
                        <p className="text-sm text-gray-900">{selectedPreconfiguracion.creado_por}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Detalles Adicionales
                    </h3>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Nivel educativo mínimo</p>
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {selectedPreconfiguracion.nivel_educativo_minimo}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Rango de edad</p>
                      <p className="text-sm text-gray-900">
                        {selectedPreconfiguracion.edad_minima} - {selectedPreconfiguracion.edad_maxima} años
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Niveles totales</p>
                      <p className="text-sm text-gray-900">{selectedPreconfiguracion.niveles_totales}</p>
                    </div>
                  </div>
                </div>

                {/* Objetivos */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos</h3>
                  <ul className="space-y-2">
                    {selectedPreconfiguracion.objetivos.map((objetivo, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                        <span className="ml-3 text-gray-700">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requisitos */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h3>
                  <p className="text-gray-700">{selectedPreconfiguracion.requisitos}</p>
                </div>

                {/* Botones de acción */}
                <div className="p-6 border-t border-gray-200 flex flex-wrap gap-4">
                  <button
                    onClick={handleBackToList}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a la Lista
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Taller desde Pre configuración
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
        <UserInfoBar user={user} onLogout={logout} />

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
                  {activeTab !== "inactivos" && (
                    <button
                      onClick={() => {
                        setAddingType(activeTab === "preconfiguraciones" ? "preconfiguracion" : "taller")
                        setShowAddForm(true)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2 -ml-1" />
                      {activeTab === "preconfiguraciones" ? "Añadir Pre configuración" : "Añadir Taller"}
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={
                        activeTab === "preconfiguraciones" ? "Buscar preconfiguraciones..." : "Buscar talleres..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {/* Filtro por periodo - solo visible en la pestaña "Activos" */}
                  {activeTab === "activos" && (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
                        >
                          <option value="">Todos los periodos</option>
                          {todosLosPeriodos.map((periodo) => (
                            <option key={periodo} value={periodo}>
                              {new Date(periodo).toLocaleDateString("es-ES")}
                            </option>
                          ))}
                        </select>
                      </div>
                      {selectedPeriod && (
                        <button
                          onClick={clearPeriodFilter}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Limpiar filtro"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-b border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("preconfiguraciones")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "preconfiguraciones"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pre configuraciones ({preconfiguraciones.length})
                  </button>
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
                  {selectedPeriod && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-800">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Mostrando talleres del periodo:{" "}
                        <strong>{new Date(selectedPeriod).toLocaleDateString("es-ES")}</strong>
                      </p>
                    </div>
                  )}

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
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {taller.nombre_publico || taller.nombre}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {taller.descripcion_publica || taller.descripcion}
                                </p>
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
                              <span className="ml-2 text-gray-600">
                                {taller.Usuario?.nombre || taller.creado_por || taller.profesor_a_cargo}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Alumnos:</span>
                              <span className="ml-2 text-gray-600">{taller.alumnos || 0}</span>
                            </div>
                            {taller.periodo && (
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 text-emerald-600 mr-2" />
                                <span className="font-medium text-gray-700">Periodo:</span>
                                <span className="ml-2 text-gray-600">
                                  {new Date(taller.periodo).toLocaleDateString("es-ES")}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Niveles:</span>
                              <div className="ml-2 flex flex-wrap gap-1">
                                {(taller.niveles || ["Básico"]).map((nivel) => (
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {selectedPeriod
                          ? "No se encontraron talleres para este periodo"
                          : "No se encontraron talleres activos"}
                      </h3>
                      <p className="text-gray-500">
                        {selectedPeriod
                          ? "Intenta seleccionar un periodo diferente o crear un nuevo taller."
                          : "Intenta ajustar tu búsqueda o crear un nuevo taller."}
                      </p>
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
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {taller.nombre_publico || taller.nombre}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {taller.descripcion_publica || taller.descripcion}
                                </p>
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
                              <span className="ml-2 text-gray-600">
                                {taller.Usuario?.nombre || taller.creado_por || taller.profesor_a_cargo}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Alumnos:</span>
                              <span className="ml-2 text-gray-600">{taller.alumnos || 0}</span>
                            </div>
                            {taller.periodo && (
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 text-emerald-600 mr-2" />
                                <span className="font-medium text-gray-700">Periodo:</span>
                                <span className="ml-2 text-gray-600">
                                  {new Date(taller.periodo).toLocaleDateString("es-ES")}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="font-medium text-gray-700">Niveles:</span>
                              <div className="ml-2 flex flex-wrap gap-1">
                                {(taller.niveles || ["Básico"]).map((nivel) => (
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
                                Editar
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
                      <p className="text-gray-500">
                        {searchTerm
                          ? "No se encontraron talleres inactivos que coincidan con tu búsqueda."
                          : "No hay talleres inactivos en este momento."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "preconfiguraciones" && (
                <div className="p-6">
                  {filteredPreconfiguraciones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPreconfiguraciones.map((preconfig) => (
                        <div
                          key={preconfig.id}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                          <div className="p-5 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{preconfig.nombre}</h3>
                                <p className="text-sm text-gray-600 mt-1">{preconfig.descripcion}</p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Pre configuración
                              </span>
                            </div>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="flex items-center text-sm">
                              <Settings className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-700">Tipo:</span>
                              <span className="ml-2 text-gray-600">{preconfig.tipo}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-700">Creada:</span>
                              <span className="ml-2 text-gray-600">{preconfig.fechaCreacion}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-700">Creado por:</span>
                              <span className="ml-2 text-gray-600">{preconfig.creado_por}</span>
                            </div>
                            <div className="pt-2 flex space-x-2">
                              <button
                                onClick={() => handleViewPreconfiguracionDetails(preconfig)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </button>
                              <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay preconfiguraciones disponibles</h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? "No se encontraron preconfiguraciones que coincidan con tu búsqueda."
                          : "Las preconfiguraciones aparecerán aquí cuando se agreguen al sistema."}
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
