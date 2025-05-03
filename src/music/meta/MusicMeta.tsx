import type { IKeySignature, ITimeSignature } from './types'
import KeySignature from './KeySignature'
import TimeSignature from './TimeSignature'
import './MusicMeta.css'
import { MarkdownHtmlPropertyValue } from '../../jianpu-markdown/ast'
import MarkdownHtmlRenderer from '../../renderer/MarkdownHtmlRenderer'

export default function MusicMeta(props: {
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composer?: MarkdownHtmlPropertyValue
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
            <MarkdownHtmlRenderer htmlNode={props.composer} />
          </div>
        )}
      </div>
    </div>
  )
}
