import { useState } from 'react'
import { BookOpen, Users, Calendar, MapPin, GraduationCap, Edit } from 'lucide-react'
import { useTalleres } from '../../../../hooks/useTalleres'
import { EvidenciasForm } from '../Form/EvidenciasForm'
import { EvidenciasList } from '../List/EvidenciasList'

export function TallerDetails({ taller, onEdit }) {
  const [showEvidenciasForm, setShowEvidenciasForm] = useState(false)
  const { updateTaller } = useTalleres()

  const handleToggleEvidenciasForm = () => {
    setShowEvidenciasForm(!showEvidenciasForm)
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      {/* Encabezado */}
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{taller.nombre_publico}</h3>
            <p className="mt-1 text-sm text-gray-500">{taller.descripcion_publica}</p>
          </div>
          <button
            onClick={onEdit}
            className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
          >
            <Edit className="-ml-0.5 mr-2 h-4 w-4" /> Editar
          </button>
        </div>
      </div>

      {/* Información del taller */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <BookOpen className="mr-2 h-5 w-5 text-emerald-500" />
              Profesor a cargo
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {taller.Usuario.nombre} {taller.Usuario.apellido}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <Users className="mr-2 h-5 w-5 text-emerald-500" />
              Alumnos inscritos
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {taller.alumnos || 0}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <Calendar className="mr-2 h-5 w-5 text-emerald-500" />
              Periodo
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {taller.PeriodoAcademico?.nombre_periodo}
              {/* {new Date(taller.periodo).toLocaleDateString('es-ES')} */}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <MapPin className="mr-2 h-5 w-5 text-emerald-500" />
              Ubicación
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {taller.ubicacion || 'Por definir'}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <GraduationCap className="mr-2 h-5 w-5 text-emerald-500" />
              Nivel educativo mínimo
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {taller.TallerDefinido.nivel_minimo}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Rango de edad</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {taller.TallerDefinido.edad_minima} - {taller.TallerDefinido.edad_maxima} años
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Objetivos</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <ul className="list-disc pl-5 space-y-1">
                {Array.isArray(taller.TallerDefinido.objetivos) ? (
                  taller.TallerDefinido.objetivos.map((objetivo, index) => (
                    <li key={index}>{objetivo}</li>
                  ))
                ) : (
                  <li>{taller.TallerDefinido.objetivos}</li>
                )}
              </ul>
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Requisitos</dt>
            <dd className="mt-1 text-sm text-gray-900">{taller.TallerDefinido.requisitos}</dd>
          </div>
        </dl>
      </div>

      {/* Sección de evidencias */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Evidencias</h3>
          <button
            onClick={handleToggleEvidenciasForm}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
          >
            {showEvidenciasForm ? 'Cancelar' : 'Subir evidencias'}
          </button>
        </div>

        {showEvidenciasForm ? (
          <EvidenciasForm
            tallerId={taller.id}
            onClose={handleToggleEvidenciasForm}
          />
        ) : (
          <EvidenciasList
            tallerId={taller.id}
            evidencias={taller.evidencias}
            canDelete={true}
          />
        )}
      </div>
    </div>
  )
}
