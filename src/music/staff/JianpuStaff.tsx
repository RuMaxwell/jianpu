import type { INote, IPitchNote, IStaff } from './staff'
import { MUSIC_NOTE_TO_JIANPU_NOTE } from '../music'
import { Accidental } from '../meta/types'
import { MusicText } from '../MusicText'
import './JianpuStaff.css'
import { em } from '../../utils/units'
import { useStaffEditor } from './editor/engine'
import { useEffect, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { ArrayUtil } from '../../utils/array'

type StaffContext = {
  name: 'initial' | 'slurStart' | 'slur' | 'slurEnd'
}

const thinNoteTypes = new Set<string | undefined>(['dot'])
const zeroWidthNoteTypes = new Set<string | undefined>(['slurStart', 'slurEnd'])

function noteWidthClassName(note: INote): string {
  return thinNoteTypes.has(note.type)
    ? 'thin-note '
    : zeroWidthNoteTypes.has(note.type)
    ? 'zero-width-note '
    : ''
}

export default function JianpuStaff({
  newStaff,
  onNotesChange,
}: {
  /** Only update this when the staff need to be completely replaced. Do not update it when notes change. */
  newStaff?: IStaff
  onNotesChange?: (notes: INote[]) => void
}) {
  const { notes, setNotes, cursor, setCursor, handleKey } = useStaffEditor(
    newStaff?.notes,
  )

  useEffect(() => {
    setNotes(newStaff?.notes ?? [])
    setCursor(newStaff?.notes?.length ?? 0)
  }, [newStaff?.notes])

  const [focused, setFocused] = useState(false)
  const handleFocus = useMemoizedFn(() => {
    setFocused(true)
  })
  const handleBlur = useMemoizedFn(() => {
    setFocused(false)
  })

  const handleInput = useMemoizedFn(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      console.log(event.key)
      if (handleKey(event.key)) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
  )

  useEffect(() => {
    console.log('notes:change', notes)
    onNotesChange?.(notes)
  }, [notes])

  // Big notations (e.g. slurs) needs to store contexts.
  const contexts: StaffContext[] = [{ name: 'initial' }]

  return (
    <div
      className='jianpu-staff'
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleInput}
    >
      {notes.map((note, index) => {
        return (
          <div
            key={index}
            className={'jianpu-note ' + noteWidthClassName(note)}
          >
            {
              /* normal cursor */
              focused &&
                index === cursor &&
                notes[index - 1]?.type !== 'slurStart' &&
                notes[index - 1]?.type !== 'slurEnd' && (
                  <div key='cursor' className='staff-editor-cursor'></div>
                )
            }
            {
              /* cursor for zero-width notes */
              focused &&
                index === cursor &&
                (notes[index - 1]?.type === 'slurStart' ||
                  notes[index - 1]?.type === 'slurEnd') && (
                  <div
                    key='slurStartCursor'
                    className={
                      'staff-editor-slur-delimiter-cursor ' +
                      (notes[index - 1]?.type === 'slurEnd'
                        ? 'slur-end-cursor '
                        : '')
                    }
                  ></div>
                )
            }
            <JianpuNote
              note={note}
              index={index}
              notes={notes}
              contexts={contexts}
            />
          </div>
        )
      })}

      {focused && cursor === notes.length && (
        <div className='staff-editor-cursor cursor-at-last'></div>
      )}
    </div>
  )
}

function JianpuNote({
  note,
  index,
  notes,
  contexts,
}: {
  note: INote
  index: number
  notes: INote[]
  contexts: StaffContext[]
}) {
  const ConcreteNote = getNoteComponent(note, index, notes, contexts)
  return ConcreteNote
}

function getNoteComponent(
  note: INote,
  index: number,
  notes: INote[],
  contexts: StaffContext[],
) {
  const MainNoteComponent = () => getMainNoteComponent(note)

  // Change contexts if necessary
  switch (note.type) {
    case 'slurStart':
      contexts.push({ name: 'slur' })
      break
    case 'slurEnd':
      ArrayUtil.popLast(contexts, (context) => context.name === 'slur')
      break
    default:
  }

  return (
    <>
      <MainNoteComponent />
      <NoteDecoration
        note={note}
        index={index}
        notes={notes}
        contexts={contexts}
      />
    </>
  )
}

function getMainNoteComponent(note: INote): JSX.Element | null {
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
      case 'slurStart':
      case 'slurEnd':
      default:
        return null
    }
  } else {
    return <JianpuPitch note={note}></JianpuPitch>
  }
}

function NoteDecoration({
  note,
  index,
  notes,
  contexts,
}: {
  note: INote
  index: number
  notes: INote[]
  contexts: StaffContext[]
}) {
  if (
    ArrayUtil.findLastIndex(contexts, (context) => context.name === 'slur') !==
    -1
  ) {
    if (note.type === 'slurStart') {
      return null
    }
    if (notes[index + 1]?.type === 'slurEnd') {
      return (
        <div className='jianpu-slur jianpu-slur-end'>
          <svg
            width='1em'
            height='1em'
            viewBox='0 0 10 10'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M 0 5 C 2 5 5 6.5 5 10' fill='transparent'></path>
          </svg>
        </div>
      )
    }
    if (notes[index - 1]?.type === 'slurStart') {
      return (
        <div className='jianpu-slur'>
          <svg
            width='1em'
            height='1em'
            viewBox='0 0 10 10'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M 5 10 C 5 8 6.5 5 10 5' fill='transparent'></path>
          </svg>
        </div>
      )
    }
    return (
      <div className='jianpu-slur jianpu-slur-continue'>
        <svg
          width={
            !note.type && note.pitch.accidental
              ? '1.6em'
              : thinNoteTypes.has(note.type)
              ? '0.6em'
              : '1.1em'
          }
          height='1em'
          viewBox={
            !note.type && note.pitch.accidental
              ? '0 0 16 10'
              : thinNoteTypes.has(note.type)
              ? '0 0 6 10'
              : '0 0 11 10'
          }
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d={
              !note.type && note.pitch.accidental
                ? 'M 0 5 L 16 5'
                : thinNoteTypes.has(note.type)
                ? 'M 0 5 L 6 5'
                : 'M 0 5 L 11 5'
            }
            fill='transparent'
          ></path>
        </svg>
      </div>
    )
  }
  return null
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
