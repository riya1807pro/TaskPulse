import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema = new Mongoose({
    name:{
        type: String,
        require: true,
    },

    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    },
    profilePicUrl:{
        type: String,
        default:"https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"
    }
},

{timestamps: true}
)

const user = mongoose.model("user", userSchema);
export default user;