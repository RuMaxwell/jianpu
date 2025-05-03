export interface HtmlNode {
  id: string
  /** If no tag, it is a text node, and `innerHtml` should be the text content,
   * and attributes set to this node are ignored. However, if it has HtmlNodes,
   * it will be treated like a virtual node and delegate all its attributes to
   * its child or every children. */
  tag?: string
  innerHtml: string | HtmlNode | HtmlNode[]
  [p: string]: any
}
