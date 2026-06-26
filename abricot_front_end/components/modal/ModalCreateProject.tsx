import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchCreateProject,
  fetchSearchUsersProject,
  fetchProfile,
  SearchUserProject,
  SearchUserProjectResponse,
} from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitiales } from '@/lib/utils'
import { useModal } from '@/components/providers/ModalProvider'
import { ChevronDown } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Un titre est requis'),
  description: z.string().optional(),
  contributors: z.array(z.string().email()).optional(),
})

type Input = z.infer<typeof schema>

export default function ModalCreateProject() {
  // useState pour gerer les message d'erreur et de reussite
  const [erreur, setErreur] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<SearchUserProject[]>([])

  const { setOpenModal } = useModal()
  const queryClient = useQueryClient()

  // useMutation gère l'envoi de la modification des informations de l'utilisateur
  const { mutate: mutateCreateProject } = useMutation({
    mutationFn: fetchCreateProject,
    // onSuccess est appelé lorsque la modification echoue
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur(data.message)
      } else {
        setOpenModal(false)
        queryClient.invalidateQueries({ queryKey: ['projects'] })
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
    mode: 'onChange',
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

  const onSubmit = (data: Input) => {
    mutateCreateProject(data)
  }
  return (
    <>
      <h1 className="font-semibold text-xl mb-8">Créer un projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label htmlFor="project-name">Titre * </Label>
          <Input
            id="project-name"
            {...register('name')}
            className={`border rounded-lg bg-white h-12 pr-10 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="project-description">Description </Label>
          <Input
            id="project-description"
            {...register('description')}
            className="border rounded-lg bg-white h-12 pr-10 "
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="project-contributors">Contributeurs</Label>
          <div className="relative">
            <Input
              id="project-contributors"
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
                    aria-label={`Retirer ${user.name ?? user.email}`}
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
