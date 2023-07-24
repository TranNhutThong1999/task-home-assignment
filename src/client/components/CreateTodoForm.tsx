import { useState } from 'react'

import { api } from '@/utils/client/api'

/**
 * QUESTION 1:
 * -----------
 * Style the "Add" button so that it looks like the design in Figma.
 *
 * NOTE: You must use tailwindcss and className. Do not use other methods (eg.
 * inline styles, separate css files, css modules, etc.) unless absolutely
 * necessary. This applies to all styling-related questions in this assignment.
 *
 * Documentation references:
 *  - https://tailwindcss.com
 *  - https://www.youtube.com/watch?v=mr15Xzb1Ook
 *
 *
 *
 * QUESTION 2:
 * -----------
 * Currently our form is not keyboard accessible. Users cannot hit
 * <Enter> right after typing to submit the form (add new todo). Fix this issue.
 */

export const CreateTodoForm = () => {
  const [todoBody, setTodoBody] = useState('')

  const apiContext = api.useContext()

  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch()
      },
    })

  const handleSubmittingForm = (e: React.FormEvent): void => {
    e.preventDefault()
    if (checkEmptyInput(todoBody)) {
      alert('Not empty')
      return
    }
    createTodo({
      body: todoBody,
    })
    setTodoBody('')
  }

  const checkEmptyInput = (input: string): boolean => input.trim() === ''

  return (
    <form
      onSubmit={handleSubmittingForm}
      className="group flex items-center justify-between gap-2 rounded-12 py-2 pr-3 outline outline-gray-200 focus-within:border-gray-400"
    >
      <label htmlFor={TODO_INPUT_ID} className="sr-only">
        Add todo
      </label>

      <input
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e) => {
          setTodoBody(e.target.value)
        }}
        className="flex-1 pl-4 text-base font-normal placeholder:text-gray-400 focus:outline-none"
      />

      <button
        type="submit"
        className="rounded-full bg-gray-700 px-5 py-2 text-sm font-bold tracking-[0.007rem] text-white"
        disabled={isCreatingTodo}
      >
        Add
      </button>
    </form>
  )
}

const TODO_INPUT_ID = 'todo-input-id'
