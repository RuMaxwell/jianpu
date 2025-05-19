import { useSize } from 'ahooks'
import { px } from '../utils/units'
import MusicTitle from '../music/MusicTitle'
import MusicMeta from '../music/meta/MusicMeta'
import { IKeySignature, ITimeSignature } from '../music/meta/types'
import type { INote, IStaff } from '../music/staff/staff'
import JianpuStaff from '../music/staff/JianpuStaff'

export default function Stage(props: {
  titleHtml?: string
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composerHtml?: string
  newStaff?: IStaff
  onTitleChange?: (value: string) => void
  onKeySignatureChange?: (value?: IKeySignature) => void
  onTimeSignatureChange?: (value?: ITimeSignature) => void
  onComposerChange?: (value: string) => void
  onNotesChange?: (value: INote[]) => void
}) {
  const {
    titleHtml,
    keySignature,
    timeSignature,
    composerHtml,
    newStaff,
    onTitleChange,
    onKeySignatureChange,
    onTimeSignatureChange,
    onComposerChange,
    onNotesChange,
  } = props

  const windowSize = useSize(document.body)
  const width = windowSize?.width || 0

  return (
    <div style={{ width: px(width) }}>
      <MusicTitle titleHtml={titleHtml} onChange={onTitleChange} />
      <MusicMeta
        keySignature={keySignature}
        timeSignature={timeSignature}
        composerHtml={composerHtml}
        onKeySignatureChange={onKeySignatureChange}
        onTimeSignatureChange={onTimeSignatureChange}
        onComposerChange={onComposerChange}
      />
      <JianpuStaff newStaff={newStaff} onNotesChange={onNotesChange} />
    </div>
  )
}
