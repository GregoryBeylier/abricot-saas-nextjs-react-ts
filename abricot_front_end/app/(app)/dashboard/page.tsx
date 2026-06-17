'use client'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { fetchProfile } from '@/lib/api'
import VueListe from '@/components/dashboard/VueListe'
import VueKanban from '@/components/dashboard/VueKanban'

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
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="flex justify-between">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bonjour {name}, voici un aperçu de vos projets et tâche</p>
        </div>
        <Button>+ créer un projet </Button>
      </div>
      <div>
        <button onClick={() => setVue('liste')}>Liste</button>
        <button onClick={() => setVue('kanban')}>Kanban</button>
        {vue === 'liste' ? <VueListe /> : <VueKanban />}
      </div>
    </div>
  )
}
