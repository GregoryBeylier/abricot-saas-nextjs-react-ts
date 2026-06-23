'use client'
import { useModal } from '@/components/providers/ModalProvider'

export default function ModalWrapper() {
  const { openModal, contentModal, setOpenModal } = useModal()
  if (!openModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px] p-6 md:pt-[79px] md:pb-[79px] md:pl-[73px] md:pr-[73px] w-full max-w-[598px] max-h-[90vh] overflow-y-auto relative mx-4 md:mx-0">
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        {contentModal}
      </div>
    </div>
  )
}
