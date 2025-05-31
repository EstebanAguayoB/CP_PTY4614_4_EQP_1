import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setIsAuthenticated(true)
      } else {
        navigate('/')
      }
      setLoading(false)
    }
    checkUser()
  }, [navigate])

  if (loading) return <p>Cargando...</p>

  return isAuthenticated ? children : null
}

export default ProtectedRoute
