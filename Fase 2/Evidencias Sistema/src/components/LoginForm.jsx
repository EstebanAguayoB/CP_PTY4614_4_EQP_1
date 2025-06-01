import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { supabase } from "../../lib/supabase"
import { toast } from "react-toastify"


export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    toast.error("Credenciales incorrectas. Intenta de nuevo.", {
      position: "top-right",
    })
  } else {
    toast.success("Inicio de sesión exitoso. Redirigiendo...", {
      position: "top-right",
    })
    setTimeout(() => navigate("/dashboard"), 1500) 
  }
}


  const handleBackToHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
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

      {/* Navbar centrado solo con logo */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center items-center py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-emerald-600 font-bold text-xl">SkillTrack</h1>
            <p className="text-gray-500 text-sm">Gestión Extracurricular</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-md w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8 animate-slideInFromLeft relative z-10 backdrop-blur-sm">
        <h2 className="text-center text-4xl font-extrabold text-white animate-appear">Bienvenido</h2>
        <p className="text-center text-gray-200 animate-appear-delayed">Inicia sesion con tus credenciales</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              placeholder=""
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-400 focus:bg-transparent active:bg-transparent autofill:bg-transparent autofill:text-white"
              style={{
                backgroundColor: "transparent !important",
                boxShadow: "none",
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "white",
              }}
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
              placeholder=""
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-400 focus:bg-transparent active:bg-transparent autofill:bg-transparent autofill:text-white"
              style={{
                backgroundColor: "transparent !important",
                boxShadow: "none",
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "white",
              }}
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

