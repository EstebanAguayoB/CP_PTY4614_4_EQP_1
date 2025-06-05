import { useState } from 'react'
import { useTalleres } from '../../../../hooks/useTalleres'

export function TallerForm({ onClose, initialData = null, userId }) {
  const { createTaller, updateTaller } = useTalleres()
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    descripcion: '',
    objetivos: '',
    requisitos: '',
    niveles_totales: '',
    nivel_minimo: '',
    edad_minima: '',
    edad_maxima: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const tallerData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        objetivos: formData.objetivos,
        requisitos: formData.requisitos,
        niveles_totales: parseInt(formData.niveles_totales),
        nivel_minimo: formData.nivel_minimo,
        edad_minima: parseInt(formData.edad_minima),
        edad_maxima: parseInt(formData.edad_maxima),
        creado_por: userId // id del coordinador
      }

      if (initialData?.id_taller_definido) {
        await updateTaller(initialData.id_taller_definido, tallerData)
      } else {
        await createTaller(tallerData)
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
            onChange={e => setFormData({ ...formData, niveles_totales: e.target.value })}
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
            <option value="">Selecciona</option>
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
      {error && (
        <div className="text-red-600">{error}</div>
      )}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
