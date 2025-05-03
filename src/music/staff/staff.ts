import type { Accidental } from '../meta/types'
import type { Note } from '../music'

export interface IStaff {
  notes: INote[]
}

export interface IKey {
  key: string
}

export type INote =
  | IPitchNote
  | IRestNote
  | (IKey & {
      type: 'dot'
    })
  | (IKey & {
      type: 'dash'
    })
  | IBar
  | ITextNote

export interface IPitchNote extends IKey {
  type?: undefined
  pitch: IPitch
  denominator: number // 1 = whole note, 2 = half note, 4 = quarter note, etc.
}

export interface IPitch {
  note: Note
  accidental?: Accidental
  octave: number
}

export interface IRestNote extends IKey {
  type: 'rest'
  denominator: number // 1 = whole note, 2 = half note, 4 = quarter note, etc.
}

export interface IBar extends IKey {
  type: 'bar'
  final?: boolean
  repeat?: boolean
}

export interface ITextNote extends IKey {
  type: 'text'
  text: string
}
