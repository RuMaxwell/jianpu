import type { IPitch } from '../music'

export interface IStaff {
  notes: INote[]
}

export interface INoteId {
  id: string
}

export type INote =
  | IPitchNote
  | IRestNote
  | (INoteId & {
      type: 'dot'
    })
  | (INoteId & {
      type: 'dash'
    })
  | IBar
  | ITextNote

export interface IPitchNote extends INoteId {
  type?: undefined
  pitch: IPitch
  denominator: number // 1 = whole note, 2 = half note, 4 = quarter note, etc.
}

export interface IRestNote extends INoteId {
  type: 'rest'
  denominator: number // 1 = whole note, 2 = half note, 4 = quarter note, etc.
}

export interface IBar extends INoteId {
  type: 'bar'
  final?: boolean
  repeat?: boolean
}

export interface ITextNote extends INoteId {
  type: 'text'
  text: string
}
