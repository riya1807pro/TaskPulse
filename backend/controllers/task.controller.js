import { ErrorHandler } from "../utils/error.js";
import Task from "../models/task.modal.js"

const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachment,
      todoCheckList,
    } = req.body;

    if(!Array.isArray(assignedTo)){
        return next(ErrorHandler(400, "assignedTo must be a array of user's Id"))
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachment,
      todoCheckList,
      createdBy: req.user.id
    })

    
    res.status(200).json({message : "task created", task})
  } catch (error) {
    next(error)
  }
};

export default createTask;
