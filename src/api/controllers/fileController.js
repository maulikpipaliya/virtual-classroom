import uploadFile from "../middlewares/uploadFileMiddleware.js";

export const upload = async (req, res) => {
    console.log("Upload API called");
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res
                .status(400)
                .send({ message: "File is undefined or not provided!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (error) {
        res.status(500).send({
            message: `Could not upload the file: ${error}`,
        });
    }
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = "./assets/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};
