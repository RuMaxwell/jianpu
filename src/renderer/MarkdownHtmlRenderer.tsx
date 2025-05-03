import { CSSProperties } from 'react'
import type { MarkdownHtmlPropertyValue } from '../jianpu-markdown/ast'

export interface AllowedHtmlAttributes {
  style?: CSSProperties
  [p: string]: any // extra attributes are ignored
}

export default function MarkdownHtmlRenderer({
  htmlNode,
  attrs,
}: {
  htmlNode: MarkdownHtmlPropertyValue | undefined
  attrs?: AllowedHtmlAttributes
}): string | JSX.Element | undefined {
  if (htmlNode === undefined) {
    return
  }
  if (Array.isArray(htmlNode)) {
    return (
      <>
        {htmlNode.map((node) => (
          <MarkdownHtmlRenderer
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
    if (typeof htmlNode.children === 'string') {
      return htmlNode.children
    }
    return (
      <MarkdownHtmlRenderer
        htmlNode={htmlNode.children}
        attrs={{ attrs, ...htmlNode }}
      />
    )
  }
  switch (htmlNode.tag) {
    case 'b':
    case 'code':
    case 'div':
    case 'i':
    case 'span':
    case 'strong':
    case 'sub':
    case 'sup':
      return (
        <htmlNode.tag style={attrs?.style}>
          <MarkdownHtmlRenderer htmlNode={htmlNode.children} />
        </htmlNode.tag>
      )
    case 'br':
      return <br />
  }
}
