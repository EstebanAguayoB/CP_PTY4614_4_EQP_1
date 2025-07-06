import { supabase } from '../lib/supabase';

export const MetricasService = {
  async getTalleresPorPeriodo(periodoId = null) {
    try {
      const { data, error } = await supabase.rpc('total_talleres_por_periodo', { periodo_id: periodoId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getTalleresPorPeriodo:', error);
      throw new Error('Error al cargar Total de Talleres por Periodo');
    }
  },

  async getEstudiantesPorPeriodo(periodoId = null) {
    try {
      const { data, error } = await supabase.rpc('total_estudiantes_por_periodo', { periodo_id: periodoId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getEstudiantesPorPeriodo:', error);
      throw new Error('Error al cargar Total de Estudiantes por Periodo');
    }
  },

  async getTasaFinalizacionPorPeriodo(periodoId = null) {
    try {
      const { data, error } = await supabase.rpc('tasa_finalizacion_por_periodo', { periodo_id: periodoId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getTasaFinalizacionPorPeriodo:', error);
      throw new Error('Error al cargar Tasa de Finalización por Periodo');
    }
  },

  async getPromedioEstudiantesPorTaller(periodoId = null) {
    try {
      const { data, error } = await supabase.rpc('promedio_estudiantes_por_taller', { periodo_id: periodoId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getPromedioEstudiantesPorTaller:', error);
      throw new Error('Error al cargar Promedio de Estudiantes por Taller');
    }
  },

  async getRankingTalleresPorPeriodo(periodoId = null) {
    try {
      const { data, error } = await supabase.rpc('ranking_talleres_por_periodo', { periodo_id: periodoId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getRankingTalleresPorPeriodo:', error);
      throw new Error('Error al cargar Ranking de Talleres por Periodo');
    }
  },

  async getProfesoresActivosPorPeriodo(periodoId = null) {
    try {
      const { data, error } = await supabase.rpc('profesores_activos_por_periodo', { periodo_id: periodoId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getProfesoresActivosPorPeriodo:', error);
      throw new Error('Error al cargar Profesores Activos por Periodo');
    }
  }
};