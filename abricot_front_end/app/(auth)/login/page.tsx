'use client'
import picture from '../../../public/SingInLogo.jpg'
import logo from '../../../public/logo.svg'
import Image from 'next/image'
import * as z from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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

  const onSubmit = (data: Input) => {
    console.log(data)
  }

  return (
    //    div global
    <div className="flex h-screen ">
      {/* section formulaire de connexion */}
      <div className="w-full md:w-2/5 bg-gray-50 flex flex-col items-center justify-between p-10">
        <Image
          src={logo}
          alt="logo"
          width={200}
          height={50}
          className="w-[200px] h-auto mt-6 md:mt-10 mb-8"
        />
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
      </div>

      {/* section image de connexion */}

      <div className="w-3/5 relative">
        <Image
          src={picture}
          alt="photo"
          fill
          className="object-cover hidden md:block"
        />
      </div>
    </div>
  )
}
