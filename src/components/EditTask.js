import react, { useState, useEffect } from "react";
import "../stylesheets/Addnewtask.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditTask = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const tasks = {
    title: "",
    description: "",
    status: "",
    date: "",
  };
  const { id } = useParams();
  const [task, setTask] = useState(tasks);
  // Function to handle input changes and update the task state
  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setTask({ ...task, [name]: value });
  };
  // Function to fetch task data from the server and set it in the state
  useEffect(() => {
    axios
      .get(
        `https://task-manager-server-c8360b2a15c3.herokuapp.com/tasks/task/${id}`
      )
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);
  // Function to update by sending a PUT request to the server
  const submitForm = async (e) => {
    e.preventDefault();
    console.log(task);
    await axios
      .put(
        `https://task-manager-server-c8360b2a15c3.herokuapp.com/tasks/update/${id}`,
        task
      )
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message || "An unexpected error occurred";
        toast.error(errorMessage, { position: "top-right" });
      });
  };
  return (
    <div className="task-manager__container-form">
      <h1>EDIT TASK</h1>
      <form onSubmit={submitForm} className="task-manager__add-form">
        <div className="task-manager__input-group">
          <label htmlFor="title" className="task-manager__label">
            Title
          </label>
          <input
            type="text"
            id="title"
            onChange={inputHandler}
            value={task.title}
            name="title"
            autoComplete="off"
            className="task-manager__input-form"
            placeholder="Enter task title"
          />
        </div>
        <div className="task-manager__input-group">
          <label htmlFor="Description" className="task-manager__label">
            Description
          </label>
          <input
            type="text"
            id="description"
            onChange={inputHandler}
            value={task.description}
            className="task-manager__input-form"
            name="description"
            autoComplete="off"
            placeholder="Enter task description"
          />
        </div>
        <div className="task-manager__input-group">
          <label htmlFor="Date" className="task-manager__label">
            Date
          </label>
          <input
            type="date"
            id="date"
            onChange={inputHandler}
            value={task.date ? task.date.split("T")[0] : ""}
            className="task-manager__input-form"
            name="date"
            min={today}
          />
        </div>
        <div className="task-manager__input-group">
          <label htmlFor="status" className="task-manager__label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="task-manager__select-status"
            onChange={inputHandler}
            value={task.status}
          >
            <option value="">Select status</option>
            <option value="To do">To do</option>
            <option value="In progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="task-manager__buttons">
          <button type="submit" className="task-manager__addtask">
            Edit task
          </button>

          <button
            className="task-manager__goback"
            type="button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
