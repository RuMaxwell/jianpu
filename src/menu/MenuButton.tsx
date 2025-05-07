import { forwardRef, MouseEvent, useState } from 'react'
import MenuIcon from '../assets/icons/menu.svg'
import CloseIcon from '../assets/icons/close.svg'
import ChevronLeftIcon from '../assets/icons/chevron-left.svg'
import ChevronRightIcon from '../assets/icons/chevron-right.svg'
import './MenuButton.css'

const MenuButton = forwardRef<
  HTMLDivElement,
  {
    isActive?: boolean
    onClick?: (active: boolean) => void
  }
>(({ isActive, onClick }, ref) => {
  const [autoHide, setAutoHide] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  function handleMenuClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    onClick?.(!isActive)
  }

  function handleAutoHideClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setAutoHide(!autoHide)
    if (!autoHide) {
      // Hides menu button immediately if switched to auto-hide.
      setIsHidden(true)
    }
  }

  function handleMouseEnter() {
    if (autoHide) {
      setIsHidden(false)
    }
  }

  function handleMouseLeave() {
    if (autoHide) {
      setIsHidden(true)
    }
  }

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
            src={autoHide ? ChevronRightIcon : ChevronLeftIcon}
          ></img>
        </button>
        <button className='menu-button' onClick={handleMenuClick}>
          <img className='icon' src={isActive ? CloseIcon : MenuIcon}></img>
        </button>
      </div>
    </div>
  )
})

export default MenuButton
