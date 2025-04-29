import './MusicText.css'

export function MusicText({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={'music-text ' + className} style={style}>
      {children}
    </span>
  )
}
