import { useSize } from 'ahooks'
import { px } from '../utils/units'
import MusicTitle from '../music/MusicTitle'
import MusicMeta from '../music/meta/MusicMeta'
import { IKeySignature, ITimeSignature } from '../music/meta/types'
import { IStaff } from '../music/staff/staff'
import JianpuStaff from '../music/staff/JianpuStaff'

export default function Stage(props: {
  titleHtml?: string
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composerHtml?: string
  staff?: IStaff
  onTitleChange?: (value: string) => void
  onComposerChange?: (value: string) => void
}) {
  const {
    titleHtml,
    keySignature,
    timeSignature,
    composerHtml,
    staff,
    onTitleChange,
    onComposerChange,
  } = props

  const windowSize = useSize(document.body)
  const width = windowSize?.width || 0

  return (
    <div style={{ width: px(width) }}>
      <MusicTitle titleHtml={titleHtml} onChange={onTitleChange}></MusicTitle>
      <MusicMeta
        keySignature={keySignature}
        timeSignature={timeSignature}
        composerHtml={composerHtml}
        onComposerChange={onComposerChange}
      ></MusicMeta>
      {staff && <JianpuStaff staff={staff}></JianpuStaff>}
    </div>
  )
}
