import { BookOpen, Users, BarChart3, ArrowRight, CheckCircle, Star, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "./shared/Navbar"

export default function LandingPage() {
  const navigate = useNavigate()

  const handleLogin = () => {
    console.log("Navegando a Login...")
    navigate("/login")
  }

  const handleGetStarted = () => {
    console.log("Desplazándose al footer...")
    const footer = document.getElementById("footer-section")
    if (footer) {
      footer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-teal-200 to-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-cyan-200 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

        {/* Nuevos elementos decorativos */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float-reverse"></div>
      </div>

      {/* Navbar */}
      <Navbar variant="landing" transparent={true} />

      {/* Hero Section mejorado */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        {/* Patrón decorativo mejorado */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Contenido principal mejorado */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-emerald-700 text-sm font-semibold mb-6 shadow-sm border border-emerald-200/50 backdrop-blur-sm">
                <Star className="w-4 h-4 mr-2 text-emerald-600" />
                Plataforma para gestionamiento de talleres #1
                <Sparkles className="w-4 h-4 ml-2 text-emerald-600" />
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Gestión{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  Eficiente
                </span>{" "}
                de Talleres Extracurriculares
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl font-light">
                SkillTrack automatiza la inscripción, evaluación del progreso, generación de reportes académicos, y
                supervisión por parte de tutores o apoderados en talleres extracurriculares.
              </p>

              {/* Lista de beneficios mejorada */}
              <div className="space-y-4 pt-4">
                {[
                  "Automatización de procesos",
                  "Generación de reportes inteligentes",
                  "Seguimiento personalizado de progreso en estudiantes",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 animate-fade-in-left"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Botón CTA mejorado */}
              <div className="pt-8">
                <button
                  onClick={handleGetStarted}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Más información
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Elemento visual mejorado */}
            <div className="relative animate-fade-in-right">
              <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-1 transition-all duration-700 hover:shadow-3xl">
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl"></div>

                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-inner">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-sm">
                      <Users className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Dashboard Intuitivo</h3>
                      <p className="text-gray-600">Gestión simplificada y eficiente</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-3/4 animate-progress"></div>
                    </div>
                    <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full w-1/2 animate-progress animation-delay-500"></div>
                    </div>
                    <div className="h-3 bg-cyan-100 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full w-5/6 animate-progress animation-delay-1000"></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 font-medium pt-2">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      Talleres Activos: 24
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                      Estudiantes: 156
                    </span>
                  </div>
                </div>
              </div>

              {/* Elementos flotantes mejorados */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-70 animate-float shadow-lg"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-teal-300 to-teal-400 rounded-2xl opacity-70 animate-float-delayed shadow-lg"></div>
              <div className="absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full opacity-60 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section mejorado */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Principales{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Funcionalidades
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Descubre cómo SkillTrack puede transformar la gestión de tus talleres extracurriculares
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: BookOpen,
                title: "Gestión de Talleres",
                description: "Creación y configuración de talleres por niveles, asignación de profesores y alumnos.",
                color: "emerald",
                gradient: "from-emerald-500 to-emerald-600",
              },
              {
                icon: Users,
                title: "Seguimiento de Alumnos",
                description: "Registro detallado de avances, con fechas, observaciones y evidencias del progreso.",
                color: "teal",
                gradient: "from-teal-500 to-teal-600",
              },
              {
                icon: BarChart3,
                title: "Reportes Automáticos",
                description: "Generación de reportes para tutores y coordinadores con datos verificados.",
                color: "cyan",
                gradient: "from-cyan-500 to-cyan-600",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div
                    className={`w-18 h-18 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-center font-medium">{feature.description}</p>

                  {/* Elemento decorativo mejorado */}
                  <div
                    className={`absolute top-6 right-6 w-3 h-3 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse`}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Elementos decorativos flotantes mejorados */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full opacity-30 animate-float shadow-lg"></div>
        <div className="absolute bottom-1/4 right-10 w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl rotate-45 opacity-30 animate-float-delayed shadow-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full opacity-25 animate-pulse-slow"></div>
      </section>

      {/* Footer mejorado */}
      <footer id="footer-section" className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info mejorado */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  SkillTrack
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed font-light">
                Plataforma líder en gestión de talleres extracurriculares. Automatizamos procesos para mejorar la
                experiencia de aprendizaje.
              </p>
              <div className="flex space-x-4">
                {[Users, BookOpen, BarChart3].map((Icon, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links mejorados */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-emerald-400">Enlaces</h3>
              <ul className="space-y-3">
                {["Inicio", "Contacto"].map((link, index) => (
                  <li key={index}>
                    <button className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-medium">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar mejorado */}
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-medium">© 2025 SkillTrack. Todos los derechos reservados.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              {["Política de Privacidad", "Términos de Servicio"].map((link, index) => (
                <button
                  key={index}
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300 font-medium"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-5deg); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: var(--target-width, 75%); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 3s; }
        
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-left { animation: fade-in-left 0.8s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out; }
        
        .animate-progress { animation: progress 2s ease-out; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        
        .bg-dot-pattern {
          background-image: radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}
