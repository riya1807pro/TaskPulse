import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // use the file parameter (file.originalname), not req.file
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error("Invalid file type"), false);
    } else {
        cb(null, true);
    }
};

const uploads = multer({ storage, fileFilter });

export default uploads;