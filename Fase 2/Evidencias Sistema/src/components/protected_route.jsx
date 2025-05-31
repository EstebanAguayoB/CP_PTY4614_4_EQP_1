import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "./shared/LoadingSpinner"

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          setIsAuthenticated(true)
        } else {
          navigate("/")
        }
      } catch (error) {
        console.error("Error checking user:", error)
        navigate("/")
      }
      setLoading(false)
    }
    checkUser()
  }, [navigate])

  if (loading) return <LoadingSpinner />

  return isAuthenticated ? children : null
}

export default ProtectedRoute