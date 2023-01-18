import express from "express";
import * as user from "../Controllers/User.js";
import * as tokenverify from "../Controllers/Tokenverify.js";
import upload from "../utils/upload.js";
import { uploadImage, getImage } from "../Controllers/uploadImg.js";
const routes = express.Router();
// post methods start here
routes.post("/createuser", user.createuser);
routes.post("/login", user.login);
routes.get("/getAllusers",user.getAllusers);
routes.post("/verifytoken", tokenverify.tokenVerifyHandler);
routes.get("/getuser/:id", user.fetchuser);
routes.post("/file/uploads", upload.single("file"), uploadImage);
routes.get("/file/:filename", getImage);
export default routes;
