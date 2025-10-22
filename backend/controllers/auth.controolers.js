import bcrypt from 'bcryptjs';
import User from '../models/user.modals.js';

export const signUp = async (req, res,next) => {
    const {name, email, password, profilePicUrl, adminJoinCode} = req.body;

if(
    !name|| 
    !email || 
    !password|| 
    name===""|| 
    email===""||
    password===""
){ res.jsom({message: "Please provide all required fields"}); }

const alreadyExists = await User.findOne({email});

if(alreadyExists){
    return res.status(400).json({message: "User with this email already exists"});
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
    res.status(400).json({message: "Error creating user", error: error.message});
    next(error);
}

}