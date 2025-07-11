import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
   

    // Check if req.body exists
    if (!req.body) {
        console.log('ERROR: req.body is undefined!');
        throw new ApiError(400, "Request body is missing");
    }

    // Check if req.body is empty object
    if (Object.keys(req.body).length === 0) {
        console.log('ERROR: req.body is empty object!');
        throw new ApiError(400, "Request body is empty");
    }

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body

    // Debug the extracted values
    console.log('Extracted values:');
    console.log('fullName:', fullName);
    console.log('email:', email);
    console.log('username:', username);
    console.log('password:', password ? '[HIDDEN]' : 'undefined');

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // Temporary success response for testing
    res.status(200).json({
        success: true,
        message: "User registration logic working",
        data: { fullName, email, username }
    });

    //console.log(req.files);
})

export { registerUser }