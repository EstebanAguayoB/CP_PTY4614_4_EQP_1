"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "./shared/LoadingSpinner"

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUserAndRole = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()

        if (!authData.user) {
          navigate("/")
          return
        }

        setIsAuthenticated(true)

        // Si no se especifican roles permitidos, solo verificar autenticación
        if (allowedRoles.length === 0) {
          setHasPermission(true)
          setLoading(false)
          return
        }

        // Obtener información del usuario desde la tabla Usuario
        const { data: userData, error } = await supabase
          .from("Usuario")
          .select("rol, estado")
          .eq("correo", authData.user.email)
          .single()

        if (error || !userData) {
          console.error("Error fetching user data:", error)
          navigate("/")
          return
        }

        // Verificar si el usuario está activo
        if (userData.estado !== "ACTIVO") {
          navigate("/")
          return
        }

        // Verificar si el rol del usuario está permitido
        if (allowedRoles.includes(userData.rol)) {
          setHasPermission(true)
        } else {
          // Redirigir al dashboard apropiado según el rol
          if (userData.rol === "COORDINADOR") {
            navigate("/dashboard")
          } else if (userData.rol === "PROFESOR") {
            navigate("/dashboardprofesor")
          } else {
            navigate("/")
          }
        }
      } catch (error) {
        console.error("Error checking user:", error)
        navigate("/")
      }
      setLoading(false)
    }

    checkUserAndRole()
  }, [navigate, allowedRoles])

  if (loading) return <LoadingSpinner />

  return isAuthenticated && hasPermission ? children : null
}

export default ProtectedRoute
