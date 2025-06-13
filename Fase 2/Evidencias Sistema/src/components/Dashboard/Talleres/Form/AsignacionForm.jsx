import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useTalleres } from '../../../../hooks/useTalleres'

export function AsignacionForm({ tallerId, onClose, tallerSeleccionado }) {
  const { updateTallerImpartido } = useTalleres()
  const [selectedProfesor, setSelectedProfesor] = useState('')
  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProfesores()
  }, [])

  const loadProfesores = async () => {
    try {
      const { data, error } = await supabase
        .from('Usuario')
        .select(`
          id_usuario,
          nombre,
          apellido,
          ProfesorDetalle (
            especialidad,
            nivel_educativo
          )
        `)
        .not('ProfesorDetalle', 'is', null)

      if (error) throw error
      setProfesores(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const validarDisponibilidad = async (profesorId, dia_semana, hora_inicio, hora_fin) => {
    const { data: asignaciones, error } = await supabase
      .from("AsignacionProfesor")
      .select(`
        id_taller_impartido,
        estado_asignacion,
        TallerImpartido(dia_semana, hora_inicio, hora_fin, nombre_publico)
      `)
      .eq("id_usuario", profesorId)
      .eq("estado_asignacion", "ACTIVA")

    if (error) {
      alert("Error consultando disponibilidad del profesor")
      return false
    }

    // Verificar traslape de horarios
    const conflicto = asignaciones.some(asig => {
      const taller = asig.TallerImpartido
      if (!taller) return false
      if (taller.dia_semana !== dia_semana) return false
      // Compara traslape de horas
      return (
        (hora_inicio < taller.hora_fin && hora_fin > taller.hora_inicio)
      )
    })

    if (conflicto) {
      alert("El profesor ya tiene un taller asignado en ese horario.")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Supón que tienes los datos del taller a asignar
    const { dia_semana, hora_inicio, hora_fin } = tallerSeleccionado // o formData

    const disponible = await validarDisponibilidad(selectedProfesor, dia_semana, hora_inicio, hora_fin)
    if (!disponible) {
      setLoading(false)
      return
    }

    try {
      // Verificar si ya existe una asignación activa
      const { data: existingAsignacion } = await supabase
        .from('AsignacionProfesor')
        .select('*')
        .eq('id_taller_impartido', tallerId)
        .eq('estado_asignacion', 'ACTIVA')
        .single()

      if (existingAsignacion) {
        // Desactivar asignación anterior
        await supabase
          .from('AsignacionProfesor')
          .update({ estado_asignacion: 'REMOVIDA' })
          .eq('id_asignacion', existingAsignacion.id_asignacion)
      }

      // Crear nueva asignación
      const { error: asignacionError } = await supabase
        .from('AsignacionProfesor')
        .insert([{
          id_usuario: selectedProfesor,
          id_taller_impartido: tallerId,
          rol: 'RESPONSABLE',
          estado_asignacion: 'ACTIVA'
        }])

      if (asignacionError) throw asignacionError

      // Actualizar el taller con el nuevo profesor usando el hook
      await updateTallerImpartido(tallerId, { 
        profesor_asignado: selectedProfesor,
        fecha_asignacion: new Date().toISOString()
      })

      onClose(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="profesor" className="block text-sm font-medium text-gray-700">
          Seleccionar Profesor
        </label>
        <select
          id="profesor"
          value={selectedProfesor}
          onChange={(e) => setSelectedProfesor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Seleccione un profesor</option>
          {profesores.map((profesor) => (
            <option key={profesor.id_usuario} value={profesor.id_usuario}>
              {profesor.nombre} {profesor.apellido} - {profesor.ProfesorDetalle.especialidad}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onClose(null)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
        >
          {loading ? 'Asignando...' : 'Asignar Profesor'}
        </button>
      </div>
    </form>
  )
}
