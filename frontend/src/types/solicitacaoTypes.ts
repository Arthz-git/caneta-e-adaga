
interface CreateSolicitacaoParams {
	mesaId: number
	destinoId: number
	motivo: Motivos
}

type Motivos =
	'PEDIDO_AMIZADE' |
	'CONVITE_MESA' |
	'PEDIDO_ENTRADA_MESA_JOGADOR' |
	'PEDIDO_ENTRADA_MESA_ESPECTADOR'

type Status = 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA'

interface SolicitacaoResponse {
	id: number
	motivo: Motivos
	status: Status
	createdAt: Date
	updatedAt: Date
	solicitante: {
		id: number
		name: string
	}
	destino: {
		id: number
		name: string
	}
	mesa: {
		id: number
		title: string
	} | null
}

export type {
	CreateSolicitacaoParams,
	Motivos,
	SolicitacaoResponse
}