'use client'
import Cookie from 'js-cookie'
import picture from '../../../public/SingInLogo.jpg'
import AuthLayout from '../../../components/auth/auth-layout'
import * as z from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

type Input = z.infer<typeof schema>

// cette fonction est un composant React qui représente la page de connexion (SignIn) d'une application. Elle utilise Tailwind CSS pour le style et Next.js pour la gestion des images. Le composant est structuré en deux parties principales : une section de formulaire de connexion et une section d'image.
export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(schema),
  })

  // useRouter est un hook permattant de naviguer entre les pages
  const router = useRouter()
  // Cookie est une librairie qui permet de gerer les cookies dans le navigateur
  const Cookies = Cookie.withAttributes({ path: '/' })

  // La function useMutation permet de gerer les données de connexion permet d'envoyer les requettes de connexion a l'api
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: Input) => {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return await res.json()
    },
    // onSucess est une fonction est appeler lorque la connexion est reussie et permet de sotcker le toekn
    onSuccess: (data) => {
      console.log('succès:', data)
      Cookies.set('token', data.data.token)
      router.push('/dashboard')
    },
    // onError est une fonction lorque la connexion echoue
    onError: (error) => {
      console.log('erreur:', error)
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
          Connexion
        </h1>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label>Email</Label>
          <Input
            {...register('email')}
            type="email"
            className="bg-white h-12"
          />
        </div>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label>Mot de passe</Label>
          <Input
            {...register('password')}
            type="password"
            className="bg-white h-12"
          />
        </div>

        <Button
          className="w-3/4 mx-auto h-14 rounded-lg"
          type="submit"
          onClick={() => console.log('errors:', errors)}
        >
          Se connecter
        </Button>

        <a
          href="#"
          className="text-[var(--color-abricot)] text-sm underline text-center "
        >
          Mot de passe oublié?
        </a>
      </form>

      <span className="whitespace-nowrap">
        Pas encore de compte ?{' '}
        <a href="/register" className="text-[var(--color-abricot)] underline">
          Créer un compte
        </a>
      </span>
    </AuthLayout>
  )
}
