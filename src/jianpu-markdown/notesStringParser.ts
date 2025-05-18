import { Accidental } from '../music/meta/types'
import { JIANPU_NOTE_TO_MUSIC_NOTE, Note } from '../music/music'
import type { INoteId, INote, IPitchNote } from '../music/staff/staff'
import { BUG_REPORT_MESSAGE } from './errors'

export class NotesStringParser {
  private str: string
  private i = 0
  private notes: INote[] = []

  constructor(notesString: string, private options: { octave: number }) {
    this.str = notesString
  }

  public parse(): INote[] {
    while (this.i < this.str.length) {
      const char = this.str[this.i]
      if (char.match(/\s/)) {
        this.i++
        continue
      }
      if (char.match(/[1-7]/)) {
        this.pushPitchNote(JIANPU_NOTE_TO_MUSIC_NOTE[char])
        this.i++
        continue
      }
      if (char.match(/[\/#bnlh]/)) {
        this.handlePitchModifier(char)
        this.i++
        continue
      }
      switch (char) {
        case '0':
          this.pushRestNote()
          break
        case '|':
          this.handleBarLine()
          break
        case '.':
          this.handleDot()
          break
        case '-':
          this.handleDash()
          break
        case ':':
          this.pushNote({ type: 'text', text: ':' } as INote)
          break
        default:
          console.warn(`Unexpected character in notes: ${char}. Ignoring it.`)
          break
      }
      this.i++
    }
    return this.notes
  }

  private handleBarLine(): void {
    const prev = this.notes[this.notes.length - 1]
    if (prev?.type === 'bar') {
      prev.final = true
      return
    }
    if (prev?.type === 'text' && prev.text === ':') {
      this.notes[this.notes.length - 1] = {
        id: prev.id,
        type: 'bar',
        repeat: true,
      }
      return
    }
    this.pushNote({ type: 'bar' })
  }

  private handleDot(): void {
    this.pushNote({ type: 'dot' })
  }

  private handleDash(): void {
    this.pushNote({ type: 'dash' })
  }

  private handlePitchModifier(modifier: string): void {
    const compatibleWithRest = modifier === '/'
    if (compatibleWithRest) {
      return this.handlePitchRestModifier(modifier)
    }
    const prev = this.notes[this.notes.length - 1]
    if (prev?.type !== undefined) {
      console.warn(`Unexpected '${modifier}' after ${prev.type}. Ignoring it.`)
      return
    }
    switch (modifier) {
      case 'l':
      case 'h':
        this.notes[this.notes.length - 1] = {
          ...prev,
          pitch: {
            ...prev.pitch,
            octave: prev.pitch.octave + (modifier === 'h' ? 1 : -1),
          },
        } as IPitchNote
        break
      case '#':
      case 'b':
      case 'n':
        this.notes[this.notes.length - 1] = {
          ...prev,
          pitch: {
            ...prev.pitch,
            accidental:
              modifier === '#'
                ? Accidental.Sharp
                : modifier === 'b'
                ? Accidental.Flat
                : Accidental.Natural,
          },
        } as IPitchNote
        break
      default:
        throw new Error(`Unreachable code. ${BUG_REPORT_MESSAGE}`)
    }
  }

  private handlePitchRestModifier(modifier: string): void {
    const prev = this.notes[this.notes.length - 1]
    if (prev?.type !== undefined) {
      console.warn(`Unexpected '${modifier}' after ${prev.type}. Ignoring it.`)
      return
    }
    switch (modifier) {
      case '/':
        this.notes[this.notes.length - 1] = {
          ...prev,
          denominator: prev.denominator * 2,
        }
        break
      default:
        throw new Error(`Unreachable code. ${BUG_REPORT_MESSAGE}`)
    }
  }

  private makeNote(noteWithoutId: Omit<INote, 'id'> & Partial<INoteId>): INote {
    return {
      ...(noteWithoutId as INote),
      id: `${this.notes.length}`,
    }
  }

  private pushNote(noteWithoutId: Omit<INote, 'id'> & Partial<INoteId>): void {
    this.notes.push(this.makeNote(noteWithoutId))
  }

  private pushPitchNote(note: Note): void {
    this.pushNote({
      pitch: {
        note,
        octave: this.options.octave,
      },
      denominator: 4,
    } as INote)
  }

  private pushRestNote(): void {
    this.pushNote({
      type: 'rest',
      denominator: 4,
    } as INote)
  }
}
