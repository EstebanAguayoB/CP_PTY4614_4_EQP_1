import { useState } from 'react'
import { useTalleres } from '../../../../hooks/useTalleres'

export function TallerForm({ onClose, initialData = null }) {
  const { createTaller, updateTaller } = useTalleres()
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    nombre_publico: '',
    descripcion_publica: '',
    objetivos: '',
    requisitos: '',
    niveles_totales: '',
    nivel_educativo_minimo: '',
    edad_minima: '',
    edad_maxima: '',
    periodo: '',
    profesor_a_cargo: '',
    estado: 'activo'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const tallerData = {
        ...formData,
        objetivos: formData.objetivos.split('\n').filter(obj => obj.trim()),
        niveles_totales: parseInt(formData.niveles_totales),
        edad_minima: parseInt(formData.edad_minima),
        edad_maxima: parseInt(formData.edad_maxima)
      }

      if (initialData?.id) {
        await updateTaller(initialData.id, tallerData)
      } else {
        await createTaller(tallerData)
      }

      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre del Taller
        </label>
        <input
          id="nombre"
          type="text"
          required
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value, nombre_publico: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion_publica"
          required
          value={formData.descripcion_publica}
          onChange={(e) => setFormData({ 
            ...formData, 
            descripcion_publica: e.target.value 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows="3"
        />
      </div>

      <div>
        <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700">
          Objetivos
        </label>
        <textarea
          id="objetivos"
          required
          value={formData.objetivos}
          onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows="3"
          placeholder="Un objetivo por línea"
        />
      </div>

      <div>
        <label htmlFor="requisitos" className="block text-sm font-medium text-gray-700">
          Requisitos
        </label>
        <textarea
          id="requisitos"
          required
          value={formData.requisitos}
          onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="niveles_totales" className="block text-sm font-medium text-gray-700">
            Niveles totales
          </label>
          <input
            id="niveles_totales"
            type="number"
            required
            min="1"
            value={formData.niveles_totales}
            onChange={(e) => setFormData({ ...formData, niveles_totales: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="profesor_a_cargo" className="block text-sm font-medium text-gray-700">
            Profesor a cargo
          </label>
          <input
            id="profesor_a_cargo"
            type="text"
            required
            value={formData.profesor_a_cargo}
            onChange={(e) => setFormData({ ...formData, profesor_a_cargo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nivel educativo mínimo</label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              required
              value="BASICA"
              checked={formData.nivel_educativo_minimo === 'BASICA'}
              onChange={(e) => setFormData({ ...formData, nivel_educativo_minimo: e.target.value })}
              className="form-radio text-emerald-600"
            />
            <span className="ml-2">Básica</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              required
              value="MEDIA"
              checked={formData.nivel_educativo_minimo === 'MEDIA'}
              onChange={(e) => setFormData({ ...formData, nivel_educativo_minimo: e.target.value })}
              className="form-radio text-emerald-600"
            />
            <span className="ml-2">Media</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="edad_minima" className="block text-sm font-medium text-gray-700">
            Edad mínima
          </label>
          <input
            id="edad_minima"
            type="number"
            required
            min="1"
            max="100"
            value={formData.edad_minima}
            onChange={(e) => setFormData({ ...formData, edad_minima: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="edad_maxima" className="block text-sm font-medium text-gray-700">
            Edad máxima
          </label>
          <input
            id="edad_maxima"
            type="number"
            required
            min="1"
            max="100"
            value={formData.edad_maxima}
            onChange={(e) => setFormData({ ...formData, edad_maxima: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">
          Periodo
        </label>
        <input
          id="periodo"
          type="date"
          required
          value={formData.periodo}
          onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al {initialData ? 'actualizar' : 'crear'} el taller</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
