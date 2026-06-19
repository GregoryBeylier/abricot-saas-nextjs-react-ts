'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchProjects, type ProjectsResponse } from '@/lib/api'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/ProjectCard'

export default function ProjectsPage() {
  // récupère les données utilisateur depuis le cache TanStack Query
  const { data } = useQuery<ProjectsResponse>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  // recuperer le nom des projets de l'utlisateur
  const projects = data?.data?.projects ?? []
  return (
    <div className="bg-[#F9FAFB] px-4 lg:px-[112px] pt-[40px] pb-[50px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="mt-[40px] lg:mt-[89px]">
          <h1 className="text-2xl font-semibold mb-2">Mes projets</h1>
          <p className="mb-10">Gérez vos projets</p>
        </div>
        <Button className="h-[50px] px-[30px] rounded-[10px] text-base font-normal sm:mt-[89px]">
          + Créer un projet
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
