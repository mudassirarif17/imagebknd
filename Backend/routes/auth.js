import express from "express";
const router = express.Router();
import Profile from "../Models/Profile.js";
import multer from "multer";

// Multer code
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

router.post("/upload-image", upload.single("image"), async (req, res) => {
    console.log(req.body);
    const {name , email , password} = req.body;
    const imageName = req.file.filename;
  
    try {
      await Profile.create({ image: imageName , name : name , email : email , password : password });
      // let p = await new Profile({iamge , name , email , password});
      res.json({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
  });
  
  router.get("/get-image", async (req, res) => {
    try {
      Profile.find({}).then((data) => {
        res.send({ status: "ok", data: data });
      });
    } catch (error) {
      res.json({ status: error });
    }
  });



export default router;