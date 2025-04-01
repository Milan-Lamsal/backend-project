import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"// file system unlink ( file delete ->  file unlink )

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on clodinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successsfull
        // console.log("file is uploaded on Cloudinary", response.url);

        //removing the file (unlinking the file) 
        fs.unlinkSync(localFilePath, { // synchronously 
            resource_type: "auto"
        })
        return response

    } catch (error) {
        //deleting from file from server if its corrupted or not working files 
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed

        return null;

    }
}
export { uploadOnCloudinary }