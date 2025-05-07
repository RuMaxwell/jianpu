import type { IKeySignature } from './types'
import { MusicText } from '../MusicText'

export default function KeySignature(props: { value: IKeySignature }) {
  return (
    <div>
      <MusicText>1 = </MusicText>
      {props.value.accidental && (
        <MusicText>
          <sup>{props.value.accidental}</sup>
        </MusicText>
      )}
      <MusicText>{props.value.note}</MusicText>
    </div>
  )
}
