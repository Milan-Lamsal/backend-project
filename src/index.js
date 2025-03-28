// require('dotenv').config({ path: './env' }) this make code in consistent as you using both module and common js 
import dotenv from "dotenv"
import connectDB from "./db/db_index.js";


dotenv.config({
    path: './env',
})

connectDB();



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