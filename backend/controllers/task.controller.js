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

    // normalize todoCheckList: keep items that have non-empty text
    const normalizedTodo = Array.isArray(todoCheckList)
      ? todoCheckList
          .map(item => ({
            text: (item && item.text) ? String(item.text).trim() : "",
            completed: !!(item && item.completed)
          }))
          .filter(i => i.text.length > 0)
      : [];

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachment,
      todoCheckList: normalizedTodo,
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

export const getTaskById = async (req, res, next) => {
  try {
    const id = req.params?.id || req.params?.taskId;
    if (!id) return next(ErrorHandler(400, "Missing task id"));

    const task = await Task.findById(id).populate("assignedTo", "name email profilePicUrl");
    if (!task) return next(ErrorHandler(404, "Task not found"));

    return res.status(200).json({ success: true, task });
  } catch (error) {
    return next(error);
  }
};

const sanitizeTodoList = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      // accept both item.text and legacy item.task
      const rawText = item?.text ?? item?.task ?? "";
      return {
        text: String(rawText).trim(),
        completed: !!item?.completed,
      };
    })
    .filter((i) => i.text.length > 0);
};

export const updateTask = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!id) return next(ErrorHandler(400, "Missing task id"));

    const task = await Task.findById(id);
    if (!task) return next(ErrorHandler(404, "Task not found"));

    // update fields
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.priority = req.body.priority ?? task.priority;
    task.dueDate = req.body.dueDate ?? task.dueDate;

    // If client provided todoCheckList, sanitize and set it.
    if (req.body.todoCheckList) {
      task.todoCheckList = sanitizeTodoList(req.body.todoCheckList);
    } else {
      // Always sanitize existing items to avoid validation errors from legacy data
      task.todoCheckList = sanitizeTodoList(task.todoCheckList);
    }

    task.attachments = req.body.attachment ?? task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return next(ErrorHandler(400, "Assigned to must be an array of user ids"));
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();

    return res.status(200).json({ success: true, task: updatedTask });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  const task = Task.findById(req.params?.id);

  if (!task) {
    next(ErrorHandler(404, "task not found"))
  }

  await task.deleteOne();

  res.status(200).json("task deleted successfully!")
}

export const updateTaskStatus = async (req, res, next) => {
  try {
       const id = req.params?.id;
    if (!id) return next(ErrorHandler(400, "Missing task id"));

    const task = await Task.findById(id);
    if (!task) return next(ErrorHandler(404, "Task not found"));

    const isAssigned = task.assignedTo.some((userId)=> userId.toString() === req.user.id.toString());

    if (!isAssigned && req.user.role !== "admin") {
      next(ErrorHandler(401, "unauthorized user"))
    }

    task.status = req.body.status || task.status;

    if(task.status === "completed"){
      task.todoCheckList.forEach((item)=> item.completed = true)
    }

    await task.save();

    return res.status(200, {message: "task status updated"}, task)

  } catch (error) {
    next(error) 
  }
}

export default createTask;
