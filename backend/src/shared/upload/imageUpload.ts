import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary } from './cloudinary'

const MAX_FILE_SIZE_MB = 5

function createImageUpload(folder: string) {
	const storage = new CloudinaryStorage({
		cloudinary,
		params: () => ({
			folder: `caneta-e-adaga/${folder}`,
			allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
		})
	})

	return multer({
		storage,
		limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
		fileFilter: (_req, file, callback) => {
			if (!file.mimetype.startsWith('image/')) {
				callback(new Error('O arquivo enviado deve ser uma imagem'))
				return
			}

			callback(null, true)
		}
	})
}

export { createImageUpload }
