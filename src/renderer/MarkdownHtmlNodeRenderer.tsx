import { CSSProperties } from 'react'
import type { MarkdownHtmlPropertyValue } from '../jianpu-markdown/ast'

export interface AllowedHtmlAttributes {
  style?: CSSProperties
  [p: string]: any // extra attributes are ignored
}

export default function MarkdownHtmlNodeRenderer({
  htmlNode,
  attrs,
  onClick,
}: {
  htmlNode: MarkdownHtmlPropertyValue | undefined
  attrs?: AllowedHtmlAttributes
  onClick?: () => void
}): string | JSX.Element | undefined {
  if (htmlNode === undefined) {
    return <></>
  }
  if (Array.isArray(htmlNode)) {
    return (
      <>
        {htmlNode.map((node) => (
          <MarkdownHtmlNodeRenderer
            key={node.id}
            htmlNode={node}
            attrs={{ attrs, ...node }}
            onClick={onClick}
          />
        ))}
      </>
    )
  }
  if (typeof htmlNode === 'string') {
    return attrs || onClick ? (
      <span style={attrs?.style} onClick={onClick}>
        {htmlNode}
      </span>
    ) : (
      htmlNode
    )
  }
  if (!htmlNode.tag) {
    if (typeof htmlNode.children === 'string') {
      return attrs || onClick ? (
        <span style={attrs?.style} onClick={onClick}>
          {htmlNode.children}
        </span>
      ) : (
        htmlNode.children
      )
    }
    return (
      <MarkdownHtmlNodeRenderer
        htmlNode={htmlNode.children}
        attrs={{ attrs, ...htmlNode }}
        onClick={onClick}
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
        <htmlNode.tag style={attrs?.style} onClick={onClick}>
          <MarkdownHtmlNodeRenderer
            htmlNode={htmlNode.children}
            onClick={onClick}
          />
        </htmlNode.tag>
      )
    case 'br':
      return <br onClick={onClick} />
  }
}
