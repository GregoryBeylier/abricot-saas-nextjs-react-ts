'use client'
import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProjectTasks, fetchProjects, fetchProfile } from '@/lib/api'
import type { ProjectTasksResponse, ProjectsResponse } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInitiales, roleLabels } from '@/lib/utils'

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
            <h1 className="font-semibold text-xl">{project?.name}</h1>
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
      <div className="bg-[#F3F4F6] rounded-xl p-4 mt-6 flex items-center gap-4 flex-wrap">
        <p className="font-medium text-sm">
          Contributeurs{' '}
          <span className="text-gray-500">
            {(project?.members.length ?? 0) + 1} personnes
          </span>
        </p>
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div
            title={`${project?.owner?.name} — Propriétaire`}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ring-2 ring-white ${
              project?.owner?.id === userId ? 'bg-[#FFE8D9]' : 'bg-gray-200'
            }`}
          >
            {project?.owner?.name ? getInitiales(project.owner.name) : '?'}
          </div>
          <span className="bg-[#FFE8D9] text-[#D3590B] text-xs px-3 py-1 rounded-full">
            {project?.userRole
              ? (roleLabels[project.userRole] ?? project.userRole)
              : ''}
          </span>

          {/* Membres */}
          {project?.members
            .filter((member) => member.user.id !== project?.owner?.id)
            .map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div
                  title={`${member.user.name} — ${roleLabels[member.role] ?? member.role}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ring-2 ring-white ${
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
    </div>
  )
}
