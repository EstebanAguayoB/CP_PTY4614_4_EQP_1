import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    userType: "Profesor", // Nuevo campo para tipo de usuario
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempt:", formData)

    // Simular autenticación exitosa y redirigir al dashboard
    if (formData.email && formData.password) {
      navigate("/dashboard")
    }
  }

  const handleBackToHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Patrón de puntos */}
        <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>

        {/* Formas geométricas flotantes */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-emerald-300 rounded-lg rotate-45 opacity-30 animate-float"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-teal-300 rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-cyan-300 rotate-12 opacity-30 animate-pulse"></div>
      </div>

      {/* Formulario */}
      <div className="max-w-md w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8 animate-slideInFromLeft relative z-10 backdrop-blur-sm">
        <h2 className="text-center text-4xl font-extrabold text-white animate-appear">Bienvenido</h2>
        <p className="text-center text-gray-200 animate-appear-delayed">Inicia sesion con tus credenciales</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de tipo de usuario */}
          <div className="space-y-2">
            <label className="text-sm text-gray-200 font-medium">Tipo de Usuario</label>
            <div className="flex space-x-4">
              <label className="flex items-center text-sm text-gray-200">
                <input
                  type="radio"
                  name="userType"
                  value="Profesor"
                  checked={formData.userType === "Profesor"}
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-emerald-400 bg-gray-800 border-gray-300"
                />
                <span className="ml-2">Profesor</span>
              </label>
              <label className="flex items-center text-sm text-gray-200">
                <input
                  type="radio"
                  name="userType"
                  value="Coordinador"
                  checked={formData.userType === "Coordinador"}
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-emerald-400 bg-gray-800 border-gray-300"
                />
                <span className="ml-2">Coordinador</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              placeholder="john@example.com"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-400"
              required
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-400 peer-focus:text-sm"
              htmlFor="email"
            >
              Correo Institucional
            </label>
          </div>

          <div className="relative">
            <input
              placeholder="Password"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-400"
              required
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-400 peer-focus:text-sm"
              htmlFor="password"
            >
              Contraseña
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-200">
              <input
                className="form-checkbox h-4 w-4 text-emerald-400 bg-gray-800 border-gray-300 rounded"
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span className="ml-2">Recuerdame</span>
            </label>
            <button
              type="button"
              className="text-sm text-emerald-200 hover:underline"
              onClick={() => console.log("Forgot password clicked")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
            type="submit"
          >
            Iniciar
          </button>
        </form>

        <div className="text-center text-gray-300">
          {"No tienes una cuenta? "}
          <button className="text-emerald-300 hover:underline" onClick={() => console.log("Sign up clicked")}>
            Contacta aqui
          </button>
        </div>

        {/* Botón para volver al inicio */}
        <div className="text-center">
          <button onClick={handleBackToHome} className="text-sm text-gray-300 hover:text-white transition-colors">
            ← Volver al inicio
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes appear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
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
        
        .animate-slideInFromLeft {
          animation: slideInFromLeft 1s ease-out;
        }
        
        .animate-appear {
          animation: appear 2s ease-out;
        }
        
        .animate-appear-delayed {
          animation: appear 3s ease-out;
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
          background-image: radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}
