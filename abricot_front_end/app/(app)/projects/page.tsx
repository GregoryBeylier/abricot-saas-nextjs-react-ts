'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchProjects, type ProjectsResponse } from '@/lib/api'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/ProjectCard'
import { useModal } from '@/components/providers/ModalProvider'
import ModalCreateProject from '@/components/modal/ModalCreateProject'

export default function ProjectsPage() {
  // Récupère la liste des projets de l'utilisateur via TanStack Query
  const { data } = useQuery<ProjectsResponse>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const { setContentModal, setOpenModal } = useModal()

  // Récupère les projets depuis la réponse de l'API
  const projects = data?.data?.projects ?? []
  return (
    <div className="min-h-screen px-4 lg:px-[112px] pt-[40px] pb-[50px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="mt-[40px] lg:mt-[89px]">
          <h1 className="text-2xl font-semibold mb-2">Mes projets</h1>
          <p className="mb-10">Gérez vos projets</p>
        </div>
        <Button
          className="h-[50px] px-[30px] rounded-[10px] text-base font-normal sm:mt-[89px]"
          onClick={() => {
            setContentModal(<ModalCreateProject />)
            setOpenModal(true)
          }}
        >
          + Créer un projet
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="h-full">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
