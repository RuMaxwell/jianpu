import type { INote } from '../music/staff/staff'
import { IMusicScore, type IPitch, type Note } from '../music/music'
import { Accidental, type ITimeSignature } from '../music/meta/types'
import { Version } from '../utils/version'
import { NotesStringParser } from './notesStringParser'

function checkVersion(version: string) {
  // PACKAGE_VERSION is defined by rsbuild.config.ts (in source.define) and
  // declared in env.d.ts. Its value is in package.json.
  const packageVersion = Version.fromString(PACKAGE_VERSION)
  const markdownVersion = Version.fromString(version)
  if (!packageVersion.compatibleTo(markdownVersion)) {
    console.warn(
      `Version mismatch: markdown file version ${markdownVersion} is not compatible to runtime version ${PACKAGE_VERSION}. Some unexpected errors may occur. See [changes](${PACKAGE_REPOSITORY}/docs/CHANGELOG.md).`,
    )
  }
}

interface IProperty {
  type: 'main' | 'sub'
  key: string
  value: string | null
}

const propertyRegex = /^(#|-)\s*([A-Za-z_0-9-]+)(?:\s*\:(.*))?$/i

function matchAndSplitProperty(propertyLine: string): IProperty | null {
  const m = propertyLine.match(propertyRegex)
  if (!m) {
    return null
  }
  const type = m[1] === '#' ? 'main' : 'sub'
  const key = m[2].toLowerCase()
  const value = m[3] ? m[3].trim() : null
  return { type, key, value }
}

// One-time parser. `parse()` method should only be called once.
export class JianpuMarkdownParser {
  private constructor() {}
  private static _instance: JianpuMarkdownParser | undefined

  public static get instance(): JianpuMarkdownParser {
    if (!JianpuMarkdownParser._instance) {
      JianpuMarkdownParser._instance = new JianpuMarkdownParser()
    }
    return JianpuMarkdownParser._instance
  }

  private static getInitialState() {
    return {
      version: '',
      score: {
        title: '',
        meta: {
          key: undefined,
          tempo: undefined,
          composer: '',
        },
        staff: {
          notes: [],
        },
      } as IMusicScore,
      notesString: '',
      context: 'initial',
    }
  }

  private state: ReturnType<typeof JianpuMarkdownParser.getInitialState> =
    null as any

  /** The parse does not fail (more strictly, it only fails when fatal error
   * happens). Jianpu Markdown has a loose syntax that all kinds of text is
   * valid. However, it prints warnings if there is content not making sense. */
  public parse(input: string): IMusicScore {
    this.state = JianpuMarkdownParser.getInitialState()

    const lines = input.split('\n')

    for (let i = 0; i < lines.length; ) {
      if (!lines[i].trim()) {
        i++
        continue
      }
      const line = lines[i].trim()
      switch (this.state.context) {
        case 'initial':
          i += this.handleInitialState(line)
          break
        case 'title':
          i += this.handleTitleState(line)
          break
        case 'meta':
          i += this.handleMetaState(line)
          break
        case 'meta.key':
          i += this.handleMetaKeyState(line)
          break
        case 'meta.tempo':
          i += this.handleMetaTempoState(line)
          break
        case 'meta.composer':
          i += this.handleMetaComposerState(line)
          break
        case 'staff':
          i += this.handleStaffState(line)
          break
        case 'staff.notes':
          i += this.handleStaffNotesState(line)
          break
        default:
          console.error(
            `Unexpected property: ${this.state.context}. Ignoring it.`,
          )
          this.state.context = 'initial'
          i++
      }
    }

    if (this.state.notesString) {
      this.state.score.staff.notes = this.parseNotesString()
      this.state.notesString = ''
    }

    return this.state.score
  }

  private handleInitialState(line: string): 1 {
    const property = matchAndSplitProperty(line)
    if (!property) {
      console.warn(`Expected main property. Ignoring line: ${line}.`)
      return 1
    }
    if (property.type === 'sub') {
      console.warn(`Expected main property. Ignoring line: ${line}.`)
      return 1
    }
    if (property.type === 'main' && property.value === null) {
      this.state.context = property.key
      return 1
    }
    // property.type === 'main' && property.value !== null
    const value = property.value!
    switch (property.key) {
      case 'version':
        checkVersion(value)
        this.state.version = value
        break
      case 'title':
        this.state.score.title = value
        break
      case 'meta':
        console.warn(
          `Meta does not support a direct value. Ignoring value: ${value}.`,
        )
        break
      case 'staff':
        console.warn(
          `Staff does not support a direct value. Ignoring value: ${value}.`,
        )
        break
      default:
        console.warn(`Unknown property. Ignoring property: ${property}.`)
    }
    return 1
  }

  private handleTitleState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (property?.type === 'main') {
      this.state.context = 'initial'
      return 0
    }
    if (property?.type === 'sub') {
      console.warn(
        `Title does not support sub-properties. Ignoring line: ${line}.`,
      )
      return 1
    }
    // property === null
    this.state.score.title += line
    return 1
  }

  private handleMetaState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (!property) {
      console.warn(`Expected sub-property. Ignoring line: ${line}.`)
      return 1
    }
    if (property.type === 'main') {
      this.state.context = 'initial'
      return 0
    }
    // property.type === 'sub'
    if (property.value === null) {
      this.state.context = `meta.${property.key}`
      return 1
    }
    // property.type === 'sub' && property.value !== null
    const value = property.value
    switch (property.key) {
      case 'key':
        this.state.score.meta.key =
          JianpuMarkdownParser.parseKeySignature(value)
        break
      case 'tempo':
        this.state.score.meta.tempo =
          JianpuMarkdownParser.parseTimeSignature(value)
        break
      case 'composer':
        this.state.score.meta.composer = value
        break
      default:
        console.warn(`Unknown meta property. Ignoring property: ${property}.`)
    }
    return 1
  }

  private handleMetaKeyState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (property) {
      this.state.context = 'meta'
      return 0
    }
    this.state.score.meta.key = JianpuMarkdownParser.parseKeySignature(line)
    return 1
  }

  private handleMetaTempoState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (property) {
      this.state.context = 'meta'
      return 0
    }
    this.state.score.meta.tempo = JianpuMarkdownParser.parseTimeSignature(line)
    return 1
  }

  private handleMetaComposerState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (property) {
      this.state.context = 'meta'
      return 0
    }
    this.state.score.meta.composer += line
    return 1
  }

  private handleStaffState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (!property) {
      console.warn(`Expected sub-property. Ignoring line: ${line}.`)
      return 1
    }
    if (property?.type === 'main') {
      this.state.context = 'initial'
      return 0
    }
    // property.type === 'sub'
    if (property.value === null) {
      this.state.context = `staff.${property.key}`
      return 1
    }
    // property.type === 'sub' && property.value !== null
    const value = property.value
    switch (property.key) {
      case 'notes':
        this.state.notesString = value
        break
      default:
        console.warn(`Unknown staff property. Ignoring property: ${property}.`)
    }
    return 1
  }

  private handleStaffNotesState(line: string): 0 | 1 {
    const property = matchAndSplitProperty(line)
    if (property) {
      this.state.context = 'staff'
      return 0
    }
    this.state.notesString += line
    return 1
  }

  public static parseKeySignature(pitch: string): IPitch | undefined {
    const pitchRegex = /([A-Ga-g])\s*([#bn]?)\s*(\d*)/
    const m = pitch.match(pitchRegex)
    if (!m) {
      console.error(`Invalid pitch: ${pitch}`)
      return undefined
    }
    const note = m[1].toUpperCase() as Note
    const accidental =
      m[2] === '#'
        ? Accidental.Sharp
        : m[2] === 'b'
        ? Accidental.Flat
        : m[2] === 'n'
        ? Accidental.Natural
        : undefined
    const octave = parseInt(m[3], 10) || 4
    return { note, accidental, octave }
  }

  public static parseTimeSignature(tempo: string): ITimeSignature | undefined {
    if (!tempo) {
      return undefined
    }
    const tempoRegex = /(\d+)\s*\/\s*(\d+)/
    const m = tempo.match(tempoRegex)
    if (!m) {
      console.warn(`Invalid tempo: ${tempo}`)
      return undefined
    }
    const numerator = parseInt(m[1], 10)
    const denominator = parseInt(m[2], 10)
    return { numerator, denominator }
  }

  private parseNotesString(): INote[] {
    return new NotesStringParser(this.state.notesString, {
      octave: this.state.score.meta.key?.octave ?? 4,
    }).parse()
  }
}
