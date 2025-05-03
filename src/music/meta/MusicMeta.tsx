import type { IKeySignature, ITimeSignature } from './types'
import KeySignature from './KeySignature'
import TimeSignature from './TimeSignature'
import './MusicMeta.css'
import { HtmlNode } from '../../jianpu-markdown/ast'
import HtmlNodeRenderer from '../../renderer/HtmlNodeRenderer'

export default function MusicMeta(props: {
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composer?: string | HtmlNode | HtmlNode[]
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
      <div>
        {props.composer && (
          <div>
            <HtmlNodeRenderer htmlNode={props.composer} />
          </div>
        )}
      </div>
    </div>
  )
}
