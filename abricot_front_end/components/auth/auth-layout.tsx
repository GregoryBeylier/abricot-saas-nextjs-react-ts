import logo from '@/public/logo.svg'
import Image from 'next/image'
import { StaticImageData } from 'next/image'

export default function AuthLayout({
  image,
  children,
}: {
  image: StaticImageData
  children: React.ReactNode
}) {
  return (
    //    div global
    <div className="flex h-screen ">
      {/* section formulaire de connexion */}
      <div className="w-full min-w-0 md:w-2/5 md:min-w-[300px] bg-gray-50 flex flex-col items-center justify-between px-4 py-8 md:p-10">
        <Image
          src={logo}
          alt="logo"
          width={200}
          height={50}
          className="w-[200px] h-auto mt-6 md:mt-10 mb-8"
        />
        {children}
      </div>

      {/* section image de connexion */}
      <div className="w-3/5 relative hidden md:block">
        <Image src={image} alt="illustration" fill className="object-cover" />
      </div>
    </div>
  )
}
