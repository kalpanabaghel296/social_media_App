import {Schema,model,models} from "mongoose";

const UserSchema = new Schema({
  ClerkId :{
    type: String,
    required: true,
    unique: true,
  },
  emails:{
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  photo:{
    type: String,
    required: true,
  },
  firstName:{
    type: String,
    
  },
  lastName:{
    type: String,
  },
});

const User=models?.user || model("User",UserSchema);

export default User;