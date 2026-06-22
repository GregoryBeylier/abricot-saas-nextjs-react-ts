'use client'
import { useQuery } from '@tanstack/react-query'
import type { UserProfile } from '@/lib/api'
import { fetchProfile } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function Account() {
  const { data } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  const user = data?.data?.user
  const [firstName, ...rest] = user?.name?.split(' ') ?? []
  const lastName = rest.join(' ')

  return (
    <div className="bg-[#F9FAFB] min-h-screen px-4 lg:px-[112px] pt-[40px] pb-[50px]">
      <div className="bg-white rounded-xl p-8 max-w-2xl">
        <h1 className="font-semibold text-xl">Mon compte</h1>
        <p className="text-gray-500 text-sm mb-6">{user?.name}</p>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Nom</Label>
            <Input value={lastName ?? ''} disabled className="bg-white h-12" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Prénom</Label>
            <Input value={firstName ?? ''} disabled className="bg-white h-12" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input
              value={user?.email ?? ''}
              disabled
              className="bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Mot de passe</Label>
            <Input
              value="••••••••••••"
              disabled
              type="password"
              className="bg-white h-12"
            />
          </div>

          <Button
            disabled
            className="w-fit h-12 px-8 rounded-[10px] bg-[#1F1F1F] text-white opacity-50 cursor-not-allowed"
          >
            Modifier les informations
          </Button>
        </div>
      </div>
    </div>
  )
}
