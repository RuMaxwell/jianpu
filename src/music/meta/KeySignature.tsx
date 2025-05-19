import type { IKeySignature } from './types'
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { MusicText } from '../MusicText'
import { useMemoizedFn } from 'ahooks'
import { jianpuKeySignatureToMarkdown } from '../../jianpu-markdown/jsonToMarkdown'
import { JianpuMarkdownParser } from '../../jianpu-markdown/parser'

export default function KeySignature({
  value,
  onChange,
}: {
  value: IKeySignature
  onChange?: (value?: IKeySignature) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(
    jianpuKeySignatureToMarkdown(value),
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(jianpuKeySignatureToMarkdown(value))
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
    onChange?.(JianpuMarkdownParser.parseKeySignature(inputValue))
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

  return (
    <div className='key-signature'>
      <MusicText className='key-signature-reference-pitch'>
        1 =
        {value.octave && value.octave > 4
          ? Array(value.octave - 4)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className='key-signature-reference-pitch-octave'
                  style={{ top: `${0.6 + i * 0.2}em` }}
                >
                  ・
                </span>
              ))
          : value.octave && value.octave < 4
          ? Array(4 - value.octave)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className='key-signature-reference-pitch-octave'
                  style={{ top: `-${0.6 + i * 0.2}em` }}
                >
                  ・
                </span>
              ))
          : ''}
      </MusicText>
      {!isEditing && (
        <span onClick={enterEditMode}>
          {value.accidental && (
            <MusicText>
              <sup>{value.accidental}</sup>
            </MusicText>
          )}
          <MusicText>{value.note}</MusicText>
        </span>
      )}
      {isEditing && (
        <input
          ref={inputRef}
          className='key-signature-input'
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onBlur={exitEditMode}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  )
}
