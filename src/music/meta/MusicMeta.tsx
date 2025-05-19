import type { IKeySignature, ITimeSignature } from './types'
import KeySignature from './KeySignature'
import TimeSignature from './TimeSignature'
import './MusicMeta.css'
import MarkdownHtmlEditorRenderer from '../../renderer/MarkdownHtmlEditorRenderer'

export default function MusicMeta(props: {
  keySignature?: IKeySignature
  timeSignature?: ITimeSignature
  composerHtml?: string
  onKeySignatureChange?: (value?: IKeySignature) => void
  onTimeSignatureChange?: (value?: ITimeSignature) => void
  onComposerChange?: (value: string) => void
}) {
  const {
    keySignature,
    timeSignature,
    composerHtml,
    onKeySignatureChange,
    onTimeSignatureChange,
    onComposerChange,
  } = props

  return (
    <div className='music-meta'>
      <div className='music-meta-left'>
        {keySignature && (
          <KeySignature
            value={keySignature}
            onChange={onKeySignatureChange}
          ></KeySignature>
        )}
        <div style={{ width: '12px' }}></div>
        {timeSignature && (
          <TimeSignature
            value={timeSignature}
            onChange={onTimeSignatureChange}
          ></TimeSignature>
        )}
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
