import mongoose from "mongoose";
mongoose.set('strictQuery', true)
const connectDB = async (url) => {
    await mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{
      console.log("connected successfully");
    }).catch((error)=>{
    console.log(error);
    })
};

export default connectDB;