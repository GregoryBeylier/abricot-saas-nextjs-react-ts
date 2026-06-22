import picture from '@/public/LogoFooter.svg'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 w-full px-4 sm:px-8 py-4">
      <Image
        src={picture}
        alt=""
        width={101}
        height={12}
        className="w-[80px] sm:w-[101px] h-auto"
      />
      <p className="text-sm text-gray-600">Abricot 2026</p>
    </div>
  )
}
