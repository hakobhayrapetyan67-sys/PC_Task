import { AddToDo } from "./AddToDo"
import { FilterToDo } from "./FilterToDo"
import { List } from "./List"



export const ToDoList = () => {

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-[28px] border border-indigo-500/20 bg-slate-900/80 shadow-[0_30px_80px_rgba(79,70,229,0.2)] backdrop-blur-xl">
                    <header className="border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-slate-900 px-5 py-6 sm:px-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
                                    Productivity
                                </p>
                                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                    Focus Flow
                                </h1>
                            </div>
                            <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-right">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-200">
                                    Remaining
                                </div>
                                <div className="text-lg font-bold text-indigo-100"></div>
                            </div>
                        </div>
                    </header>

                    <div className="p-5 sm:p-8">
                        <AddToDo />
                        <FilterToDo />
                        <List />
                    </div>
                </div>
            </div>
        </div>
    )
}