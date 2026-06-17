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

// cette fonction represente la  page d'inscription
export default function Register() {
  // useForm permet de gérer la validation, les valeurs des champs et les erreurs du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(schema),
    // mode: onTuched permet de valider les champs du formulaire lorsque l'utilisateur quitte le champ (blur)
    mode: 'onTouched',
  })

  // useRouter est un hook permattant de naviguer entre les pages
  const router = useRouter()
  // Cookie est une librairie qui permet de gerer les cookies dans le navigateur
  const Cookies = Cookie.withAttributes({ path: '/' })

  const [erreur, setErreur] = useState('')

  // La function useMutation permet de gerer les données de connexion permet d'envoyer les requettes de connexion a l'api
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: Input) => {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return await res.json()
    },
    // onSucess est une fonction est appeler lorque la connexion est reussie et permet de sotcker le toekn
    onSuccess: (data) => {
      // si la reponse de l'api est un echec on affiche le message d'erreur
      if (data.success === false) {
        setErreur(data.data.errors[0].message)
      } else {
        console.log('succès:', data)
        Cookies.set('token', data.data.token)
        router.push('/dashboard')
      }
    },
    // onError est une fonction lorque la connexion echoue
    onError: () => {
      setErreur('Une erreur est survenue, veuillez réessayer')
    },
  })

  // OnSumit permet d'envoyer les donnés saisies dans le formulaire de connexion a l'api
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
            className="bg-white h-12"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          )}
        </div>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label>Mot de passe</Label>
          <Input
            {...register('password')}
            type="password"
            className="bg-white h-12"
          />
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
