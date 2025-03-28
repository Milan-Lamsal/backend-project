import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//                            Second Approach more in Professional environment

const connectDB = async () => {// DB is in another continent
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log(`\n MongoDB connected !! DB HOST :${connectionInstance.connection.host}`)


    } catch (error) {
        console.log("MongoDB connection Failed :", error);
        process.exit(1) // node js give access to process ->current 
    }

}

export default connectDB