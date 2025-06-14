import { useState, useEffect } from "react"
import {
  Search,
  Download,
  FileText,
  Menu,
  BarChart3,
  X,
  Eye,
  Calendar,
  User,
  Users,
  TrendingUp,
  CheckCircle,
  Target,
  UserCheck,
  Star,
  Award,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../shared/DashboardSidebar"
import UserInfoBar from "../shared/UserInfoBar"

export default function GestionReportes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedArea, setSelectedArea] = useState("todos")
  const [previewReport, setPreviewReport] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const reportes = [
    {
      id: 1,
      nombre: "Avance en Técnicas y Rendimiento Deportivo",
      area: "Deporte",
      fecha: "20/04/2025",
      profesor: "Carlos Martínez",
      alumnos: 45,
      contenido: {
        resumen:
          "Evaluación integral del progreso de los estudiantes en técnicas deportivas fundamentales y su rendimiento físico durante el segundo trimestre del año académico.",
        metricas: {
          avancePromedio: {
            valor: 78.5,
            descripcion: "Promedio de avance en nivel de competencias deportivas",
            detalles: [
              "Técnica de carrera: 82%",
              "Resistencia cardiovascular: 75%",
              "Coordinación motriz: 80%",
              "Trabajo en equipo: 77%",
            ],
          },
          evidenciasValidadas: {
            valor: 92.3,
            total: 156,
            validadas: 144,
            descripcion: "Porcentaje de evidencias de progreso validadas por el instructor",
          },
          seguimientoPromedio: {
            valor: 3.2,
            descripcion: "Número promedio de seguimientos individualizados por estudiante",
            detalles: ["Evaluaciones técnicas: 2.1 por estudiante", "Seguimientos físicos: 1.1 por estudiante"],
          },
          retencion: {
            valor: 88.9,
            inicial: 45,
            actual: 40,
            descripcion: "Tasa de retención de estudiantes en el taller",
          },
          popularidad: {
            valor: 95.7,
            inscritos: 45,
            capacidad: 47,
            listaEspera: 12,
            descripcion: "Nivel de demanda del taller basado en inscripciones",
          },
          finalizacion: {
            valor: 85.4,
            completados: 35,
            total: 41,
            descripcion: "Porcentaje de estudiantes que completaron satisfactoriamente el taller",
          },
        },
        objetivos: [
          "Mejorar la técnica de carrera y salto en un 15%",
          "Desarrollar resistencia cardiovascular en todos los participantes",
          "Fortalecer habilidades de trabajo en equipo y liderazgo deportivo",
        ],
        resultados: [
          "85% de los estudiantes mejoraron su tiempo en carrera de 100m",
          "Incremento del 20% en resistencia cardiovascular promedio",
          "Mejora notable en coordinación y trabajo colaborativo en deportes de equipo",
          "Reducción del 30% en lesiones menores durante la práctica",
        ],
        recomendaciones: [
          "Continuar con entrenamientos progresivos de resistencia",
          "Implementar más ejercicios de coordinación específicos",
          "Reforzar técnicas de salto y velocidad",
          "Incluir más actividades de team building deportivo",
        ],
      },
    },
    {
      id: 2,
      nombre: "Progreso en Técnicas de Expresión Visual",
      area: "Arte",
      fecha: "19/04/2025",
      profesor: "María González",
      alumnos: 28,
      contenido: {
        resumen:
          "Análisis comprehensivo del desarrollo creativo y técnico de los estudiantes en artes visuales, con énfasis en pintura, dibujo y composición artística.",
        metricas: {
          avancePromedio: {
            valor: 82.1,
            descripcion: "Promedio de avance en técnicas artísticas y expresión creativa",
            detalles: [
              "Técnicas de pintura: 85%",
              "Composición visual: 79%",
              "Uso del color: 84%",
              "Creatividad original: 80%",
            ],
          },
          evidenciasValidadas: {
            valor: 96.4,
            total: 84,
            validadas: 81,
            descripcion: "Porcentaje de obras y proyectos artísticos validados",
          },
          seguimientoPromedio: {
            valor: 4.1,
            descripcion: "Número promedio de revisiones y retroalimentaciones por estudiante",
            detalles: ["Revisiones de técnica: 2.3 por estudiante", "Evaluaciones creativas: 1.8 por estudiante"],
          },
          retencion: {
            valor: 92.9,
            inicial: 28,
            actual: 26,
            descripcion: "Tasa de retención de estudiantes en el taller artístico",
          },
          popularidad: {
            valor: 87.5,
            inscritos: 28,
            capacidad: 32,
            listaEspera: 8,
            descripcion: "Nivel de demanda del taller de artes visuales",
          },
          finalizacion: {
            valor: 89.3,
            completados: 25,
            total: 28,
            descripcion: "Porcentaje de estudiantes que completaron el portafolio artístico",
          },
        },
        objetivos: [
          "Dominar técnicas básicas de pintura al óleo y acrílico",
          "Desarrollar un estilo personal y voz artística única",
          "Mejorar la composición visual y teoría del color",
        ],
        resultados: [
          "90% de estudiantes completaron proyectos de pintura avanzada",
          "Mejora significativa del 25% en uso efectivo del color",
          "Desarrollo exitoso de estilos personales únicos en el 78% de estudiantes",
          "Creación de 156 obras artísticas de calidad expositiva",
        ],
        recomendaciones: [
          "Explorar nuevas técnicas mixtas y experimentales",
          "Organizar exposición semestral de trabajos estudiantiles",
          "Introducir elementos de arte digital y nuevas tecnologías",
          "Implementar intercambios con otros talleres artísticos",
        ],
      },
    },
    {
      id: 3,
      nombre: "Evaluación de Desarrollo Rítmico y Melódico",
      area: "Música",
      fecha: "18/04/2025",
      profesor: "Ana Rodríguez",
      alumnos: 32,
      contenido: {
        resumen:
          "Evaluación detallada del progreso musical de los estudiantes en ritmo, melodía, armonía e interpretación instrumental durante el período académico.",
        metricas: {
          avancePromedio: {
            valor: 75.8,
            descripcion: "Promedio de avance en competencias musicales fundamentales",
            detalles: [
              "Precisión rítmica: 78%",
              "Reconocimiento melódico: 74%",
              "Interpretación instrumental: 76%",
              "Teoría musical: 75%",
            ],
          },
          evidenciasValidadas: {
            valor: 88.7,
            total: 128,
            validadas: 113,
            descripcion: "Porcentaje de interpretaciones y ejercicios musicales validados",
          },
          seguimientoPromedio: {
            valor: 3.8,
            descripcion: "Número promedio de evaluaciones musicales por estudiante",
            detalles: ["Evaluaciones técnicas: 2.2 por estudiante", "Presentaciones grupales: 1.6 por estudiante"],
          },
          retencion: {
            valor: 84.4,
            inicial: 32,
            actual: 27,
            descripcion: "Tasa de retención en el taller musical",
          },
          popularidad: {
            valor: 91.4,
            inscritos: 32,
            capacidad: 35,
            listaEspera: 15,
            descripcion: "Demanda del taller de desarrollo musical",
          },
          finalizacion: {
            valor: 81.3,
            completados: 26,
            total: 32,
            descripcion: "Porcentaje de estudiantes que completaron el programa musical",
          },
        },
        objetivos: [
          "Mejorar precisión rítmica y tempo en interpretaciones",
          "Desarrollar oído musical y reconocimiento de intervalos",
          "Perfeccionar interpretación instrumental individual y grupal",
        ],
        resultados: [
          "78% de estudiantes mejoraron significativamente su precisión rítmica",
          "Incremento notable del 22% en reconocimiento melódico y armónico",
          "Mejora sustancial en interpretación de instrumentos de cuerda y viento",
          "Realización exitosa de 3 conciertos estudiantiles",
        ],
        recomendaciones: [
          "Continuar con ejercicios intensivos de solfeo y dictado musical",
          "Implementar más práctica de conjunto y música de cámara",
          "Introducir nuevos instrumentos y géneros musicales",
          "Organizar masterclasses con músicos profesionales invitados",
        ],
      },
    },
    {
      id: 4,
      nombre: "Avance en Creatividad y Composición Artística",
      area: "Arte",
      fecha: "17/04/2025",
      profesor: "Luis Sánchez",
      alumnos: 24,
      contenido: {
        resumen:
          "Evaluación especializada del desarrollo creativo en composición artística, expresión personal y pensamiento crítico artístico de los estudiantes.",
        metricas: {
          avancePromedio: {
            valor: 86.3,
            descripcion: "Promedio de avance en creatividad y composición artística",
            detalles: [
              "Originalidad creativa: 88%",
              "Composición espacial: 85%",
              "Crítica artística: 84%",
              "Experimentación: 89%",
            ],
          },
          evidenciasValidadas: {
            valor: 94.1,
            total: 72,
            validadas: 68,
            descripcion: "Porcentaje de composiciones y proyectos creativos validados",
          },
          seguimientoPromedio: {
            valor: 4.5,
            descripcion: "Número promedio de revisiones creativas por estudiante",
            detalles: ["Críticas constructivas: 2.7 por estudiante", "Sesiones de experimentación: 1.8 por estudiante"],
          },
          retencion: {
            valor: 95.8,
            inicial: 24,
            actual: 23,
            descripcion: "Tasa de retención en el taller de composición",
          },
          popularidad: {
            valor: 80.0,
            inscritos: 24,
            capacidad: 30,
            listaEspera: 5,
            descripcion: "Demanda del taller de composición artística",
          },
          finalizacion: {
            valor: 91.7,
            completados: 22,
            total: 24,
            descripcion: "Porcentaje de estudiantes que completaron el portafolio creativo",
          },
        },
        objetivos: [
          "Fomentar creatividad original y pensamiento artístico innovador",
          "Mejorar comprensión de composición espacial y visual",
          "Desarrollar capacidades de crítica y análisis artístico",
        ],
        resultados: [
          "Incremento del 30% en originalidad y calidad de trabajos creativos",
          "Mejora significativa en comprensión de principios de composición",
          "Desarrollo exitoso de pensamiento crítico artístico en el 85% de estudiantes",
          "Creación de 68 obras experimentales de alto valor artístico",
        ],
        recomendaciones: [
          "Continuar fomentando experimentación con nuevos materiales",
          "Realizar más sesiones de crítica constructiva grupal",
          "Explorar movimientos de arte contemporáneo y vanguardista",
          "Establecer colaboraciones con galerías y espacios culturales locales",
        ],
      },
    },
    {
      id: 5,
      nombre: "Seguimiento de Interpretación Musical",
      area: "Música",
      fecha: "16/04/2025",
      profesor: "Ana Rodríguez",
      alumnos: 32,
      contenido: {
        resumen:
          "Seguimiento especializado del progreso en interpretación musical individual y grupal, con énfasis en expresividad y técnica interpretativa.",
        metricas: {
          avancePromedio: {
            valor: 81.2,
            descripcion: "Promedio de avance en interpretación y expresión musical",
            detalles: [
              "Técnica interpretativa: 83%",
              "Expresividad musical: 80%",
              "Música de conjunto: 82%",
              "Presencia escénica: 79%",
            ],
          },
          evidenciasValidadas: {
            valor: 91.5,
            total: 96,
            validadas: 88,
            descripcion: "Porcentaje de interpretaciones musicales validadas",
          },
          seguimientoPromedio: {
            valor: 4.2,
            descripcion: "Número promedio de evaluaciones interpretativas por estudiante",
            detalles: ["Recitales individuales: 2.4 por estudiante", "Presentaciones grupales: 1.8 por estudiante"],
          },
          retencion: {
            valor: 87.5,
            inicial: 32,
            actual: 28,
            descripcion: "Tasa de retención en interpretación musical",
          },
          popularidad: {
            valor: 93.3,
            inscritos: 32,
            capacidad: 35,
            listaEspera: 18,
            descripcion: "Demanda del taller de interpretación musical",
          },
          finalizacion: {
            valor: 84.4,
            completados: 27,
            total: 32,
            descripcion: "Porcentaje de estudiantes que completaron el programa interpretativo",
          },
        },
        objetivos: [
          "Mejorar técnica interpretativa individual en diversos instrumentos",
          "Desarrollar habilidades avanzadas de música de conjunto",
          "Perfeccionar expresión musical y presencia escénica",
        ],
        resultados: [
          "85% de estudiantes mejoraron significativamente su interpretación individual",
          "Excelente progreso en música de conjunto con 4 ensambles formados",
          "Mayor expresividad musical evidenciada en presentaciones públicas",
          "Realización exitosa de 2 recitales estudiantiles con alta asistencia",
        ],
        recomendaciones: [
          "Continuar con programa intensivo de recitales individuales",
          "Organizar más presentaciones grupales y colaboraciones",
          "Explorar repertorio de diferentes géneros y períodos musicales",
          "Implementar técnicas de manejo de ansiedad escénica",
        ],
      },
    },
    {
      id: 6,
      nombre: "Desarrollo de Habilidades Teatrales",
      area: "Arte",
      fecha: "15/04/2025",
      profesor: "Elena Torres",
      alumnos: 22,
      contenido: {
        resumen:
          "Evaluación integral del desarrollo de habilidades teatrales, expresión corporal, vocal y construcción de personajes en estudiantes del taller.",
        metricas: {
          avancePromedio: {
            valor: 79.4,
            descripcion: "Promedio de avance en competencias teatrales y expresivas",
            detalles: [
              "Expresión corporal: 82%",
              "Proyección vocal: 77%",
              "Construcción de personajes: 80%",
              "Confianza escénica: 78%",
            ],
          },
          evidenciasValidadas: {
            valor: 90.9,
            total: 66,
            validadas: 60,
            descripcion: "Porcentaje de actuaciones y ejercicios teatrales validados",
          },
          seguimientoPromedio: {
            valor: 3.9,
            descripcion: "Número promedio de evaluaciones teatrales por estudiante",
            detalles: ["Evaluaciones individuales: 2.1 por estudiante", "Presentaciones grupales: 1.8 por estudiante"],
          },
          retencion: {
            valor: 90.9,
            inicial: 22,
            actual: 20,
            descripcion: "Tasa de retención en el taller teatral",
          },
          popularidad: {
            valor: 73.3,
            inscritos: 22,
            capacidad: 30,
            listaEspera: 3,
            descripcion: "Demanda del taller de habilidades teatrales",
          },
          finalizacion: {
            valor: 86.4,
            completados: 19,
            total: 22,
            descripcion: "Porcentaje de estudiantes que completaron el programa teatral",
          },
        },
        objetivos: [
          "Mejorar expresión corporal y conciencia espacial escénica",
          "Desarrollar proyección vocal y dicción clara",
          "Fomentar confianza escénica y construcción de personajes",
        ],
        resultados: [
          "Notable mejora del 28% en expresión corporal y movimiento escénico",
          "Incremento significativo en confianza escénica y presencia teatral",
          "Mejor proyección vocal y claridad en diálogos teatrales",
          "Montaje exitoso de 2 obras cortas con participación estudiantil completa",
        ],
        recomendaciones: [
          "Continuar con ejercicios intensivos de improvisación teatral",
          "Organizar montaje de obra teatral completa para fin de semestre",
          "Trabajar más intensivamente en expresión facial y gestual",
          "Incluir técnicas de relajación y concentración para actuación",
        ],
      },
    },
  ]

  const areas = ["todos", "Deporte", "Arte", "Música"]

  const filteredReportes = reportes.filter((reporte) => {
    const matchesSearch =
      reporte.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.profesor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArea = selectedArea === "todos" || reporte.area === selectedArea
    return matchesSearch && matchesArea
  })

  const getAreaCount = (area) => {
    return reportes.filter((reporte) => reporte.area === area).length
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
      doc.text("REPORTE DETALLADO DE TALLER", pageWidth / 2, 25, { align: "center" })

      yPosition = 50

      // Título del reporte
      addText(reporte.nombre, 16, true, [31, 41, 55])
      addText(`Área: ${reporte.area}`, 12, false, [107, 114, 128])
      yPosition += 5

      addSeparator()

      // Información básica
      addText("INFORMACIÓN GENERAL", 14, true, [16, 185, 129])
      addText(`Fecha de Generación: ${reporte.fecha}`, 10)
      addText(`Profesor Responsable: ${reporte.profesor}`, 10)
      addText(`Estudiantes Participantes: ${reporte.alumnos}`, 10)
      yPosition += 5

      addSeparator()

      // Resumen ejecutivo
      addText("RESUMEN EJECUTIVO", 14, true, [16, 185, 129])
      addText(reporte.contenido.resumen, 10)
      yPosition += 5

      addSeparator()

      // Métricas de rendimiento
      addText("MÉTRICAS DE RENDIMIENTO", 14, true, [16, 185, 129])

      const metricas = reporte.contenido.metricas

      // Avance Promedio
      addText(`Avance Promedio de Nivel: ${metricas.avancePromedio.valor}%`, 12, true)
      addText(metricas.avancePromedio.descripcion, 10)
      metricas.avancePromedio.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Evidencias Validadas
      addText(`Evidencias Validadas: ${metricas.evidenciasValidadas.valor}%`, 12, true)
      addText(metricas.evidenciasValidadas.descripcion, 10)
      addText(`• Total: ${metricas.evidenciasValidadas.total}`, 9)
      addText(`• Validadas: ${metricas.evidenciasValidadas.validadas}`, 9)
      yPosition += 3

      // Seguimientos
      addText(`Seguimientos por Estudiante: ${metricas.seguimientoPromedio.valor}`, 12, true)
      addText(metricas.seguimientoPromedio.descripcion, 10)
      metricas.seguimientoPromedio.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Retención
      addText(`Tasa de Retención: ${metricas.retencion.valor}%`, 12, true)
      addText(metricas.retencion.descripcion, 10)
      addText(`• Inicial: ${metricas.retencion.inicial} estudiantes`, 9)
      addText(`• Actual: ${metricas.retencion.actual} estudiantes`, 9)
      yPosition += 3

      // Popularidad
      addText(`Popularidad del Taller: ${metricas.popularidad.valor}%`, 12, true)
      addText(metricas.popularidad.descripcion, 10)
      addText(`• Inscritos: ${metricas.popularidad.inscritos}`, 9)
      addText(`• Capacidad: ${metricas.popularidad.capacidad}`, 9)
      addText(`• Lista de espera: ${metricas.popularidad.listaEspera}`, 9)
      yPosition += 3

      // Finalización
      addText(`Tasa de Finalización: ${metricas.finalizacion.valor}%`, 12, true)
      addText(metricas.finalizacion.descripcion, 10)
      addText(`• Completados: ${metricas.finalizacion.completados}`, 9)
      addText(`• Total: ${metricas.finalizacion.total}`, 9)
      yPosition += 5

      addSeparator()

      // Objetivos
      addText("OBJETIVOS DEL PERÍODO", 14, true, [16, 185, 129])
      reporte.contenido.objetivos.forEach((objetivo) => {
        addText(`• ${objetivo}`, 10)
      })
      yPosition += 5

      addSeparator()

      // Resultados
      addText("RESULTADOS OBTENIDOS", 14, true, [16, 185, 129])
      reporte.contenido.resultados.forEach((resultado) => {
        addText(`• ${resultado}`, 10)
      })
      yPosition += 5

      addSeparator()

      // Recomendaciones
      addText("RECOMENDACIONES", 14, true, [16, 185, 129])
      reporte.contenido.recomendaciones.forEach((recomendacion) => {
        addText(`• ${recomendacion}`, 10)
      })

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

  const getAreaColor = (area) => {
    switch (area) {
      case "Deporte":
        return "bg-blue-100 text-blue-800"
      case "Arte":
        return "bg-purple-100 text-purple-800"
      case "Música":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMetricIcon = (type) => {
    switch (type) {
      case "avance":
        return <TrendingUp className="w-5 h-5 text-emerald-600" />
      case "evidencias":
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case "seguimiento":
        return <Target className="w-5 h-5 text-purple-600" />
      case "retencion":
        return <UserCheck className="w-5 h-5 text-orange-600" />
      case "popularidad":
        return <Star className="w-5 h-5 text-yellow-600" />
      case "finalizacion":
        return <Award className="w-5 h-5 text-green-600" />
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-500">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Previsualización del Reporte Detallado</h2>
              </div>
              <button onClick={closePreview} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-8">
                {/* Información del Reporte */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{previewReport.nombre}</h1>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha</p>
                        <p className="font-semibold text-gray-900">{previewReport.fecha}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Profesor</p>
                        <p className="font-semibold text-gray-900">{previewReport.profesor}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Estudiantes</p>
                        <p className="font-semibold text-gray-900">{previewReport.alumnos}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getAreaColor(previewReport.area)}`}>
                      Área: {previewReport.area}
                    </span>
                  </div>
                </div>

                {/* Resumen */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Resumen Ejecutivo</h3>
                  <p className="text-gray-700 leading-relaxed">{previewReport.contenido.resumen}</p>
                </div>

                {/* Métricas de Rendimiento */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Métricas de Rendimiento del Taller</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Avance Promedio */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("avance")}
                          <h4 className="font-semibold text-gray-900">Avance Promedio</h4>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">
                          {previewReport.contenido.metricas.avancePromedio.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.avancePromedio.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.avancePromedio.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidencias Validadas */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("evidencias")}
                          <h4 className="font-semibold text-gray-900">Evidencias Validadas</h4>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {previewReport.contenido.metricas.evidenciasValidadas.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.evidenciasValidadas.descripcion}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          • Total: {previewReport.contenido.metricas.evidenciasValidadas.total}
                        </div>
                        <div className="text-xs text-gray-500">
                          • Validadas: {previewReport.contenido.metricas.evidenciasValidadas.validadas}
                        </div>
                      </div>
                    </div>

                    {/* Seguimientos */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("seguimiento")}
                          <h4 className="font-semibold text-gray-900">Seguimientos</h4>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">
                          {previewReport.contenido.metricas.seguimientoPromedio.valor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.seguimientoPromedio.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.seguimientoPromedio.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Retención */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("retencion")}
                          <h4 className="font-semibold text-gray-900">Tasa de Retención</h4>
                        </div>
                        <span className="text-2xl font-bold text-orange-600">
                          {previewReport.contenido.metricas.retencion.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.retencion.descripcion}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          • Inicial: {previewReport.contenido.metricas.retencion.inicial} estudiantes
                        </div>
                        <div className="text-xs text-gray-500">
                          • Actual: {previewReport.contenido.metricas.retencion.actual} estudiantes
                        </div>
                      </div>
                    </div>

                    {/* Popularidad */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("popularidad")}
                          <h4 className="font-semibold text-gray-900">Popularidad</h4>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">
                          {previewReport.contenido.metricas.popularidad.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.popularidad.descripcion}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          • Inscritos: {previewReport.contenido.metricas.popularidad.inscritos}
                        </div>
                        <div className="text-xs text-gray-500">
                          • Capacidad: {previewReport.contenido.metricas.popularidad.capacidad}
                        </div>
                        <div className="text-xs text-gray-500">
                          • Lista de espera: {previewReport.contenido.metricas.popularidad.listaEspera}
                        </div>
                      </div>
                    </div>

                    {/* Finalización */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("finalizacion")}
                          <h4 className="font-semibold text-gray-900">Tasa de Finalización</h4>
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          {previewReport.contenido.metricas.finalizacion.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.finalizacion.descripcion}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          • Completados: {previewReport.contenido.metricas.finalizacion.completados}
                        </div>
                        <div className="text-xs text-gray-500">
                          • Total: {previewReport.contenido.metricas.finalizacion.total}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido del Reporte */}
                <div className="space-y-8">
                  {/* Objetivos */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Objetivos del Período</h3>
                    <ul className="space-y-2">
                      {previewReport.contenido.objetivos.map((objetivo, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{objetivo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resultados */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Resultados Obtenidos</h3>
                    <ul className="space-y-2">
                      {previewReport.contenido.resultados.map((resultado, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{resultado}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recomendaciones */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Recomendaciones</h3>
                    <ul className="space-y-2">
                      {previewReport.contenido.metricas.recomendaciones?.map((recomendacion, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{recomendacion}</span>
                        </li>
                      )) ||
                        previewReport.contenido.recomendaciones.map((recomendacion, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{recomendacion}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">Reporte generado el {previewReport.fecha}</p>
              <div className="flex space-x-3">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleDownloadReport(previewReport)}
                  disabled={isDownloading}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? "Descargando..." : "Descargar PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
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
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Reemplazar todo el user info bar por el componente optimizado */}
        <UserInfoBar user={user} onLogout={logout} />

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                    <p className="text-3xl font-bold text-gray-900">{reportes.length}</p>
                    <p className="text-sm text-emerald-600">desde el último periodo</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reportes área Deporte</p>
                    <p className="text-3xl font-bold text-gray-900">{getAreaCount("Deporte")}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reportes área Artes</p>
                    <p className="text-3xl font-bold text-gray-900">{getAreaCount("Arte")}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reportes área Musical</p>
                    <p className="text-3xl font-bold text-gray-900">{getAreaCount("Música")}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Reportes */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Reportes Generados</h2>
                    <p className="text-gray-600">Gestiona y descarga los reportes detallados del sistema</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar reportes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area === "todos" ? "Todas las áreas" : `Área ${area}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombres
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profesor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumnos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReportes.map((reporte) => (
                      <tr key={reporte.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{reporte.nombre}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAreaColor(reporte.area)}`}>
                            {reporte.area}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reporte.profesor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{reporte.fecha}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reporte.alumnos}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handlePreviewReport(reporte)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Descargar reporte
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredReportes.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron reportes</h3>
                  <p className="text-gray-500">Intenta ajustar tu búsqueda o filtros.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}