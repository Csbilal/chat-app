import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
  url: "mongodb+srv://bilal:151214bscs@cluster0.ouusdwa.mongodb.net/?retryWrites=true&w=majority",
  options: { useNewUrlParser: true },
  file: (request, file) => {
    const match = ["audio/webm"];

    if (match.indexOf(file.memeType) === -1)
      return `${Date.now()}-blog-${file.originalname}`;

    return {
      bucketName: "voices",
      filename: `${Date.now()}-blog-${file.originalname}`,
    };
  },
});

export default multer({ storage });
