'use client'
import { fetchAssignedTasks } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { AssignedTasksResponse } from '@/lib/api'
import TaskCard from '@/components/dashboard/TaskCard'

export default function VueListe() {
  // Utilisation de la hook useQuery pour récupérer les tâche
  const { data } = useQuery<AssignedTasksResponse>({
    queryKey: ['tasks'],
    queryFn: fetchAssignedTasks,
  })

  // récupération des tâches
  const tasks = data?.data?.tasks

  // hook pour la recherche des tâches
  const [search, setSearch] = useState('')
  const tasksFiltrees = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-6 gap-4 pt-[41px] px-[59px]">
      <div className="flex justify-between items-center mb-[30px]">
        <div>
          <h1 className="font-semibold">Mes tâches assignées</h1>
          <p className="text-sm text-gray-500">Par ordre de priorité</p>
        </div>
        <div className="relative">
          <Input
            placeholder="Rechercher une tâche"
            className="w-[357px] h-[53px] rounded-[8px] border px-[32px] py-[23px] bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute right-[32px] top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>
      {tasksFiltrees?.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg border px-8 py-4 h-[162px]"
        >
          <TaskCard task={task} />
        </div>
      ))}
    </div>
  )
}
