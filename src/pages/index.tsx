import type { ReactNode } from 'react'
import type { Todo } from '@/client/components/TodoList'

import * as Tabs from '@radix-ui/react-tabs'

import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'
import { api } from '@/utils/client/api'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

const Index = () => {
  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>
        <div className="pt-10">
          <Overview />
        </div>
        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

type Status = {
  id: number
  name: string
}

const PENDING = 'pending'
const COMPLETED = 'completed'

export const STATUS = {
  all: { id: 1, name: 'all' },
  pending: { id: 2, name: 'pending' },
  completed: { id: 3, name: 'completed' },
}

const statusMap = {
  [STATUS.all.name]: [PENDING, COMPLETED],
  [STATUS.completed.name]: [COMPLETED],
  [STATUS.pending.name]: [PENDING],
}

const activeClassName =
  'data-[state=active]:bg-gray-700 data-[state=active]:text-white'

const inActiveClassName =
  'data-[state=inactive]:outline-1 data-[state=inactive]:outline data-[state=inactive]:outline-gray-200 data-[state=inactive]:text-gray-700'

const Overview = () => {
  const deleteBoxMutation = api.todo.delete.useMutation()
  const updateBoxStatusMutation = api.todoStatus.update.useMutation()

  const dataFactory = api.todo.getAll.useQuery({
    statuses: [PENDING, COMPLETED],
  })
  const { data: todos = [] } = dataFactory

  const handleDeleteBox = (boxId: number): void => {
    deleteBoxMutation.mutate(
      { id: boxId },
      {
        onSuccess: () => {
          dataFactory.refetch()
        },
      }
    )
  }

  const handleCheckedBox = (boxId: number, checked: boolean): void => {
    checked
      ? handleUpdateStatus(boxId, STATUS.completed.name)
      : handleUpdateStatus(boxId, STATUS.pending.name)
  }

  const handleUpdateStatus = (boxId: number, status: string): void => {
    updateBoxStatusMutation.mutate(
      { todoId: boxId, status: status as 'pending' | 'completed' },
      {
        onSuccess: () => {
          dataFactory.refetch()
        },
      }
    )
  }

  const renderStatusTabs = () =>
    Object.values(STATUS).map((status: Status): ReactNode => {
      return (
        <Tabs.Trigger
          key={status.id}
          className={`${activeClassName} ${inActiveClassName} rounded-full px-6 py-3 text-sm font-bold tracking-[0.0156rem] text-gray-700 duration-500 first-letter:uppercase`}
          value={String(status.id)}
        >
          {status.name}
        </Tabs.Trigger>
      )
    })

  const renderContentTabs = () =>
    Object.values(STATUS).map((status: Status): ReactNode => {
      return (
        <Tabs.Content
          className="pt-10"
          value={String(status.id)}
          key={`content ${status.id}`}
        >
          <TodoList
            todos={todos.filter((todo: Todo) =>
              (statusMap[status.name] ?? []).includes(todo.status)
            )}
            onCheckedBox={handleCheckedBox}
            onDeleteBox={handleDeleteBox}
          />
        </Tabs.Content>
      )
    })

  return (
    <Tabs.Root className="" defaultValue={String(STATUS.all.id)}>
      <Tabs.List className="flex gap-2">{renderStatusTabs()}</Tabs.List>
      {renderContentTabs()}
    </Tabs.Root>
  )
}
export default Index
