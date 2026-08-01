import { hash } from 'bcryptjs'
import { prisma } from '../src/database/prisma-client'

const USERS = [
	'Arthur',
	'Beatriz',
	'Carlos',
	'Duda',
	'Eduardo',
	'Fernanda',
	'Gabriel',
	'Helena',
	'Igor',
	'Julia'
]

const CHARACTERS: { name: string; description: string; lore: string }[] = [
	{
		name: 'Thorin Barba-de-Ferro',
		description: 'Anão guerreiro robusto, especialista em machados de guerra.',
		lore: 'Sobrevivente da queda de sua cidadela nas montanhas, busca vingança contra o clã que a destruiu.'
	},
	{
		name: 'Lyra Ventofino',
		description: 'Elfa arqueira ágil, criada nas florestas do norte.',
		lore: 'Guardiã de um antigo pacto entre seu povo e os espíritos da floresta, agora quebrado por forças sombrias.'
	},
	{
		name: 'Kael Sombraviva',
		description: 'Feiticeiro humano com afinidade por magias das sombras.',
		lore: 'Aprendiz fugitivo de uma ordem arcana proibida, foge enquanto busca controlar seus poderes instáveis.'
	},
	{
		name: 'Roswitha Punho de Aço',
		description: 'Guerreira meio-orc conhecida por sua força brutal em combate.',
		lore: 'Ex-gladiadora que conquistou a liberdade na arena e agora luta por quem não pode se defender.'
	},
	{
		name: 'Zenrik das Chamas',
		description: 'Feiticeiro tiefling com poder inato sobre o fogo.',
		lore: 'Marcado por um pacto ancestral com um senhor demoníaco que busca cobrar sua dívida.'
	},
	{
		name: 'Nessa Passo-Leve',
		description: 'Ladina halfling especialista em furtividade e armadilhas.',
		lore: 'Cresceu nas ruas de uma cidade portuária, sobrevivendo de pequenos furtos até se juntar a aventureiros.'
	},
	{
		name: 'Bardolino Voz-Dourada',
		description: 'Bardo humano carismático que viaja coletando histórias e canções.',
		lore: 'Busca a lenda perdida de um herói esquecido para compor a canção definitiva de sua carreira.'
	},
	{
		name: 'Sera Luz-Sagrada',
		description: 'Clériga élfica devota de uma divindade da cura e da luz.',
		lore: 'Enviada por seu templo para investigar sinais de corrupção se espalhando pelas terras vizinhas.'
	}
]

const MESAS = [
	{
		title: 'A Ira dos Dragões Ancestrais',
		description:
			'Uma campanha épica em que os heróis devem impedir o despertar de dragões adormecidos há milênios.'
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

function pick<T>(arr: T[], index: number): T {
	return arr[index % arr.length]
}

async function main() {
	console.log('Limpando dados existentes...')
	await prisma.players.deleteMany()
	await prisma.userCharacter.deleteMany()
	await prisma.mesa.deleteMany()
	await prisma.refreshToken.deleteMany()
	await prisma.user.deleteMany()

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
			const character = pick(characters, mesaIndex + offset)

			playersData.push({
				userId: user.id,
				mesaId: mesa.id,
				role: 'PLAYER',
				userCharacterId: character.id,
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

	await prisma.players.createMany({ data: uniquePlayersData })

	console.log(
		`Seed concluído: ${users.length} usuários, ${characters.length} personagens, ${mesas.length} mesas, ${uniquePlayersData.length} vínculos de jogadores.`
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
