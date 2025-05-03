import { MarkdownHtmlPropertyValue } from '../jianpu-markdown/ast'
import MarkdownHtmlRenderer from '../renderer/MarkdownHtmlRenderer'
import './MusicTitle.css'

export default function MusicTitle({
  title,
}: {
  title?: MarkdownHtmlPropertyValue
}) {
  return (
    <h1 className='music-title'>
      <MarkdownHtmlRenderer htmlNode={title} />
    </h1>
  )
}
