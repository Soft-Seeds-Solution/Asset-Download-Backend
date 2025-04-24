import multer from "multer"

// img storage path
const fileconfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
});

const upload = multer({
    storage: fileconfig
})
export default upload;