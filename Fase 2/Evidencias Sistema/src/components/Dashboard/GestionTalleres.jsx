import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Plus,
  Users,
  BookOpen,
  Eye,
  ArrowLeft,
  Edit,
  Calendar,
  Settings,
  X,
  Power,
  PowerOff,
  ClipboardList,
  Trash2,
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"

import { TallerForm } from "./Talleres/Form/TallerForm"
import { TallerDetails } from "./Talleres/Details/TallerDetails"
import { useTalleres } from "../../hooks/useTalleres"

export function GestionTalleres() {
  const navigate = useNavigate()

  const {
    talleres,
    loading: loadingTalleres,
    error: talleresError,
    refresh: refreshTalleres,
    createTaller,
    updateTaller,
    updateEstadoTaller,
    deleteTaller,
  } = useTalleres()

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [activeTab, setActiveTab] = useState("activos")
  const [preconfiguraciones, setPreconfiguraciones] = useState([])
  const [loadingPreconfiguraciones, setLoadingPreconfiguraciones] = useState(true)
  const [errorPreconfiguraciones, setErrorPreconfiguraciones] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [selectedPreconfiguracionId, setSelectedPreconfiguracionId] = useState("")
  const [error, setError] = useState(null)
  const [selectedPeriodoId, setSelectedPeriodoId] = useState("")
  const [selectedProfesorId, setSelectedProfesorId] = useState("")

  const [periodos, setPeriodos] = useState([])
  const [profesores, setProfesores] = useState([])

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: supaUser },
      } = await supabase.auth.getUser()
      setUser(supaUser)
    }
    getUser()

    async function loadPreconfiguraciones() {
      try {
        setLoadingPreconfiguraciones(true)
        const { data, error } = await supabase
          .from("TallerDefinido")
          .select("*")
        if (error) throw error
        setPreconfiguraciones(data)
      } catch (err) {
        setErrorPreconfiguraciones(err.message)
      } finally {
        setLoadingPreconfiguraciones(false)
      }
    }
    loadPreconfiguraciones()

    supabase
      .from("PeriodoAcademico")
      .select("*")
      .then(({ data, error }) => {
        if (!error) setPeriodos(data || [])
      })

    supabase
      .from("Usuario")
      .select("id_usuario, nombre, apellido")
      .eq("rol", "PROFESOR")
      .then(({ data, error }) => {
        if (!error) setProfesores(data || [])
      })
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const toggleAddForm = () => {
    setSelectedTaller(null)
    setShowAddForm(!showAddForm)
    setShowDetailView(false)
    setShowEditForm(false)
    setError(null)
  }

  const handleTallerCreated = async (success) => {
    if (success) {
      setShowAddForm(false)
      setShowEditForm(false)
      await refreshTalleres()
    } else {
      setShowAddForm(false)
      setShowEditForm(false)
    }
    setError(null)
  }

  const handleEditTaller = (taller) => {
    setSelectedTaller(taller)
    setShowEditForm(true)
    setShowAddForm(false)
    setShowDetailView(false)
    setError(null)
  }

  const handleTallerUpdated = async (success) => {
    if (success) {
      setShowEditForm(false)
      await refreshTalleres()
    } else {
      setShowEditForm(false)
    }
    setError(null)
  }

  const handleViewDetails = (taller) => {
    setSelectedTaller(taller)
    setShowDetailView(true)
    setShowAddForm(false)
    setShowEditForm(false)
    setError(null)
  }

  const handleBackToList = () => {
    setShowDetailView(false)
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedTaller(null)
    setSelectedPreconfiguracionId("")
    setError(null)
    refreshTalleres()
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setShowAddForm(false)
    setShowEditForm(false)
    setShowDetailView(false)
    setSearchTerm("")
    setSelectedPeriod("")
    setSelectedPreconfiguracionId("")
    setError(null)
  }

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value)
  }

  const handlePreconfiguracionSelect = (e) => {
    setSelectedPreconfiguracionId(e.target.value)
  }

  const handleApplyPreconfiguracionDirect = (id) => {
    const preconfig = preconfiguraciones.find(
      (p) => p.id_taller_definido === id
    )
    if (preconfig) {
      setSelectedTaller({
        id_taller_definido: preconfig.id_taller_definido,
        nombre_publico: preconfig.nombre,
        descripcion_publica: preconfig.descripcion,
        id_periodo: "",
        profesor_asignado: "",
        estado: "activo",
      })
      setShowAddForm(true)
      setError(null)
    } else {
      setError("Preconfiguración no encontrada.")
    }
  }
  const handleApplyPreconfiguracion = () => {
    if (!selectedPreconfiguracionId) {
      setError("Por favor selecciona una preconfiguración.")
      return
    }
    const preconfig = preconfiguraciones.find(
      (p) => p.id_taller_definido.toString() === selectedPreconfiguracionId
    )
    if (preconfig) {
      setSelectedTaller({
        id_taller_definido: preconfig.id_taller_definido,
        nombre_publico: preconfig.nombre,
        descripcion_publica: preconfig.descripcion,
        id_periodo: "",
        profesor_asignado: "",
        estado: "activo",
      })
      setShowAddForm(true)
      setError(null)
    } else {
      setError("Preconfiguración no encontrada.")
    }
  }

  const handleEstadoChange = async (tallerId, currentEstado) => {
    const newEstado =
      currentEstado === "activo"
        ? "finalizado"
        : "activo"
    if (
      !window.confirm(
        `¿Estás seguro de que quieres cambiar el estado a ${newEstado}?`
      )
    ) {
      return
    }
    try {
      await updateEstadoTaller(tallerId, newEstado)
      await refreshTalleres()
    } catch (err) {
      alert("Error al cambiar el estado del taller: " + err.message)
    }
  }

  const handleDeleteTaller = async (tallerId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres desactivar este taller?")
    ) {
      return
    }
    try {
      await deleteTaller(tallerId)
      await refreshTalleres()
    } catch (err) {
      alert("Error al desactivar el taller: " + err.message)
    }
  }

  // Memoizar filtrado de talleres
  const filteredTalleres = useMemo(() => {
    return talleres
      .filter((taller) => {
        const term = searchTerm.toLowerCase()
        const matchesSearch =
          (taller.nombre?.toLowerCase().includes(term) || false) ||
          (taller.descripcion?.toLowerCase().includes(term) || false) ||
          ((taller.Usuario?.nombre || taller.profesor_a_cargo || "")
            .toLowerCase()
            .includes(term))

        const matchesTab =
          activeTab === "activos"
            ? taller.estado === "activo"
            : activeTab === "finalizados"
              ? taller.estado === "finalizado"
              : true

        // Compara por nombre de período académico
        const matchesPeriod = selectedPeriod
          ? taller.PeriodoAcademico?.nombre_periodo === selectedPeriod
          : true

        return matchesSearch && matchesTab && matchesPeriod
      })
      .sort((a, b) => new Date(b.periodo || "1970-01-01") - new Date(a.periodo || "1970-01-01"))
  }, [talleres, searchTerm, activeTab, selectedPeriod])

  const uniquePeriods = useMemo(() => {
    // Extrae los nombres únicos de los períodos académicos de la lista de periodos cargados
    return [...new Set(periodos.map((p) => p.nombre_periodo))].sort()
  }, [periodos])

  const getTallerCountByTab = (tab) => {
    if (tab === "preconfiguraciones") return preconfiguraciones.length
    return talleres.filter((t) =>
      tab === "activos"
        ? t.estado === "activo"
        : tab === "finalizados"
          ? t.estado === "finalizado"
          : false
    ).length
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserInfoBar setSidebarOpen={setSidebarOpen} user={user} />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header and Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Talleres
              </h1>
              {!showAddForm && !showEditForm && !showDetailView && (
                <button
                  onClick={toggleAddForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Crear Nuevo Taller
                </button>
              )}
              {(showAddForm || showEditForm || showDetailView) && (
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
                  Volver a la lista
                </button>
              )}
            </div>

            {/* Detalle del Taller */}
            {showDetailView && selectedTaller && (
              <TallerDetails
                taller={selectedTaller}
                onEdit={() => handleEditTaller(selectedTaller)}
              />
            )}

            {/* Contenido principal: tabs, búsqueda, filtros, lista */}
            {!showAddForm && !showEditForm && !showDetailView && (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Tabs para filtrar */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { name: "Activos", key: "activos", icon: Power },
                      { name: "Finalizados", key: "finalizados", icon: PowerOff },
                      //{ name: "Cancelados", key: "cancelados", icon: X },
                      {
                        name: "Preconfiguraciones",
                        key: "preconfiguraciones",
                        icon: ClipboardList,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`${activeTab === tab.key
                          ? "border-emerald-500 text-emerald-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                      >
                        <tab.icon className="mr-2 h-5 w-5" />
                        {tab.name}
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-900"
                            }`}
                        >
                          {getTallerCountByTab(tab.key)}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Search and Filters */}
                <div className="p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1 w-full sm:max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Buscar taller o profesor..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  {activeTab !== "preconfiguraciones" && (
                    <div className="w-full sm:w-auto">
                      <label htmlFor="period-filter" className="sr-only">
                        Filtrar por Período
                      </label>
                      <select
                        id="period-filter"
                        className={`block w-full pl-3 pr-10 py-2 text-base border ${selectedPeriod === ""
                            ? "border-emerald-500 ring-2 ring-emerald-200"
                            : "border-gray-300"
                          } focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md`}
                        value={selectedPeriod}
                        onChange={handlePeriodChange}
                      >
                        <option value="">Todos los Períodos</option>
                        {uniquePeriods.map((period) => (
                          <option key={period} value={period}>
                            {period}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Cargando y errores */}
                {(loadingTalleres || loadingPreconfiguraciones) && (
                  <div className="text-center py-12">Cargando...</div>
                )}
                {(talleresError || errorPreconfiguraciones) && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded mx-6 mb-6">
                    Error: {talleresError || errorPreconfiguraciones}
                  </div>
                )}

                {/* Contenido según pestaña */}
                {activeTab !== "preconfiguraciones" && (
                  <div className="px-6 pb-6">
                    {filteredTalleres.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalleres.map((taller) => (
                          <div
                            key={taller.id_taller_impartido}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                          >
                            <div className="p-5">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {taller.nombre_publico}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {taller.descripcion}
                              </p>
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <BookOpen className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>
                                    Profesor:{" "}
                                    {taller.Usuario?.nombre +
                                      " " +
                                      taller.Usuario?.apellido ||
                                      taller.profesor_a_cargo ||
                                      "No asignado"}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>
                                    Período:{" "}
                                    {taller.PeriodoAcademico?.nombre_periodo}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>
                                    Alumnos inscritos: {taller.alumnos || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 flex space-x-3">
                              <button
                                onClick={() => handleViewDetails(taller)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </button>
                              <button
                                onClick={() => handleEditTaller(taller)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </button>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 flex space-x-3 border-t border-gray-200">
                              <button
                                onClick={() =>
                                  handleEstadoChange(taller.id_taller_impartido, taller.estado)
                                }
                                className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${taller.estado === "activo"
                                  ? "text-orange-700 bg-orange-100 hover:bg-orange-200"
                                  : "text-green-700 bg-green-100 hover:bg-green-200"
                                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors`}
                              >
                                {taller.estado === "activo" ? (
                                  <>
                                    <PowerOff className="w-4 h-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <Power className="w-4 h-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </button>
                              {activeTab === "archivados" && (
                                <button
                                  onClick={() => handleDeleteTaller(taller.id_taller_impartido)}
                                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No hay talleres disponibles
                        </h3>
                        <p className="text-gray-500">
                          {searchTerm
                            ? "No se encontraron talleres que coincidan con tu búsqueda."
                            : "Los talleres aparecerán aquí cuando se agreguen al sistema."}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "preconfiguraciones" && (
                  <div className="px-6 pb-6">
                    <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                      <select
                        value={selectedPreconfiguracionId}
                        onChange={handlePreconfiguracionSelect}
                        className="block w-full sm:w-1/2 md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      >
                        <option value="">
                          Selecciona una preconfiguración para crear
                        </option>
                        {preconfiguraciones.map((preconfig) => (
                          <option
                            key={preconfig.id_taller_definido}
                            value={preconfig.id_taller_definido}
                          >
                            {preconfig.nombre}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleApplyPreconfiguracion}
                        disabled={!selectedPreconfiguracionId}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 w-full sm:w-auto"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Usar Preconfiguración
                      </button>
                    </div>
                    {error && (
                      <div className="rounded-md bg-red-50 p-4 mb-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Error
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {preconfiguraciones.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {preconfiguraciones.map((preconfig) => (
                          <div
                            key={preconfig.id_taller_definido}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                          >
                            <div className="p-5">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {preconfig.nombre}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {preconfig.descripcion}
                              </p>
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <BookOpen className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>
                                    Nivel Educativo:{" "}
                                    {preconfig.nivel_educativo_minimo}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>
                                    Edades: {preconfig.edad_minima} -{" "}
                                    {preconfig.edad_maxima} años
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <ClipboardList className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>
                                    Niveles Totales: {preconfig.niveles_totales}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 flex space-x-3">
                              <button
                                onClick={() => handleApplyPreconfiguracionDirect(preconfig.id_taller_definido)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Usar como base
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No hay preconfiguraciones disponibles
                        </h3>
                        <p className="text-gray-500">
                          Las preconfiguraciones aparecerán aquí cuando se agreguen al sistema.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Formularios según contexto */}
            {showAddForm && selectedTaller && selectedTaller.id_taller_definido && !showEditForm && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Crear Taller a partir de Preconfiguración
                </h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!selectedPeriodoId || !selectedProfesorId) {
                      setError("Debes seleccionar un período y un profesor.")
                      return
                    }
                    try {
                      await createTaller({
                        id_taller_definido: selectedTaller.id_taller_definido,
                        nombre_publico: selectedTaller.nombre_publico,
                        descripcion_publica: selectedTaller.descripcion_publica,
                        id_periodo: parseInt(selectedPeriodoId),
                        profesor_asignado: parseInt(selectedProfesorId),
                        estado: "activo",
                      })
                      setShowAddForm(false)
                      setSelectedTaller(null)
                      setSelectedPeriodoId("")
                      setSelectedProfesorId("")
                      setError(null)
                      await refreshTalleres()
                    } catch (err) {
                      setError("Error al crear el taller: " + err.message)
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre del Taller
                    </label>
                    <input
                      type="text"
                      value={selectedTaller.nombre_publico}
                      onChange={(e) =>
                        setSelectedTaller({ ...selectedTaller, nombre_publico: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      value={selectedTaller.descripcion_publica}
                      disabled
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Período académico
                    </label>
                    <select
                      value={selectedPeriodoId}
                      onChange={(e) => setSelectedPeriodoId(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Selecciona un período</option>
                      {periodos
                        .filter((p) => p.estado === "ACTIVO")
                        .map((periodo) => (
                          <option key={periodo.id_periodo} value={periodo.id_periodo}>
                            {periodo.nombre_periodo}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profesor a cargo
                    </label>
                    <select
                      value={selectedProfesorId}
                      onChange={(e) => setSelectedProfesorId(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Selecciona un profesor</option>
                      {profesores.map((prof) => (
                        <option key={prof.id_usuario} value={prof.id_usuario}>
                          {prof.nombre} {prof.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                  >
                    Crear Taller
                  </button>
                  {error && <div className="text-red-600">{error}</div>}
                </form>
              </div>
            )}

            {showEditForm && selectedTaller && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Editar Taller
                </h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!selectedTaller.nombre_publico || !selectedTaller.descripcion_publica || !selectedTaller.profesor_asignado || !selectedTaller.id_periodo) {
                      setError("Completa todos los campos obligatorios.")
                      return
                    }
                    try {
                      await updateTaller(selectedTaller.id_taller_impartido, {
                        nombre_publico: selectedTaller.nombre_publico,
                        descripcion_publica: selectedTaller.descripcion_publica,
                        profesor_asignado: parseInt(selectedTaller.profesor_asignado),
                        id_periodo: parseInt(selectedTaller.id_periodo)
                      })
                      setShowEditForm(false)
                      setSelectedTaller(null)
                      setError(null)
                      await refreshTalleres()
                    } catch (err) {
                      setError("Error al actualizar el taller: " + err.message)
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Taller</label>
                    <input
                      type="text"
                      value={selectedTaller.nombre_publico}
                      onChange={e => setSelectedTaller({ ...selectedTaller, nombre_publico: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      value={selectedTaller.descripcion_publica}
                      onChange={e => setSelectedTaller({ ...selectedTaller, descripcion_publica: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Período académico</label>
                    <select
                      value={selectedTaller.id_periodo}
                      onChange={e => setSelectedTaller({ ...selectedTaller, id_periodo: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Selecciona un período</option>
                      {periodos
                        .filter(p => p.estado === "ACTIVO")
                        .map(periodo => (
                          <option key={periodo.id_periodo} value={periodo.id_periodo}>
                            {periodo.nombre_periodo}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profesor a cargo</label>
                    <select
                      value={selectedTaller.profesor_asignado}
                      onChange={e => setSelectedTaller({ ...selectedTaller, profesor_asignado: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Selecciona un profesor</option>
                      {profesores.map(prof => (
                        <option key={prof.id_usuario} value={prof.id_usuario}>
                          {prof.nombre} {prof.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                  >
                    Guardar Cambios
                  </button>
                  {error && <div className="text-red-600">{error}</div>}
                </form>
              </div>
            )}

            {showAddForm && (!selectedTaller || !selectedTaller.id_taller_definido) && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Crear Nuevo Taller
                </h2>
                <TallerForm
                  onClose={(success) => {
                    if (success) {
                      setShowAddForm(false)
                      setShowEditForm(false)
                      refreshTalleres()
                    } else {
                      setShowAddForm(false)
                    }
                    setError(null)
                  }}
                  userId={user?.id_usuario}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
