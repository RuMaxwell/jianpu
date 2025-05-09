import { MouseEvent, useRef, type ReactNode } from 'react'
import CheckIcon from '../assets/icons/check.svg'
import CloseIcon from '../assets/icons/close.svg'
import { Button } from '../button/Button'
import { useMemoizedFn } from 'ahooks'
import './Dialog.css'

const Dialog = ({
  isOpen,
  message,
  onClose,
  onConfirm,
}: {
  isOpen?: boolean
  message?: ReactNode
  onClose?: () => void
  onConfirm?: () => void
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleModalClick = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose?.()
    }
  })

  return (
    <div
      ref={modalRef}
      className={'dialog-modal ' + (isOpen ? '' : 'modal-off')}
      onClickCapture={handleModalClick}
    >
      <dialog ref={dialogRef} className='dialog' open={isOpen}>
        <div className='dialog-header'>
          <Button icon={CloseIcon} onClick={onClose} />
          <Button text='Ok' icon={CheckIcon} onClick={onConfirm} />
        </div>
        <div className='dialog-body'>{message}</div>
        <div className='dialog-footer'></div>
      </dialog>
    </div>
  )
}

export default Dialog
