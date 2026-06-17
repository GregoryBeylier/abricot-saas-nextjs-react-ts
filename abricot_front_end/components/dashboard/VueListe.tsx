'use client'
import { fetchAssignedTasks } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Folder, Calendar, MessageSquare } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: string
  dueDate: string | null
  comments: { id: string }[]
}

interface AssignedTasksResponse {
  data: {
    tasks: Task[]
  }
}

export default function VueListe() {
  // Utilisation de la hook useQuery pour récupérer les tâche
  const { data } = useQuery<AssignedTasksResponse>({
    queryKey: ['tasks'],
    queryFn: fetchAssignedTasks,
  })

  // récupération des tâches
  const tasks = data?.data?.tasks

  // mapping pour les états des tâches
  const statusLabels = {
    TODO: 'À faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminée',
  }

  // mapping pour les couleurs des états des tâches
  const statusColors = {
    TODO: 'bg-red-100 text-red-400',
    IN_PROGRESS: 'bg-orange-100 text-orange-400',
    DONE: 'bg-green-100 text-green-400',
  }

  // hook pour la recherche des tâches
  const [search, setSearch] = useState('')
  const tasksFiltrees = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-6 gap-4 pt-[41px] px-[59px] ">
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
          className="bg-white rounded-lg border p-4 flex justify-between h-[162px]"
          key={task.id}
        >
          <div className="flex flex-col justify-between py-2">
            <div>
              <h2 className="font-medium">{task.title}</h2>
              <p className="text-gray-500 text-sm">{task.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Folder size={16} className="text-gray-400" fill="currentColor" />
              <span>Nom du projet</span>
              <span>|</span>
              <Calendar size={16} className="text-gray-400" />
              <span>
                {task.dueDate
                  ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
                  : ''}
              </span>
              <span>|</span>
              <MessageSquare
                size={16}
                className="text-gray-400"
                fill="currentColor"
              />
              <span>{task.comments.length}</span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between pr-4 pb-2">
            <span
              className={`mt-2 rounded-full px-[16px] py-[4px] text-xs h-[25px] flex items-center ${statusColors[task.status as keyof typeof statusColors]}`}
            >
              {statusLabels[task.status as keyof typeof statusLabels]}
            </span>
            <Button className="h-[40px] rounded-[10px] px-[32px] bg-[#1F1F1F] text-white">
              Voir
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
