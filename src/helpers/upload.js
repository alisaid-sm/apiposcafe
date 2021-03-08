const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/upload')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.png`)

    }
})

const upload = multer({
    storage,
    limits: { fileSize: 100000 },
    fileFilter(req , file , cb){
        if (file.originalname.match(/\.(jpg|jpeg|png)\b/)) {
            cb(null , true)
        } else {
            cb('image type must jpg, jpeg, or png', null)
        }
    }
})

module.exports = upload