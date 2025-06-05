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
        .select('*, Usuario(nombre,apellido),TallerDefinido(*),PeriodoAcademico(nombre_periodo)')
      
      if (error) throw error
      
      setTalleres(data)
      console.log(data);
      
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
        .insert([{
          id_taller_definido: parseInt(tallerData.id_taller_definido),
          id_periodo: parseInt(tallerData.id_periodo),
          nombre_publico: tallerData.nombre_publico,
          descripcion_publica: tallerData.descripcion_publica,
          profesor_asignado: parseInt(tallerData.profesor_asignado),
          estado: tallerData.estado
        }])
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
        .eq('id_taller_impartido', tallerId)
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
        .eq('id_taller_impartido', tallerId)
      
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
