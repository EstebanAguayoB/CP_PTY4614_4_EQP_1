import { BookOpen, Users, BarChart3, ArrowRight, CheckCircle, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "./shared/Navbar"

export default function LandingPage() {
  const navigate = useNavigate()

  // Funciones para manejar la navegación
  const handleLogin = () => {
    console.log("Navegando a Login...")
    navigate("/login")
  }

  const handleGetStarted = () => {
    console.log("Comenzando...")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-emerald-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <Navbar variant="landing" transparent={true} />

      {/* Hero Section */}
      <section className="relative z-10 bg-emerald-50 px-6 py-24">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido principal */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <Star className="w-4 h-4 mr-2" />
                Plataforma para gestionamiento de talleres #1
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Gestión{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Eficiente
                </span>{" "}
                de Talleres Extracurriculares
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                SkillTrack automatiza la inscripción, evaluación del progreso, generación de reportes académicos, y
                supervisión por parte de tutores o apoderados en talleres extracurriculares.
              </p>

              {/* Lista de beneficios */}
              <div className="space-y-3">
                {[
                  "Automatización de procesos",
                  "Generacion de reportes",
                  "Seguimiento personalizado de progreso en estudiantes",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 inline-flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Elemento visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dashboard Intuitivo</h3>
                      <p className="text-gray-600 text-sm">Gestión simplificada</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 bg-emerald-200 rounded-full">
                      <div className="h-2 bg-emerald-500 rounded-full w-3/4"></div>
                    </div>
                    <div className="h-2 bg-teal-200 rounded-full">
                      <div className="h-2 bg-teal-500 rounded-full w-1/2"></div>
                    </div>
                    <div className="h-2 bg-cyan-200 rounded-full">
                      <div className="h-2 bg-cyan-500 rounded-full w-5/6"></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Talleres Activos: 24</span>
                    <span>Estudiantes: 156</span>
                  </div>
                </div>
              </div>

              {/* Elementos flotantes */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-300 rounded-full opacity-60 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-teal-300 rounded-lg opacity-60 animate-float-delayed"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Principales{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Funcionalidades
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre cómo SkillTrack puede transformar la gestión de tus talleres extracurriculares
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Gestión de Talleres",
                description: "Creación y configuración de talleres por niveles, asignación de profesores y alumnos.",
                color: "emerald",
              },
              {
                icon: Users,
                title: "Seguimiento de Alumnos",
                description: "Registro detallado de avances, con fechas, observaciones y evidencias del progreso.",
                color: "teal",
              },
              {
                icon: BarChart3,
                title: "Reportes Automáticos",
                description: "Generación de reportes para tutores y coordinadores con datos verificados.",
                color: "cyan",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r from-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>

                  {/* Elemento decorativo */}
                  <div
                    className={`absolute top-4 right-4 w-2 h-2 bg-${feature.color}-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-emerald-100 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-teal-100 rounded-lg rotate-45 opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-cyan-100 rounded-full opacity-15 animate-pulse"></div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">SkillTrack</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Plataforma líder en gestión de talleres extracurrilulares. Automatizamos procesos para mejorar la
                experiencia de aprendizaje.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Users className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-300 hover:text-emerald-400 transition-colors">Inicio</button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-emerald-400 transition-colors">Contacto</button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 SkillTrack. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Política de Privacidad
              </button>
              <button className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Términos de Servicio
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
        
        .bg-dot-pattern {
          background-image: radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}