import { BookOpen } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "url(/bg-decorative.png) repeat",
          opacity: 0.1,
          zIndex: -1,
        }}
      />

      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        {/* Spinner Animation */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando</h3>
          <p className="text-gray-600">Verificando credenciales...</p>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}
