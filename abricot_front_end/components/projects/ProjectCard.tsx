import type { Projects, UserProfile } from '@/lib/api'
import { Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProfile } from '@/lib/api'
import { getInitiales, roleLabels } from '@/lib/utils'
import Link from 'next/link'
import RoleBadge from '@/components/ui/RoleBadge'

interface ProjectCardProps {
  project: Projects
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { data } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  const total = project._count?.tasks ?? 0
  const completed = project.completedTasks ?? 0
  const progression = total > 0 ? Math.round((completed / total) * 100) : 0

  const userId = data?.data?.user?.id

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-xl border p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <h2 className="font-semibold text-base sm:text-lg">{project.name}</h2>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[2.5rem]">
          {project.description}
        </p>
        <div className="mt-8 flex-1">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{progression}%</span>
            <span>Progression</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#D3590B] h-1.5 rounded-full"
              style={{ width: `${progression}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 mb-10">
            {completed} / {total} tâches terminées
          </p>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <Users size={16} />
            <span>Équipe ({project.members.length + 1})</span>
          </div>
          <div className="flex items-center flex-wrap gap-y-2 gap-x-2">
            <div
              title={`${project.owner.name || project.owner.email} — Propriétaire`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ring-2 ring-white ${
                project.owner.id === userId ? 'bg-[#FFE8D9]' : 'bg-gray-200'
              }`}
            >
              {project?.owner?.name
                ? getInitiales(project.owner.name)
                : getInitiales(project?.owner?.email ?? '')}
            </div>
            <RoleBadge role={project.userRole} />
            <div className="flex items-center">
              {project.members
                .filter((member) => member.user.id !== project.owner.id)
                .map((member) => (
                  <div
                    key={member.id}
                    title={`${member.user.name || member.user.email} — ${roleLabels[member.role] ?? member.role}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium uppercase ring-2 ring-white -ml-2 first:ml-0 ${
                      member.user.id === userId ? 'bg-[#FFE8D9]' : 'bg-gray-200'
                    }`}
                  >
                    {member.user.name
                      ? getInitiales(member.user.name)
                      : getInitiales(member.user.email)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
