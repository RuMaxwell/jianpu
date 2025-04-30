import type { INote, IPitchNote, IStaff } from './staff'
import { MUSIC_NOTE_TO_JIANPU_NOTE } from '../music'
import { Accidental } from '../meta/musicMeta'
import { MusicText } from '../MusicText'
import './JianpuStaff.css'
import { em } from '../../styles/units'
import { useStaffEditor } from './editor/engine'
import { useEffect, useState } from 'react'

export default function JianpuStaff({ staff }: { staff: IStaff }) {
  const { notes: initialNotes } = staff

  const { notes, cursor, handleKey } = useStaffEditor(initialNotes)

  const [focused, setFocused] = useState(false)
  function handleFocus() {
    console.log('focus')
    setFocused(true)
  }
  function handleBlur() {
    console.log('blur')
    setFocused(false)
  }

  function handleInput(event: React.KeyboardEvent<HTMLDivElement>) {
    // const target = event.target as HTMLDivElement
    console.log(event.key)
    if (handleKey(event.key)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  useEffect(() => {
    console.log('notes:after', notes)
  }, [notes])

  return (
    <div
      className='jianpu-staff'
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleInput}
    >
      {notes.map((note, index) => (
        <div
          key={index}
          className={
            'jianpu-note ' +
            ('type' in note && note.type === 'dot' ? 'thin-note ' : '')
          }
        >
          {focused && index === cursor && (
            <div key='cursor' className='staff-editor-cursor'></div>
          )}
          <JianpuNote note={note} />
        </div>
      ))}

      {focused && cursor === notes.length && (
        <div className='staff-editor-cursor cursor-at-last'></div>
      )}
    </div>
  )
}

function JianpuNote({ note }: { note: INote }) {
  const ConcreteNote = getNoteComponent(note)
  return ConcreteNote
}

function getNoteComponent(note: INote) {
  if ('type' in note) {
    switch (note.type) {
      case 'rest':
        return <MusicText className='jianpu-rest'>0</MusicText>
      case 'dot':
        return <div className='jianpu-dot'>.</div>
      case 'dash':
        return <div className='jianpu-dash'>_</div>
      case 'bar':
        return (
          <div
            className={
              'jianpu-bar ' +
              (note.final ? 'final ' : '') +
              (note.repeat ? 'repeat ' : '')
            }
          ></div>
        )
      case 'text':
        return <div className='jianpu-text-note'>{note.text}</div>
      default:
        return null
    }
  } else {
    return <JianpuPitch note={note}></JianpuPitch>
  }
}

function JianpuPitch(props: { note: IPitchNote }) {
  const { accidental, note, octave } = props.note.pitch
  const { denominator } = props.note

  return (
    <div
      className='jianpu-pitch-note'
      style={{ marginLeft: accidental ? em(0.5) : 0 }}
    >
      <div className='jianpu-pitch-note-pitch'>
        <div>
          {octave > 4 &&
            Array(octave - 4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className='jianpu-pitch-note-pitch-octave'
                  style={{ top: em(0.25 - i * 0.2) }}
                >
                  ·
                </div>
              ))}
        </div>
        <div className='jianpu-pitch-note-pitch-note'>
          <MusicText
            className={
              'jianpu-pitch-note-pitch-note-accidental ' +
              (accidental === Accidental.Sharp ? 'accidental-sharp ' : '')
            }
          >
            {accidental && <sup>{accidental}</sup>}
          </MusicText>
          <MusicText className='jianpu-pitch-note-pitch-note-name'>
            {MUSIC_NOTE_TO_JIANPU_NOTE[note]}
          </MusicText>
        </div>
        {denominator > 4 &&
          Array(Math.log2(denominator) - 2)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={
                  'jianpu-pitch-note-pitch-halfline ' +
                  (accidental ? 'has-accidental' : '')
                }
                style={{ top: em(2 + i * 0.2) }}
              ></div>
            ))}
        {octave < 4 &&
          Array(4 - octave)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className='jianpu-pitch-note-pitch-octave'
                style={{
                  top: em(1.5 + (Math.log2(denominator) - 2) * 0.2 + i * 0.2),
                }}
              >
                ·
              </div>
            ))}
      </div>
    </div>
  )
}
