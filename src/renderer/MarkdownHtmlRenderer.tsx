import { HtmlParser } from '../jianpu-markdown/htmlParser'
import MarkdownHtmlNodeRenderer from './MarkdownHtmlNodeRenderer'

export default function MarkdownHtmlRenderer({
  htmlSource,
  onClick,
}: {
  htmlSource?: string
  onClick?: () => void
}) {
  const htmlNode = htmlSource ? new HtmlParser(htmlSource).parse() : undefined

  return <MarkdownHtmlNodeRenderer htmlNode={htmlNode} onClick={onClick} />
}
