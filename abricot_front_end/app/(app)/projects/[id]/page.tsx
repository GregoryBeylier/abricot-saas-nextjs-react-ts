'use client'
import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProjectTasks, fetchProjects, fetchProfile } from '@/lib/api'
import type { ProjectTasksResponse, ProjectsResponse } from '@/lib/api'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Search,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInitiales, roleLabels } from '@/lib/utils'
import RoleBadge from '@/components/ui/RoleBadge'
import TaskRow from '@/components/projects/TaskRow'
import { Input } from '@/components/ui/input'

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const { data } = useQuery<ProjectTasksResponse>({
    queryFn: () => fetchProjectTasks(id),
    queryKey: ['project-tasks', id],
  })
  const tasks = data?.data?.tasks ?? []

  const { data: projectsData } = useQuery<ProjectsResponse>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const { data: profileData } = useQuery({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })
  const userId = profileData?.data?.user?.id

  const project = projectsData?.data?.projects.find((p) => p.id === id)

  // État local pour filtrer la liste des tâches
  const [search, setSearch] = useState('')
  const tasksFiltrees = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#F9FAFB] px-4 lg:px-[112px] pt-[40px] pb-[50px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-xl ">{project?.name}</h1>
              <a
                href="/login"
                className="text-sm text-[var(--color-abricot)] underline"
              >
                modifier
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-1">{project?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-[50px] px-[30px] rounded-[10px] bg-[#1F1F1F] text-white">
            Créer une tâche
          </Button>
          <Button className="h-[50px] px-[30px] rounded-[10px] bg-[#D3590B] text-white flex items-center gap-2">
            <Sparkles size={18} />
            IA
          </Button>
        </div>
      </div>

      {/* Bande Contributeurs */}
      <div className="mb-9 bg-[#F3F4F6] rounded-xl p-4 mt-6 flex items-center gap-4 flex-wrap">
        <p className="font-medium text-sm">
          Contributeurs{' '}
          <span className="text-gray-500">
            {(project?.members.length ?? 0) + 1} personnes
          </span>
        </p>
        <div className="flex  justify-end items-center gap-2 flex-wrap flex-1">
          <div
            title={`${project?.owner?.name} — Propriétaire`}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ${
              project?.owner?.id === userId ? 'bg-[#FFE8D9]' : 'bg-gray-200'
            }`}
          >
            {project?.owner?.name ? getInitiales(project.owner.name) : '?'}
          </div>
          <RoleBadge role={project?.userRole ?? ''} />

          {/* Membres */}
          {project?.members
            .filter((member) => member.user.id !== project?.owner?.id)
            .map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div
                  title={`${member.user.name} — ${roleLabels[member.role] ?? member.role}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ${
                    member.user.id === userId ? 'bg-[#FFE8D9]' : 'bg-gray-200'
                  }`}
                >
                  {member.user.name ? getInitiales(member.user.name) : '?'}
                </div>
                <span className="text-sm text-gray-600 bg-[#E5E7EB] px-3 py-1 rounded-full">
                  {member.user.name}
                </span>
              </div>
            ))}
        </div>
      </div>
      {/* Header Tâches */}
      <div className="bg-white rounded-xl py-12 px-15">
        <div className="flex justify-between items-center mb-15">
          <div>
            <h2 className="font-semibold text-lg">Tâches</h2>
            <p className="text-sm text-gray-500">Par ordre de priorité</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#FFE8D9] text-[#D3590B] px-4 py-3 rounded-lg text-sm">
              <CheckSquare size={16} />
              Liste
            </button>
            <button className="flex items-center gap-2 text-[#D3590B] px-4 py-3 rounded-lg text-sm">
              <CalendarDays size={16} />
              Calendrier
            </button>
            <button className="flex items-center gap-2 text-gray-500 px-7 py-5 rounded-lg text-sm border">
              Statut
              <ChevronDown size={16} />
            </button>
            <div className="flex items-center gap-2 border rounded-lg px-5 py-5">
              <input
                placeholder="Rechercher une tâche"
                className="text-sm outline-none bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-6 mx-4">
          {tasksFiltrees.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}
