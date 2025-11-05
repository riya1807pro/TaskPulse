import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
    text:{
        type: String,
        require: true,
    },
    completed:{
        type: Boolean,
        default: false,
    }
})

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    dueDate:{
        type: Date,
        require: true,
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    createdBy :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            require: true,
        }
    ],
    attachments:[
        {
            type: String,
        }
    ],

    todoCheckList :[todoSchema],
    progress : {
        type: Number,
        default: 0,
    },
},{timestamps: true})

const Task = mongoose.model("Task", TaskSchema);
export default Task;
