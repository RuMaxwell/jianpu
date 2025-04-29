import { Accidental, Note } from '../meta/musicMeta'

export interface IStaff {
  notes: INote[]
}

export interface IKey {
  key: string
}

export type INote =
  | IPitchNote
  | (IKey & {
      type: 'rest'
      denominator: number // 1 = whole note, 2 = half note, 4 = quarter note, etc.
    })
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

export interface IBar extends IKey {
  type: 'bar'
  final?: boolean
  repeat?: boolean
}

export interface ITextNote extends IKey {
  type: 'text'
  text: string
}
