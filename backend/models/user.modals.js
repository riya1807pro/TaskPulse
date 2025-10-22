import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicUrl:{
        type: String,
        default:"https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
},

{timestamps: true}
)

const User = mongoose.model("User", userSchema);
export default User;