import type { MarkdownHtmlPropertyValue } from '../jianpu-markdown/ast'
import { IMusicMeta } from './meta/types'
import { IStaff } from './staff/staff'

export interface IMusicScore {
  title: MarkdownHtmlPropertyValue
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
