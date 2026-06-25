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
}).refine(
  (data) => {
    const hasFirst = !!data.firstName?.trim()
    const hasLast = !!data.lastName?.trim()
    return hasFirst === hasLast
  },
  {
    message: 'Remplissez les deux champs ou laissez-les vides',
    path: ['lastName'],
  }
)

type Input = z.infer<typeof schema>

export default function Account() {
  const { data } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  useEffect(() => {
    if (!erreur) return
    const timer = setTimeout(() => setErreur(''), 4000)
    return () => clearTimeout(timer)
  }, [erreur])

  useEffect(() => {
    if (!succes) return
    const timer = setTimeout(() => setSucces(''), 4000)
    return () => clearTimeout(timer)
  }, [succes])
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const queryClient = useQueryClient()

  const user = data?.data?.user

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    getValues,
  } = useForm<Input>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  // useMutation gère l'envoi de la modification des informations de l'utilisateur
  const { mutate: mutateProfile } = useMutation({
    mutationFn: fetchUpdateProfile,
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur(data.message)
      } else {
        setSucces('Profil mis à jour avec succès')
        queryClient.invalidateQueries({ queryKey: ['user'] })
        reset(getValues(), { keepDefaultValues: false })
      }
    },
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  // useMutation gère l'envoi de la modification du mot de passe
  const { mutate: mutatePassword } = useMutation({
    mutationFn: fetchUpdatePassword,
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur(data.message)
      } else {
        setSucces('Mot de passe mis à jour avec succès')
        reset({ ...getValues(), currentPassword: '', newPassword: '' })
      }
    },
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  const onSubmit = (data: Input) => {
    mutateProfile({
      name: [data.firstName, data.lastName].filter(Boolean).join(' '),
      email: data.email,
    })
    if (data.currentPassword && data.newPassword) {
      mutatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
    }
  }

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name?.split(' ') ?? []
      const lastName = rest.join(' ')
      reset({
        firstName,
        lastName,
        email: user.email ?? '',
      })
    }
  }, [user, reset])

  return (
    <div className="min-h-screen px-3 sm:px-4 lg:px-[112px] pt-[70px] pb-[20px]">
      <div className="bg-white rounded-xl p-4 md:p-8 w-full h-fit min-w-0">
        <h1 className="font-semibold text-xl">Mon compte</h1>
        <p className="text-gray-500 text-sm mb-6">{user?.name}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Prénom</Label>
            <Input {...register('firstName')} className={`bg-white h-12 ${errors.firstName ? 'border-red-500' : ''}`} />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Nom</Label>
            <Input {...register('lastName')} className={`bg-white h-12 ${errors.lastName ? 'border-red-500' : ''}`} />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
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
                type={showCurrentPassword ? 'text' : 'password'}
                className="bg-white h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Nouveau Mot de passe</Label>
            <div className="relative">
              <Input
                {...register('newPassword')}
                type={showNewPassword ? 'text' : 'password'}
                className={`bg-white h-12 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
            disabled={!isDirty}
            className={`w-full sm:w-fit h-12 px-8 rounded-[10px] transition-colors ${
              isDirty ? 'bg-[#1F1F1F] text-white' : 'bg-gray-200 text-gray-500'
            }`}
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
