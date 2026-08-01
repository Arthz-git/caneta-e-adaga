import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const formatString = 'dd/MM/yyyy HH:mm:ss'

export function formatDateIntoString(date: Date, typeForm = formatString) {
	return format(date, typeForm, { locale: ptBR })
}