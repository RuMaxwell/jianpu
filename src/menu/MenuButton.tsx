import { forwardRef, MouseEvent, useState } from 'react'
import MenuIcon from '../assets/icons/menu.svg'
import CloseIcon from '../assets/icons/close.svg'
import ChevronUpIcon from '../assets/icons/chevron-up.svg'
import ChevronDownIcon from '../assets/icons/chevron-down.svg'
import './MenuButton.css'
import { useMemoizedFn } from 'ahooks'

const MenuButton = forwardRef<
  HTMLDivElement,
  {
    isActive?: boolean
    onClick?: (active: boolean) => void
    onAddTitle?: () => void
    onAddComposer?: () => void
  }
>(({ isActive, onClick, onAddTitle, onAddComposer }, ref) => {
  const [autoHide, setAutoHide] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const handleMenuClick = useMemoizedFn((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onClick?.(!isActive)
  })

  const handleAutoHideClick = useMemoizedFn(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setAutoHide(!autoHide)
      if (!autoHide) {
        // Hides menu button immediately if switched to auto-hide.
        setIsHidden(true)
      }
    },
  )

  const handleMouseEnter = useMemoizedFn(() => {
    if (autoHide) {
      setIsHidden(false)
    }
  })

  const handleMouseLeave = useMemoizedFn(() => {
    if (autoHide) {
      setIsHidden(true)
    }
  })

  return (
    <div
      className={
        'menu-button-container-trigger ' + (autoHide ? 'auto-hide ' : '')
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={ref}
        className={
          'menu-button-container ' +
          (autoHide ? 'auto-hide ' : '') +
          (isHidden ? 'slide-hidden ' : '')
        }
      >
        <button className='menu-button' onClick={handleAutoHideClick}>
          <img
            className='icon'
            src={autoHide ? ChevronDownIcon : ChevronUpIcon}
          ></img>
        </button>
        <button className='menu-button' onClick={handleMenuClick}>
          <img className='icon' src={isActive ? CloseIcon : MenuIcon}></img>
        </button>
        <button className='menu-text-button' onClick={onAddTitle}>
          +Title
        </button>
        <button className='menu-text-button' onClick={onAddComposer}>
          +Composer
        </button>
      </div>
    </div>
  )
})

export default MenuButton
