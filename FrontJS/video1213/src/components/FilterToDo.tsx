const FILTERS = ["All", "Active", "Done"]

export const FilterToDo = () => {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-2">
            {FILTERS.map((filter, index) => {
                const isActive = index === 0

                return (
                    <button
                        key={filter}
                        type="button"
                        className={[
                            "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30"
                                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white",
                        ].join(" ")}
                    >
                        {filter}
                    </button>
                )
            })}
        </div>
    )
}