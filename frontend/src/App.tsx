import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import PrivateRoute from "./routes/privateRoute"
import CreateTasks from "./pages/admin/createTasks"
import ManageTasks from "./pages/admin//manageTasks"
import ManageUsers from "./pages/admin/manageUsers"
import MyTasks from "./pages/users/myTasks"
import TaskDeatils from "./pages/users/taskDeatils"
import UserDashboard from "./pages/users/userDashboard"
import Dashboard from "./pages/admin/dashboard"
import HomePage from "./pages/home"
import NotFound from "./pages/NotFound"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
  return (
   <div>
    <BrowserRouter>
    <ErrorBoundary>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
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
    </ErrorBoundary>
    </BrowserRouter>
   </div>
  )
}

export default App
