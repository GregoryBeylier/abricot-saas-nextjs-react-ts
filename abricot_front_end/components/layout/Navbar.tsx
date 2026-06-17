'use client'
import { useQuery } from '@tanstack/react-query'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import Cookie from 'js-cookie'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import iconDashboard from '@/public/dashboard.svg'
import iconProjects from '@/public/projets.svg'

export default function Header() {
  // récupere le token du cookie
  const token = Cookie.get('token')

  // uesePathname est un hook qui permet de recuperer le chemin de la page actuelle
  const pathname = usePathname()

  // appel de l'api pour recuperer les informations de l'utilisateur connecté
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      return await response.json()
    },
  })
  console.log(data)
  return (
    <nav className="flex items-center justify-between px-[100px] py-[8px] h-[94px] bg-white w-full">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Abricot" width={147} height={18} />
      </div>

      <div className="flex gap-4">
        <Link
          className={
            pathname === '/dashboard'
              ? 'group flex items-center gap-2 bg-black text-white px-[32px] py-[27px] rounded-[10px] transition-all duration-200'
              : 'group flex items-center gap-2 text-[var(--color-abricot)] px-[32px] py-[27px] rounded-[10px] hover:bg-black hover:text-white transition-all duration-500'
          }
          href="/dashboard"
        >
          <Image
            src={iconDashboard}
            alt=""
            width={24}
            height={24}
            className={
              pathname === '/dashboard'
                ? 'brightness-0 invert'
                : 'group-hover:brightness-0 group-hover:invert'
            }
          />
          Tableau de bord
        </Link>
        <Link
          className={
            pathname === '/projects'
              ? 'group flex items-center gap-2 bg-black text-white px-[32px] py-[27px] rounded-[10px] transition-all duration-200'
              : 'group flex items-center gap-2 text-[var(--color-abricot)] px-[32px] py-[27px] rounded-[10px] hover:bg-black hover:text-white transition-all duration-500'
          }
          href="/projects"
        >
          <Image
            src={iconProjects}
            alt=""
            width={24}
            height={24}
            className={
              pathname === '/projects'
                ? 'brightness-0 invert'
                : 'group-hover:brightness-0 group-hover:invert'
            }
          />
          Projets
        </Link>
      </div>

      {/* profil  */}
      <div className="w-[65px] h-[65px] rounded-full bg-[#FFE8D9] flex items-center justify-center uppercase">
        {data?.data?.user?.name
          ? data.data.user.name.slice(0, 2)
          : data?.data?.user?.email?.slice(0, 2)}
      </div>
    </nav>
  )
}
