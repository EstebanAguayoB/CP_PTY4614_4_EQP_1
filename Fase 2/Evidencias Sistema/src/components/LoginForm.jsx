import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { supabase } from "../../lib/supabase"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Cargar credenciales guardadas al iniciar
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Función para validar el formulario antes del envío
  const validateForm = () => {
    // Verificar campos vacíos
    if (!formData.email.trim()) {
      toast.error("Por favor ingresa tu correo electrónico", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return false
    }

    if (!formData.password.trim()) {
      toast.error("Por favor ingresa tu contraseña", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return false
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresa un correo electrónico válido", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return false
    }

    // Validar longitud mínima de contraseña
    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario antes de proceder
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Verificar conexión a internet
      if (!navigator.onLine) {
        toast.error("No hay conexión a internet. Verifica tu conexión e intenta nuevamente.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setIsLoading(false)
        return
      }

      // Mostrar toast de carga
      const loadingToast = toast.loading("Verificando credenciales...", {
        position: "top-center",
      })

      // Intentar autenticación con timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), 15000),
      )

      const authPromise = supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      const { data, error } = await Promise.race([authPromise, timeoutPromise])

      // Cerrar toast de carga
      toast.dismiss(loadingToast)

      if (error) {
        let errorMessage = "Error al iniciar sesión. Intenta nuevamente."

        // Manejar diferentes tipos de errores de autenticación
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("invalid_credentials") ||
          error.message.includes("Invalid email or password")
        ) {
          // Verificar si el email existe en la base de datos
          try {
            const { data: userExists, error: checkError } = await supabase
              .from("Usuario")
              .select("correo")
              .eq("correo", formData.email.trim().toLowerCase())
              .single()

            if (checkError) {
              if (checkError.code === "PGRST116") {
                // No se encontró el usuario
                errorMessage = "No existe una cuenta con este correo electrónico."
              } else {
                // Error al consultar la base de datos
                errorMessage = "Contraseña inexistente."
              }
            } else if (userExists) {
              // El usuario existe, por lo tanto la contraseña es incorrecta
              errorMessage = "Contraseña inexistente."
            } else {
              // Caso de respaldo
              errorMessage = "No existe una cuenta con este correo electrónico."
            }
          } catch (checkError) {
            console.error("Error al verificar usuario:", checkError)
            // Si hay un error en la verificación, usar mensaje específico
            errorMessage = "Contraseña inexistente."
          }
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Tu cuenta no ha sido confirmada. Revisa tu correo electrónico."
        } else if (error.message.includes("Too many requests") || error.message.includes("rate_limit")) {
          errorMessage = "Demasiados intentos fallidos. Espera unos minutos antes de intentar nuevamente."
        } else if (error.message.includes("User not found")) {
          errorMessage = "No existe una cuenta con este correo electrónico."
        } else if (error.message.includes("Account locked") || error.message.includes("account_disabled")) {
          errorMessage = "Tu cuenta ha sido bloqueada. Contacta al administrador."
        } else if (error.message.includes("signup_disabled")) {
          errorMessage = "El registro está deshabilitado. Contacta al administrador."
        } else if (error.status >= 500) {
          errorMessage = "Error en el servidor. Intenta más tarde."
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch") ||
          error.message.includes("NetworkError")
        ) {
          errorMessage = "Error de conexión. Verifica tu red e intenta nuevamente."
        } else if (error.message.includes("timeout")) {
          errorMessage = "La solicitud ha tardado demasiado. Intenta nuevamente."
        }

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        // Limpiar contraseña en caso de error
        setFormData((prev) => ({
          ...prev,
          password: "",
        }))

        setIsLoading(false)
        return
      }

      // Si la autenticación fue exitosa, verificar información del usuario
      toast.success("Autenticación exitosa. Verificando permisos...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      // Obtener información del usuario para determinar el rol
      const { data: userData, error: userError } = await supabase
        .from("Usuario")
        .select("rol, estado, nombre, apellido")
        .eq("correo", formData.email.trim().toLowerCase())
        .single()

      if (userError) {
        let userErrorMessage = "Error al obtener información del usuario."

        if (userError.code === "PGRST116") {
          userErrorMessage = "Usuario no encontrado en el sistema. Contacta al administrador."
        } else if (userError.message.includes("network")) {
          userErrorMessage = "Error de conexión al verificar usuario. Intenta nuevamente."
        }

        toast.error(userErrorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      if (!userData) {
        toast.error("No se encontró información del usuario en el sistema. Contacta al administrador.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Verificar si el usuario está activo
      if (userData.estado !== "ACTIVO") {
        let statusMessage = "Tu cuenta no está activa. Contacta al administrador."

        if (userData.estado === "INACTIVO") {
          statusMessage = "Tu cuenta está inactiva. Contacta al administrador para reactivarla."
        } else if (userData.estado === "SUSPENDIDO") {
          statusMessage = "Tu cuenta ha sido suspendida. Contacta al administrador."
        } else if (userData.estado === "PENDIENTE") {
          statusMessage = "Tu cuenta está pendiente de aprobación. Contacta al administrador."
        }

        toast.error(statusMessage, {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Verificar rol válido
      if (!userData.rol || !["COORDINADOR", "PROFESOR"].includes(userData.rol)) {
        toast.error("Rol de usuario no reconocido o no autorizado para acceder al sistema.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Guardar email si "Recuérdame" está marcado
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email.trim().toLowerCase())
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      // Éxito completo
      const userName =
        userData.nombre && userData.apellido
          ? `${userData.nombre} ${userData.apellido}`
          : userData.nombre || formData.email.split("@")[0]

      // Limpiar formulario
      setFormData({
        email: "",
        password: "",
        rememberMe: formData.rememberMe,
      })

      // Redirigir según el rol del usuario
      setTimeout(() => {
        if (userData.rol === "COORDINADOR") {
          navigate("/dashboard")
        } else if (userData.rol === "PROFESOR") {
          navigate("/dashboardprofesor")
        }
      }, 1500)
    } catch (error) {
      console.error("Error durante el login:", error)

      let catchErrorMessage = "Error inesperado. Por favor, intenta nuevamente."

      if (error.message === "Tiempo de espera agotado") {
        catchErrorMessage = "La solicitud ha tardado demasiado. Verifica tu conexión e intenta nuevamente."
      } else if (error.message?.includes("fetch failed") || error.message?.includes("network")) {
        catchErrorMessage = "Error de conexión. Verifica tu red e intenta nuevamente."
      } else if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        catchErrorMessage = "No se pudo conectar con el servidor. Intenta más tarde."
      }

      toast.error(catchErrorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    navigate("/")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: white !important;
        background-color: transparent !important;
        background-image: none !important;
        transition: background-color 5000s ease-in-out 0s !important;
        -webkit-transition: background-color 5000s ease-in-out 0s !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

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
        <p className="text-center text-gray-200 animate-appear-delayed">Inicia sesión con tus credenciales</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              placeholder=""
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-400 focus:bg-transparent active:bg-transparent autofill:bg-transparent autofill:text-white"
              style={{
                backgroundColor: "transparent !important",
                boxShadow: "none !important",
                WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                WebkitTextFillColor: "white !important",
                transition: "background-color 5000s ease-in-out 0s !important",
                WebkitTransition: "background-color 5000s ease-in-out 0s !important",
              }}
              autoComplete="email"
              required
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
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
                boxShadow: "none !important",
                WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                WebkitTextFillColor: "white !important",
                transition: "background-color 5000s ease-in-out 0s !important",
                WebkitTransition: "background-color 5000s ease-in-out 0s !important",
              }}
              autoComplete="current-password"
              required
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-400 peer-focus:text-sm"
              htmlFor="password"
            >
              Contraseña
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-2 text-gray-300 hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-200">
              <input
                className="form-checkbox h-4 w-4 text-emerald-400 bg-gray-800 border-gray-300 rounded"
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <span className="ml-2">Recuérdame</span>
            </label>
            <button
              type="button"
              className="text-sm text-emerald-200 hover:underline disabled:opacity-50"
              disabled={isLoading}
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/?view=cm&to=skilltrack@educacion.cl&su=Restablecer%20contraseña",
                  "_blank",
                )
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="text-center text-gray-300">
          {"¿No tienes una cuenta? "}
          <button
            className="text-emerald-300 hover:underline disabled:opacity-50"
            disabled={isLoading}
            onClick={() =>
              window.open(
                "https://mail.google.com/mail/?view=cm&to=skilltrack@educacion.cl&su=Solicitud%20para%20crear%20cuenta%20en%20sistema",
                "_blank",
              )
            }
          >
            Contacta aquí
          </button>
        </div>

        {/* Botón para volver al inicio */}
        <div className="text-center">
          <button
            onClick={handleBackToHome}
            disabled={isLoading}
            className="text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
      {/* ToastContainer para las notificaciones */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        toastClassName="backdrop-blur-lg"
        style={{
          fontSize: "14px",
          fontWeight: "500",
        }}
      />
    </div>
  )
}
