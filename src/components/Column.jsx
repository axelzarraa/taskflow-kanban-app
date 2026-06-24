import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function Column({ id, title, tasks, onDeleteTask, onUpdateTaskStatus, onEditTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`column ${isOver ? "column-over" : ""}`}
    >
      <div className="column-header">
        <div>
          <h2>{title}</h2>
          <p>
            {id === "todo" && "Tasks ready to start"}
            {id === "in-progress" && "Tasks currently in progress"}
            {id === "done" && "Completed tasks"}
          </p>
        </div>

        <span>{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleteTask={onDeleteTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
              onEditTask={onEditTask}
            />
          ))
        ) : (
          <div className="empty-column">
            <strong>No tasks yet</strong>
            <p>Move or create a task here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Column;