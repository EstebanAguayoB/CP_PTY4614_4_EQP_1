import { useState, useEffect } from 'react'
import { useTalleres } from '../../../../hooks/useTalleres'
import { supabase } from '../../../../lib/supabase'
import { Download, Trash2, File, Image, FileText } from 'lucide-react'

export function EvidenciasList({ tallerId, evidencias = [], canDelete = false }) {
  const { updateTallerImpartido } = useTalleres()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si no hay tallerId, no hacemos nada
    if (!tallerId) return

    // Función para cargar las evidencias del taller
    const loadEvidencias = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('Evidencia')
          .select('*')
          .eq('id_taller_impartido', tallerId)
          .order('fecha_registro', { ascending: false })

        if (error) throw error

        // Actualizar el estado con las evidencias obtenidas
        setEvidencias(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvidencias()
  }, [tallerId])

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image
    if (type.includes('pdf')) return FileText
    return File
  }

  const handleDownload = async (file) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from('talleres')
        .download(file.path)

      if (error) throw error

      // Crear un objeto URL para el blob y forzar la descarga
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (file) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta evidencia?')) {
      return
    }

    try {
      setLoading(true)
      
      // Eliminar el archivo del storage
      const { error: storageError } = await supabase.storage
        .from('talleres')
        .remove([file.path])

      if (storageError) throw storageError

      // Actualizar la lista de evidencias en el taller
      const updatedEvidencias = evidencias.filter(e => e.path !== file.path)
      await updateTallerImpartido(tallerId, updatedEvidencias)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando evidencias...</div>
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
        Error al cargar las evidencias: {error}
      </div>
    )
  }

  if (evidencias.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay evidencias registradas
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {evidencias.map((file, index) => {
          const FileIcon = getFileIcon(file.type)
          return (
            <li key={index} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <FileIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString('es-ES')} · {(file.size / 1024).toFixed(2)}kb
                  </p>
                </div>
                <div className="flex-shrink-0 space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(file)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(file)}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
