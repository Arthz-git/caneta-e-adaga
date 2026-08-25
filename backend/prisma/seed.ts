import { hash } from 'bcryptjs'
import { prisma } from '../src/database/prisma-client'

const USERS = [
	'Xuxu',
	'X12',
	'Duduka',
	'pedrinhodk',
	'Abzu',
	'CAiXA',
	'Mewmew',
	'Cl3',
	'JohnGreen',
	'Spy'
]

const CHARACTERS: { name: string; description: string; lore: string; imageUrl: string }[] = [
	{
		name: 'Thorin Barba-de-Ferro',
		description: 'Anão guerreiro robusto, especialista em machados de guerra.',
		lore: 'Sobrevivente da queda de sua cidadela nas montanhas, busca vingança contra o clã que a destruiu.',
		imageUrl: 'https://picsum.photos/seed/thorin-barba-de-ferro/200'
	},
	{
		name: 'Lyra Ventofino',
		description: 'Elfa arqueira ágil, criada nas florestas do norte.',
		lore: 'Guardiã de um antigo pacto entre seu povo e os espíritos da floresta, agora quebrado por forças sombrias.',
		imageUrl: 'https://picsum.photos/seed/lyra-ventofino/200'
	},
	{
		name: 'Kael Sombraviva',
		description: 'Feiticeiro humano com afinidade por magias das sombras.',
		lore: 'Aprendiz fugitivo de uma ordem arcana proibida, foge enquanto busca controlar seus poderes instáveis.',
		imageUrl: 'https://picsum.photos/seed/kael-sombraviva/200'
	},
	{
		name: 'Roswitha Punho de Aço',
		description: 'Guerreira meio-orc conhecida por sua força brutal em combate.',
		lore: 'Ex-gladiadora que conquistou a liberdade na arena e agora luta por quem não pode se defender.',
		imageUrl: 'https://picsum.photos/seed/roswitha-punho-de-aco/200'
	},
	{
		name: 'Zenrik das Chamas',
		description: 'Feiticeiro tiefling com poder inato sobre o fogo.',
		lore: 'Marcado por um pacto ancestral com um senhor demoníaco que busca cobrar sua dívida.',
		imageUrl: 'https://picsum.photos/seed/zenrik-das-chamas/200'
	},
	{
		name: 'Nessa Passo-Leve',
		description: 'Ladina halfling especialista em furtividade e armadilhas.',
		lore: 'Cresceu nas ruas de uma cidade portuária, sobrevivendo de pequenos furtos até se juntar a aventureiros.',
		imageUrl: 'https://picsum.photos/seed/nessa-passo-leve/200'
	},
	{
		name: 'Bardolino Voz-Dourada',
		description: 'Bardo humano carismático que viaja coletando histórias e canções.',
		lore: 'Busca a lenda perdida de um herói esquecido para compor a canção definitiva de sua carreira.',
		imageUrl: 'https://picsum.photos/seed/bardolino-voz-dourada/200'
	},
	{
		name: 'Sera Luz-Sagrada',
		description: 'Clériga élfica devota de uma divindade da cura e da luz.',
		lore: 'Enviada por seu templo para investigar sinais de corrupção se espalhando pelas terras vizinhas.',
		imageUrl: 'https://picsum.photos/seed/sera-luz-sagrada/200'
	}
]

const MESAS = [
	{
		title: 'A Ira dos Dragões Ancestrais',
		description: 'Uma campanha épica em que os heróis devem impedir o despertar de dragões adormecidos há milênios.'
	},
	{
		title: 'Segredos da Cripta Esquecida',
		description: 'Um grupo de aventureiros explora uma cripta amaldiçoada em busca de um artefato perdido.'
	},
	{
		title: 'O Chamado das Terras Geladas',
		description: 'Exploradores enfrentam tempestades e feras árticas para desvendar ruínas de uma civilização extinta.'
	},
	{
		title: 'Conspiração na Corte Real',
		description: 'Intrigas políticas e traições ameaçam o trono, e os heróis precisam descobrir quem puxa os fios.'
	},
	{
		title: 'A Praga da Floresta Negra',
		description: 'Uma corrupção sombria se espalha pela floresta, transformando criaturas em monstros.'
	},
	{
		title: 'Piratas do Mar Esmeralda',
		description: 'Uma tripulação improvisada busca um tesouro lendário enquanto foge da marinha real.'
	},
	{
		title: 'O Último Refúgio',
		description: 'Sobreviventes de um apocalipse mágico tentam reconstruir a civilização em um mundo hostil.'
	},
	{
		title: 'Ecos de uma Guerra Antiga',
		description: 'Fantasmas de um conflito milenar assombram um vale, exigindo que os heróis façam as pazes com o passado.'
	},
	{
		title: 'A Torre do Feiticeiro Louco',
		description: 'Uma torre labiríntica cheia de armadilhas e experimentos arcanos fora de controle.'
	},
	{
		title: 'Sombras sobre a Capital',
		description: 'Uma seita secreta trama um ritual capaz de mergulhar a capital em trevas eternas.'
	},
	{
		title: 'A Caravana Perdida',
		description: 'Os heróis são contratados para escoltar uma caravana através de terras dominadas por bandidos.'
	},
	{
		title: 'O Despertar do Golem de Pedra',
		description: 'Uma cidade antiga desperta um golem guardião que agora ameaça tudo ao seu redor.'
	},
	{
		title: 'Ritual sob a Lua Sangrenta',
		description: 'Um culto planeja um ritual proibido durante o eclipse para invocar uma entidade cósmica.'
	},
	{
		title: 'A Ilha que Não Existe no Mapa',
		description: 'Náufragos descobrem uma ilha misteriosa cheia de ruínas e criaturas nunca antes vistas.'
	},
	{
		title: 'O Herdeiro Esquecido',
		description: 'Um jovem descobre que é herdeiro de um reino em ruínas e precisa reivindicar seu destino.'
	},
	{
		title: 'A Peste das Sombras',
		description: 'Uma doença sobrenatural transforma vítimas em servos das trevas, e uma cura precisa ser encontrada.'
	}
]

const NARRATOR_TEXTS = [
	'A névoa se dissipa lentamente, revelando as ruínas cobertas de musgo que vocês buscavam.',
	'Um vento gelado corta o ar enquanto a caravana se aproxima do desfiladeiro.',
	'As tochas da taverna bruxuleiam quando a porta se abre com um estalo seco.',
	'O silêncio da floresta é quebrado por um uivo distante, vindo de além das árvores antigas.',
	'A torre se ergue diante de vocês, suas pedras negras absorvendo a pouca luz do entardecer.'
]

const SCENE_TEXTS = [
	'As Ruínas de Karth-Vael',
	'A Taverna do Corvo Cinzento',
	'O Desfiladeiro Esquecido',
	'A Torre Negra',
	'O Mercado das Sombras'
]

const NPC_NAMES = ['Velho Corvin', 'Guarda Ithan', 'Mercadora Yssa', 'Xamã Doreth', 'Capitão Volund']

const NPC_TEXTS = [
	'"Vocês não deveriam estar aqui... não depois do que aconteceu na última lua cheia."',
	'"Passagem custa três moedas de prata. E cuidado com os becos depois do anoitecer."',
	'"Tragam-me a relíquia e prometo que sua dívida será perdoada."',
	'"Os espíritos desta terra não recebem bem forasteiros armados."',
	'"Se querem cruzar a ponte, terão que provar seu valor primeiro."'
]

const CHARACTER_TEXTS = [
	'Avanço com cautela, mantendo a mão próxima à empunhadura da arma.',
	'"Algo aqui não está certo... sinto que estamos sendo observados."',
	'Examino as marcas entalhadas na pedra, tentando reconhecer o símbolo.',
	'"Não vamos recuar agora, chegamos longe demais para isso."',
	'Sussurro um aviso aos outros e aponto para as sombras adiante.'
]

const OOC_TEXTS = [
	'(Só confirmando: minha iniciativa foi 17, certo?)',
	'(Preciso sair uns 10 minutos, podem continuar sem mim)',
	'(Adorei essa cena, muito bem narrada!)',
	'(Alguém lembra qual foi o resultado daquele teste de percepção?)'
]

const SYSTEM_TEXTS = [
	'A sessão foi retomada após uma pausa.',
	'Um novo capítulo da campanha foi iniciado.',
	'O mestre atualizou o mapa da região.',
	'Rolagem de iniciativa registrada para o grupo.'
]

const WHISPER_TEXTS = [
	'Enquanto os outros não percebem, você nota um símbolo estranho gravado na parede.',
	'Uma voz sussurra apenas em sua mente: "Não confie em todos aqui."',
	'Você sente um frio na espinha, como se algo estivesse observando só você.',
	'Um pedaço de papel amassado aparece em seu bolso, sem que você notasse quem o colocou lá.',
	'Você reconhece esse lugar de um sonho recente, mas prefere não dizer nada aos outros.'
]

function pick<T>(arr: T[], index: number): T {
	return arr[index % arr.length]
}

async function main() {
	console.log('Limpando dados existentes...')
	await prisma.$executeRawUnsafe(
		'TRUNCATE TABLE "posts", "players", "characters", "solicitacoes", "notificacoes", "amizades", "refresh_tokens", "mesas", "users" RESTART IDENTITY CASCADE'
	)

	console.log('Criando usuários...')
	const password = await hash('senha123', 8)

	const users = await Promise.all(
		USERS.map((name, index) =>
			prisma.user.create({
				data: {
					name,
					email: `usuario${index + 1}@example.com`,
					password
				}
			})
		)
	)

	console.log('Criando personagens...')
	const characters = await Promise.all(
		CHARACTERS.map((character, index) =>
			prisma.userCharacter.create({
				data: {
					...character,
					userId: pick(users, index + 1).id
				}
			})
		)
	)

	console.log('Criando mesas...')
	const mesas = await Promise.all(
		MESAS.map((mesa, index) =>
			prisma.mesa.create({
				data: {
					...mesa,
					createdBy: pick(users, index).id,
					isPrivate: index % 4 === 0,
					allowSpectators: index % 5 !== 0,
					maxPlayers: 3 + (index % 4)
				}
			})
		)
	)

	console.log('Criando vínculos de jogadores...')
	const playersData: {
		userId: number
		mesaId: number
		role: 'MASTER' | 'PLAYER' | 'SPECTATOR'
		userCharacterId?: number
		isFavorite: boolean
	}[] = []

	// cada personagem só pode estar vinculado a uma mesa por vez
	const charactersByUserId = new Map<number, typeof characters[number][]>()
	characters.forEach(character => {
		const list = charactersByUserId.get(character.userId) ?? []
		list.push(character)
		charactersByUserId.set(character.userId, list)
	})
	const usedCharacterIds = new Set<number>()

	mesas.forEach((mesa, mesaIndex) => {
		// apenas 1 mestre por mesa
		const masterId = pick(users, mesaIndex).id
		playersData.push({ userId: masterId, mesaId: mesa.id, role: 'MASTER', isFavorite: mesaIndex % 3 === 0 })

		const usedUserIds = new Set([masterId])
		let offset = 1

		const nextUnusedUser = () => {
			let user = pick(users, mesaIndex + offset)
			while (usedUserIds.has(user.id)) {
				offset++
				user = pick(users, mesaIndex + offset)
			}
			usedUserIds.add(user.id)
			offset++
			return user
		}

		// jogadores contam para o limite da mesa, então nunca ultrapassam maxPlayers - 1 (a vaga do mestre)
		const playersCount = Math.min(1 + (mesaIndex % 3), mesa.maxPlayers - 1)
		for (let i = 0; i < playersCount; i++) {
			const user = nextUnusedUser()
			const availableCharacter = (charactersByUserId.get(user.id) ?? [])
				.find(character => !usedCharacterIds.has(character.id))

			if (availableCharacter) {
				usedCharacterIds.add(availableCharacter.id)
			}

			playersData.push({
				userId: user.id,
				mesaId: mesa.id,
				role: 'PLAYER',
				userCharacterId: availableCharacter?.id,
				isFavorite: (mesaIndex + offset) % 4 === 0
			})
		}

		// espectadores não contam para o limite, mas só existem se a mesa permitir
		const spectatorsCount = mesa.allowSpectators ? mesaIndex % 2 : 0
		for (let i = 0; i < spectatorsCount; i++) {
			const user = nextUnusedUser()

			playersData.push({
				userId: user.id,
				mesaId: mesa.id,
				role: 'SPECTATOR',
				isFavorite: false
			})
		}
	})

	const uniquePlayersData = Array.from(
		new Map(playersData.map((player) => [`${player.userId}-${player.mesaId}`, player])).values()
	)

	const players = await Promise.all(
		uniquePlayersData.map((player) => prisma.players.create({ data: player }))
	)

	console.log('Criando posts...')
	const postsData: {
		userId: number
		mesaId: number
		type: 'CHARACTER' | 'NARRATOR' | 'SCENE' | 'NPC' | 'SYSTEM' | 'OOC'
		text: string
		characterId?: number
		npcName?: string
	}[] = []

	const whisperPostsData: {
		userId: number
		mesaId: number
		type: 'NARRATOR'
		text: string
		visiblePlayerIds: number[]
	}[] = []

	mesas.forEach((mesa, mesaIndex) => {
		const mesaPlayers = players.filter((player) => player.mesaId === mesa.id)
		const master = mesaPlayers.find((player) => player.role === 'MASTER')!
		const mesaOnlyPlayers = mesaPlayers.filter((player) => player.role === 'PLAYER')

		postsData.push({
			userId: master.userId,
			mesaId: mesa.id,
			type: 'SCENE',
			text: pick(SCENE_TEXTS, mesaIndex)
		})

		postsData.push({
			userId: master.userId,
			mesaId: mesa.id,
			type: 'NARRATOR',
			text: pick(NARRATOR_TEXTS, mesaIndex)
		})

		postsData.push({
			userId: master.userId,
			mesaId: mesa.id,
			type: 'NPC',
			npcName: pick(NPC_NAMES, mesaIndex),
			text: pick(NPC_TEXTS, mesaIndex)
		})

		mesaOnlyPlayers
			.filter((player) => player.userCharacterId)
			.forEach((player, playerIndex) => {
				postsData.push({
					userId: player.userId,
					mesaId: mesa.id,
					type: 'CHARACTER',
					characterId: player.userCharacterId!,
					text: pick(CHARACTER_TEXTS, mesaIndex + playerIndex)
				})
			})

		if (mesaOnlyPlayers.length) {
			postsData.push({
				userId: mesaOnlyPlayers[0].userId,
				mesaId: mesa.id,
				type: 'OOC',
				text: pick(OOC_TEXTS, mesaIndex)
			})
		}

		postsData.push({
			userId: master.userId,
			mesaId: mesa.id,
			type: 'SYSTEM',
			text: pick(SYSTEM_TEXTS, mesaIndex)
		})

		if (mesaOnlyPlayers.length) {
			const whisperTargets = mesaOnlyPlayers.slice(0, Math.min(2, mesaOnlyPlayers.length)).map((player) => player.id)

			whisperPostsData.push({
				userId: master.userId,
				mesaId: mesa.id,
				type: 'NARRATOR',
				text: pick(WHISPER_TEXTS, mesaIndex),
				visiblePlayerIds: whisperTargets
			})
		}
	})

	const postsBaseTime = Date.now() - postsData.length * 5 * 60 * 1000
	const postsWithTimestamps = postsData.map((post, index) => ({
		...post,
		createdAt: new Date(postsBaseTime + index * 5 * 60 * 1000)
	}))

	await prisma.post.createMany({ data: postsWithTimestamps })

	console.log('Criando posts privados (visíveis apenas a jogadores selecionados)...')
	const whisperBaseTime = postsBaseTime + postsData.length * 5 * 60 * 1000
	const whisperPosts = await Promise.all(
		whisperPostsData.map(({ visiblePlayerIds, ...post }, index) =>
			prisma.post.create({
				data: {
					...post,
					createdAt: new Date(whisperBaseTime + index * 5 * 60 * 1000),
					visiblePlayers: { create: visiblePlayerIds.map((playerId) => ({ playerId })) }
				}
			}).then((created) => ({ post: created, visiblePlayerIds }))
		)
	)

	console.log('Criando solicitações...')
	const solicitacoesSeed: {
		solicitanteId: number
		destinoId: number
		mesaId?: number
		motivo: 'PEDIDO_AMIZADE' | 'CONVITE_MESA' | 'PEDIDO_ENTRADA_MESA_JOGADOR' | 'PEDIDO_ENTRADA_MESA_ESPECTADOR'
		status: 'PENDENTE' | 'ACEITA' | 'RECUSADA'
	}[] = [
		{ solicitanteId: users[1].id, destinoId: users[0].id, motivo: 'PEDIDO_AMIZADE', status: 'PENDENTE' },
		{ solicitanteId: users[3].id, destinoId: users[2].id, motivo: 'PEDIDO_AMIZADE', status: 'ACEITA' },
		{ solicitanteId: mesas[0].createdBy, destinoId: users[5].id, mesaId: mesas[0].id, motivo: 'CONVITE_MESA', status: 'PENDENTE' },
		{ solicitanteId: users[6].id, destinoId: mesas[1].createdBy, mesaId: mesas[1].id, motivo: 'PEDIDO_ENTRADA_MESA_JOGADOR', status: 'PENDENTE' },
		{ solicitanteId: users[7].id, destinoId: mesas[2].createdBy, mesaId: mesas[2].id, motivo: 'PEDIDO_ENTRADA_MESA_ESPECTADOR', status: 'RECUSADA' }
	]

	const solicitacoes = await Promise.all(
		solicitacoesSeed.map((solicitacao) => prisma.solicitacao.create({ data: solicitacao }))
	)

	console.log('Criando amizades...')
	const amizadesSeed: { userAId: number; userBId: number }[] = [
		// amizade originada da solicitação de PEDIDO_AMIZADE aceita entre users[3] e users[2]
		{ userAId: users[2].id, userBId: users[3].id },
		{ userAId: users[0].id, userBId: users[4].id },
		{ userAId: users[0].id, userBId: users[5].id },
		{ userAId: users[1].id, userBId: users[6].id }
	]

	const amizades = await Promise.all(
		amizadesSeed.map((amizade) => prisma.amizade.create({ data: amizade }))
	)

	console.log('Criando notificações...')
	const motivoMessages: Record<string, string> = {
		PEDIDO_AMIZADE: 'Você recebeu um pedido de amizade',
		CONVITE_MESA: 'Você recebeu um convite para uma mesa',
		PEDIDO_ENTRADA_MESA_JOGADOR: 'Você recebeu um pedido de entrada como jogador',
		PEDIDO_ENTRADA_MESA_ESPECTADOR: 'Você recebeu um pedido de entrada como espectador'
	}

	type NotificacaoTipo =
		'SOLICITACAO_RECEBIDA' | 'SOLICITACAO_ACEITA' | 'SOLICITACAO_RECUSADA' |
		'NOVO_POST_MESA' | 'POST_PRIVADO' | 'JOGADOR_REMOVIDO_MESA' | 'MESA_EXCLUIDA'

	const notificacoesData: {
		destinoId: number
		remetenteId?: number
		tipo: NotificacaoTipo
		message: string
		solicitacaoId?: number
		mesaId?: number
		postId?: number
		readAt?: Date
	}[] = []

	solicitacoes.forEach((solicitacao) => {
		notificacoesData.push({
			destinoId: solicitacao.destinoId,
			remetenteId: solicitacao.solicitanteId,
			tipo: 'SOLICITACAO_RECEBIDA',
			message: motivoMessages[solicitacao.motivo],
			solicitacaoId: solicitacao.id,
			mesaId: solicitacao.mesaId ?? undefined,
			readAt: solicitacao.status === 'PENDENTE' ? undefined : new Date()
		})

		if (solicitacao.status === 'ACEITA' || solicitacao.status === 'RECUSADA') {
			notificacoesData.push({
				destinoId: solicitacao.solicitanteId,
				remetenteId: solicitacao.destinoId,
				tipo: solicitacao.status === 'ACEITA' ? 'SOLICITACAO_ACEITA' : 'SOLICITACAO_RECUSADA',
				message: solicitacao.status === 'ACEITA' ? 'Sua solicitação foi aceita' : 'Sua solicitação foi recusada',
				solicitacaoId: solicitacao.id,
				mesaId: solicitacao.mesaId ?? undefined
			})
		}
	})

	whisperPosts.forEach(({ post, visiblePlayerIds }) => {
		const mesa = mesas.find((mesa) => mesa.id === post.mesaId)!
		const targets = players.filter((player) => visiblePlayerIds.includes(player.id) && player.userId !== post.userId)

		targets.forEach((target) => {
			notificacoesData.push({
				destinoId: target.userId,
				remetenteId: post.userId,
				tipo: 'POST_PRIVADO',
				message: `Você recebeu uma mensagem privada na mesa "${mesa.title}"`,
				mesaId: mesa.id,
				postId: post.id
			})
		})
	})

	mesas.forEach((mesa) => {
		const mesaPlayers = players.filter((player) => player.mesaId === mesa.id)
		const master = mesaPlayers.find((player) => player.role === 'MASTER')!
		const recipients = mesaPlayers.filter((player) => player.userId !== master.userId)

		recipients.forEach((recipient) => {
			notificacoesData.push({
				destinoId: recipient.userId,
				remetenteId: master.userId,
				tipo: 'NOVO_POST_MESA',
				message: `Nova mensagem na mesa "${mesa.title}"`,
				mesaId: mesa.id,
				readAt: new Date()
			})
		})
	})

	const jogadorRemovidoMesa = mesas[0]
	const jogadorRemovidoAlvo = users.find(
		(user) => !players.some((player) => player.mesaId === jogadorRemovidoMesa.id && player.userId === user.id)
	)!

	notificacoesData.push({
		destinoId: jogadorRemovidoAlvo.id,
		remetenteId: jogadorRemovidoMesa.createdBy,
		tipo: 'JOGADOR_REMOVIDO_MESA',
		message: `Você foi removido da mesa "${jogadorRemovidoMesa.title}"`,
		mesaId: jogadorRemovidoMesa.id
	})

	notificacoesData.push({
		destinoId: users[8].id,
		remetenteId: users[9].id,
		tipo: 'MESA_EXCLUIDA',
		message: 'A mesa "Campanha Piloto Cancelada" foi excluída'
	})

	await prisma.notificacao.createMany({ data: notificacoesData })

	console.log('Criando mesa de testes com muitos posts (paginação)...')
	const paginationMesa = await prisma.mesa.create({
		data: {
			title: 'Mesa de Testes - Paginação de Posts',
			description: 'Mesa criada apenas para testar a listagem paginada de posts, com um grande volume de mensagens.',
			createdBy: users[0].id,
			isPrivate: false,
			allowSpectators: true,
			maxPlayers: 4
		}
	})

	const paginationMaster = await prisma.players.create({
		data: { userId: users[0].id, mesaId: paginationMesa.id, role: 'MASTER', isFavorite: false }
	})
	const paginationPlayers = await Promise.all(
		[users[1], users[2]].map((user) => {
			const availableCharacter = (charactersByUserId.get(user.id) ?? [])
				.find(character => !usedCharacterIds.has(character.id))

			if (availableCharacter) {
				usedCharacterIds.add(availableCharacter.id)
			}

			return prisma.players.create({
				data: {
					userId: user.id,
					mesaId: paginationMesa.id,
					role: 'PLAYER',
					userCharacterId: availableCharacter?.id,
					isFavorite: false
				}
			})
		})
	)

	const PAGINATION_POSTS_COUNT = 45
	const paginationPostsData = Array.from({ length: PAGINATION_POSTS_COUNT }, (_, index) => {
		const author = index % 3 === 0 ? paginationMaster : pick(paginationPlayers, index)
		const type = index % 3 === 0 || !author.userCharacterId ? 'NARRATOR' : 'CHARACTER'

		return {
			userId: author.userId,
			mesaId: paginationMesa.id,
			type: type as 'NARRATOR' | 'CHARACTER',
			characterId: type === 'CHARACTER' ? author.userCharacterId! : undefined,
			text: `[${index + 1}] ${pick(type === 'NARRATOR' ? NARRATOR_TEXTS : CHARACTER_TEXTS, index)}`
		}
	})

	const paginationBaseTime = whisperBaseTime + whisperPostsData.length * 5 * 60 * 1000
	await prisma.post.createMany({
		data: paginationPostsData.map((post, index) => ({
			...post,
			createdAt: new Date(paginationBaseTime + index * 5 * 60 * 1000)
		}))
	})

	console.log(
		`Seed concluído: ${users.length} usuários, ${characters.length} personagens, ${mesas.length + 1} mesas, ${players.length + 1 + paginationPlayers.length} vínculos de jogadores, ${postsWithTimestamps.length + whisperPostsData.length + paginationPostsData.length} posts (${whisperPostsData.length} privados, ${paginationPostsData.length} na mesa de testes), ${solicitacoes.length} solicitações, ${amizades.length} amizades, ${notificacoesData.length} notificações.`
	)
}

main()
	.catch((error) => {
		console.error('Erro ao executar o seed:', error)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
