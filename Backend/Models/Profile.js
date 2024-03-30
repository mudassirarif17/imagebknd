import mongoose , {model} from "mongoose";

const {Schema} = mongoose;

const ProfileScehma = new Schema({
        image : {
            type : String    
        }
})

// export default model('user' , UserScehma); 
export default model('profile' , ProfileScehma); 
