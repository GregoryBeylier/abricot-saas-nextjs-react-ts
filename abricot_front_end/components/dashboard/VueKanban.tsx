'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchAssignedTasks, type AssignedTasksResponse } from '@/lib/api'
import TaskCard from '@/components/dashboard/TaskCard'

export default function VueKanban() {
  // Utilisation de la hook useQuery pour récupérer les tâche
  const { data } = useQuery<AssignedTasksResponse>({
    queryKey: ['tasks'],
    queryFn: fetchAssignedTasks,
  })

  // récupération des tâches
  const tasks = data?.data?.tasks

  // filtre les tâches Todo
  const todoTask = tasks?.filter((task) => task.status === 'TODO') || []

  // filtre les tâches in progress
  const inProgressTask =
    tasks?.filter((task) => task.status === 'IN_PROGRESS') || []

  // filtre les tâches done
  const doneTask = tasks?.filter((task) => task.status === 'DONE') || []

  return (
    <div className="flex gap-4 ">
      <div className="bg-white rounded-xl p-6 w-1/3">
        <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
          <p className="font-semibold">À faire</p>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
            {todoTask.length}
          </span>
        </div>
        {todoTask.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 mb-4">
            <TaskCard task={task} variant_style="flex-col" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 w-1/3">
        <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
          <p className="font-semibold">En cours</p>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
            {inProgressTask.length}
          </span>
        </div>
        {inProgressTask.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 mb-4">
            <TaskCard task={task} variant_style="flex-col" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 w-1/3">
        <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
          <p className="font-semibold">Terminée</p>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
            {doneTask.length}
          </span>
        </div>
        {doneTask.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 mb-4">
            <TaskCard task={task} variant_style="flex-col" />
          </div>
        ))}
      </div>
    </div>
  )
}
