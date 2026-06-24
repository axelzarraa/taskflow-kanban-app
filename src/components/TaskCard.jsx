import { useDraggable } from "@dnd-kit/core";

function TaskCard({ task, onDeleteTask, onUpdateTaskStatus, onEditTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      className={`task-card ${isDragging ? "task-card-dragging" : ""}`}
      style={dragStyle}
    >
      <div className="task-card-top">
        <div className="task-card-left">
          <button
            className="drag-handle"
            type="button"
            aria-label="Drag task"
            {...listeners}
            {...attributes}
          >
            ⠿
          </button>

          <span className={`task-priority ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        <div className="task-actions">
          <button
            className="task-action-button"
            type="button"
            aria-label="Edit task"
            onClick={() => onEditTask(task)}
          >
            Edit
          </button>

          <button
            className="task-menu"
            type="button"
            aria-label="Delete task"
            onClick={() => onDeleteTask(task.id)}
          >
            ×
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>

      <label className="status-control">
        Status
        <select
          value={task.status}
          onChange={(event) => onUpdateTaskStatus(task.id, event.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      <div className="task-footer">
        <span>Task #{task.id}</span>
        <span>DummyJSON</span>
      </div>
    </article>
  );
}

export default TaskCard;