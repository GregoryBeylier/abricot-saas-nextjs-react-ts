import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/footer'
import Modal from '@/components/modal/ModalWrapper'
import { ModalProvider } from '@/components/providers/ModalProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <Modal />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ModalProvider>
  )
}
