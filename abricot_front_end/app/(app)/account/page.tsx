'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UserProfile } from '@/lib/api'
import {
  fetchProfile,
  fetchUpdateProfile,
  fetchUpdatePassword,
} from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Email invalide').optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule')
    .regex(/[a-z]/, 'Au moins une lettre minuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[@$!%*?&]/, 'Au moins un caractère spécial')
    .optional()
    .or(z.literal('')),
})

type Input = z.infer<typeof schema>

export default function Account() {
  const { data } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const queryClient = useQueryClient()

  // useMutation gère l'envoi de la modification des informations de l'utilisateur
  const { mutate: mutateProfile } = useMutation({
    mutationFn: fetchUpdateProfile,
    // onSuccess est appelé lorsque la modification echoue
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur(data.message)
      } else {
        setSucces('Profil mis à jour avec succès')
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    },
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  // useMutation gère l'envoi de la modification des informations de l'utilisateur
  const { mutate: mutatePassword } = useMutation({
    mutationFn: fetchUpdatePassword,
    // onSuccess est appelé lorsque la modification echoue
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur(data.message)
      } else {
        setSucces('Profil mis à jour avec succès')
      }
    },
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  const onSubmit = (data: Input) => {
    mutateProfile({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
    })
    if (data.currentPassword && data.newPassword) {
      mutatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
    }
  }
  const user = data?.data?.user

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Input>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name?.split(' ') ?? []
      reset({
        firstName: firstName ?? '',
        lastName: rest.join(' ') ?? '',
        email: user.email ?? '',
      })
    }
  }, [user, reset])

  return (
    <div className="bg-[#F9FAFB] min-h-screen px-3 sm:px-4 lg:px-[112px] pt-[70px] pb-[20px]">
      <div className="bg-white rounded-xl p-4 md:p-8 w-full h-fit min-w-0">
        <h1 className="font-semibold text-xl">Mon compte</h1>
        <p className="text-gray-500 text-sm mb-6">{user?.name}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Nom</Label>
            <Input {...register('firstName')} className="bg-white h-12" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Prénom</Label>
            <Input {...register('lastName')} className="bg-white h-12" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input {...register('email')} className="bg-white h-12" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Mot de passe actuel</Label>
            <div className="relative">
              <Input
                {...register('currentPassword')}
                type={showPassword ? 'text' : 'password'}
                className="bg-white h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Nouveau Mot de passe</Label>
            <div className="relative">
              <Input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                className={`bg-white h-12 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full sm:w-fit h-12 px-8 rounded-[10px] bg-[#1F1F1F] text-white"
          >
            Modifier les informations
          </Button>
          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}
          {succes && (
            <p className="text-green-500 text-sm text-center">{succes}</p>
          )}
        </form>
      </div>
    </div>
  )
}
