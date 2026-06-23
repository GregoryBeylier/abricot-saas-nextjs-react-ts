import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchCreateProject,
  fetchSearchUsersProject,
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
  const [succes, setSucces] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<SearchUserProject[]>([])

  const { setOpenModal } = useModal()
  const queryClient = useQueryClient()

  // useMutation gère l'envoi de la modification des informations de l'utilisateur
  const { mutate: mutateCrateProject } = useMutation({
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
    reset,
    setValue,
  } = useForm<Input>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const [query, setQuery] = useState('')

  const { data } = useQuery<SearchUserProjectResponse>({
    queryKey: ['users-search', query],
    queryFn: () => fetchSearchUsersProject(query),
    enabled: query.length >= 2,
  })

  const onSubmit = (data: Input) => {
    mutateCrateProject(data)
  }
  return (
    <>
      <h1 className="font-semibold text-xl mb-8">Créer un projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label>Titre </Label>
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
              placeholder="Choisir un ou plusieurs collaborateurs"
              className="border rounded-lg bg-white h-12 pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            {query.length >= 2 && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg top-full">
                {(data?.data.users ?? []).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedUsers((prev) => [...prev, user])
                      setValue(
                        'contributors',
                        [...selectedUsers, user].map((u) => u.email)
                      )
                      setQuery('')
                    }}
                  >
                    {user.name} - {user.email}
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFE8D9] flex items-center justify-center text-xs font-medium uppercase ring-2 ring-white shrink-0">
                {getInitiales(user.name ?? '')}
              </div>
              <span className="text-sm">
                <span className="hidden sm:inline">{user.email}</span>
                <span className="sm:hidden">{user.name}</span>
              </span>
              <button
                onClick={() =>
                  setSelectedUsers(
                    selectedUsers.filter((u) => u.id !== user.id)
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
        {erreur && <p className="text-red-500 text-sm text-center">{erreur}</p>}
      </form>
    </>
  )
}
