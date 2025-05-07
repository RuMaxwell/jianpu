import type { ITimeSignature } from './types'
import { MusicText } from '../MusicText'

export default function TimeSignature(props: { value: ITimeSignature }) {
  return (
    <div>
      <MusicText>{props.value.numerator}</MusicText>
      <MusicText>/</MusicText>
      <MusicText>{props.value.denominator}</MusicText>
    </div>
  )
}
