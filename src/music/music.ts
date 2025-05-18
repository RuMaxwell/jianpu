import { Accidental, IMusicMeta } from './meta/types'
import { IStaff } from './staff/staff'

export interface IMusicScore {
  title: string // HTML
  meta: IMusicMeta
  staff: IStaff
}

export enum Note {
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  A = 'A',
  B = 'B',
  Do = 'C',
  Re = 'D',
  Mi = 'E',
  Fa = 'F',
  Sol = 'G',
  La = 'A',
  Si = 'B',
}

export interface IPitch {
  note: Note
  accidental?: Accidental
  octave: number
}

export const JIANPU_NOTE_TO_MUSIC_NOTE: Record<string, Note> = {
  '1': Note.Do,
  '2': Note.Re,
  '3': Note.Mi,
  '4': Note.Fa,
  '5': Note.Sol,
  '6': Note.La,
  '7': Note.Si,
}

export const MUSIC_NOTE_TO_JIANPU_NOTE: Record<Note, string> = {
  [Note.Do]: '1',
  [Note.Re]: '2',
  [Note.Mi]: '3',
  [Note.Fa]: '4',
  [Note.Sol]: '5',
  [Note.La]: '6',
  [Note.Si]: '7',
}

export function nextNote(note: Note): Note {
  switch (note) {
    case Note.A:
      return Note.B
    case Note.B:
      return Note.C
    case Note.C:
      return Note.D
    case Note.D:
      return Note.E
    case Note.E:
      return Note.F
    case Note.F:
      return Note.G
    case Note.G:
      return Note.A
  }
}

export function previousNote(note: Note): Note {
  switch (note) {
    case Note.A:
      return Note.G
    case Note.B:
      return Note.A
    case Note.C:
      return Note.B
    case Note.D:
      return Note.C
    case Note.E:
      return Note.D
    case Note.F:
      return Note.E
    case Note.G:
      return Note.F
  }
}

export namespace Note {
  /**
   * Shifts pitch by a half note.
   * @param pitch the pitch
   * @param halfNotes `+1` to shift higher, `-1` to shift lower
   * @param mode `'auto'` to add sharp accidental when shifting higher, flat
   * accidental when shifting lower; `'sharp'` to always add sharp accidentals,
   * `'flat'` to always add flat accidentals.
   * @returns the shifted pitch
   */
  function shiftPitchByHalfNote(
    pitch: IPitch,
    halfNotes: 1 | -1,
    mode: 'auto' | 'sharp' | 'flat' = 'auto',
  ): IPitch {
    if (halfNotes > 0) {
      return {
        note:
          pitch.accidental === Accidental.Sharp ||
          ((mode === 'flat' ||
            pitch.note === Note.E ||
            pitch.note === Note.B) &&
            pitch.accidental !== Accidental.Flat)
            ? nextNote(pitch.note)
            : pitch.note,
        accidental:
          (pitch.accidental === Accidental.Natural || !pitch.accidental) &&
          pitch.note !== Note.E &&
          pitch.note !== Note.B
            ? mode === 'flat'
              ? Accidental.Flat
              : Accidental.Sharp
            : (pitch.note === Note.E || pitch.note === Note.B) &&
              pitch.accidental === Accidental.Sharp
            ? Accidental.Sharp
            : undefined,
        octave:
          pitch.note === Note.B && pitch.accidental !== Accidental.Flat
            ? pitch.octave + 1
            : pitch.octave,
      }
    } else {
      return {
        note:
          pitch.accidental === Accidental.Flat ||
          ((mode === 'sharp' ||
            pitch.note === Note.F ||
            pitch.note === Note.C) &&
            pitch.accidental !== Accidental.Sharp)
            ? previousNote(pitch.note)
            : pitch.note,
        accidental:
          (pitch.accidental === Accidental.Natural || !pitch.accidental) &&
          pitch.note !== Note.F &&
          pitch.note !== Note.C
            ? mode === 'sharp'
              ? Accidental.Sharp
              : Accidental.Flat
            : (pitch.note === Note.F || pitch.note === Note.C) &&
              pitch.accidental === Accidental.Flat
            ? Accidental.Flat
            : undefined,
        octave:
          pitch.note === Note.C && pitch.accidental !== Accidental.Sharp
            ? pitch.octave - 1
            : pitch.octave,
      }
    }
  }

  /**
   * Shifts pitch by half notes.
   * @param pitch the pitch
   * @param halfNotes positive integer to shift higher, negative integer to
   * shift lower, 0 to copy the note
   * @param mode `'auto'` to add sharp accidental when shifting higher, flat
   * accidental when shifting lower; `'sharp'` to always add sharp accidentals,
   * `'flat'` to always add flat accidentals.
   * @returns the shifted pitch
   */
  export function shiftPitch(
    pitch: IPitch,
    halfNotes: number,
    mode: 'auto' | 'sharp' | 'flat' = 'auto',
  ): IPitch {
    if (halfNotes === 0) {
      return { ...pitch }
    }

    if (halfNotes > 0) {
      for (let i = 0; i < halfNotes; i++) {
        pitch = shiftPitchByHalfNote(pitch, 1, mode)
      }
    } else {
      for (let i = -halfNotes; i > 0; i--) {
        pitch = shiftPitchByHalfNote(pitch, -1, mode)
      }
    }
    return pitch
  }
}
