import { forwardRef, MouseEvent, useState } from 'react'
import MenuIcon from '../assets/icons/menu.svg'
import CloseIcon from '../assets/icons/close.svg'
import ChevronUpIcon from '../assets/icons/chevron-up.svg'
import ChevronDownIcon from '../assets/icons/chevron-down.svg'
import './MenuButton.css'
import { useMemoizedFn } from 'ahooks'
import { Button } from '../button/Button'

interface IProps {
  isActive?: boolean
  onClick?: (active: boolean) => void
  onAddTitle?: () => void
  onAddKeySignature?: () => void
  onAddTimeSignature?: () => void
  onAddComposer?: () => void
  onPitchShiftHigher?: () => void
  onPitchShiftLower?: () => void
}

const MenuButton = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const {
    isActive,
    onClick,
    onAddTitle,
    onAddKeySignature,
    onAddTimeSignature,
    onAddComposer,
    onPitchShiftHigher,
    onPitchShiftLower,
  } = props

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
        <Button
          icon={autoHide ? ChevronDownIcon : ChevronUpIcon}
          onClick={handleAutoHideClick}
        />
        <Button
          icon={isActive ? CloseIcon : MenuIcon}
          onClick={handleMenuClick}
        />
        <Button text='+Title' onClick={onAddTitle} />
        <Button text='+Key' onClick={onAddKeySignature} />
        <Button text='+Tempo' onClick={onAddTimeSignature} />
        <Button text='+Composer' onClick={onAddComposer} />
        <Button text='+Pitch' onClick={onPitchShiftHigher} />
        <Button text='-Pitch' onClick={onPitchShiftLower} />
      </div>
    </div>
  )
})

export default MenuButton
