import {
  ChangeEvent,
  KeyboardEvent,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react'
import './MarkdownHtmlEditorRenderer.css'
import MarkdownHtmlRenderer from '../renderer/MarkdownHtmlRenderer'

export default function MarkdownHtmlEditorRenderer({
  html,
  className,
  editorClassName,
  onChange,
}: {
  html?: string
  className?: string
  editorClassName?: string
  onChange?: (value: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  const editorRef: Ref<HTMLTextAreaElement> = useRef(null)

  useEffect(() => {
    editorRef.current?.focus()
  }, [isEditing])

  function enterEditingMode() {
    setIsEditing(true)
  }

  function exitEditingMode() {
    setIsEditing(false)
  }

  function handleEditorChange(e: ChangeEvent<HTMLTextAreaElement>) {
    return onChange?.(e.target.value)
  }

  function handleEditorKeyUp(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      exitEditingMode()
    }
  }

  return (
    <div className={className}>
      {isEditing ? (
        <textarea
          ref={editorRef}
          className={'markdown-html-editor ' + editorClassName}
          defaultValue={html}
          onBlur={exitEditingMode}
          onChange={handleEditorChange}
          onKeyUp={handleEditorKeyUp}
        />
      ) : (
        <MarkdownHtmlRenderer htmlSource={html} onClick={enterEditingMode} />
      )}
    </div>
  )
}
