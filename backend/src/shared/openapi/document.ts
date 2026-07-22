import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import '../../modules/auth/docs/auth.openapi'
import '../../modules/users/docs/users.openapi'
import '../../modules/userCharacters/docs/userCharacters.openapi'
import { openApiRegistry } from './registry'

export function generateOpenApiDocument() {
	const generator = new OpenApiGeneratorV31(openApiRegistry.definitions)

	return generator.generateDocument({
		openapi: '3.1.0',
		info: {
			title: 'Caneta & Adaga API',
			version: '1.0.0'
		}
	})
}
