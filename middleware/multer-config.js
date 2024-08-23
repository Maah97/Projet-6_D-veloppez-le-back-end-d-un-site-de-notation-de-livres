const multer = require('multer');
const sharpMulter = require('sharp-multer');


const newFilenameFunction = (og_filename, options) => {
    const nameDowload = og_filename.split(' ').join('_');
    const newname =
      nameDowload.split(".").slice(0, -1).join(".") +
      `${options.useTimestamp ? "-" + Date.now() : ""}` +
      "." + options.fileFormat;
    return newname;
};


const storage = sharpMulter ({
    destination:(req, file, callback) => {
        callback(null, 'images');
    },
    imageOptions: {
        fileFormat: "webp",
        quality: 20,
        resize: { width: 512, height: 800 },
        useTimestamp: true,
        filename: newFilenameFunction
    }
});

module.exports = multer({storage: storage}).single('image');