'use client'
import { JSX, use, useState } from 'react'
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
import type { Status } from '@/components/ui/StatusBadge'
import ModalEditProject from '@/components/modal/ModalEditProjects'
import { useModal } from '@/components/providers/ModalProvider'

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { setOpenModal, setContentModal } = useModal()

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
  const [statusFiltre, setStatusFiltre] = useState<Status | null>(null)
  const tasksFiltrees = tasks?.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFiltre === null || task.status === statusFiltre)
  )

  return (
    <div className="bg-[#F9FAFB] min-w-[280px] w-full px-4 lg:px-[112px] pt-[80px] pb-[50px]">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-xl">{project?.name}</h1>
              <a
                onClick={() => {
                  if (!project) return
                  setContentModal(<ModalEditProject project={project} />)
                  setOpenModal(true)
                }}
                className="text-sm text-[var(--color-abricot)] underline"
              >
                modifier
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-1">{project?.description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
          <Button className="h-[50px] px-[30px] rounded-[10px] bg-[#1F1F1F] text-white w-full sm:w-auto">
            Créer une tâche
          </Button>
          <Button className="h-[50px] px-[30px] rounded-[10px] bg-[#D3590B] text-white flex items-center gap-2 w-full sm:w-auto justify-center">
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
        <div className="flex justify-end items-center gap-2 flex-wrap flex-1">
          <div
            title={`${project?.owner?.name} — Propriétaire`}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ${
              project?.owner?.id === userId ? 'bg-[#FFE8D9]' : 'bg-gray-200'
            }`}
          >
            {project?.owner?.name ? getInitiales(project.owner.name) : '?'}
          </div>
          <RoleBadge role={project?.userRole ?? ''} />
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
      <div className="bg-white rounded-xl py-6 px-4 md:px-8 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Tâches</h2>
            <p className="text-sm text-gray-500">Par ordre de priorité</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
            <button className="flex items-center gap-2 bg-[#FFE8D9] text-[#D3590B] px-4 py-3 rounded-lg text-sm">
              <CheckSquare size={16} />
              Liste
            </button>
            <button className="flex items-center gap-2 text-[#D3590B] px-4 py-3 rounded-lg text-sm">
              <CalendarDays size={16} />
              Calendrier
            </button>
            <div className="relative flex items-center border rounded-lg">
              <select
                className="text-gray-500 px-4 py-3 text-sm outline-none bg-white appearance-none cursor-pointer pr-8 rounded-lg"
                value={statusFiltre ?? ''}
                onChange={(e) =>
                  setStatusFiltre((e.target.value as Status) || null)
                }
              >
                <option value="">Statut</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminée</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 pointer-events-none text-gray-500"
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-3 w-full max-w-[480px]">
              <input
                placeholder="Rechercher une tâche"
                className="text-sm outline-none bg-transparent flex-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards en dehors de la box blanche */}
      <div className="flex flex-col gap-4">
        {tasksFiltrees.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
