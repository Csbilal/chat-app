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
    default:"12"
  },
  img: {
    type: String,
    default: "",
  },
  status:{
    type:String,
    default:"offline",
  },
  lastseen:{
    type:String,
    default:""
  }
});
const usersModal = mongoose.model("nftlay", userSchema);
export default usersModal;
