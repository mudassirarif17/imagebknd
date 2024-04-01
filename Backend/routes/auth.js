import express from "express";
const router = express.Router();
import Profile from "../Models/Profile.js";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";


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

// Route : 1 Sign Up 
router.post("/signup", upload.single("image"), async (req, res) => {
    console.log(req.body);
    const {name , email , password} = req.body;
    const imageName = req.file.filename;

    if(!name || !email || !password){
      return res.status(400).json({error : "All Fields Are Required"});
    }

    if(!email.includes('@')){
      return res.status(400).json({error : "Please Enter a valid Email"})
    }
  
    try {
      const profile = await Profile.findOne({email});
      if(profile){
        return res.status(400).json({error : "User Already Exist"});
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password , salt);

      const newProfile = await Profile({
        image : imageName,
        name,
        email,
        password : hashedPass
      })

      await newProfile.save();
      res.json({ status: "Signup SuccessFully" });
    } catch (error) {
      res.json({ status: error });
    }
  });
  
  // Route 2 : Sign In
  router.post("/signin" , async (req,res)=>{
    // res.send("Hello Login");
    const {email , password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({error : "All fields are required"})
        }

        if(!email.includes("@")){
            return res.status(400).json({error : "Please Enter a valid Email"})
        }

        const user = await Profile.findOne({email});
        console.log(user);

        if(!user){
            res.status.send({error : "User Not Found"});
        }

        const dotMatch = await bcrypt.compare(password , user.password);
        console.log(dotMatch);

        if(dotMatch){
            const token = jwt.sign({userId : user.id} , process.env.JWT_SECRET , {
                expiresIn : "7d"
            }) ;

            res.status(201).json({token})
        }
        else{
            res.status(404).json({error : "Email And Password Not Found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
    
})


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