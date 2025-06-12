import { useState, useEffect } from 'react'
import { useTalleres } from '../../../../hooks/useTalleres'

export function TallerForm({ onClose, userId }) {
  const { createTaller } = useTalleres()
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    objetivos: '',
    requisitos: '',
    niveles_totales: '',
    nivel_minimo: '',
    edad_minima: '',
    edad_maxima: '',
    id_periodo: '',
    profesor_asignado: ''
  })
  const [niveles, setNiveles] = useState([
    { numero_nivel: 1, descripcion: '', habilidades_clave: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [periodos, setPeriodos] = useState([])
  const [profesores, setProfesores] = useState([])

  // Cargar periodos y profesores al montar
  useEffect(() => {
    window.supabase.from('PeriodoAcademico').select('*').then(({ data }) => setPeriodos(data || []))
    window.supabase.from('Usuario').select('id_usuario, nombre, apellido').eq('rol', 'PROFESOR').then(({ data }) => setProfesores(data || []))
  }, [])

  const handleNivelesTotalesChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, niveles_totales: value })
    setNiveles(
      Array.from({ length: Number(value) || 1 }, (_, i) => niveles[i] || {
        numero_nivel: i + 1,
        descripcion: '',
        habilidades_clave: ''
      })
    )
  }

  const handleNivelChange = (idx, field, value) => {
    setNiveles(niveles.map((nivel, i) =>
      i === idx ? { ...nivel, [field]: value } : nivel
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validar que todos los niveles tengan descripción y habilidades clave
    const nivelesValidos = niveles.every(nivel => nivel.descripcion && nivel.habilidades_clave)
    if (!nivelesValidos) {
      setError('Todos los niveles deben tener descripción y habilidades clave.')
      setLoading(false)
      return
    }

    try {
      // 1. Crear el taller definido
      const tallerDefinidoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        objetivos: formData.objetivos,
        requisitos: formData.requisitos,
        niveles_totales: parseInt(formData.niveles_totales),
        nivel_minimo: formData.nivel_minimo,
        edad_minima: parseInt(formData.edad_minima),
        edad_maxima: parseInt(formData.edad_maxima),
        creado_por: userId
      }
      const { data: tallerDefinido, error: errorDefinido } = await window.supabase
        .from('TallerDefinido')
        .insert([tallerDefinidoData])
        .select()
        .single()
      if (errorDefinido) throw errorDefinido

      // 2. Crear los niveles
      for (const nivel of niveles) {
        const { error: errorNivel } = await window.supabase
          .from('Nivel')
          .insert({
            id_taller_definido: tallerDefinido.id_taller_definido,
            numero_nivel: nivel.numero_nivel,
            descripcion: nivel.descripcion,
            habilidades_clave: nivel.habilidades_clave
          })
        if (errorNivel) {
          console.error('Error al insertar nivel:', errorNivel)
          throw errorNivel
        }
      }

      onClose(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Taller</label>
        <input
          type="text"
          required
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          required
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Objetivos</label>
        <textarea
          required
          value={formData.objetivos}
          onChange={e => setFormData({ ...formData, objetivos: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Requisitos</label>
        <textarea
          required
          value={formData.requisitos}
          onChange={e => setFormData({ ...formData, requisitos: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Niveles totales</label>
          <input
            type="number"
            required
            min="1"
            value={formData.niveles_totales}
            onChange={handleNivelesTotalesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nivel educativo mínimo</label>
          <select
            required
            value={formData.nivel_minimo}
            onChange={e => setFormData({ ...formData, nivel_minimo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona un nivel</option>
            <option value="BASICA">Básica</option>
            <option value="MEDIA">Media</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Edad mínima</label>
          <input
            type="number"
            required
            min="1"
            max="100"
            value={formData.edad_minima}
            onChange={e => setFormData({ ...formData, edad_minima: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Edad máxima</label>
          <input
            type="number"
            required
            min="1"
            max="100"
            value={formData.edad_maxima}
            onChange={e => setFormData({ ...formData, edad_maxima: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      {/* Campos para cada nivel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Niveles</label>
        {niveles.map((nivel, idx) => (
          <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
            <div className="font-semibold mb-2">Nivel {nivel.numero_nivel}</div>
            <input
              type="text"
              placeholder="Descripción del nivel"
              value={nivel.descripcion}
              onChange={e => handleNivelChange(idx, 'descripcion', e.target.value)}
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Habilidades clave"
              value={nivel.habilidades_clave}
              onChange={e => handleNivelChange(idx, 'habilidades_clave', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        ))}
      </div>
      {/* Campos de período y profesor (solo para referencia, no se usan en el insert) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Período académico (referencia)</label>
          <select
            value={formData.id_periodo}
            onChange={e => setFormData({ ...formData, id_periodo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona un período</option>
            {periodos
              .filter(p => p.estado === "ACTIVO")
              .map(periodo => (
                <option key={periodo.id_periodo} value={periodo.id_periodo}>
                  {periodo.nombre_periodo}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profesor a cargo (referencia)</label>
          <select
            value={formData.profesor_asignado}
            onChange={e => setFormData({ ...formData, profesor_asignado: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona un profesor</option>
            {profesores.map(prof => (
              <option key={prof.id_usuario} value={prof.id_usuario}>
                {prof.nombre} {prof.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <div className="text-red-600">{error}</div>
      )}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onClose(false)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? 'Guardando...' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
