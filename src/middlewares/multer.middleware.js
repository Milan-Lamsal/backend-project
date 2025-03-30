import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp") // cb means call back 
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname) // not a good idea to use originalname what if user give 5 files of same filename and they might override but the files will only remain for very less amount of time cus gonna send in cloudinary 
    }
})

export const upload = multer(
    {
        storage: storage  // or just storage,
    }
)