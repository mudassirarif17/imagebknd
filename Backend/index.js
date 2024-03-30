import express from "express";
import cors from 'cors'
import connectToMongo from "./database/db.js";

import Profile from "./Models/Profile.js";
import multer from "multer";

const app = express();
app.use(express.json());

app.use(cors());
const port = 5000;

connectToMongo();

app.listen(port, () => {
  console.log(`App Listen at http://localhost:${port}`)
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../src/images/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  app.post("/upload-image", upload.single("image"), async (req, res) => {
    console.log(req.body);
    const imageName = req.file.filename;
  
    try {
      await Profile.create({ image: imageName });
      res.json({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
  });
  
  app.get("/get-image", async (req, res) => {
    try {
      Profile.find({}).then((data) => {
        res.send({ status: "ok", data: data });
      });
    } catch (error) {
      res.json({ status: error });
    }
  });