import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTalleres() {
  const [talleres, setTalleres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadTalleres() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('TallerImpartido')
        .select('*, Usuario(nombre)')
      
      if (error) throw error
      
      setTalleres(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createTaller(tallerData) {
    try {
      const { data, error } = await supabase
        .from('TallerImpartido')
        .insert([tallerData])
        .select()
        .single()
      
      if (error) throw error
      
      setTalleres([...talleres, data])
      return { data }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  async function updateTaller(tallerId, tallerData) {
    try {
      const { data, error } = await supabase
        .from('TallerImpartido')
        .update(tallerData)
        .eq('id', tallerId)
        .select()
        .single()
      
      if (error) throw error

      setTalleres(talleres.map(t => t.id === tallerId ? data : t))
      return { data }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  async function updateTallerImpartido(tallerId, evidencias) {
    try {
      const { data, error } = await supabase
        .from('TallerImpartido')
        .update({ evidencias })
        .eq('id', tallerId)
        .select()
        .single()
      
      if (error) throw error

      setTalleres(talleres.map(t => t.id === tallerId ? data : t))
      return { data }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  async function updateEstadoTaller(tallerId, estado) {
    try {
      const { data, error } = await supabase
        .from('TallerImpartido')
        .update({ estado })
        .eq('id', tallerId)
        .select()
        .single()
      
      if (error) throw error

      setTalleres(talleres.map(t => t.id === tallerId ? data : t))
      return { data }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  async function deleteTaller(tallerId) {
    try {
      const { error } = await supabase
        .from('TallerImpartido')
        .delete()
        .eq('id', tallerId)
      
      if (error) throw error

      setTalleres(talleres.filter(t => t.id !== tallerId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadTalleres()
  }, [])

  return {
    talleres,
    loading,
    error,
    refresh: loadTalleres,
    createTaller,
    updateTaller,
    updateTallerImpartido,
    updateEstadoTaller,
    deleteTaller
  }
}
