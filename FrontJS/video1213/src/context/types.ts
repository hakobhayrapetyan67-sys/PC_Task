export type ToDo = {
    id: number
    title: string
    completed: boolean
}

export type ContextType = {
    todos: ToDo[]
    onRemove: (id: number) => void
    onAdd:(title:string) => void
}