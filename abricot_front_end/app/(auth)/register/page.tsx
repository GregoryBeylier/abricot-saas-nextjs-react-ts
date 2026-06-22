'use client'
import * as z from 'zod'
import picture from '@/public/ResgisterLogo.jpg'
import AuthLayout from '@/components/auth/auth-layout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Cookie from 'js-cookie'
import { useState } from 'react'
import { fetchRegister } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  email: z.email('Adresse email incorecte'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule')
    .regex(/[a-z]/, 'Au moins une lettre minuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[@$!%*?&]/, 'Au moins un caractère spécial'),
})

type Input = z.infer<typeof schema>

// Composant de la page d'inscription
export default function Register() {
  // useForm gère la validation, les valeurs des champs et les erreurs du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(schema),
    // Valide le champ lors du blur
    mode: 'onTouched',
  })

  // UseState pour masquer le MDP
  const [showPassword, setShowPassword] = useState(false)

  // useRouter permet de naviguer entre les pages
  const router = useRouter()
  // Cookie permet de stocker le token dans le navigateur
  const Cookies = Cookie.withAttributes({ path: '/' })

  const [erreur, setErreur] = useState('')

  // useMutation gère l'envoi du formulaire d'inscription et les états de la mutation
  const { mutate, isPending, isError } = useMutation({
    mutationFn: fetchRegister,
    // onSuccess est appelé lorsque l'inscription réussit et permet de stocker le token
    onSuccess: (data) => {
      // si la réponse de l'API est un échec, affiche un message d'erreur
      if (data.success === false) {
        setErreur(data.data.errors[0].message)
      } else {
        Cookies.set('token', data.data.token)
        router.push('/dashboard')
      }
    },
    // onError est appelé lorsque la mutation échoue
    onError: () => setErreur('Une erreur est survenue, veuillez réessayer'),
  })

  // onSubmit envoie les données du formulaire à l'API
  const onSubmit = (data: Input) => {
    mutate(data)
  }

  return (
    <AuthLayout image={picture}>
      <form
        className="w-full max-w-sm flex flex-col gap-6 mb-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold text-[var(--color-abricot)] text-center mt-8 md:mt-12 ">
          Inscription
        </h1>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label>Email</Label>
          <Input
            {...register('email')}
            type="email"
            className={`bg-white h-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          )}
        </div>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label>Mot de passe</Label>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`bg-white h-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          )}
        </div>

        <Button
          className="w-3/4 mx-auto h-14 rounded-lg"
          type="submit"
          onClick={() => console.log('errors:', errors)}
        >
          S’inscrire
        </Button>
        {/* Affiche le message d'erreur retourné par l'API */}
        {erreur && (
          <p className="text-red-500 text-sm w-full text-center">{erreur}</p>
        )}
      </form>

      <span className="whitespace-nowrap">
        Déjà inscrit ?{' '}
        <a href="/login" className="text-[var(--color-abricot)] underline">
          Se connecter
        </a>
      </span>
    </AuthLayout>
  )
}
