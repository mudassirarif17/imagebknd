import express from "express";
import auth from "./routes/auth.js";
import connectToMongo from "./database/db.js";
import cors from 'cors'

const app = express();
app.use(express.json());

app.use(cors());
const port = 5000;

connectToMongo();
app.use("/api/auth" , auth);

app.listen(port, () => {
  console.log(`App Listen at http://localhost:${port}`)
})
