import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const formatString = 'dd/MM/yyyy HH:mm:ss'

export function formatDateIntoString(date: Date, typeForm = formatString) {
	return format(date, typeForm, { locale: ptBR })
}

export function formatRelativeTime(date: Date) {
	return formatDistanceToNow(date, { locale: ptBR, addSuffix: true })
}