import {
  Accidental,
  ACCIDENTAL_TO_ASCII,
  type ITimeSignature,
  type IKeySignature,
} from '../music/meta/types'
import { MUSIC_NOTE_TO_JIANPU_NOTE, type IMusicScore } from '../music/music'
import { BUG_REPORT_MESSAGE } from './errors'

export function jianpuJsonObjectToMarkdown(jsonObject: IMusicScore): string {
  const lines = []

  if (jsonObject.title) {
    lines.push(`# Title: ${jsonObject.title}`)
  }

  if (jsonObject.meta) {
    const meta = jsonObject.meta
    lines.push(`# Meta`)

    if (meta.key) {
      lines.push(`- key: ${jianpuKeySignatureToMarkdown(meta.key)}`)
    }
    if (meta.tempo) {
      lines.push(`- tempo: ${jianpuTimeSignatureToMarkdown(meta.tempo)}`)
    }
    if (meta.composer) {
      lines.push(`- composer: ${meta.composer}`)
    }
  }

  if (jsonObject.staff) {
    lines.push(`# Staff`)
    const notes = jsonObject.staff.notes
    lines.push(`- Notes`)

    let notesString = ''
    for (const note of notes) {
      if (!note.type) {
        notesString += `${
          MUSIC_NOTE_TO_JIANPU_NOTE[note.pitch.note]
        }${accidental(note.pitch.accidental)}${octave(
          note.pitch.octave,
        )}${duration(note.denominator)}`
        continue
      }
      switch (note.type) {
        case 'rest':
          notesString += `0${duration(note.denominator)}`
          break
        case 'bar':
          notesString += `${note.repeat ? ':' : ''}|${note.final ? '|' : ''}`
          break
        case 'dash':
          notesString += '-'
          break
        case 'dot':
          notesString += '.'
          break
        case 'slurStart':
          notesString += '['
          break
        case 'slurEnd':
          notesString += ']'
          break
        case 'text':
          notesString += note.text
          break
        default:
          throw new Error(
            `Unhandled note type when exporting as Jianpu Markdown. ${BUG_REPORT_MESSAGE}`,
          )
      }
    }

    lines.push(notesString, '')
  }

  return lines.join('\n')
}

export function jianpuKeySignatureToMarkdown(key: IKeySignature): string {
  return `${key.note}${accidental(key.accidental)}${key.octave ?? ''}`
}

export function jianpuTimeSignatureToMarkdown(time: ITimeSignature): string {
  return `${time.numerator}/${time.denominator}`
}

function accidental(value?: Accidental): string {
  return value
    ? ACCIDENTAL_TO_ASCII[value] === 'n'
      ? ''
      : ACCIDENTAL_TO_ASCII[value]
    : ''
}

function octave(value?: number): string {
  return value
    ? value === 4
      ? ''
      : value > 4
      ? Array(value - 4)
          .fill('h')
          .join('')
      : Array(4 - value)
          .fill('l')
          .join('')
    : ''
}

function duration(denominator: number): string {
  return Array(Math.log2(denominator) - 2)
    .fill('/')
    .join('')
}
