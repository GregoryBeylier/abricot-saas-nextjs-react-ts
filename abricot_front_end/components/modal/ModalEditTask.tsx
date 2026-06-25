import {
  fetchUpdateTask,
  ProjectMember,
  Projects,
  ProjectTask,
} from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useModal } from '@/components/providers/ModalProvider'
import { Label } from '../ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import { getInitiales } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Un titre est requis'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  assigneeIds: z.array(z.string()).optional(),
})

type Input = z.infer<typeof schema>

interface ModalEditTaskProps {
  task: ProjectTask
  project: Projects
}

export default function ModalEditTask({ task, project }: ModalEditTaskProps) {
  // useState pour gerer les message d'erreur et de reussite
  const [erreur, setErreur] = useState('')
  // On construit la liste complète des membres potentiels : members + owner si absent
  const allMembers: ProjectMember[] = [
    ...project.members,
    ...(project.members.some((m) => m.user.id === project.owner?.id)
      ? []
      : [{ id: 'owner', role: 'OWNER', user: project.owner }]),
  ]

  const [selectedUsers, setSelectedUsers] = useState<ProjectMember[]>(
    allMembers.filter((m) =>
      task.assignees.some((a) => a.user.id === m.user.id)
    )
  )
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { setOpenModal } = useModal()
  const queryClient = useQueryClient()

  const { mutate: mutateUpdateProject } = useMutation({
    mutationFn: (data: Input) => fetchUpdateTask(project.id, task.id, data),
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
    watch,
  } = useForm<Input>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate?.slice(0, 10) ?? '',
      assigneeIds: task.assignees.map((a) => a.user.id),
      status: task.status,
    },
  })

  const onSubmit = (data: Input) => {
    mutateUpdateProject(data)
  }

  return (
    <>
      <h1 className="font-semibold text-xl mb-8">Modifier une tâche</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label>Titre * </Label>
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
            className="border rounded-lg bg-white h-12 pr-10"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label>Échéance </Label>
          <Input
            type="date"
            {...register('dueDate')}
            className="border rounded-lg bg-white h-12 pr-10"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label>Assigné à :</Label>
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              placeholder="Choisir un ou plusieurs collaborateurs"
              className="border rounded-lg bg-white h-12 pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            {dropdownOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg top-full max-h-48 overflow-y-auto">
                {allMembers
                  .filter(
                    (member) =>
                      !selectedUsers.find((u) => u.user.id === member.user.id) &&
                      (query.length === 0 ||
                        member.user.name?.toLowerCase().includes(query.toLowerCase()) ||
                        member.user.email.toLowerCase().includes(query.toLowerCase()))
                  )
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-gray-50"
                      onMouseDown={() => {
                        const newSelected = [...selectedUsers, member]
                        setSelectedUsers(newSelected)
                        setValue('assigneeIds', newSelected.map((u) => u.user.id))
                        setQuery('')
                        setErreur('')
                        setDropdownOpen(false)
                      }}
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium uppercase flex-shrink-0">
                        {getInitiales(member.user.name ?? member.user.email)}
                      </div>
                      <span className="text-sm">{member.user.name ?? member.user.email}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1">
                  <div className="w-6 h-6 rounded-full bg-[#D3590B]/10 flex items-center justify-center text-xs font-medium uppercase shrink-0">
                    {getInitiales(user.user.name ?? user.user.email)}
                  </div>
                  <span className="text-sm text-gray-700 max-w-[120px] truncate">
                    {user.user.name ?? user.user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSelected = selectedUsers.filter((u) => u.user.id !== user.user.id)
                      setSelectedUsers(newSelected)
                      setValue('assigneeIds', newSelected.map((u) => u.user.id))
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label>Statut :</Label>
          <div className="flex items-center gap-3">
            {(
              [
                { value: 'TODO', label: 'À faire', active: 'bg-red-100 text-red-400', inactive: 'bg-gray-100 text-gray-400' },
                { value: 'IN_PROGRESS', label: 'En cours', active: 'bg-orange-100 text-orange-400', inactive: 'bg-gray-100 text-gray-400' },
                { value: 'DONE', label: 'Terminée', active: 'bg-green-100 text-green-400', inactive: 'bg-gray-100 text-gray-400' },
              ] as const
            ).map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setValue('status', s.value)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${watch('status') === s.value ? s.active : s.inactive}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!watch('title')}
          className={`w-fit h-12 px-8 rounded-[10px] transition-colors ${
            watch('title')
              ? 'bg-[#1F1F1F] text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Modifier la tâche
        </Button>
      </form>
    </>
  )
}
