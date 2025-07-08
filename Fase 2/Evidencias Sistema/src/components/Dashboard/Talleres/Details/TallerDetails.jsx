import { useState } from 'react'
import { BookOpen, Users, Calendar, MapPin, GraduationCap, Edit, FileText, Loader2 } from 'lucide-react'
import { useTalleres } from '../../../../hooks/useTalleres'

export function TallerDetails({ taller, onEdit, onGenerateReport, loadingMetrics, errorMetrics }) {
  const { updateTaller } = useTalleres()

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      {/* Encabezado */}
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{taller.nombre_publico}</h3>
            <p className="mt-1 text-sm text-gray-500">{taller.descripcion_publica}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
            >
              <Edit className="-ml-0.5 mr-2 h-4 w-4" /> Editar
            </button>
          </div>
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
    </div>
  )
}
