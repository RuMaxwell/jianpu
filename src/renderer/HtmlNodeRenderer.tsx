import { CSSProperties } from 'react'
import type { HtmlNode } from '../jianpu-markdown/ast'

export interface AllowedHtmlAttributes {
  style?: CSSProperties
  [p: string]: any // extra attributes are ignored
}

export default function HtmlNodeRenderer({
  htmlNode,
  attrs,
}: {
  htmlNode: string | HtmlNode | HtmlNode[] | undefined
  attrs?: AllowedHtmlAttributes
}): string | JSX.Element | undefined {
  if (htmlNode === undefined) {
    return
  }
  if (Array.isArray(htmlNode)) {
    return (
      <>
        {htmlNode.map((node) => (
          <HtmlNodeRenderer
            key={node.id}
            htmlNode={node}
            attrs={{ attrs, ...node }}
          />
        ))}
      </>
    )
  }
  if (typeof htmlNode === 'string') {
    return attrs ? <span style={attrs?.style}>{htmlNode}</span> : htmlNode
  }
  if (!htmlNode.tag) {
    if (typeof htmlNode.innerHtml === 'string') {
      return htmlNode.innerHtml
    }
    return (
      <HtmlNodeRenderer
        htmlNode={htmlNode.innerHtml}
        attrs={{ attrs, ...htmlNode }}
      />
    )
  }
  switch (htmlNode.tag) {
    case 'b':
    case 'code':
    case 'i':
    case 'strong':
    case 'sub':
    case 'sup':
      return (
        <htmlNode.tag style={attrs?.style}>
          <HtmlNodeRenderer htmlNode={htmlNode.innerHtml} />
        </htmlNode.tag>
      )
  }
}
