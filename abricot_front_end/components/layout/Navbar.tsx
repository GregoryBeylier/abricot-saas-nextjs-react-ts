'use client'
import { useQuery } from '@tanstack/react-query'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import iconDashboard from '@/public/dashboard.svg'
import iconProjects from '@/public/projets.svg'
import { fetchProfile } from '@/lib/api'

export default function Header() {
  // usePathname récupère le chemin de la page actuelle
  const pathname = usePathname()

  // Récupère le profil utilisateur depuis l'API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  return (
    <nav className="relative overflow-hidden flex items-center justify-between px-4 lg:px-[100px] py-[8px] h-[94px] bg-white w-full">
      <div className="flex items-center gap-4">
        <Image
          src={logo}
          alt="Abricot"
          width={147}
          height={18}
          className="w-[90px] sm:w-[147px]"
        />
      </div>

      <div className="flex gap-4">
        <Link
          className={
            pathname === '/dashboard'
              ? 'group flex items-center gap-2 bg-black text-white px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] transition-all duration-200'
              : 'group flex items-center gap-2 text-[var(--color-abricot)] px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] hover:bg-black hover:text-white transition-all duration-500'
          }
          href="/dashboard"
        >
          <Image
            src={iconDashboard}
            alt=""
            width={24}
            height={24}
            className={`w-4 h-4 min-[321px]:w-5 min-[321px]:h-5 lg:w-6 lg:h-6 ${
              pathname === '/dashboard'
                ? 'brightness-0 invert'
                : 'group-hover:brightness-0 group-hover:invert'
            }`}
          />
          <span className="hidden sm:inline">Tableau de bord</span>
        </Link>
        <Link
          className={
            pathname === '/projects'
              ? 'group flex items-center gap-2 bg-black text-white px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] transition-all duration-200'
              : 'group flex items-center gap-2 text-[var(--color-abricot)] px-2 py-2 min-[321px]:px-4 min-[321px]:py-3 lg:px-[32px] lg:py-[27px] rounded-[10px] hover:bg-black hover:text-white transition-all duration-500'
          }
          href="/projects"
        >
          <Image
            src={iconProjects}
            alt=""
            width={24}
            height={24}
            className={`w-4 h-4 min-[321px]:w-5 min-[321px]:h-5 lg:w-6 lg:h-6 ${
              pathname === '/projects'
                ? 'brightness-0 invert'
                : 'group-hover:brightness-0 group-hover:invert'
            }`}
          />
          <span className="hidden sm:inline">Projets</span>
        </Link>
      </div>

      <div className="w-[40px] h-[40px] sm:w-[65px] sm:h-[65px] rounded-full bg-[#FFE8D9] flex items-center justify-center uppercase">
        {data?.data?.user?.name
          ? data.data.user.name.slice(0, 2)
          : data?.data?.user?.email?.slice(0, 2)}
      </div>
    </nav>
  )
}
