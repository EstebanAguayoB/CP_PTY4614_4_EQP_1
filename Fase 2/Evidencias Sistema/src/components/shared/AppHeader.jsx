import { BookOpen } from "lucide-react"

export default function AppHeader({ title = "Dashboard", showNav = false, activeTab, setActiveTab, navItems = [] }) {
  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          {showNav && (
            <nav className="flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.key ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}