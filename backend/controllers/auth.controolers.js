import bcrypt from 'bcryptjs';
import User from '../models/user.modals.js';
import { ErrorHandler } from '../utils/error.js';

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