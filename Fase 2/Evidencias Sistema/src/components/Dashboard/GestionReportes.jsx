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
  Award,
  Activity,
  BookOpen,
  PieChart,
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
          tasaInscripcion: {
            valor: 92.5,
            descripcion: "Porcentaje de inscripciones exitosas respecto a la capacidad total del área",
            detalles: [
              "Inscripciones totales: 185",
              "Capacidad total: 200",
              "Lista de espera: 35 estudiantes",
              "Tasa de conversión: 94.6%",
            ],
          },
          promedioParticipacion: {
            valor: 28.5,
            descripcion: "Promedio de estudiantes participantes por taller en el área",
            detalles: [
              "Talleres activos: 6",
              "Total participantes: 171",
              "Rango: 22-35 estudiantes por taller",
              "Desviación estándar: 4.2",
            ],
          },
          talleresActivos: {
            valor: 6,
            descripcion: "Número total de talleres activos en el área deportiva",
            detalles: ["Fútbol: 2 talleres", "Básquetbol: 1 taller", "Atletismo: 1 taller", "Natación: 2 talleres"],
          },
          activosVsFinalizados: {
            valor: "6:2",
            activos: 6,
            finalizados: 2,
            descripcion: "Relación entre talleres activos y finalizados en el período",
            detalles: [
              "Talleres activos: 6",
              "Talleres finalizados: 2",
              "Tasa de finalización: 25%",
              "Próximos a finalizar: 1",
            ],
          },
          promedioTalleresPorProfesor: {
            valor: 1.5,
            descripcion: "Promedio de talleres asignados por profesor en el área",
            detalles: [
              "Total profesores: 4",
              "Total talleres: 6",
              "Profesores con 1 taller: 2",
              "Profesores con 2 talleres: 2",
            ],
          },
          tasaAsignacion: {
            valor: 100,
            descripcion: "Porcentaje de talleres con profesor asignado",
            detalles: [
              "Talleres asignados: 6",
              "Talleres sin asignar: 0",
              "Profesores disponibles: 1",
              "Cobertura completa: Sí",
            ],
          },
          tasaExito: {
            valor: 88.7,
            descripcion: "Porcentaje de estudiantes que completan exitosamente los talleres del área",
            detalles: [
              "Estudiantes que completaron: 164 de 185",
              "Tasa de aprobación: 91.2%",
              "Tasa de retención: 87.5%",
              "Satisfacción promedio: 4.3/5",
            ],
          },
          tendenciasInscripcion: {
            valor: "+18.3%",
            descripcion: "Tendencia de crecimiento en inscripciones comparado con el período anterior",
            detalles: [
              "Inscripciones período actual: 185",
              "Inscripciones período anterior: 156",
              "Crecimiento absoluto: +29 inscripciones",
              "Proyección próximo período: +22%",
            ],
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
          tasaInscripcion: {
            valor: 87.5,
            descripcion: "Porcentaje de inscripciones exitosas respecto a la capacidad total del área",
            detalles: [
              "Inscripciones totales: 140",
              "Capacidad total: 160",
              "Lista de espera: 22 estudiantes",
              "Tasa de conversión: 91.2%",
            ],
          },
          promedioParticipacion: {
            valor: 23.3,
            descripcion: "Promedio de estudiantes participantes por taller en el área",
            detalles: [
              "Talleres activos: 6",
              "Total participantes: 140",
              "Rango: 18-28 estudiantes por taller",
              "Desviación estándar: 3.8",
            ],
          },
          talleresActivos: {
            valor: 6,
            descripcion: "Número total de talleres activos en el área artística",
            detalles: ["Pintura: 2 talleres", "Escultura: 1 taller", "Dibujo: 2 talleres", "Arte digital: 1 taller"],
          },
          activosVsFinalizados: {
            valor: "6:1",
            activos: 6,
            finalizados: 1,
            descripcion: "Relación entre talleres activos y finalizados en el período",
            detalles: [
              "Talleres activos: 6",
              "Talleres finalizados: 1",
              "Tasa de finalización: 14.3%",
              "Próximos a finalizar: 2",
            ],
          },
          promedioTalleresPorProfesor: {
            valor: 2.0,
            descripcion: "Promedio de talleres asignados por profesor en el área",
            detalles: [
              "Total profesores: 3",
              "Total talleres: 6",
              "Profesores con 2 talleres: 3",
              "Distribución equilibrada: Sí",
            ],
          },
          tasaAsignacion: {
            valor: 100,
            descripcion: "Porcentaje de talleres con profesor asignado",
            detalles: [
              "Talleres asignados: 6",
              "Talleres sin asignar: 0",
              "Profesores disponibles: 0",
              "Cobertura completa: Sí",
            ],
          },
          tasaExito: {
            valor: 92.1,
            descripcion: "Porcentaje de estudiantes que completan exitosamente los talleres del área",
            detalles: [
              "Estudiantes que completaron: 129 de 140",
              "Tasa de aprobación: 94.3%",
              "Tasa de retención: 92.1%",
              "Satisfacción promedio: 4.6/5",
            ],
          },
          tendenciasInscripcion: {
            valor: "+12.8%",
            descripcion: "Tendencia de crecimiento en inscripciones comparado con el período anterior",
            detalles: [
              "Inscripciones período actual: 140",
              "Inscripciones período anterior: 124",
              "Crecimiento absoluto: +16 inscripciones",
              "Proyección próximo período: +15%",
            ],
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
          tasaInscripcion: {
            valor: 91.4,
            descripcion: "Porcentaje de inscripciones exitosas respecto a la capacidad total del área",
            detalles: [
              "Inscripciones totales: 128",
              "Capacidad total: 140",
              "Lista de espera: 28 estudiantes",
              "Tasa de conversión: 89.6%",
            ],
          },
          promedioParticipacion: {
            valor: 25.6,
            descripcion: "Promedio de estudiantes participantes por taller en el área",
            detalles: [
              "Talleres activos: 5",
              "Total participantes: 128",
              "Rango: 20-32 estudiantes por taller",
              "Desviación estándar: 4.1",
            ],
          },
          talleresActivos: {
            valor: 5,
            descripcion: "Número total de talleres activos en el área musical",
            detalles: ["Piano: 2 talleres", "Guitarra: 1 taller", "Coro: 1 taller", "Ensamble: 1 taller"],
          },
          activosVsFinalizados: {
            valor: "5:3",
            activos: 5,
            finalizados: 3,
            descripcion: "Relación entre talleres activos y finalizados en el período",
            detalles: [
              "Talleres activos: 5",
              "Talleres finalizados: 3",
              "Tasa de finalización: 37.5%",
              "Próximos a finalizar: 1",
            ],
          },
          promedioTalleresPorProfesor: {
            valor: 1.7,
            descripcion: "Promedio de talleres asignados por profesor en el área",
            detalles: [
              "Total profesores: 3",
              "Total talleres: 5",
              "Profesores con 1 taller: 1",
              "Profesores con 2 talleres: 2",
            ],
          },
          tasaAsignacion: {
            valor: 100,
            descripcion: "Porcentaje de talleres con profesor asignado",
            detalles: [
              "Talleres asignados: 5",
              "Talleres sin asignar: 0",
              "Profesores disponibles: 1",
              "Cobertura completa: Sí",
            ],
          },
          tasaExito: {
            valor: 84.4,
            descripcion: "Porcentaje de estudiantes que completan exitosamente los talleres del área",
            detalles: [
              "Estudiantes que completaron: 108 de 128",
              "Tasa de aprobación: 87.5%",
              "Tasa de retención: 84.4%",
              "Satisfacción promedio: 4.1/5",
            ],
          },
          tendenciasInscripcion: {
            valor: "+25.9%",
            descripcion: "Tendencia de crecimiento en inscripciones comparado con el período anterior",
            detalles: [
              "Inscripciones período actual: 128",
              "Inscripciones período anterior: 102",
              "Crecimiento absoluto: +26 inscripciones",
              "Proyección próximo período: +28%",
            ],
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
          tasaInscripcion: {
            valor: 80.0,
            descripcion: "Porcentaje de inscripciones exitosas respecto a la capacidad total del área",
            detalles: [
              "Inscripciones totales: 96",
              "Capacidad total: 120",
              "Lista de espera: 8 estudiantes",
              "Tasa de conversión: 92.3%",
            ],
          },
          promedioParticipacion: {
            valor: 24.0,
            descripcion: "Promedio de estudiantes participantes por taller en el área",
            detalles: [
              "Talleres activos: 4",
              "Total participantes: 96",
              "Rango: 20-28 estudiantes por taller",
              "Desviación estándar: 3.2",
            ],
          },
          talleresActivos: {
            valor: 4,
            descripcion: "Número total de talleres activos en el área artística",
            detalles: [
              "Composición: 1 taller",
              "Creatividad: 1 taller",
              "Arte experimental: 1 taller",
              "Crítica artística: 1 taller",
            ],
          },
          activosVsFinalizados: {
            valor: "4:0",
            activos: 4,
            finalizados: 0,
            descripcion: "Relación entre talleres activos y finalizados en el período",
            detalles: [
              "Talleres activos: 4",
              "Talleres finalizados: 0",
              "Tasa de finalización: 0%",
              "Próximos a finalizar: 0",
            ],
          },
          promedioTalleresPorProfesor: {
            valor: 2.0,
            descripcion: "Promedio de talleres asignados por profesor en el área",
            detalles: [
              "Total profesores: 2",
              "Total talleres: 4",
              "Profesores con 2 talleres: 2",
              "Distribución equilibrada: Sí",
            ],
          },
          tasaAsignacion: {
            valor: 100,
            descripcion: "Porcentaje de talleres con profesor asignado",
            detalles: [
              "Talleres asignados: 4",
              "Talleres sin asignar: 0",
              "Profesores disponibles: 0",
              "Cobertura completa: Sí",
            ],
          },
          tasaExito: {
            valor: 95.8,
            descripcion: "Porcentaje de estudiantes que completan exitosamente los talleres del área",
            detalles: [
              "Estudiantes que completaron: 92 de 96",
              "Tasa de aprobación: 97.9%",
              "Tasa de retención: 95.8%",
              "Satisfacción promedio: 4.7/5",
            ],
          },
          tendenciasInscripcion: {
            valor: "+8.1%",
            descripcion: "Tendencia de crecimiento en inscripciones comparado con el período anterior",
            detalles: [
              "Inscripciones período actual: 96",
              "Inscripciones período anterior: 89",
              "Crecimiento absoluto: +7 inscripciones",
              "Proyección próximo período: +10%",
            ],
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
          tasaInscripcion: {
            valor: 94.3,
            descripcion: "Porcentaje de inscripciones exitosas respecto a la capacidad total del área",
            detalles: [
              "Inscripciones totales: 99",
              "Capacidad total: 105",
              "Lista de espera: 18 estudiantes",
              "Tasa de conversión: 84.6%",
            ],
          },
          promedioParticipacion: {
            valor: 33.0,
            descripcion: "Promedio de estudiantes participantes por taller en el área",
            detalles: [
              "Talleres activos: 3",
              "Total participantes: 99",
              "Rango: 30-36 estudiantes por taller",
              "Desviación estándar: 2.4",
            ],
          },
          talleresActivos: {
            valor: 3,
            descripcion: "Número total de talleres activos en el área musical",
            detalles: [
              "Interpretación vocal: 1 taller",
              "Interpretación instrumental: 1 taller",
              "Música de cámara: 1 taller",
            ],
          },
          activosVsFinalizados: {
            valor: "3:2",
            activos: 3,
            finalizados: 2,
            descripcion: "Relación entre talleres activos y finalizados en el período",
            detalles: [
              "Talleres activos: 3",
              "Talleres finalizados: 2",
              "Tasa de finalización: 40%",
              "Próximos a finalizar: 1",
            ],
          },
          promedioTalleresPorProfesor: {
            valor: 1.5,
            descripcion: "Promedio de talleres asignados por profesor en el área",
            detalles: [
              "Total profesores: 2",
              "Total talleres: 3",
              "Profesores con 1 taller: 1",
              "Profesores con 2 talleres: 1",
            ],
          },
          tasaAsignacion: {
            valor: 100,
            descripcion: "Porcentaje de talleres con profesor asignado",
            detalles: [
              "Talleres asignados: 3",
              "Talleres sin asignar: 0",
              "Profesores disponibles: 1",
              "Cobertura completa: Sí",
            ],
          },
          tasaExito: {
            valor: 89.9,
            descripcion: "Porcentaje de estudiantes que completan exitosamente los talleres del área",
            detalles: [
              "Estudiantes que completaron: 89 de 99",
              "Tasa de aprobación: 92.9%",
              "Tasa de retención: 89.9%",
              "Satisfacción promedio: 4.4/5",
            ],
          },
          tendenciasInscripcion: {
            valor: "+19.3%",
            descripcion: "Tendencia de crecimiento en inscripciones comparado con el período anterior",
            detalles: [
              "Inscripciones período actual: 99",
              "Inscripciones período anterior: 83",
              "Crecimiento absoluto: +16 inscripciones",
              "Proyección próximo período: +21%",
            ],
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
          tasaInscripcion: {
            valor: 73.3,
            descripcion: "Porcentaje de inscripciones exitosas respecto a la capacidad total del área",
            detalles: [
              "Inscripciones totales: 66",
              "Capacidad total: 90",
              "Lista de espera: 5 estudiantes",
              "Tasa de conversión: 93.0%",
            ],
          },
          promedioParticipacion: {
            valor: 22.0,
            descripcion: "Promedio de estudiantes participantes por taller en el área",
            detalles: [
              "Talleres activos: 3",
              "Total participantes: 66",
              "Rango: 20-24 estudiantes por taller",
              "Desviación estándar: 1.6",
            ],
          },
          talleresActivos: {
            valor: 3,
            descripcion: "Número total de talleres activos en el área teatral",
            detalles: ["Teatro básico: 1 taller", "Expresión corporal: 1 taller", "Improvisación: 1 taller"],
          },
          activosVsFinalizados: {
            valor: "3:1",
            activos: 3,
            finalizados: 1,
            descripcion: "Relación entre talleres activos y finalizados en el período",
            detalles: [
              "Talleres activos: 3",
              "Talleres finalizados: 1",
              "Tasa de finalización: 25%",
              "Próximos a finalizar: 1",
            ],
          },
          promedioTalleresPorProfesor: {
            valor: 1.5,
            descripcion: "Promedio de talleres asignados por profesor en el área",
            detalles: [
              "Total profesores: 2",
              "Total talleres: 3",
              "Profesores con 1 taller: 1",
              "Profesores con 2 talleres: 1",
            ],
          },
          tasaAsignacion: {
            valor: 100,
            descripcion: "Porcentaje de talleres con profesor asignado",
            detalles: [
              "Talleres asignados: 3",
              "Talleres sin asignar: 0",
              "Profesores disponibles: 0",
              "Cobertura completa: Sí",
            ],
          },
          tasaExito: {
            valor: 87.9,
            descripcion: "Porcentaje de estudiantes que completan exitosamente los talleres del área",
            detalles: [
              "Estudiantes que completaron: 58 de 66",
              "Tasa de aprobación: 90.9%",
              "Tasa de retención: 87.9%",
              "Satisfacción promedio: 4.2/5",
            ],
          },
          tendenciasInscripcion: {
            valor: "+6.5%",
            descripcion: "Tendencia de crecimiento en inscripciones comparado con el período anterior",
            detalles: [
              "Inscripciones período actual: 66",
              "Inscripciones período anterior: 62",
              "Crecimiento absoluto: +4 inscripciones",
              "Proyección próximo período: +8%",
            ],
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
      doc.text("REPORTE DETALLADO DE ÁREA", pageWidth / 2, 25, { align: "center" })

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

      // Métricas de rendimiento del área
      addText("MÉTRICAS DE RENDIMIENTO DEL ÁREA", 14, true, [16, 185, 129])

      const metricas = reporte.contenido.metricas

      // Tasa de Inscripción
      addText(`Tasa de Inscripción: ${metricas.tasaInscripcion.valor}%`, 12, true)
      addText(metricas.tasaInscripcion.descripcion, 10)
      metricas.tasaInscripcion.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Promedio de Participación por Taller
      addText(`Promedio de Participación por Taller: ${metricas.promedioParticipacion.valor}`, 12, true)
      addText(metricas.promedioParticipacion.descripcion, 10)
      metricas.promedioParticipacion.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Número Total de Talleres Activos
      addText(`Número Total de Talleres Activos: ${metricas.talleresActivos.valor}`, 12, true)
      addText(metricas.talleresActivos.descripcion, 10)
      metricas.talleresActivos.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Talleres Activos vs. Finalizados
      addText(`Talleres Activos vs. Finalizados: ${metricas.activosVsFinalizados.valor}`, 12, true)
      addText(metricas.activosVsFinalizados.descripcion, 10)
      metricas.activosVsFinalizados.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Promedio de Talleres por Profesor
      addText(`Promedio de Talleres por Profesor: ${metricas.promedioTalleresPorProfesor.valor}`, 12, true)
      addText(metricas.promedioTalleresPorProfesor.descripcion, 10)
      metricas.promedioTalleresPorProfesor.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Tasa de Asignación de Talleres
      addText(`Tasa de Asignación de Talleres: ${metricas.tasaAsignacion.valor}%`, 12, true)
      addText(metricas.tasaAsignacion.descripcion, 10)
      metricas.tasaAsignacion.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Tasa de Éxito
      addText(`Tasa de Éxito: ${metricas.tasaExito.valor}%`, 12, true)
      addText(metricas.tasaExito.descripcion, 10)
      metricas.tasaExito.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
      yPosition += 3

      // Tendencias de Inscripción
      addText(`Tendencias de Inscripción: ${metricas.tendenciasInscripcion.valor}`, 12, true)
      addText(metricas.tendenciasInscripcion.descripcion, 10)
      metricas.tendenciasInscripcion.detalles.forEach((detalle) => {
        addText(`• ${detalle}`, 9)
      })
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

                {/* Métricas de Rendimiento del Área */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Métricas de Rendimiento del Área</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Tasa de Inscripción */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("tasaInscripcion")}
                          <h4 className="font-semibold text-gray-900">Tasa de Inscripción</h4>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">
                          {previewReport.contenido.metricas.tasaInscripcion.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.tasaInscripcion.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.tasaInscripcion.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promedio de Participación por Taller */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("promedioParticipacion")}
                          <h4 className="font-semibold text-gray-900">Promedio de Participación</h4>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {previewReport.contenido.metricas.promedioParticipacion.valor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.promedioParticipacion.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.promedioParticipacion.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Número Total de Talleres Activos */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("talleresActivos")}
                          <h4 className="font-semibold text-gray-900">Talleres Activos</h4>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">
                          {previewReport.contenido.metricas.talleresActivos.valor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.talleresActivos.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.talleresActivos.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Talleres Activos vs. Finalizados */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("activosVsFinalizados")}
                          <h4 className="font-semibold text-gray-900">Activos vs. Finalizados</h4>
                        </div>
                        <span className="text-2xl font-bold text-orange-600">
                          {previewReport.contenido.metricas.activosVsFinalizados.valor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.activosVsFinalizados.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.activosVsFinalizados.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promedio de Talleres por Profesor */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("promedioTalleresPorProfesor")}
                          <h4 className="font-semibold text-gray-900">Talleres por Profesor</h4>
                        </div>
                        <span className="text-2xl font-bold text-teal-600">
                          {previewReport.contenido.metricas.promedioTalleresPorProfesor.valor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.promedioTalleresPorProfesor.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.promedioTalleresPorProfesor.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasa de Asignación de Talleres */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("tasaAsignacion")}
                          <h4 className="font-semibold text-gray-900">Tasa de Asignación</h4>
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          {previewReport.contenido.metricas.tasaAsignacion.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.tasaAsignacion.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.tasaAsignacion.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasa de Éxito */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("tasaExito")}
                          <h4 className="font-semibold text-gray-900">Tasa de Éxito</h4>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">
                          {previewReport.contenido.metricas.tasaExito.valor}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.tasaExito.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.tasaExito.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tendencias de Inscripción */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon("tendenciasInscripcion")}
                          <h4 className="font-semibold text-gray-900">Tendencias de Inscripción</h4>
                        </div>
                        <span className="text-2xl font-bold text-red-600">
                          {previewReport.contenido.metricas.tendenciasInscripcion.valor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewReport.contenido.metricas.tendenciasInscripcion.descripcion}
                      </p>
                      <div className="space-y-1">
                        {previewReport.contenido.metricas.tendenciasInscripcion.detalles.map((detalle, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {detalle}
                          </div>
                        ))}
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