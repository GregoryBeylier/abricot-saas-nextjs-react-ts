import picture from '@/public/LogoFooter.svg'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className="flex justify-between h-[68px] px-[32px] items-center">
      <Image src={picture} alt="" width={101} height={12} />
      <div>Abricot 2026</div>
    </div>
  )
}
