import './MusicTitle.css'
import MarkdownHtmlEditorRenderer from '../renderer/MarkdownHtmlEditorRenderer'

export default function MusicTitle({
  titleHtml,
  onChange,
}: {
  titleHtml?: string
  onChange?: (value: string) => void
}) {
  return (
    <h1 className='music-title'>
      <MarkdownHtmlEditorRenderer
        editorClassName='music-title-editor'
        html={titleHtml}
        onChange={onChange}
      />
    </h1>
  )
}
