'use client'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { fetchProfile } from '@/lib/api'
import VueListe from '@/components/dashboard/VueListe'
import VueKanban from '@/components/dashboard/VueKanban'
import iconListe from '@/public/liste.svg'
import iconKanban from '@/public/kanban.svg'
import Image from 'next/image'

// interface pour typer la réponse de l'api
interface UserProfile {
  data: {
    user: {
      id: string
      email: string
      name: string | null
    }
  }
}

export default function DashboardPage() {
  // récupère les données utilisateur depuis le cache TanStack Query (même queryKey que la navbar)
  const { data } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  // recuperer le nom de l'utilisateur connecté
  const name = data?.data?.user?.name

  const [vue, setVue] = useState('liste')
  console.log(vue)
  return (
    <div className="bg-[#F9FAFB] px-[112px] pt-[40px] pb-[50px]">
      <div className="flex justify-between items-center mb-6">
        <div className="mt-[89px]">
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
          <p>Bonjour {name}, voici un aperçu de vos projets et tâches</p>
        </div>
        <Button className="h-[50px] px-[30px] rounded-[10px] text-base font-normal mt-[89px]">
          + Créer un projet
        </Button>
      </div>
      <div className="flex gap-4 mb-6 mt-[60px]">
        <button
          onClick={() => setVue('liste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-abricot)] hover:bg-[#FFE8D9] transition-colors duration-500  ${
            vue === 'liste' ? 'bg-[#FFE8D9]' : 'bg-white'
          }`}
        >
          <Image src={iconListe} alt="" width={20} height={20} />
          Liste
        </button>
        <button
          onClick={() => setVue('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-abricot)] hover:bg-[#FFE8D9] transition-colors duration-500 ${
            vue === 'kanban' ? 'bg-[#FFE8D9]' : 'bg-white'
          }`}
        >
          <Image src={iconKanban} alt="" width={20} height={20} />
          Kanban
        </button>
      </div>
      {vue === 'liste' ? <VueListe /> : <VueKanban />}
    </div>
  )
}
