import { MouseEvent } from 'react'
import './Button.css'

export const Button = ({
  icon,
  text,
  onClick,
}: {
  icon?: string
  text?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}) => {
  return (
    <button
      className={
        'button ' + (icon ? 'icon-button ' : '') + (text ? 'text-button ' : '')
      }
      onClick={onClick}
    >
      {icon && <img className='icon' src={icon}></img>}
      {text || ''}
    </button>
  )
}
