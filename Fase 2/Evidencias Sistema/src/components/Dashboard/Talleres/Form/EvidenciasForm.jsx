import { useState, useRef } from 'react'
import { useTalleres } from '../../../../hooks/useTalleres'
import { supabase } from '../../../../lib/supabase'
import { Upload, X, Check, Loader2 } from 'lucide-react'

export function EvidenciasForm({ tallerId, onClose }) {
  const { updateTallerImpartido } = useTalleres()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef()

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (files.length === 0) {
      setError('Por favor selecciona al menos un archivo')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}${Date.now()}.${fileExt}`
        const filePath = `evidencias/${tallerId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('talleres')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        return {
          name: file.name,
          path: filePath,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString()
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      await updateTallerImpartido(tallerId, uploadedFiles)
      
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <div className="flex justify-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-lg">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500">
              <span>Seleccionar archivos</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileSelect}
              />
            </label>
            <p className="pl-1">o arrastrar y soltar</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, PDF hasta 10MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="sr-only">Archivos</h4>
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
              >
                <div className="flex w-0 flex-1 items-center">
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="flex-shrink-0 text-gray-400">
                      {(file.size / 1024).toFixed(2)}kb
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al subir archivos</h3>
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
          disabled={uploading || files.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Subiendo...
            </>
          ) : (
            <>
              <Check className="-ml-1 mr-2 h-4 w-4" />
              Subir evidencias
            </>
          )}
        </button>
      </div>
    </form>
  )
}
