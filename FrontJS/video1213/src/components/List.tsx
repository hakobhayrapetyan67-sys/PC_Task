import { useContext } from "react"
import { ToDoItem } from "./ToDoItem"
import { ToDoContext } from "../context/todoContext"



export const List = () => {
    const context = useContext(ToDoContext)
    if (!context) throw new Error("")

    const { todos } = context
    return (
        <div className="space-y-3">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                <span>{todos.length} tasks</span>
                <span>{todos.filter((todo) => todo.completed).length} completed</span>
            </div>

            {todos.map((todo) => (
                <ToDoItem todo={todo} key={todo.id} />
            ))}
        </div>
    )
}