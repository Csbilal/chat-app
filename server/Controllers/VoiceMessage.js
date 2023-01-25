import mongoose from "mongoose";
import grid from "gridfs-stream";
const url = "http://localhost:8080";

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "voices",
  });
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("voices");
});

export const uploadAudio = (req, res) => {
  if (!req.file) return res.status(404).json("File not found");

  const audioUrl = `${url}/file/${req.file.filename}`;

  res.status(200).json(audioUrl);
};

export const getAudio = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.file });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
