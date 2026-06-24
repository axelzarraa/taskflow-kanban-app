import Column from "./Column";

const columns = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

function Board({ tasks, onDeleteTask, onUpdateTaskStatus, onEditTask }) {
  return (
    <section className="board">
      {columns.map((column) => {
        const filteredTasks = tasks.filter((task) => task.status === column.id);

        return (
       <Column
        key={column.id}
        id={column.id}
        title={column.title}
        tasks={filteredTasks}
        onDeleteTask={onDeleteTask}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onEditTask={onEditTask}
        />
        );
      })}
    </section>
  );
}

export default Board;