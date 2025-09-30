import mongoose from "mongoose";
import userSchema from "../schema/User.js";

const userModel = mongoose.model("User", userSchema);

export default userModel;
