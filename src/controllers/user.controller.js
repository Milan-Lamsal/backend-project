import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { User } from "..models/user.model.js"
import { uploadOnCloudinary } from "..utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


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
    const { fullName, email, username, password } = req.body
    console.log("email:", email) // you can only handle data not file if you want to handle file so how can we do ?
    //we use Routes for that 

    //2. Now validation 
    // if (fullName === ""){ 
    //     throw new ApiError(400, "fullname is required")
    // } As validating for all gonna take do lots of if else so rather we wil  be doing in this way:

    if (// check this and return true or false 

        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if the user already exist or not
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist ")
    }
    // Now Images 
    const avatarLocalPath = req.files?.avatar[0]?.path;     // because of multiple we can access files 
    const coverImageLocalPath = req.files?.coverImage[0]?.path; // [0] first property 

    //check avatar
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
    const user = User.create({
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



export { registerUser }