import util from "util";
import multer from "multer";

const maxSize = 5 * 1024 * 1024; // 5MB

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/uploads");
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
});

//single file for now
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize,
    },
}).single("file");

// makes the exported middleware object - can be used with async-await
let uploadFileMiddleware = util.promisify(upload);

export default uploadFileMiddleware;
