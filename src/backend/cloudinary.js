const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: cloudinary.cloud_name,
    api_key: cloudinary.api_key,
    api_secret: cloudinary.api_secret,
});

// Upload a file to Cloudinary
const uploadFile = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: 'bikeImages',
            public_id: file.originalname,
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};

// Get a list of files from Cloudinary
const getFiles = async () => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            max_results: 10,
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};

// Use the uploaded file URL
const getFileUrl = (publicId) => {
    return cloudinary.url(publicId, {
        width: 300,
        height: 200,
        crop: 'fill',
    });
};
