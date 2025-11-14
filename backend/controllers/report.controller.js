import Task from "../models/task.modal.js";
import excelJs from "exceljs"
import User from "../models/user.modals.js"

export const exportTaskReport = async (req, res, next) => {
    try {
        const task = await Task.find().populate("assignedTo", "name email");;

        const workBook = new excelJs.Workbook();
        const workSheet = workBook.addWorksheet("Task Report");

        workSheet.columns = [
            {header:"Task Id", key: "_id", width:25},
            {header:"Task Title", key: "title", width:25},
            {header:"Task Description", key: "description", width:30},
            {header:"Task Priority", key: "Priority", width:15},
            {header:"Task Status", key: "Status", width:20},
            {header:"Due Date", key: "dueDate", width:20},
            {header:"AssignedTo", key: "assignedTo", width:30},
        ]

        task.forEach((task)=>task.assignedTo.map((user)=>
        `(${user.name}) (${user.email})`)).join(" , ");

        workSheet.addRow = ({
            _id : task._id,
            title : task.title,
            description : task.description,
            priority : task.priority,
            status : task.status,
            dueDate : task.dueDate.toISOString().split("T")[0],
            assignedTo: task.assignedTo || "unassigned"
        });

        res.setHeader(
            "Content-type",
            "attachment/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        res.setHeader("content-header",
            'attachment;filename="task_report.xlsx"'
        );
        
        return workBook.xlsx.write(res).then(()=>{
            res.end();
        })

    } catch (error) {
        next(error)
    }
}


export const exportUsersReport = async (req, res, next) => {
  try {
    const users = await User.find().select("name email _id").lean()

    const userTasks = await Task.find().populate("assignedTo", "name email _id")

    const userTaskMap = {}

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      }
    })

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1

            if (task.status === "pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1
            } else if (task.status === "in-progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1
            } else if (task.status === "completed") {
              userTaskMap[assignedUser._id].completedTasks += 1
            }
          }
        })
      }
    })

    const workbook = new excelJs.Workbook()

    const worksheet = workbook.addWorksheet("User Task Report")

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ]

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user)
    })

    res.setHeader(
      "Content-Type",
      "attachment/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users_report.xlsx"'
    )

    return workbook.xlsx.write(res).then(() => {
      res.end()
    })
  } catch (error) {
    next(error)
  }
}