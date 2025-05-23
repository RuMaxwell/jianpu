import { useState } from 'react'
import type { IBar, INote, IPitchNote, ITextNote } from '../staff'
import { Accidental } from '../../meta/types'
import { JIANPU_NOTE_TO_MUSIC_NOTE } from '../../music'

const NOTE_KEY_SET = new Set('01234567'.split(''))
const TEXT_KEY_SET = new Set(':'.split(''))

function genId(cursor: number) {
  return `${Date.now()}-${cursor}`
}

function isPitchNote(note: INote): note is IPitchNote {
  return note && note.type === undefined
}

export function useStaffEditor(initialNotes?: INote[]) {
  const [notes, setNotes] = useState<INote[]>(initialNotes ?? [])
  const [cursor, setCursor] = useState(notes.length)

  const moveLeft = () => {
    if (cursor > 0) {
      setCursor(cursor - 1)
    }
  }

  const moveRight = () => {
    if (cursor < notes.length) {
      setCursor(cursor + 1)
    }
  }

  const moveUp = () => {}

  const moveDown = () => {}

  const handleTabKey = () => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'text',
        text: ' ',
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const handlePipeKey = () => {
    if (notes[cursor - 1]?.type === 'bar') {
      setNotes((prev) => {
        const newNotes = [...prev]
        newNotes[cursor - 1] = {
          ...(newNotes[cursor - 1] as IBar),
          final: true,
        }
        return newNotes
      })
    } else if (
      notes[cursor - 1]?.type === 'text' &&
      (notes[cursor - 1] as ITextNote).text === ':'
    ) {
      setNotes((prev) => {
        const newNotes = [...prev]
        newNotes[cursor - 1] = {
          id: newNotes[cursor - 1].id,
          type: 'bar',
          final: false,
          repeat: true,
        } as IBar
        return newNotes
      })
    } else {
      setNotes((prev) => {
        const newNotes = [...prev]
        newNotes.splice(cursor, 0, {
          id: genId(cursor),
          type: 'bar',
        })
        return newNotes
      })
      setCursor(cursor + 1)
    }
  }

  const handleSlashKey = () => {
    const lastNote = notes[cursor - 1]
    if (isPitchNote(lastNote) || lastNote?.type === 'rest') {
      setNotes((prev) => {
        const newNotes = [...prev]
        newNotes[cursor - 1] = {
          ...lastNote,
          denominator: lastNote.denominator * 2,
        }
        return newNotes
      })
    }
  }

  const handleAccidentalKey = (key: string) => {
    const lastNote = notes[cursor - 1]
    if (isPitchNote(lastNote)) {
      setNotes((prev) => {
        const newNotes = [...prev]
        newNotes[cursor - 1] = {
          ...lastNote,
          pitch: {
            ...lastNote.pitch,
            accidental:
              key === '#'
                ? Accidental.Sharp
                : key === 'b'
                ? Accidental.Flat
                : Accidental.Natural,
          },
        }
        return newNotes
      })
    }
  }

  const handleOctaveKey = (key: string) => {
    const lastNote = notes[cursor - 1]
    if (isPitchNote(lastNote)) {
      setNotes((prev) => {
        const newNotes = [...prev]
        newNotes[cursor - 1] = {
          ...lastNote,
          pitch: {
            ...lastNote.pitch,
            octave: lastNote.pitch.octave + (key === 'h' ? 1 : -1),
          },
        }
        return newNotes
      })
    }
  }

  const handleDotKey = () => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'dot',
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const handleDashKey = () => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'dash',
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const handleLeftSquaredBracketKey = () => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'slurStart',
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const handleRightSquaredBracketKey = () => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'slurEnd',
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const insertRestNote = () => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'rest',
        denominator: 4,
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const insertPitchNote = (key: string) => {
    const note = JIANPU_NOTE_TO_MUSIC_NOTE[key]
    if (!note) return
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        pitch: { note, octave: 4 },
        denominator: 4,
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const insertText = (key: string) => {
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor, 0, {
        id: genId(cursor),
        type: 'text',
        text: key,
      })
      return newNotes
    })
    setCursor(cursor + 1)
  }

  const handleOtherKey = (key: string) => {
    if (NOTE_KEY_SET.has(key)) {
      if (key === '0') {
        insertRestNote()
      } else {
        insertPitchNote(key)
      }
    } else if (TEXT_KEY_SET.has(key)) {
      insertText(key)
    } else {
      return false // key not handled
    }
    return true // key handled
  }

  const handleBackspaceKey = () => {
    if (cursor === 0) return
    setNotes((prev) => {
      const newNotes = [...prev]
      newNotes.splice(cursor - 1, 1)
      return newNotes
    })
    setCursor(cursor - 1)
  }

  const handleKey = (key: string) => {
    switch (key) {
      case 'Tab':
        handleTabKey()
        break
      case 'ArrowLeft':
        moveLeft()
        break
      case 'ArrowRight':
        moveRight()
        break
      case '|':
        handlePipeKey()
        break
      case '/':
        handleSlashKey()
        break
      case '.':
        handleDotKey()
        break
      case '-':
        handleDashKey()
        break
      case '[':
        handleLeftSquaredBracketKey()
        break
      case ']':
        handleRightSquaredBracketKey()
        break
      case '#':
      case 'b':
      case 'n':
        handleAccidentalKey(key)
        break
      case 'h':
      case 'l':
        handleOctaveKey(key)
        break
      case 'Backspace':
        handleBackspaceKey()
        break
      default:
        return handleOtherKey(key)
    }
    return true // key handled
  }

  return {
    notes,
    setNotes,
    cursor,
    setCursor,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    handleKey,
  }
}
