import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

export const uploadDoctorFiles = upload.fields([
  { name: 'degreeCertificate', maxCount: 1 },
  { name: 'licenseCertificate', maxCount: 1 },
]);

export const uploadSingleImage = upload.single('profileImage');
