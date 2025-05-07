import type { Note } from '../music'

export enum Accidental {
  Sharp = '♯',
  Flat = '♭',
  Natural = '♮',
}

export const ACCIDENTAL_TO_ASCII = {
  [Accidental.Sharp]: '#',
  [Accidental.Flat]: 'b',
  [Accidental.Natural]: 'n',
}

export interface IKeySignature {
  note: Note
  accidental?: Accidental
  octave?: number
}

export interface ITimeSignature {
  numerator: number
  denominator: number
}

export interface IMusicMeta {
  key?: IKeySignature
  tempo?: ITimeSignature
  composer?: string // HTML
}
