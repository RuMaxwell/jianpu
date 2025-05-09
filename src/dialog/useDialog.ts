import { useState } from 'react'

export function useDialog({
  openImmediately,
}: { openImmediately?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(!!openImmediately)
  const [message, setMessage] = useState('')

  const open = (message?: string) => {
    setIsOpen(true)
    setMessage(message || '')
  }

  const close = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    message,
    setMessage,
  }
}
