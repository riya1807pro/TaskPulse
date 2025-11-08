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
    } = req.body || {};

    if (!req.user || !req.user.id) return next(ErrorHandler(401, "Unauthorized"));

    if(!Array.isArray(assignedTo)){
        return next(ErrorHandler(400, "assignedTo must be an array of User IDs"))
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

    return res.status(201).json({ success: true, message : "task created", task})
  } catch (error) {
    next(error)
  }
};

export const getTask = async (req, res, next) => {
  try {
    let {status} = req.query;

    let filter = {};
    if(status){
      filter.status = status;
    }

    if (!req.user || !req.user.id) return next(ErrorHandler(401, "Unauthorized"));

    let tasks;

    if(req.user.role === "admin"){
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profilePicUrl"
      );
    } else {
      tasks = await Task.find({
        ...filter,
        assignedTo: req.user.id
      }).populate("assignedTo", "name email profilePicUrl");
    }

    tasks = await Promise.all(
      tasks.map(async(task)=>{
        const completeCount = (task.todoCheckList || []).filter(
          (item)=> item.completed
        ).length;

        return {...task._doc , completeCount : completeCount}
      })
    );

    // task summary
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo : req.user.id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id })
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "in-progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id })
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id })
    });

    return res.status(200).json({
      success: true,
      tasks,
      statusSummary : {
        all : allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks
      }
    });
  } catch (error) {
    next(error)
  }
}

export default createTask;
