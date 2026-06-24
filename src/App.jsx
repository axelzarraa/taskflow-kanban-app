import { DndContext } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import Board from "./components/Board";
import { getTodos } from "./services/todoApi";
import "./App.css";

const STORAGE_KEY = "taskflow-tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    async function loadTodos() {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
          setStatus("success");
          return;
        }

        const todos = await getTodos();

        const formattedTasks = todos.map((todo, index) => ({
          id: todo.id,
          title: todo.todo,
          priority:
            index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low",
          status:
            todo.completed ? "done" : index % 2 === 0 ? "todo" : "in-progress",
        }));

        setTasks(formattedTasks);
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (status === "success") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, status]);

  function handleCreateTask(event) {
    event.preventDefault();

    if (!newTaskTitle.trim()) {
      return;
    }

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: newTaskTitle,
                priority: newTaskPriority,
              }
            : task
        )
      );

      setEditingTask(null);
      setNewTaskTitle("");
      setNewTaskPriority("Medium");
      setIsFormOpen(false);
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      priority: newTaskPriority,
      status: "todo",
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    setIsFormOpen(false);
  }

  function handleDeleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  }

  function handleUpdateTaskStatus(taskId, newStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  function handleOpenEditTask(task) {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskPriority(task.priority);
    setIsFormOpen(true);
  }

  function handleOpenNewTaskForm() {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    setIsFormOpen(true);
  }

  function handleCloseForm() {
  setEditingTask(null);
  setNewTaskTitle("");
  setNewTaskPriority("Medium");
  setIsFormOpen(false);
}

function handleResetFilters() {
  setSearchQuery("");
  setPriorityFilter("All");
}

function handleResetData() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

function handleDragEnd(event) {
  const { active, over } = event;

  if (!over) {
    return;
  }

  const taskId = active.id;
  const newStatus = over.id;

  handleUpdateTaskStatus(taskId, newStatus);
}

const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchesPriority =
    priorityFilter === "All" || task.priority === priorityFilter;

  return matchesSearch && matchesPriority;
});

const totalTasks = tasks.length;
const todoTasks = tasks.filter((task) => task.status === "todo").length;
const inProgressTasks = tasks.filter(
  (task) => task.status === "in-progress"
).length;
const doneTasks = tasks.filter((task) => task.status === "done").length;

const completionRate =
  totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

return (
  <main className="app">
    <div className="page-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Task Management App</p>
          <h1>TaskFlow</h1>
          <p className="subtitle">
            A clean kanban-style board to organize tasks, track progress, and
            manage daily workflow.
          </p>
        </div>

        <div className="header-actions">
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            className="secondary-button"
            type="button"
            onClick={handleResetFilters}
          >
            Reset
          </button>

          <button
            className="danger-button"
            type="button"
            onClick={handleResetData}
          >
            Reset Data
          </button>

          <button className="primary-button" onClick={handleOpenNewTaskForm}>
            + New Task
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Tasks</span>
          <strong>{totalTasks}</strong>
        </article>

        <article className="stat-card">
          <span>To Do</span>
          <strong>{todoTasks}</strong>
        </article>

        <article className="stat-card">
          <span>In Progress</span>
          <strong>{inProgressTasks}</strong>
        </article>

        <article className="stat-card">
          <span>Done</span>
          <strong>{doneTasks}</strong>
        </article>
      </section>

      <section className="progress-card">
        <div>
          <span>Overall Progress</span>
          <strong>{completionRate}% completed</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </section>

      {status === "loading" && <p className="state-text">Loading tasks...</p>}

      {status === "error" && (
        <p className="state-text error">Error: {errorMessage}</p>
      )}

      {status === "success" && filteredTasks.length > 0 && (
        <DndContext onDragEnd={handleDragEnd}>
          <Board
            tasks={filteredTasks}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onEditTask={handleOpenEditTask}
          />
        </DndContext>
      )}

      {status === "success" && filteredTasks.length === 0 && (
        <section className="empty-state">
          <h2>No tasks found</h2>
          <p>
            Try adjusting your search keyword or priority filter to find the
            task you are looking for.
          </p>
        </section>
      )}

      {isFormOpen && (
        <div className="modal-backdrop">
          <form className="task-form" onSubmit={handleCreateTask}>
            <div className="form-header">
              <div>
                <p className="eyebrow">
                  {editingTask ? "Edit Task" : "New Task"}
                </p>
                <h2>{editingTask ? "Update task" : "Create task"}</h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={handleCloseForm}
              >
                ×
              </button>
            </div>

            <label>
              Task title
              <input
                type="text"
                placeholder="Example: Design dashboard layout"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
              />
            </label>

            <label>
              Priority
              <select
                value={newTaskPriority}
                onChange={(event) => setNewTaskPriority(event.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleCloseForm}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                {editingTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  </main>
);
}

export default App;