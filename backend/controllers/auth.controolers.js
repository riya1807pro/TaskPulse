import bcrypt from 'bcryptjs';
import User from '../models/user.modals.js';
import { ErrorHandler } from '../utils/error.js';
import jwt from "jsonwebtoken";

export const signUp = async (req, res,next) => {
    const {name, email, password, profilePicUrl, adminJoinCode} = req.body;

if(
    !name|| 
    !email || 
    !password|| 
    name===""|| 
    email===""||
    password===""
) return next(ErrorHandler(400, "Name, email and password are required"));

const alreadyExists = await User.findOne({email});

if(alreadyExists){
    return next(ErrorHandler(400, "User with this email already exists"));
}


let role = "user";

if(adminJoinCode && adminJoinCode === process.env.ADMIN_JOIN_CODE){
    role = "admin";
}

const hashedPassword = bcrypt.hashSync(password, 10);

const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profilePicUrl,
    role,
})

try {
    await newUser.save();
    return res.status(201).json({message: "User created successfully"});
} catch (error) {
   return nextError(ErrorHandler(500, "Internal server error"));
}

}

export const SignIn = async (req, res, next)=>{
    const {email, password} = req.body;;

    if(!email ||
        !password ||
        email === "" ||
        password === ""
    ) return next(ErrorHandler(400, "Email and password are required"));

    const existingUser = await User.findOne({email});

    if(!existingUser) {
        return next(ErrorHandler(404, "user not found"));
    }

    const validPass = bcrypt.compareSync(password, existingUser.password);

    if(!validPass){
        return next(ErrorHandler(400, "Incorrect Credentials"))
    }

    const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET)

    const {password : pass, ...rest} = existingUser._doc;

    return res.status(200).cookie("token_access", token, {
        httpOnly: true,
    }).json({
        message: "SignIn successful",
        user: rest,
    })
}