import { ToDoList } from "./components/ToDoList";
import { ToDoContextProvider } from "./context/todoContextProvider";

export default function App() {
  return (
    <ToDoContextProvider>
      <ToDoList />
    </ToDoContextProvider>
  )
}

