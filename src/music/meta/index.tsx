import type { IKeySignature, ITimeSignature } from './musicMeta'
import KeySignature from './KeySignature'
import TimeSignature from './TimeSignature'
import './MusicMeta.css'

export function MusicMeta(props: {
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composer?: string
}) {
  return (
    <div className='music-meta'>
      <div>
        {props.keySignature && (
          <KeySignature value={props.keySignature}></KeySignature>
        )}
        {props.timeSignature && (
          <TimeSignature value={props.timeSignature}></TimeSignature>
        )}
      </div>
      <div>{props.composer && <div>{props.composer}</div>}</div>
    </div>
  )
}
