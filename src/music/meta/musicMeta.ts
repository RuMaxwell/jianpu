import type { Note } from '../music'

export enum Accidental {
  Sharp = '♯',
  Flat = '♭',
  Natural = '♮',
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
  composer?: string
}
