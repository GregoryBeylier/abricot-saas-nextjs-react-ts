import {
  AddContributorBody,
  fetchAddContributor,
  fetchRemoveContributor,
  fetchSearchUsersProject,
  fetchUpdateProject,
  fetchProfile,
  Projects,
  SearchUserProject,
  SearchUserProjectResponse,
} from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import z from 'zod'
import { useModal } from '@/components/providers/ModalProvider'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitiales } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'

const schema = z.object({
  name: z.string().min(1, 'Un titre est requis'),
  description: z.string().optional(),
  contributors: z.array(z.string().email()).optional(),
})

type Input = z.infer<typeof schema>

export default function ModalEditProject({ project }: { project: Projects }) {
  const [erreur, setErreur] = useState('')

  const [selectedUsers, setSelectedUsers] = useState<SearchUserProject[]>(
    project.members.map((m) => ({
      ...m.user,
      name: m.user.name ?? m.user.email,
    }))
  )

  const { setOpenModal } = useModal()
  const queryClient = useQueryClient()

  // useMutation pour modifier le titre et la description
  const { mutateAsync: mutateUpdateProject } = useMutation({
    mutationFn: (data: Input) => fetchUpdateProject(project.id, data),
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  // useMutation pour ajouter un contributeur
  const { mutateAsync: mutateAddContributorsProject } = useMutation({
    mutationFn: (data: AddContributorBody) =>
      fetchAddContributor(project.id, data),
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  // useMutation pour supprimer un contributeur
  const { mutateAsync: mutateRemoveContributorsProject } = useMutation({
    mutationFn: (userId: string) => fetchRemoveContributor(project.id, userId),
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
    mode: 'onChange',
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
    },
  })

  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { data: profileData } = useQuery({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })
  const currentUserId = profileData?.data?.user?.id

  const { data } = useQuery<SearchUserProjectResponse>({
    queryKey: ['users-search', query],
    queryFn: () => fetchSearchUsersProject(query),
    enabled: dropdownOpen,
  })

  const searchResults = (data?.data?.users ?? []).filter(
    (u) =>
      u.id !== currentUserId &&
      !selectedUsers.find((s) => s.id === u.id)
  )

  const onSubmit = async (data: Input) => {
    const initialIds = project.members.map((m) => m.user.id)
    const selectedIds = selectedUsers.map((u) => u.id)

    const toAdd = selectedUsers.filter((u) => !initialIds.includes(u.id))
    const toRemove = project.members.filter(
      (m) => !selectedIds.includes(m.user.id)
    )

    await Promise.all([
      mutateUpdateProject(data),
      ...toAdd.map((u) =>
        mutateAddContributorsProject({ email: u.email, role: 'CONTRIBUTOR' })
      ),
      ...toRemove.map((m) => mutateRemoveContributorsProject(m.user.id)),
    ])

    setOpenModal(false)
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }
  return (
    <>
      <h1 className="font-semibold text-xl mb-8">Modifier un projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label>Titre * </Label>
          <Input
            {...register('name')}
            className={`border rounded-lg bg-white h-12 pr-10 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
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
          <Label>Contributeurs</Label>
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
                {searchResults.length === 0 ? (
                  <p className="text-sm text-gray-400 px-3 py-2">Aucun résultat</p>
                ) : searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-gray-50"
                    onMouseDown={() => {
                      const newSelected = [...selectedUsers, user]
                      setSelectedUsers(newSelected)
                      setValue('contributors', newSelected.map((u) => u.email))
                      setQuery('')
                      setErreur('')
                      setDropdownOpen(false)
                    }}
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium uppercase flex-shrink-0">
                      {getInitiales(user.name ?? user.email)}
                    </div>
                    <span className="text-sm">{user.name ?? user.email}</span>
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
                    {getInitiales(user.name ?? user.email)}
                  </div>
                  <span className="text-sm text-gray-700 max-w-[120px] truncate">
                    {user.name ?? user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSelected = selectedUsers.filter((u) => u.id !== user.id)
                      setSelectedUsers(newSelected)
                      setValue('contributors', newSelected.map((u) => u.email))
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

        <Button
          type="submit"
          disabled={!watch('name')}
          className={`w-fit h-12 px-8 rounded-[10px] transition-colors ${
            watch('name')
              ? 'bg-[#1F1F1F] text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Ajouter un projet
        </Button>
      </form>
    </>
  )
}
