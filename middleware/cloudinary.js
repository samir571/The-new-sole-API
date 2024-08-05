const cloudinary = require("cloudinary").v2
const cloud_name = process.env.CLOUD_NAME
const api_secret = process.env.CLOUD_SECRET_KEY
const api_key = process.env.CLOUD_API_KEY

cloudinary.config({ cloud_name, api_secret, api_key })

exports.upload_image = async (imagePath,folder_name) => {
    const profile = await cloudinary.uploader.upload(imagePath, {
        public_id: Date.now(),
        folder: "gypsy/"+folder_name
    })
    return profile.secure_url
}