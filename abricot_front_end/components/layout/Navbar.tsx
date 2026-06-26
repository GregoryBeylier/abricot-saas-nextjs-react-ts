'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import iconDashboard from '@/public/dashboard.svg'
import iconProjects from '@/public/projets.svg'
import { fetchProfile } from '@/lib/api'
import { useState } from 'react'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { getInitiales } from '@/lib/utils'

export default function Header() {
  // usePathname récupère le chemin de la page actuelle
  const pathname = usePathname()

  const router = useRouter()
  const queryClient = useQueryClient()

  // Récupère le profil utilisateur depuis l'API (nom/email pour l'avatar)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  // État local pour ouvrir/fermer le menu utilisateur
  const [open, setOpen] = useState(false)

  // Structure principale de la navbar — responsive via classes Tailwind
  return (
    <nav className="relative flex items-center justify-between px-4 lg:px-[100px] py-[8px] h-[94px] bg-white w-full">
      <div className="flex items-center gap-4">
        {/* Logo — s'adapte (mobile -> desktop) via les classes responsive */}
        <Link href="/dashboard">
          <Image
            src={logo}
            alt="Abricot"
            width={147}
            height={18}
            className="w-[90px] sm:w-[147px]"
          />
        </Link>
      </div>

      <div className="flex gap-4">
        {/* Liens de navigation — style actif différent selon la route */}
        <Link
          className={
            pathname.startsWith('/dashboard')
              ? 'group flex items-center gap-2 bg-black text-white px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] transition-all duration-200'
              : 'group flex items-center gap-2 text-[var(--color-abricot-text)] px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] hover:bg-black hover:text-white transition-all duration-500'
          }
          href="/dashboard"
        >
          <Image
            src={iconDashboard}
            alt=""
            width={24}
            height={24}
            className={`w-4 h-4 min-[321px]:w-5 min-[321px]:h-5 lg:w-6 lg:h-6 ${
              pathname.startsWith('/dashboard')
                ? 'brightness-0 invert'
                : 'group-hover:brightness-0 group-hover:invert'
            }`}
          />
          {/* Le label est masqué sur très petits écrans pour gagner de l'espace */}
          <span className="hidden sm:inline">Tableau de bord</span>
        </Link>
        <Link
          className={
            pathname.startsWith('/projects')
              ? 'group flex items-center gap-2 bg-black text-white px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] transition-all duration-200'
              : 'group flex items-center gap-2 text-[var(--color-abricot-text)] px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] hover:bg-black hover:text-white transition-all duration-500'
          }
          href="/projects"
        >
          <Image
            src={iconProjects}
            alt=""
            width={24}
            height={24}
            className={`w-4 h-4 min-[321px]:w-5 min-[321px]:h-5 lg:w-6 lg:h-6 ${
              pathname.startsWith('/projects')
                ? 'brightness-0 invert'
                : 'group-hover:brightness-0 group-hover:invert'
            }`}
          />
          <span className="hidden sm:inline">Projets</span>
        </Link>
      </div>

      <div className="relative">
        {/* Avatar / bouton utilisateur — affiche initiales et ouvre le menu */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Menu utilisateur"
          aria-expanded={open}
          aria-haspopup="menu"
          className={`w-[40px] h-[40px] sm:w-[65px] sm:h-[65px] rounded-full flex items-center justify-center uppercase cursor-pointer transition-all ${
            open || pathname.startsWith('/account')
              ? 'bg-[var(--color-abricot-text)] text-white'
              : 'bg-[#FFE8D9]'
          }`}
        >
          {data?.data?.user?.name
            ? getInitiales(data.data.user.name)
            : data?.data?.user?.email?.slice(0, 2).toUpperCase()}
        </button>

        {open && (
          /* Menu déroulant — contient lien vers le compte et déconnexion */
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border p-2 flex flex-col gap-1 min-w-[180px]">
            <Link
              href="/account"
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
            >
              Mes informations
            </Link>

            <button
              onClick={() => {
                // Suppression du token et redirection vers la page de login
                Cookie.remove('token')
                queryClient.clear()
                router.push('/login')
              }}
              className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg text-left"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
