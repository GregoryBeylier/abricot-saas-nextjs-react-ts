'use client'
import { useQuery } from '@tanstack/react-query'
import {
  fetchAssignedTasks,
  fetchProjectsWithTasks,
  type AssignedTasksResponse,
  ProjectsWithTasksResponse,
} from '@/lib/api'
import TaskCard from '@/components/dashboard/TaskCard'

export default function VueKanban() {
  // useQuery récupère les tâches assignées de l'utilisateur
  const { data } = useQuery<AssignedTasksResponse>({
    queryKey: ['tasks'],
    queryFn: fetchAssignedTasks,
  })

  // useQuery récupère les projets et leurs tâches pour obtenir les noms de projets
  const { data: projectsData } = useQuery<ProjectsWithTasksResponse>({
    queryKey: ['projects-with-tasks'],
    queryFn: fetchProjectsWithTasks,
  })

  // Récupère les projets depuis la réponse de la requête
  const projects = projectsData?.data?.projects ?? []

  // Construit un dictionnaire projectId => projectName pour affichage
  const projectNames = projects.reduce<Record<string, string>>(
    (acc, project) => {
      acc[project.id] = project.name
      return acc
    },
    {}
  )

  // Récupère les tâches depuis la réponse de la requête
  const tasks = data?.data?.tasks

  // Filtre les tâches selon leur statut
  const todoTask = tasks?.filter((task) => task.status === 'TODO') || []

  // filtre les tâches in progress
  const inProgressTask =
    tasks?.filter((task) => task.status === 'IN_PROGRESS') || []

  // filtre les tâches done
  const doneTask = tasks?.filter((task) => task.status === 'DONE') || []

  return (
    <div className="flex gap-4 overflow-x-auto min-w-[1100px]">
      <div className="bg-white rounded-xl p-6 w-1/3 min-w-[280px] overflow-y-auto max-h-[600px]">
        <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
          <p className="font-semibold">À faire</p>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
            {todoTask.length}
          </span>
        </div>
        {todoTask.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 mb-4">
            <TaskCard
              task={task}
              variant_style="flex-col"
              projectName={projectNames[task.projectId]}
            />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 w-1/3 min-w-[280px] overflow-y-auto max-h-[600px]">
        <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
          <p className="font-semibold">En cours</p>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
            {inProgressTask.length}
          </span>
        </div>
        {inProgressTask.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 mb-4">
            <TaskCard
              task={task}
              variant_style="flex-col"
              projectName={projectNames[task.projectId]}
            />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 w-1/3 min-w-[280px] overflow-y-auto max-h-[600px]">
        <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
          <p className="font-semibold">Terminée</p>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
            {doneTask.length}
          </span>
        </div>
        {doneTask.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 mb-4">
            <TaskCard
              task={task}
              variant_style="flex-col"
              projectName={projectNames[task.projectId]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
