import { mongoose, Schema } from "mongoose";
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  walletaddress: {
    type: String,
     default:""
  },
  img: {
    type: String,
    default: "",
  },
  status:{
    type:String,
    default:"offline",
  }
});
const usersModal = mongoose.model("nftlay", userSchema);
export default usersModal;
