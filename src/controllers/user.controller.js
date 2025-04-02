import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const genereateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        //access and refresh token 
        const accessToken = user.generateAccessToken() // it is a method so use ()paratheses and access token we will give it to user
        const refreshToken = user.generateRefreshToken()//refresh token is saved on database so that we don't have to ask user to put password everytime

        //how to put refresh token in database 
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })// mongoose 

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")

    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend  (you can get the details from postman )
    //validation (if email is in correct format or if password is more than 8 character )- not empty 
    //check if user already exist : check username , email 
    //check for images, check for avatar
    // upload them to cloudinary, avatar 
    //create user object - create entry in  db 
    // remove password and refresh token field from response 
    // check for user creation 
    //return respose

    //1 get user details from fronted  (you can get the details from postman )
    //Extracted all the datapoints from req.body  
    const { fullName, email, username, password } = req.body
    console.log("email:", email) // you can only handle data not file if you want to handle file so how can we do ?
    //we use Routes for that 

    //2. Now validation 
    // if (fullName === ""){ 
    //     throw new ApiError(400, "fullname is required")
    // } As validating for all gonna take do lots of if else so rather we wil  be doing in this way:

    if (// check this and return true or false 
        //checking if someone kept empty string 
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if the user already exist or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist ")
    }
    console.log(req.files);

    // Now Images - called optional chaining 
    //taking out localpath and tried uploading 
    const avatarLocalPath = req.files?.avatar[0]?.path;     // because of multiple we can access files 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; // [0] first property 

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    //check avatar is present if not throw error or else upload to cloudinary 
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    //upload them to clodinary 100% takes time so await 
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //check if avatar is gone or not properly 
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    // create user object - Entry in database ,where user is taking with database 
    const user = await User.create({
        fullName,
        avatar: avatar.url, // just send URL or avatar 
        coverImage: coverImage?.url || " ", // as it not required so not empty
        email,
        password,
        username: username.toLowerCase()
    })
    //check if the user if null or empty 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"// what are the things we don't need , the things we need will be selected default, and -password means not needed (-)negative with space  { here two field  are not selected}
    ) // in mogo each data has _id 

    if (!createdUser) {
        throw new ApiError(500, "Something was wrong while regiestring user ")
    }
    //  finally return API respose 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

//what todo needed for 
const loginUser = asyncHandler(async (req, res) => {
    //req body->data
    //username or email ( one code which can work in both )
    //find the user
    //password check 
    //access and refresh token 
    //send cookie

    //req body -> data
    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }
    //Here is an alternatives of above code based on logic discuss
    //if(!(username || email )){
    // throw new ApiError(400, "Username or email is required") 
    // }

    const user = await User.findOne({
        $or: [{ username }, { email }] // here $or is mongodb operator
    })//the first entry in the monogodb its gives back
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    //check password
    const isPasswordCorrect = await user.isPasswordCorrect(password) // use small user not User capital User is from the mongoose and user is the instance of User
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials")
    }
    // access or request token 
    const { accessToken, refreshToken } = await genereateAccessAndRefreshTokens(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") //.select ("-password -refreshToken")  not needed

    //send in cookies - what information to send 
    const options = {
        httpOnly: true, // bydefault it can be modified in frontend but if you do hpptonly and secure true then it will only be modified from server. You cant modified from frontend 
        secure: true, //
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully "
            )
        )


})
// two things remove the cooking and 

//1refresh token remove from database
const logoutUser = asyncHandler(async (req, res) => {//middleware
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {//mongodb operator
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out "))

})

const refreshAccessToken = asyncHandler(async (req, resp) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    //verifying DECODED TOKEN
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh Token ")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, " refresh Token is expired or used  ")
        }
        //genereate new 
        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newRefreshToken } = await genereateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    },
                    "Access Token Refreshed"
                ),
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")

    }

})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken


}