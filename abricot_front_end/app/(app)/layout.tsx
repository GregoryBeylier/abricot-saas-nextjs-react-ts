import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/footer'
import Modal from '@/components/modal/ModalWrapper'
import { ModalProvider } from '@/components/providers/ModalProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col">
        <Modal />
        <Header />
        <main className="flex-1 bg-[#F9FAFB]">{children}</main>
        <Footer />
      </div>
    </ModalProvider>
  )
}
