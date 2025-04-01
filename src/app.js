import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// how to confiugure
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//Before doing the cookies option need to do some settings 
//data might come from URL, JSON, Body(like form ), like not allwoing unlimited JSON 

app.use(express.json({ limit: "16kb" }))// accepting json

// In URL there is encoder like for space " " it is encoded to %20 so when accepting URL 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))// extended object on object 

app.use(express.static("public"))// STATIC -> sometimes we want to store file and folder like pdf files , images to store in the server so we gonna make a public assest where anyone can access , where public is the folder name 

// Used of cookieParser
// to access the cookies and to set the cookies 

app.use(cookieParser())

//routes import this way 
import userRouter from "./routes/user.routes.js"

//routes declaration
// app.get//  when routes and controller was used in the same file then we were writing in this way but  now when wer are using import then we will be using middlewares to bring routes instead of app.get we use app.use

app.use("/api/v1/users", userRouter) //(we define api and version its a good practice)

// http://localhost:8000/api/v1/users/register
// http://localhost:8000/api/v1/users/login



export { app }
