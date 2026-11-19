import { useContext } from "react"
import type { ToDo } from "../context/types"
import { ToDoContext } from "../context/todoContext"

type Props = {
    todo: ToDo
}

export const ToDoItem: React.FC<Props> = ({ todo }) => {
    const context = useContext(ToDoContext)
    if (!context) throw new Error("")

    const { onRemove } = context
    return (
        <div
            className={[
                "flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm transition-all duration-200",
                todo.completed
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-indigo-400/20 bg-slate-800/80",
            ].join(" ")}
        >
            <div className="flex items-center gap-3">
                <div
                    className={[
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold",
                        todo.completed
                            ? "border-emerald-400 bg-emerald-400 text-slate-950"
                            : "border-slate-500 bg-transparent text-transparent",
                    ].join(" ")}
                >
                    ✓
                </div>

                <p
                    className={[
                        "text-base font-medium",
                        todo.completed ? "text-slate-400 line-through" : "text-slate-100",
                    ].join(" ")}
                >
                    {todo.title}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onRemove(todo.id)}
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-rose-400/50 hover:text-rose-300"
            >
                Delete
            </button>
            <button
                type="button"
               
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-rose-400/50 hover:text-rose-300"
            >
                {todo.completed ? "Cancel" : "Complete"}
            </button>
        </div>
    )
}