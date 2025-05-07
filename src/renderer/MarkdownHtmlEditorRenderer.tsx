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
import { useMemoizedFn } from 'ahooks'

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

  const enterEditingMode = useMemoizedFn(() => {
    setIsEditing(true)
  })

  const exitEditingMode = useMemoizedFn(() => {
    setIsEditing(false)
  })

  const handleEditorChange = useMemoizedFn(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      return onChange?.(e.target.value)
    },
  )

  const handleEditorKeyUp = useMemoizedFn(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        exitEditingMode()
      }
    },
  )

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
