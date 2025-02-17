import "./App.css";
import AddTask from "./components/AddNewTask";
import EditTask from "./components/EditTask";
import TaskManagerMain from "./components/TaskManagerMain";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <TaskManagerMain />,
    },
    {
      path: "/AddTask",
      element: <AddTask />,
    },
    {
      path: "/Update/:id",
      element: <EditTask />,
    },
  ]);
  return (
    <div className="App">
      <Toaster />
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
