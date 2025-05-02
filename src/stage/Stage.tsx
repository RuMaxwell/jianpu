import { useSize } from 'ahooks'
import { px } from '../utils/units'
import MusicTitle from '../music/MusicTitle'
import { MusicMeta } from '../music/meta'
import { IKeySignature, ITimeSignature } from '../music/meta/musicMeta'
import { ReactNode } from 'react'
import { IStaff } from '../music/staff/staff'
import JianpuStaff from '../music/staff/JianpuStaff'

export default function Stage(props: {
  title?: string | ReactNode
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composer?: string
  staff?: IStaff
}) {
  const { title, keySignature, timeSignature, composer, staff } = props

  const windowSize = useSize(document.body)
  const width = windowSize?.width || 0

  return (
    title && (
      <div style={{ width: px(width) }}>
        <MusicTitle>{title}</MusicTitle>
        <MusicMeta
          keySignature={keySignature}
          timeSignature={timeSignature}
          composer={composer}
        ></MusicMeta>
        {staff && <JianpuStaff staff={staff}></JianpuStaff>}
      </div>
    )
  )
}
