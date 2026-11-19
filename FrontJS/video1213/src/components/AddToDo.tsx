import { useForm, type SubmitHandler } from "react-hook-form"
import type { ToDo } from "../context/types"
import { useContext } from "react"
import { ToDoContext } from "../context/todoContext"

type ToDoDetails = Omit<ToDo, 'id' | 'completed'>

export const AddToDo = () => {
    const context = useContext(ToDoContext)
    if (!context) throw new Error()
    const { onAdd } = context
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ToDoDetails>()

    const handleAdd: SubmitHandler<ToDoDetails> = (data) => {
        onAdd(data.title)
        reset()
    }
    return (
        <div className="mb-6">
            <label className="sr-only" htmlFor="todo-input">
                Add a new task
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-indigo-400/20 bg-slate-950/40 p-2 shadow-lg shadow-indigo-900/10 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-semibold text-white shadow-md shadow-indigo-500/30">
                    +
                </div>
                <form onSubmit={handleSubmit(handleAdd)}>
                    {errors.title && <p className="text-red-400">{errors.title.message}</p>}
                    <input
                        id="todo-input"
                        type="text"
                        {...register("title", { required: "Please fill the title" })}
                        placeholder="Add a new task..."
                        className="flex-1 border-0 bg-transparent px-2 py-3 text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    )
}