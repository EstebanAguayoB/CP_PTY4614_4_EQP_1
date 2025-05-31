import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen } from "lucide-react"
import Navbar from "./shared/Navbar"

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
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

    {/* Navbar */}
      <Navbar variant="landing" transparent={true} />

      {/* Elementos decorativos de fondo */}
      <div
        className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,_white,_transparent_70%)]"
        aria-hidden="true"
      >
        <div
          className="absolute bg-emerald-200 opacity-50 h-[300px] w-[300px] rounded-full top-[20%] left-[20%] blur-3xl"
          style={{ transform: "translate(-50%, -50%)" }}
        />
        <div
          className="absolute bg-teal-200 opacity-50 h-[300px] w-[300px] rounded-full bottom-[20%] right-[20%] blur-3xl"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Formulario */}
      <div className="max-w-md w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8 animate-slideInFromLeft relative z-10 backdrop-blur-sm">
        <h2 className="text-center text-4xl font-extrabold text-white animate-appear">Bienvenido</h2>
        <p className="text-center text-gray-200 animate-appear-delayed">Inicia sesion con tus credenciales</p>

        <form onSubmit={handleSubmit} className="space-y-6">

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
            type="submit"
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition-colors duration-200"
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
    </div>
  )
}