import './MusicTitle.css'

export default function MusicTitle(props: { children?: React.ReactNode }) {
  return <h1 className='music-title'>{props.children}</h1>
}
