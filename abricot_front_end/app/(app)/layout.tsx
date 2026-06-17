import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/footer'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
