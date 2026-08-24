import DOMPurify from 'dompurify'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
import type { PostListItem } from '@/types/postTypes'

interface ExportPostsToHtmlOptions {
	mesaTitle: string
	posts: PostListItem[]
	isMaster: boolean
	currentPlayerId?: number
	currentUserId?: number
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

function sanitizeFilename(name: string) {
	return name.replace(/[\\/:*?"<>|]/g, '').trim() || 'mesa'
}

function isRestricted(post: PostListItem) {
	return post.visiblePlayerIds.length > 0
}

function canViewRestrictedContent(post: PostListItem, { isMaster, currentPlayerId, currentUserId }: Omit<ExportPostsToHtmlOptions, 'mesaTitle' | 'posts'>) {
	if (!isRestricted(post)) return true
	if (isMaster || post.userId === currentUserId) return true

	return currentPlayerId != null && post.visiblePlayerIds.includes(currentPlayerId)
}

function speakerName(post: PostListItem) {
	if (post.type === 'NPC') return post.npcName ?? 'NPC'
	if (post.type === 'CHARACTER') return post.character?.name ?? post.author.name

	return post.author.name
}

function renderPost(post: PostListItem, canView: boolean) {
	const time = escapeHtml(formatDateIntoString(new Date(post.createdAt)))

	if (!canView) {
		return `
			<div class="post post--hidden">
				<p class="post__text post__text--hidden">Uma mensagem oculta foi enviada aqui</p>
				<span class="post__time">${time}</span>
			</div>
		`
	}

	const sanitizedText = DOMPurify.sanitize(post.text)
	const restrictedBadge = isRestricted(post) ? '<span class="post__badge">Mensagem restrita</span>' : ''

	if (post.type === 'SCENE') {
		return `
			<div class="post post--scene">
				${restrictedBadge ? `<div class="post__header">${restrictedBadge}</div>` : ''}
				<div class="post__text">${sanitizedText}</div>
				<span class="post__time">${time}</span>
			</div>
		`
	}

	if (post.type === 'NARRATOR') {
		return `
			<div class="post post--narrator">
				${restrictedBadge ? `<div class="post__header">${restrictedBadge}</div>` : ''}
				<div class="post__text">${sanitizedText}</div>
				<span class="post__time">${time}</span>
			</div>
		`
	}

	const subtitle = post.type === 'CHARACTER'
		? post.author.name
		: post.type === 'NPC' ? `NPC de ${post.author.name}` : ''

	return `
		<div class="post post--${post.type.toLowerCase()}">
			<div class="post__header">
				<span class="post__speaker">${escapeHtml(speakerName(post))}</span>
				${subtitle ? `<span class="post__subtitle">${escapeHtml(subtitle)}</span>` : ''}
				${restrictedBadge}
				<span class="post__time">${time}</span>
			</div>
			<div class="post__text">${sanitizedText}</div>
		</div>
	`
}

function buildHtmlDocument(mesaTitle: string, posts: PostListItem[], options: Omit<ExportPostsToHtmlOptions, 'mesaTitle' | 'posts'>) {
	const body = posts
		.map(post => renderPost(post, canViewRestrictedContent(post, options)))
		.join('\n')

	return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(mesaTitle)}</title>
<style>
	body {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		background: #f6f1e7;
		color: #2b2320;
		font-family: Georgia, 'Times New Roman', serif;
		line-height: 1.5;
	}
	h1 {
		font-size: 1.6rem;
		border-bottom: 2px solid #7a2e2e;
		padding-bottom: 0.75rem;
		margin-bottom: 2rem;
	}
	.post {
		margin-bottom: 1.5rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid #ddd2ba;
	}
	.post__header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 0.35rem;
		font-family: Arial, sans-serif;
	}
	.post__speaker {
		font-weight: bold;
	}
	.post__subtitle {
		font-size: 0.8rem;
		color: #6b6259;
	}
	.post--narrator .post__text {
		font-style: italic;
	}
	.post--scene {
		text-align: center;
		border-top: 1px solid #b8925a;
		border-bottom: 1px solid #b8925a;
		padding: 0.75rem 0;
	}
	.post--scene .post__header {
		justify-content: center;
	}
	.post--scene .post__text {
		font-weight: bold;
		font-size: 1.05rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #8a5a1e;
	}
	.post--scene .post__time {
		margin-left: 0;
		display: block;
		margin-top: 0.35rem;
	}
	.post__time {
		margin-left: auto;
		font-size: 0.7rem;
		color: #6b6259;
		font-family: Arial, sans-serif;
	}
	.post--hidden .post__text--hidden {
		font-style: italic;
		color: #6b6259;
	}
	.post__badge {
		font-size: 0.7rem;
		font-family: Arial, sans-serif;
		font-weight: bold;
		color: #7a2e2e;
		border: 1px solid #7a2e2e;
		border-radius: 4px;
		padding: 1px 6px;
	}
	.post__text img {
		max-width: 100%;
		border-radius: 6px;
	}
</style>
</head>
<body>
<h1>${escapeHtml(mesaTitle)}</h1>
${body}
</body>
</html>`
}

function downloadHtml(html: string, filename: string) {
	const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.href = url
	link.download = `${sanitizeFilename(filename)}.html`

	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

	URL.revokeObjectURL(url)
}

export function exportPostsToHtml({ mesaTitle, posts, isMaster, currentPlayerId, currentUserId }: ExportPostsToHtmlOptions) {
	const narrativePosts = posts.filter(post => post.type !== 'OOC' && post.type !== 'SYSTEM')

	const html = buildHtmlDocument(mesaTitle, narrativePosts, { isMaster, currentPlayerId, currentUserId })

	downloadHtml(html, mesaTitle)
}
