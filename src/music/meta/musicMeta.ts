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

export enum Accidental {
  Sharp = '♯',
  Flat = '♭',
  Natural = '♮',
}

export interface IKeySignature {
  note: Note
  accidental?: Accidental
  scale?: 'major' | 'minor'
}

export interface ITimeSignature {
  numerator: number
  denominator: number
}
