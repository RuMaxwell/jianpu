import { MusicText } from '../MusicText'
import { type ITimeSignature } from './musicMeta'

export default function TimeSignature(props: { value: ITimeSignature }) {
  return (
    <div>
      <MusicText>{props.value.numerator}</MusicText>
      <MusicText>/</MusicText>
      <MusicText>{props.value.denominator}</MusicText>
    </div>
  )
}
