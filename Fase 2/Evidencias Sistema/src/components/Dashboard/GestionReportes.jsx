import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"
import {
  Search,
  Download,
  X,
  User,
  Calendar,
  Users,
  BarChart3,
  BookOpen,
  PieChart,
  CheckCircle,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react"

export default function GestionReportes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [previewReport, setPreviewReport] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const navigate = useNavigate()

  // Obtener el usuario
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        fetchReportes()
      } else {
        navigate("/")
      }
    }
    getUser()
  }, [navigate])

  const fetchReportes = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("ReporteDesempeno").select(`
          id_reporte,
          fecha_generacion,
          resumen_semana,
          recomendaciones,
          ParticipacionEstudiante (
            Estudiante (
              nombre,
              apellido
            ),
            TallerImpartido (
              nombre_publico,
              TallerDefinido (*),
              Usuario (
                nombre,
                apellido
              )
            )
          )
        `)

      if (error) throw error

      const formattedReportes = data
        .map((reporte) => {
          if (!reporte.ParticipacionEstudiante) return null

          const tallerImpartido = reporte.ParticipacionEstudiante.TallerImpartido
          if (!tallerImpartido) return null

          // Parse resumen_semana con mejor lógica de extracción
          const resumen = reporte.resumen_semana || ""

          // Mejorar la extracción de métricas con múltiples patrones
          let progresoPromedio = 0
          let totalAlumnos = 0

          // Patrones para progreso promedio
          const progresoPatterns = [
            /Progreso promedio: (\d+\.?\d*)%/i,
            /progreso promedio del (\d+\.?\d*)%/i,
            /promedio de progreso: (\d+\.?\d*)%/i,
            /progreso promedio de (\d+\.?\d*)%/i,
          ]

          // Patrones para total de alumnos
          const alumnosPatterns = [
            /Total de alumnos: (\d+)/i,
            /(\d+) estudiantes?/i,
            /estado de (\d+) estudiantes?/i,
            /Se incluye el estado de (\d+) estudiantes?/i,
          ]

          // Buscar progreso promedio
          for (const pattern of progresoPatterns) {
            const match = resumen.match(pattern)
            if (match) {
              progresoPromedio = Number.parseFloat(match[1])
              break
            }
          }

          // Buscar total de alumnos
          for (const pattern of alumnosPatterns) {
            const match = resumen.match(pattern)
            if (match) {
              totalAlumnos = Number.parseInt(match[1], 10)
              break
            }
          }

          // Si no se encontró en el resumen, contar desde los detalles de alumnos
          const alumnosDetalles = resumen
            .split("Alumno: ")
            .slice(1)
            .map((detalle) => {
              const nombreMatch = detalle.match(/(.*?)[,.]/)
              const nivelMatch = detalle.match(/Nivel: (.*?)[,.]/)
              const progresoMatch = detalle.match(/Progreso individual: (\d+\.?\d*)%/)
              return {
                nombre: nombreMatch ? nombreMatch[1].trim() : "N/A",
                nivel: nivelMatch ? nivelMatch[1].trim() : "N/A",
                progreso: progresoMatch ? Number.parseFloat(progresoMatch[1]) : 0,
              }
            })
            .filter((alumno) => alumno.nombre !== "N/A")

          // Si no se encontró total de alumnos en el texto, usar el conteo de detalles
          if (totalAlumnos === 0 && alumnosDetalles.length > 0) {
            totalAlumnos = alumnosDetalles.length
          }

          // Si no se encontró progreso promedio, calcularlo desde los detalles
          if (progresoPromedio === 0 && alumnosDetalles.length > 0) {
            const sumaProgresos = alumnosDetalles.reduce((suma, alumno) => suma + alumno.progreso, 0)
            progresoPromedio = sumaProgresos / alumnosDetalles.length
          }

          // Parse recomendaciones
          const recomendacionesRaw = reporte.recomendaciones || ""
          const recomendacionesGenerales = recomendacionesRaw.split("Estudiante:")[0].trim()
          const recomendacionesEstudiantes = recomendacionesRaw
            .split("Estudiante: ")
            .slice(1)
            .map((rec) => {
              const [nombre, recomendacion] = rec.split(" - ")
              return { nombre: nombre.trim(), recomendacion: recomendacion.trim() }
            })

          return {
            id: reporte.id_reporte,
            nombre: tallerImpartido.nombre_publico || "Taller no especificado",
            profesor: `${tallerImpartido.Usuario?.nombre || "Profesor"} ${tallerImpartido.Usuario?.apellido || "No asignado"
              }`,
            alumnos: totalAlumnos, // Usar el valor calculado
            fecha: new Date(reporte.fecha_generacion).toLocaleDateString(),
            fechaCompleta: new Date(reporte.fecha_generacion).toLocaleString(),
            contenido: {
              resumen: resumen,
              recomendaciones: recomendacionesRaw,
              metricas: {
                progresoPromedio: Math.round(progresoPromedio * 100) / 100, // Redondear a 2 decimales
                totalAlumnos: totalAlumnos,
              },
              alumnosDetalles: alumnosDetalles,
              recomendacionesGenerales: recomendacionesGenerales,
              recomendacionesEstudiantes: recomendacionesEstudiantes,
              objetivos: [],
              resultados: [],
            },
          }
        })
        .filter(Boolean) // Eliminar entradas nulas

      setReportes(formattedReportes)
    } catch (error) {
      console.error("Error fetching reportes:", error)
      setError("No se pudieron cargar los reportes. Intente de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const filteredReportes = reportes.filter((reporte) => {
    const matchesSearch =
      reporte.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.contenido.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reporte.contenido.alumnosDetalles &&
        reporte.contenido.alumnosDetalles.some(alumno =>
          alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-700">Cargando reportes...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const handlePreviewReport = (reporte) => {
    setPreviewReport(reporte)
    setShowPreview(true)
  }

  const handleDownloadReport = async (reporte) => {
    setIsDownloading(true)

    try {
      // Importar jsPDF dinámicamente
      const { jsPDF } = await import("jspdf")

      // Crear nueva instancia de PDF
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - margin * 2
      let yPosition = margin

      // Función auxiliar para agregar texto con salto de línea automático
      const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize)
        doc.setFont("helvetica", isBold ? "bold" : "normal")
        doc.setTextColor(color[0], color[1], color[2])

        const lines = doc.splitTextToSize(text, maxWidth)

        // Verificar si necesitamos una nueva página
        if (yPosition + lines.length * fontSize * 0.5 > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }

        doc.text(lines, margin, yPosition)
        yPosition += lines.length * fontSize * 0.5 + 5
        return yPosition
      }

      // Función para agregar línea separadora
      const addSeparator = () => {
        doc.setDrawColor(16, 185, 129) // Color verde
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10
      }

      // Encabezado del documento
      doc.setFillColor(16, 185, 129) // Verde
      doc.rect(0, 0, pageWidth, 40, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("REPORTE DETALLADO", pageWidth / 2, 25, { align: "center" })

      yPosition = 50

      // Título del reporte
      addText(reporte.nombre, 16, true, [31, 41, 55])
      yPosition += 5

      addSeparator()

      // Información básica
      addText("INFORMACIÓN GENERAL", 14, true, [16, 185, 129])
      addText(`Fecha de Generación: ${reporte.fechaCompleta}`, 10)
      addText(`Profesor Responsable: ${reporte.profesor}`, 10)
      addText(`Estudiantes Participantes: ${reporte.alumnos}`, 10)
      yPosition += 5

      addSeparator()

      // Resumen ejecutivo
      addText("RESUMEN EJECUTIVO", 14, true, [16, 185, 129])
      addText(reporte.contenido.resumen, 10)
      yPosition += 5

      addSeparator()

      // Métricas de rendimiento del área (removed evidencias pendientes)
      addText("MÉTRICAS DE RENDIMIENTO", 14, true, [16, 185, 129])
      addText(`Progreso Promedio: ${reporte.contenido.metricas.progresoPromedio}%`, 10)
      addText(`Total de Alumnos: ${reporte.contenido.metricas.totalAlumnos}`, 10)
      // Removed evidencias pendientes line
      yPosition += 5

      if (reporte.contenido.alumnosDetalles && reporte.contenido.alumnosDetalles.length > 0) {
        addSeparator()
        addText("DETALLE POR ALUMNO", 14, true, [16, 185, 129])
        reporte.contenido.alumnosDetalles.forEach((alumno) => {
          addText(`- ${alumno.nombre}: Nivel ${alumno.nivel}, Progreso ${alumno.progreso}%`, 10)
        })
        yPosition += 5
      }

      addSeparator()

      // Recomendaciones
      addText("RECOMENDACIONES", 14, true, [16, 185, 129])
      if (reporte.contenido.recomendacionesGenerales) {
        addText(reporte.contenido.recomendacionesGenerales, 10)
      }
      if (reporte.contenido.recomendacionesEstudiantes && reporte.contenido.recomendacionesEstudiantes.length > 0) {
        reporte.contenido.recomendacionesEstudiantes.forEach((rec) => {
          addText(`- ${rec.nombre}: ${rec.recomendacion}`, 10)
        })
      }
      yPosition += 5

      // Footer
      const currentDate = new Date().toLocaleDateString("es-CL")
      doc.setFontSize(8)
      doc.setTextColor(107, 114, 128)
      doc.text(
        `Reporte generado el ${currentDate} | Sistema de Gestión de Talleres Educativos`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      )

      // Descargar el PDF
      const fileName = `Reporte_${reporte.nombre.replace(/\s+/g, "_")}_${reporte.fecha.replace(/\//g, "-")}.pdf`
      doc.save(fileName)

      // Mostrar mensaje de éxito
      alert(`Reporte "${reporte.nombre}" descargado exitosamente como PDF`)
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      alert("Error al generar el PDF. Por favor, intenta nuevamente.")
    } finally {
      setIsDownloading(false)
      setShowPreview(false)
    }
  }

  const closePreview = () => {
    setShowPreview(false)
    setPreviewReport(null)
  }

  const getMetricIcon = (type) => {
    switch (type) {
      case "tasaInscripcion":
        return <Users className="w-5 h-5 text-emerald-600" />
      case "promedioParticipacion":
        return <BarChart3 className="w-5 h-5 text-blue-600" />
      case "talleresActivos":
        return <BookOpen className="w-5 h-5 text-purple-600" />
      case "activosVsFinalizados":
        return <PieChart className="w-5 h-5 text-orange-600" />
      case "promedioTalleresPorProfesor":
        return <User className="w-5 h-5 text-teal-600" />
      case "tasaAsignacion":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "tasaExito":
        return <Award className="w-5 h-5 text-yellow-600" />
      case "tendenciasInscripcion":
        return <TrendingUp className="w-5 h-5 text-red-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole="Coordinador" />

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Modal de Previsualización */}
      {showPreview && previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Vista Previa del Reporte</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleDownloadReport(previewReport)}
                  disabled={isDownloading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Descargando...
                    </>
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  Descargar PDF
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8 overflow-y-auto h-[calc(90vh-70px)] bg-white">
              <div className="prose max-w-none">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{previewReport.nombre}</h1>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{previewReport.profesor}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{previewReport.fechaCompleta}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{previewReport.alumnos} participante(s)</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-500 pb-2 mb-4">
                      Resumen Ejecutivo
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{previewReport.contenido.resumen}</p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-500 pb-2 mb-4">
                      Métricas de Rendimiento
                    </h2>
                    {/* Modified grid to show only 2 columns instead of 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {previewReport.contenido.metricas.progresoPromedio}%
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Progreso Promedio</p>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {previewReport.contenido.metricas.totalAlumnos}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Total de Alumnos</p>
                      </div>
                      {/* Removed evidencias pendientes card */}
                    </div>
                    {previewReport.contenido.alumnosDetalles && previewReport.contenido.alumnosDetalles.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Detalle por Alumno</h3>
                        <ul className="space-y-2 list-disc list-inside">
                          {previewReport.contenido.alumnosDetalles.map((alumno, index) => (
                            <li key={index} className="text-gray-600">
                              <strong>{alumno.nombre}:</strong> Nivel {alumno.nivel}, Progreso individual:{" "}
                              {alumno.progreso}%
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-500 pb-2 mb-4">
                      Recomendaciones
                    </h2>
                    {previewReport.contenido.recomendacionesGenerales && (
                      <p className="text-gray-600 mb-4">{previewReport.contenido.recomendacionesGenerales}</p>
                    )}
                    {previewReport.contenido.recomendacionesEstudiantes &&
                      previewReport.contenido.recomendacionesEstudiantes.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-3">Recomendaciones Específicas</h3>
                          <ul className="space-y-2 list-disc list-inside">
                            {previewReport.contenido.recomendacionesEstudiantes.map((rec, index) => (
                              <li key={index} className="text-gray-600">
                                <strong>{rec.nombre}:</strong> {rec.recomendacion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserInfoBar user={user} logout={logout} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Reportes</h1>
            </div>

            {/* Barra de Búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de reporte, área o profesor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                />
              </div>
            </div>

            {/* Grid de Reportes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredReportes.map((reporte) => (
                <div
                  key={reporte.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-500">{reporte.fechaCompleta}</p>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{reporte.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {reporte.profesor}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handlePreviewReport(reporte)}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                      >
                        Ver Reporte
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
