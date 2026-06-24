'use client'
import { createContext, useContext, useState } from 'react'
import type { Dispatch, JSX, ReactNode, SetStateAction } from 'react'

interface ModalContentType {
  openModal: boolean
  contentModal: JSX.Element
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setContentModal: Dispatch<SetStateAction<JSX.Element>>
}

const ContextModal = createContext<ModalContentType | null>(null)

export function useModal() {
  const context = useContext(ContextModal)
  if (!context) throw new Error('useModal must be used within a ModalProvider')
  return context
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [contentModal, setContentModal] = useState(<></>)

  return (
    <ContextModal.Provider
      value={{
        openModal,
        setOpenModal,
        contentModal,
        setContentModal,
      }}
    >
      {children}
    </ContextModal.Provider>
  )
}
