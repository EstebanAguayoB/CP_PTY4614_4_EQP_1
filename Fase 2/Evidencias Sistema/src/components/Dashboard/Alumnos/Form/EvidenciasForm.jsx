import { useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { Upload, X } from 'lucide-react'

export function EvidenciasForm({ idParticipacion, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [descripcion, setDescripcion] = useState('')

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${idParticipacion}_${Date.now()}.${fileExt}`
        const filePath = `evidencias/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('evidencias')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        return filePath
      })

      const fileUrls = await Promise.all(uploadPromises)

      // Crear registros de evidencias
      const { data, error: dbError } = await supabase
        .from('Evidencia')
        .insert(
          fileUrls.map(url => ({
            id_participacion: idParticipacion,
            semana: getCurrentWeek(),
            descripcion,
            archivo_url: url,
            validada_por_profesor: false
          }))
        )
        .select()

      if (dbError) throw dbError

      // Actualizar seguimiento
      await supabase
        .from('Seguimiento')
        .insert([{
          id_participacion: idParticipacion,
          semana: getCurrentWeek(),
          comentarios_profesor: 'Nuevas evidencias subidas',
          fecha_registro: new Date().toISOString()
        }])

      onSubmit(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentWeek = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now - start
    const oneWeek = 1000 * 60 * 60 * 24 * 7
    return Math.ceil(diff / oneWeek)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Archivos de Evidencia
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-base">Seleccionar archivos</span>
            <input type="file" className="hidden" multiple onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows="3"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSubmit(null)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
        >
          {loading ? 'Subiendo...' : 'Subir Evidencias'}
        </button>
      </div>
    </form>
  )
}
