'use client'
import { fetchAssignedTasks } from '@/lib/api'
import { fetchProjectsWithTasks } from '@/lib/api'
import { ProjectsWithTasksResponse } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { AssignedTasksResponse } from '@/lib/api'
import TaskCard from '@/components/dashboard/TaskCard'

export default function VueListe() {
  // useQuery récupère les tâches assignées de l'utilisateur
  const { data } = useQuery<AssignedTasksResponse>({
    queryKey: ['tasks'],
    queryFn: fetchAssignedTasks,
  })

  // Récupère les tâches depuis la réponse de la requête
  const tasks = data?.data?.tasks

  // État local pour filtrer la liste des tâches
  const [search, setSearch] = useState('')
  const tasksFiltrees = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  // useQuery récupère les projets et leurs tâches pour obtenir les noms de projets
  const { data: projectsData } = useQuery<ProjectsWithTasksResponse>({
    queryKey: ['projects-with-tasks'],
    queryFn: fetchProjectsWithTasks,
  })

  // récupération des projets
  const projects = projectsData?.data?.projects ?? []

  // Construit un dictionnaire { projectId: projectName } pour retrouver le nom d'un projet par son id
  const projectNames = projects.reduce<Record<string, string>>(
    (acc, project) => {
      acc[project.id] = project.name
      return acc
    },
    {}
  )

  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-6 gap-4 pt-[41px] lg:px-[59px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-[30px] gap-4">
        <div>
          <h1 className="font-semibold">Mes tâches assignées</h1>
          <p className="text-sm text-gray-500">Par ordre de priorité</p>
        </div>
        <div className="relative w-full lg:w-auto">
          <Input
            placeholder="Rechercher une tâche"
            className="w-full lg:w-[357px] h-[53px] rounded-[8px] border px-[32px] py-[23px] bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute right-[32px] top-1/2 -translate-y-1/2 text-gray-400 hidden min-[321px]:block"
            size={20}
          />
        </div>
      </div>
      {tasksFiltrees?.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg border px-4 lg:px-8 py-4 lg:h-[162px]"
        >
          <TaskCard task={task} projectName={projectNames[task.projectId]} />
        </div>
      ))}
    </div>
  )
}
