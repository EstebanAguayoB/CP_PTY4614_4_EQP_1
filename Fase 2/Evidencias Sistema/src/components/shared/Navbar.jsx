import { useState, useEffect } from "react"
import { BookOpen, Menu, X, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar({
  variant = "landing",
  showNavigation = false,
  navigationItems = [],
  currentPath = "/",
  transparent = false,
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoClick = () => {
    navigate("/")
  }

  const handleLoginClick = () => {
    navigate("/login")
  }

  // Configuraciones por variante
  const variants = {
    landing: {
      showLogo: true,
      showLogin: true,
      showNavigation: false,
      bgClass: transparent
        ? isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100/50"
          : "bg-transparent"
        : "bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100/50",
    },
    dashboard: {
      showLogo: true,
      showLogin: false,
      showNavigation: true,
      bgClass: "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50",
    },
    auth: {
      showLogo: true,
      showLogin: false,
      showNavigation: false,
      bgClass: "bg-white/90 backdrop-blur-md shadow-sm",
    },
  }

  const config = variants[variant] || variants.landing

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${config.bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            {config.showLogo && (
              <div onClick={handleLogoClick} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-300">
                    SkillTrack
                  </span>
                  <div className="text-xs text-gray-500 -mt-1 font-medium">Gestión Educativa</div>
                </div>
              </div>
            )}

            {/* Navegación Desktop */}
            {config.showNavigation && showNavigation && (
              <div className="hidden lg:flex items-center space-x-8">
                {navigationItems.map((item, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => item.onClick && item.onClick()}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPath === item.path
                          ? "bg-emerald-100 text-emerald-700 shadow-sm"
                          : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Indicador activo */}
                    {currentPath === item.path && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Botón de Login */}
            {config.showLogin && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLoginClick}
                  className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 lg:px-8 lg:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
                >
                  {/* Efecto de brillo animado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">Iniciar Sesión</span>
                </button>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {config.showNavigation &&
                navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick && item.onClick()
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      currentPath === item.path
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

              {config.showLogin && (
                <button
                  onClick={() => {
                    handleLoginClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Espaciador para el navbar fijo */}
      <div className="h-16 lg:h-20"></div>
    </>
  )
}