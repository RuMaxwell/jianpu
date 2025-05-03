import { HtmlNode } from '../jianpu-markdown/ast'
import HtmlNodeRenderer from '../renderer/HtmlNodeRenderer'
import './MusicTitle.css'

export default function MusicTitle({
  title,
}: {
  title?: string | HtmlNode | HtmlNode[]
}) {
  return (
    <h1 className='music-title'>
      <HtmlNodeRenderer htmlNode={title} />
    </h1>
  )
}
