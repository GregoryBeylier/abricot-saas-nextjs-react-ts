'use client'
import Cookie from 'js-cookie'
import picture from '@/public/SingInLogo.jpg'
import AuthLayout from '@/components/auth/auth-layout'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { fetchLogin } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  email: z.string().min(1, 'Email requis').email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type Input = z.infer<typeof schema>

// Composant de la page de connexion
export default function SignIn() {
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

  const [showPassword, setShowPassword] = useState(false)

  // useRouter permet de naviguer entre les pages
  const router = useRouter()
  // Cookie permet de stocker le token dans le navigateur
  const Cookies = Cookie.withAttributes({ path: '/' })

  const [erreur, setErreur] = useState('')
  // useMutation gère l'envoi du formulaire de connexion et les états de la mutation
  const { mutate, isPending, isError } = useMutation({
    mutationFn: fetchLogin,
    // onSuccess est appelé lorsque la connexion réussit et permet de stocker le token
    onSuccess: (data) => {
      // si la réponse de l'API est un échec, affiche un message d'erreur
      if (data.success === false) {
        setErreur(data.message)
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
        <h1 className="text-3xl font-bold text-[var(--color-abricot-text)] text-center mt-8 md:mt-12 ">
          Connexion
        </h1>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register('email')}
            type="email"
            className={`bg-white h-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email?.message}</p>
          )}
        </div>

        <div className="max-w-xs mx-auto w-full flex flex-col gap-3">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`bg-white h-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password?.message}</p>
          )}
        </div>

        <Button className="w-3/4 mx-auto h-14 rounded-lg" type="submit">
          Se connecter
        </Button>
        {/* Affiche le message d'erreur retourné par l'API */}
        {erreur && (
          <p className="text-red-600 text-sm w-full text-center">{erreur}</p>
        )}

        <a
          href="#"
          className="text-[var(--color-abricot-text)] text-sm underline text-center "
        >
          Mot de passe oublié?
        </a>
      </form>

      <span className="text-sm text-center px-4">
        Pas encore de compte ?{' '}
        <a href="/register" className="text-[var(--color-abricot-text)] underline">
          Créer un compte
        </a>
      </span>
    </AuthLayout>
  )
}
