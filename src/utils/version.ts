const VERSION_REGEX = /(\d+)\.(\d+)(?:\.(\d+))?(-alpha)?/i

export class Version {
  constructor(
    public main: number,
    public sub: number,
    public minor: number,
    public alpha: boolean,
  ) {}

  static fromString(version: string): Version {
    const m = version.match(VERSION_REGEX)
    if (!m) {
      return new Version(0, 0, 0, false)
    }
    return new Version(
      parseInt(m[1]),
      parseInt(m[2]),
      parseInt(m[3] || '0'),
      m[3] === '-alpha',
    )
  }

  compatibleTo(other: Version | string): boolean {
    if (typeof other === 'string') {
      other = Version.fromString(other)
    }
    return this.main === other.main
  }
}
