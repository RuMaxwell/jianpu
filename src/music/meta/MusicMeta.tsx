import type { IKeySignature, ITimeSignature } from './types'
import KeySignature from './KeySignature'
import TimeSignature from './TimeSignature'
import './MusicMeta.css'
import MarkdownHtmlEditorRenderer from '../../renderer/MarkdownHtmlEditorRenderer'

export default function MusicMeta(props: {
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composerHtml?: string
  onComposerChange?: (value: string) => void
}) {
  const { keySignature, timeSignature, composerHtml, onComposerChange } = props

  return (
    <div className='music-meta'>
      <div>
        {keySignature && <KeySignature value={keySignature}></KeySignature>}
        {timeSignature && <TimeSignature value={timeSignature}></TimeSignature>}
      </div>
      <div>
        {composerHtml && (
          <div>
            <MarkdownHtmlEditorRenderer
              html={composerHtml}
              onChange={onComposerChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
