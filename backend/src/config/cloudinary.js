import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

const hasCloudinaryConfig = Boolean(
	process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

export async function uploadBufferToCloudinary(buffer, folder, fileName) {
	if (!hasCloudinaryConfig) {
		return {
			secure_url: `https://res.cloudinary.com/demo/${folder}/${Date.now()}-${fileName}`,
		};
	}

	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder,
				resource_type: 'auto',
				public_id: fileName.replace(/\.[^/.]+$/, ''),
			},
			(error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			}
		);

		Readable.from(buffer).pipe(uploadStream);
	});
}

export default cloudinary;
