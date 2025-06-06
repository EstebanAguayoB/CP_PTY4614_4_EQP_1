import { useState, useEffect } from "react"
import { BookOpen, Users, FileText, X, Home, LayoutDashboard } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const DashboardProfeSidebar = ({ sidebarOpen, toggleSidebar, userRole = "Profesor" }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
  const location = useLocation()

  const handleResize = () => {
    const newIsDesktop = window.innerWidth >= 768
    setIsDesktop(newIsDesktop)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  const navigationItems = [
    {
      name: "Dashboard Profesor",
      path: "/dashboardprofesor",
      icon: LayoutDashboard,
    },
    {
      name: "Mis talleres",
      path: "/dashboardprofesor/talleres",
      icon: BookOpen,
    },
    {
      name: "Alumnos",
      path: "/dashboardprofesor/alumnos",
      icon: Users,
    },
    {
      name: "Evidencias",
      path: "/dashboardprofesor/evidencias",
      icon: FileText,
    },
  ]

  return (
    <aside
      className={`w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 
      fixed left-0 top-0 bottom-0 z-50 md:relative no-scrollbar 
      ${isDesktop || sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      bg-white text-gray-900 shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SkillTrack</span>
        </div>
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors" onClick={toggleSidebar}>
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <nav className="space-y-2 overflow-y-auto no-scrollbar flex-1">
        {/* Botón de Inicio */}
        <div>
          <Link to="/" className="w-full block">
            <button
              className={`w-full justify-start flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActiveRoute("/")
                  ? "bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Inicio
            </button>
          </Link>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Navegación principal */}
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name}>
              <Link to={item.path} className="w-full block">
                <button
                  className={`w-full justify-start flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(item.path)
                      ? "bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500">Rol actual</p>
          <p className="text-sm font-medium text-gray-900">{userRole}</p>
        </div>
      </div>
    </aside>
  )
}

export default DashboardProfeSidebar

