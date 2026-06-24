# TaskFlow — Task Management App

TaskFlow is a Trello-style task management app built with React. It allows users to organize tasks across multiple workflow stages, manage task details, filter tasks, and move cards using drag-and-drop interaction.

This project was created as part of my frontend development portfolio to practice building a more complete and interactive web application using React, API integration, local state management, and persistent browser storage.

## Features

- Kanban-style task board with To Do, In Progress, and Done columns
- Fetch initial task data from DummyJSON API
- Add new tasks with custom title and priority
- Edit existing task title and priority
- Delete tasks
- Move tasks between columns using dropdown status control
- Drag and drop tasks between columns
- Search tasks by title
- Filter tasks by priority
- Dashboard summary for total, To Do, In Progress, and Done tasks
- Overall completion progress bar
- Empty state for no search results and empty columns
- Persistent data using LocalStorage
- Reset filters and reset board data
- Responsive dashboard layout

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- DummyJSON API
- LocalStorage
- dnd-kit

## What I Learned

Through this project, I practiced building a React application with reusable components, handling API data, managing state across components, implementing CRUD features, and improving user experience with search, filters, drag-and-drop, and responsive UI design.

## Getting Started

Clone this repository and install the dependencies:

```bash
npm install