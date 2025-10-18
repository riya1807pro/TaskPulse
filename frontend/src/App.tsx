import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import PrivateRoute from "./routes/privateRoute"
import CreateTasks from "./pages/admin/CreateTasks"
import ManageTasks from "./pages/admin/ManageTasks"
import ManageUsers from "./pages/admin/ManageUsers"
import MyTasks from "./pages/users/MyTasks"
import TaskDeatils from "./pages/users/TaskDeatils"
import UserDashboard from "./pages/users/UserDashboard"
import Dashboard from "./pages/admin/Dashboard"

function App() {
  return (
   <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

      {/* admin routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
        <Route path="/admin/dashboard" element={<Dashboard/>} />
        <Route path="/admin/createTask" element={<CreateTasks/>} />
        <Route path="/admin/manageUsers" element={<ManageUsers/>} />
        <Route path="/admin/manageTasks" element={<ManageTasks/>} />
      </Route>

      {/* users routes */}
      <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
        <Route path="/users/myTasks" element={<MyTasks/>} />
        <Route path="/users/taskDeatils" element={<TaskDeatils/>} />
        <Route path="/users/userDashboard" element={<UserDashboard/>} />
      </Route>
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
