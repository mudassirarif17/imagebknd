import { connect } from "mongoose";

const connectToMongo = async () =>{
    try {
        await connect("mongodb://localhost:27017/image");
        console.log("Conneted To Mongo SuccessFully");
    } catch (error) {
        console.log(error);
    }
}

export default connectToMongo;