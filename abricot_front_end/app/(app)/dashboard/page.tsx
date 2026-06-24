'use client'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { fetchProfile } from '@/lib/api'
import type { UserProfile } from '@/lib/api'
import VueListe from '@/components/dashboard/VueListe'
import VueKanban from '@/components/dashboard/VueKanban'
import iconListe from '@/public/liste.svg'
import iconKanban from '@/public/kanban.svg'
import Image from 'next/image'
import ModalCreateProject from '@/components/modal/ModalCreateProject'
import { useModal } from '@/components/providers/ModalProvider'
import { email } from 'zod'

export default function DashboardPage() {
  // Récupère le profil utilisateur via TanStack Query
  const { data } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  // Nom de l'utilisateur connecté
  const name = data?.data?.user?.name
  const email = data?.data?.user?.email

  const [vue, setVue] = useState('liste')

  const { setContentModal, setOpenModal } = useModal()

  return (
    <div className="px-4 lg:px-[112px] pt-[40px] pb-[50px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="mt-[40px] lg:mt-[89px]">
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
          <p>
            Bonjour {name ?? email}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <Button
          className="h-[50px] px-[30px] rounded-[10px] text-base font-normal sm:mt-[89px]"
          onClick={() => {
            setContentModal(<ModalCreateProject />)
            setOpenModal(true)
          }}
        >
          + Créer un projet
        </Button>
      </div>
      <div className="flex gap-4 mb-6 mt-[30px] lg:mt-[60px]">
        <button
          onClick={() => setVue('liste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-abricot)] hover:bg-[#FFE8D9] transition-colors duration-500 ${
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
      {vue === 'liste' ? (
        <VueListe />
      ) : (
        <div className="overflow-x-auto">
          <VueKanban />
        </div>
      )}
    </div>
  )
}
