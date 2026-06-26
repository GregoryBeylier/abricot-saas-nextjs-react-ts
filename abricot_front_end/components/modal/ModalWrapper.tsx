'use client'
import { useModal } from '@/components/providers/ModalProvider'
import { useEffect, useRef } from 'react'

// Sélecteur des éléments focusables, utilisé pour le piège de focus
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const LABELLEDBY_ID = 'modal-title'

export default function ModalWrapper() {
  const { openModal, contentModal, setOpenModal } = useModal()
  const dialogRef = useRef<HTMLDivElement>(null)
  // Mémorise l'élément qui avait le focus avant l'ouverture pour le restaurer
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Gestion du focus : mémorisation, focus initial, restitution à la fermeture
  useEffect(() => {
    if (!openModal) return

    previousFocusRef.current = document.activeElement as HTMLElement
    const trigger = previousFocusRef.current

    const dialog = dialogRef.current
    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusable?.[0]?.focus()

    return () => {
      // Restaure le focus sur l'élément déclencheur à la fermeture
      trigger?.focus?.()
    }
  }, [openModal])

  // Fermeture avec Échap + piège de focus (Tab reste dans la modale)
  useEffect(() => {
    if (!openModal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenModal(false)
        return
      }
      if (e.key !== 'Tab') return

      const dialog = dialogRef.current
      const items = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (!items || items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        if (active === first || !dialog?.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openModal, setOpenModal])

  // Associe le titre de la modale au dialog pour aria-labelledby
  useEffect(() => {
    if (!openModal) return
    const heading = dialogRef.current?.querySelector('h1, h2')
    if (heading && !heading.id) heading.id = LABELLEDBY_ID
  }, [openModal, contentModal])

  if (!openModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={LABELLEDBY_ID}
        className="relative bg-white rounded-[10px] w-full max-w-[598px] max-h-[90vh] overflow-hidden mx-4 md:mx-0"
      >
        <button
          onClick={() => setOpenModal(false)}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <div className="max-h-[90vh] overflow-y-auto p-6 md:pt-[79px] md:pb-[79px] md:pl-[73px] md:pr-[73px]">
          {contentModal}
        </div>
      </div>
    </div>
  )
}
