import type { ITimeSignature } from './types'
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { MusicText } from '../MusicText'
import { jianpuTimeSignatureToMarkdown } from '../../jianpu-markdown/jsonToMarkdown'
import { JianpuMarkdownParser } from '../../jianpu-markdown/parser'
import { useMemoizedFn } from 'ahooks'

export default function TimeSignature({
  value,
  onChange,
}: {
  value: ITimeSignature
  onChange?: (value?: ITimeSignature) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(
    jianpuTimeSignatureToMarkdown(value),
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(jianpuTimeSignatureToMarkdown(value))
  }, [value])

  const enterEditMode = useMemoizedFn(() => {
    setIsEditing(true)
  })

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const exitEditMode = useMemoizedFn(() => {
    setIsEditing(false)
    onChange?.(JianpuMarkdownParser.parseTimeSignature(inputValue))
  })

  const handleInputChange = useMemoizedFn(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
    },
  )

  const handleKeyDown = useMemoizedFn((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault()
      exitEditMode()
    }
  })

  return isEditing ? (
    <input
      ref={inputRef}
      className='time-signature-input'
      type='text'
      value={inputValue}
      onChange={handleInputChange}
      onBlur={exitEditMode}
      onKeyDown={handleKeyDown}
    />
  ) : (
    <div className='time-signature' onClick={enterEditMode}>
      <MusicText>{value.numerator}</MusicText>
      <div className='time-signature-division-line'></div>
      <MusicText>{value.denominator}</MusicText>
    </div>
  )
}
