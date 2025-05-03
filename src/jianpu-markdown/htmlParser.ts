import { CSSProperties } from 'react'
import { MarkdownHtmlPropertyValue, type MarkdownHtmlNode } from './ast'

export class HtmlParser {
  private nextNodeId = 0
  private getNextNodeId(): string {
    this.nextNodeId++
    return `${this.nextNodeId}`
  }

  constructor(public html: string) {}

  parse(): MarkdownHtmlPropertyValue | undefined {
    const parser = new DOMParser()
    const doc = parser.parseFromString(this.html, 'text/html')
    return this.docToHtmlNode(doc)
  }

  docToHtmlNode(doc: Document): MarkdownHtmlPropertyValue | undefined {
    return this.vanillaNodeListToHtmlNode(doc.body.childNodes)
  }

  vanillaNodeListToHtmlNode(
    nodeList: NodeListOf<Node>,
  ): MarkdownHtmlPropertyValue | undefined {
    if (!nodeList?.length) {
      return undefined
    }

    let nodes: MarkdownHtmlNode[] = []
    nodeList.forEach((node) => {
      nodes.push(this.vanillaNodeToHtmlNode(node))
    })
    // only a text node
    if (nodes.length === 1 && !nodes[0].tag) {
      return nodes[0].children as string
    }
    if (nodes.length === 1) {
      return nodes[0]
    }
    return nodes
  }

  vanillaNodeToHtmlNode(node: Node): MarkdownHtmlNode {
    if (node.nodeType === Node.TEXT_NODE) {
      return {
        id: this.getNextNodeId(),
        children: node.textContent ?? '',
      }
    } else {
      return {
        id: this.getNextNodeId(),
        tag: node.nodeName.toLowerCase(),
        children: this.vanillaNodeListToHtmlNode(node.childNodes),
        style: cssTextToReactStyleObject((node as HTMLElement).style.cssText),
      }
    }
  }
}

function cssTextToReactStyleObject(cssText: string): CSSProperties {
  const style: CSSProperties = {}

  cssText.split(';').forEach((rule) => {
    if (!rule.trim()) return
    const [prop, value] = rule.split(':')
    if (!prop || !value) return

    const camelProp = prop
      .trim()
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) // kebab-case -> camelCase

    style[camelProp as keyof CSSProperties] = value.trim() as any
  })

  return style
}
