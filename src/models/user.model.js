// https://app.eraser.io/workspace/uSx3Dnf4uijx5EtdtpsM -> This is the Model we using 
import mongoose, { mongo, Schema } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true, // for searching field enable try to put index true it will be optimized
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        avatar: {
            type: String, // cloudinary url  we gonna use cloudinary service like AWS for we upload the image or file or anything and we get URL link 
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url 
        },
        watchHistory: [{ // multiple values 
            type: Schema.Types.ObjectId,
            ref: "Video",

        }
        ],
        // challenge 
        password: {
            type: String,//sometimes database can get link so clear text is not a clrear practice in database always keep the password encrypt but we can't just put encrypt cus we need to compare you keep 123 and the encrpted form is some random osdofsf#@@#  so how can we compare thats the challenge
            require: [true, "Password is required"]
        },
        refreshToken: { // what is token ? 
            type: String,
        },

    }, { timestamps: true }
)

// this will encrypt the password everytime we don't want like every if only ther is modification if password run 


userSchema.pre("save", async function (next) {
    //take password and encrypt 
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)// as it takes time to encrypt to await 
    next()


}) // before saving the data, in arrow function  can't use {this} doesn't know context so don't write arrow funciton write the normal function / as it takes time so async, we use next as err , req, res, and next where next is the middleware

//custome method cus the encrppted password and the user password they need to match 
userSchema.methods.isPasswordCorrect = async function (password) {
    // to check the password bcrypt is also used 
    return await bcrypt.compare(password, this.password) // this takes time cus cryptography by bcrypt 

}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username, // this.username is coming from database 
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User", userSchema) // as this user has been created through mongoose so it can contact with database
