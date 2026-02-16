/**
 * Utilitários para formatação de data e hora
 */

/**
 * Formata data e hora no formato brasileiro
 * @param dateString - String de data ISO ou formato válido
 * @returns String formatada "DD/MM/YYYY HH:mm"
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) return '-';
    
    // Formatar data e hora no padrão brasileiro
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '-';
  }
};

/**
 * Formata apenas a data no formato brasileiro
 * @param dateString - String de data ISO ou formato válido
 * @returns String formatada "DD/MM/YYYY"
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '-';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '-';
  }
};

/**
 * Formata apenas a hora
 * @param dateString - String de data ISO ou formato válido
 * @returns String formatada "HH:mm"
 */
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '-';
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Erro ao formatar hora:', error);
    return '-';
  }
};

/**
 * Calcula a duração entre duas datas
 * @param startDate - Data de início
 * @param endDate - Data de fim (opcional)
 * @returns String formatada da duração
 */
export const calculateDuration = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string => {
  if (!startDate) return '-';
  
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;
      return `${diffDays}d ${remainingHours}h`;
    }
    
    return `${diffHours}h ${diffMinutes}min`;
  } catch (error) {
    console.error('Erro ao calcular duração:', error);
    return '-';
  }
};
