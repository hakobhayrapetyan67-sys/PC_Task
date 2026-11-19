import { useState, type ReactNode } from "react"
import { ToDoContext } from "./todoContext"
import { type ToDo } from "./types"

type Props = {
    children: ReactNode
}

export const ToDoContextProvider: React.FC<Props> = ({ children }) => {
    const [todos, setTodos] = useState<ToDo[]>([
        { id: 101, title: "Eat a burger", completed: false },
        { id: 102, title: "Drink a coffee", completed: true },
        { id: 103, title: "Read a books", completed: false },
        { id: 104, title: "Do workout", completed: true },
    ])

    const removeToDo = (id: number) => {
        setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
    }

    const onAdd = (title: string) => {
        setTodos([{ title, completed: false, id: Date.now() }, ...todos])
    }
    return (
        <ToDoContext.Provider value={{ todos, onRemove: removeToDo, onAdd }}>
            {children}
        </ToDoContext.Provider>
    )
}