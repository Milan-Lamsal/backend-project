// require('dotenv').config({ path: './env' }) this make code in consistent as you using both module and common js 
import dotenv from "dotenv"
import connectDB from "./db/db_index.js";
import { app } from "./app.js";

//configuring Environment Variables
dotenv.config({
    path: './env',
})

//Connecting to MongoDB 
connectDB() // calls connectDB(), which returns a Promise

    .then(() => { // if connection is successful, starts the express on the Port 
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port :${process.env.PORT}`);

        })
    })
    .catch((err) => {
        console.log("Mongo db connection failed !!", err)
    })



//DB CONNECTION 





/*                                           FIRST APPROACH 
import express from "express"
const app = express()

    // IIFE Immedately Eexcute ()() Better approach 
    ; (async () => {
        try {

            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) //Database connect
            // await mongoose.connect('mongodb://127.0.0.1:27017/test');

            //Listener
            app.on("Error", (error) => {
                console.log("Error:", error);
                throw error
            })
            app.listen(process.env.Port, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            })

        } catch (error) {
            console.error("Error:", error)
            throw err

        }
    })()
 */