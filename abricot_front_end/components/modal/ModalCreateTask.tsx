'use client'

import { fetchCreateTask, ProjectMember, Projects } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useModal } from '../providers/ModalProvider'
import { useState } from 'react'
import { Label } from '../ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import { getInitiales } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Un titre est requis'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  assigneeIds: z.array(z.string()).optional(),
})

type Input = z.infer<typeof schema>

export default function ModalCreateTask({ project }: { project: Projects }) {
  // useState pour gerer les message d'erreur et de reussite
  const [erreur, setErreur] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<ProjectMember[]>([])
  const [query, setQuery] = useState('')

  const { setOpenModal } = useModal()
  const queryClient = useQueryClient()

  const { mutate: mutateCreateProject } = useMutation({
    mutationFn: (data: Input) => fetchCreateTask(project.id, data),
    // onSuccess est appelé lorsque la modification echoue
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur(data.message)
      } else {
        setOpenModal(false)
        queryClient.invalidateQueries({
          queryKey: ['project-tasks', project.id],
        })
      }
    },
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Input>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const onSubmit = (data: Input) => {
    mutateCreateProject(data)
  }
  return (
    <>
      <h1 className="font-semibold text-xl mb-8">Créer une tâche</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label>Titre </Label>
          <Input
            {...register('title')}
            className={`border rounded-lg bg-white h-12 pr-10 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label>Description </Label>
          <Input
            {...register('description')}
            className="border rounded-lg bg-white h-12 pr-10 "
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label>Échéance </Label>
          <Input
            type="date"
            {...register('dueDate')}
            className="border rounded-lg bg-white h-12 pr-10 "
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label>Assigné à :</Label>
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Choisir un ou plusieurs collaborateurs"
              className="border rounded-lg bg-white h-12 pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            {query.length >= 2 && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg top-full">
                {project.members
                  .filter(
                    (member) =>
                      member.user.name
                        ?.toLowerCase()
                        .includes(query.toLowerCase()) ||
                      member.user.email
                        .toLowerCase()
                        .includes(query.toLowerCase())
                  )
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        const alreadySelected = selectedUsers.find(
                          (u) => u.id === member.user.id
                        )
                        if (alreadySelected) {
                          setErreur('Cet utilisateur est déjà ajouté')
                          return
                        }
                        const newSelected = [...selectedUsers, member]
                        setSelectedUsers(newSelected)
                        setValue(
                          'assigneeIds',
                          newSelected.map((u) => u.user.id)
                        )
                        setQuery('')
                        setErreur('')
                      }}
                    >
                      {member.user.name} - {member.user.email}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
          {selectedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFE8D9] flex items-center justify-center text-xs font-medium uppercase ring-2 ring-white shrink-0">
                {getInitiales(user.user.name ?? '')}
              </div>
              <span className="text-sm">
                <span className="hidden sm:inline">{user.user.email}</span>
                <span className="sm:hidden">{user.user.name}</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelectedUsers(
                    selectedUsers.filter((u) => u.user.id !== user.user.id)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-fit h-12 px-8 rounded-[10px] bg-gray-200 text-gray-500 hover:bg-[#1F1F1F] hover:text-white transition-colors"
        >
          Ajouter un projet
        </Button>
      </form>
    </>
  )
}
