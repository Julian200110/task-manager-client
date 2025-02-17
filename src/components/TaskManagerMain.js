import React, { useEffect, useState } from "react";
import "../stylesheets/Taskmanagermain.css";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { RiStickyNoteAddFill } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TaskManagerMain = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(["all"]);
  const navigate = useNavigate();
  // Function to fetch task data from the server and set it in the state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://3.95.151.67:8000/tasks/");
        setTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Function to delete a specific task by passing its Id as a parameter
  const deleteTask = async (taskId) => {
    await axios
      .delete(`http://3.95.151.67:8000/tasks/delete/${taskId}`)
      .then((response) => {
        setTasks((prevTask) => prevTask.filter((task) => task._id !== taskId));
        toast.success(response.data.message, { position: "top-right" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle the status filter
  const handleStatusChange = (status) => {
    // If the user selects "all", reset the filters to only include "all"
    if (status === "all") {
      setStatusFilter(["all"]);
    } else {
      setStatusFilter((prevFilters) => {
        // If the status is already selected, remove it from the array
        if (prevFilters.includes(status)) {
          const newFilters = prevFilters.filter((s) => s !== status);
          // Prevents the list from being empty
          return newFilters.length > 0 ? newFilters : ["all"];
        } else {
          // If "all" was previously selected, replace it with the new status
          // Otherwise, add the new status to the filter array
          return prevFilters.includes("all")
            ? [status]
            : [...prevFilters, status];
        }
      });
    }
  };

  // Filter tasks by title and status
  const filteredTasks = tasks.filter((task) => {
    // Check if the task title contains the search term (case-insensitive)
    const matchesSearch = task.title
      .toLowerCase() // Convert the task title to lowercase
      .includes(search.toLowerCase()); // Convert the search term to lowercase and check if it's included

    // Check if the task status matches the selected filter
    // Allow the task if "all" is selected or if the task's status is included in the statusFilter array
    const matchesStatus =
      statusFilter.includes("all") || statusFilter.includes(task.status);

    // Include the task only if both the search term and status filter conditions are met
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="task-manager">
      <h1>TASK MANAGER</h1>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="task-manager__search-input"
      />
      <div className="task-manager__filters">
        <div className="task-manager__status-filter">
          <input
            type="checkbox"
            name="All"
            checked={statusFilter.includes("all")}
            onChange={() => handleStatusChange("all")}
          />
          <label htmlFor="All">All</label>
        </div>
        <div className="task-manager__status-filter">
          <input
            type="checkbox"
            name="Todo"
            checked={statusFilter.includes("To do")}
            onChange={() => handleStatusChange("To do")}
          />
          <label htmlFor="Todo">To do</label>
        </div>
        <div className="task-manager__status-filter">
          <input
            type="checkbox"
            name="Inprogress"
            checked={statusFilter.includes("In progress")}
            onChange={() => handleStatusChange("In progress")}
          />
          <label htmlFor="Inprogress">In progress</label>
        </div>
        <div className="task-manager__status-filter">
          <input
            type="checkbox"
            name="Done"
            checked={statusFilter.includes("Done")}
            onChange={() => handleStatusChange("Done")}
          />
          <label htmlFor="Done">Done</label>
        </div>
      </div>
      {filteredTasks.length > 0 ? (
        // If there are filtered tasks, render them
        filteredTasks.map((task, index) => (
          <div key={index} className="task-manager__card">
            <div className="task-manager__card-header">
              <div
                className={`task-manager__card-status-circle ${
                  task.status === "Done"
                    ? "task-manager__card-status-circle--green"
                    : task.status === "In progress"
                    ? "task-manager__card-status-circle--orange"
                    : "task-manager__card-status-circle--red"
                }`}
              ></div>
              <h3>{task.title}</h3>
              {/* Button to toggle task expansion */}
              <button
                onClick={() => {
                  setIsExpanded((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                }}
              >
                {isExpanded === index ? (
                  <IoIosArrowUp size={30} />
                ) : (
                  <IoIosArrowDown size={30} />
                )}
              </button>
            </div>
            {/* Expanded content (only shown when the task is expanded) */}
            {isExpanded === index ? (
              <>
                <p className="task-manager__card-description">
                  {task.description}
                </p>
                <div className="task-manager__card-footer">
                  <strong>{task.date.split("T")[0]}</strong>
                  <div className="task-manager__card-buttons">
                    <button onClick={() => navigate("/update/" + task._id)}>
                      <FaEdit size={20} />
                    </button>
                    <button onClick={() => deleteTask(task._id)}>
                      <MdDeleteForever size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ))
      ) : (
        // If no tasks match the filters, display this message
        <p>No tasks found.</p>
      )}

      <button
        className="task-manager__add-task"
        onClick={() => navigate("/AddTask")}
      >
        <RiStickyNoteAddFill size={20} />
        Add task
      </button>
    </div>
  );
};

export default TaskManagerMain;
