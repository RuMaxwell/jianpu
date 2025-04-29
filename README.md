# Jianpu Editor

A simple WYSIWYG *jianpu* editor, currently just an experimental project.

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Roadmap

- [x] Display music title, key and time signature, and the author
- [ ] Display *jianpu* staff
  - [x] Display pitch notes
    - [x] Display octave dots
    - [x] Display half duration lines
    - [x] Display accidentals
  - [x] Display rest notes
  - [x] Display dots and dashes
  - [x] Display bar lines
  - [ ] Merge the half lines of consecutive 8/16/32...th notes
  - [ ] Horizontally stretch and align to both ends, preventing wrap inside a bar.
- [ ] WYSIWYG staff editor
  - [ ] Edit music title, key and time signature, and the author
  - [ ] Edit *jianpu* staff
    - [ ] Navigation
      - [x] Display cursor position
      - [x] Keyboard Left/Right arrow as the basic method to navigate the cursor
      - [ ] Keyboard Up/Down arrow to move the cursor vertically
      - [ ] Click on the staff to navigate the cursor
    - [ ] Input and change
      - [x] Insert pitch notes
      - [x] Insert octave dots
      - [x] Insert half duration lines
      - [x] Insert accidentals
      - [x] Insert rest notes
      - [x] Insert dots and dashes
      - [x] Insert bar lines
      - [x] Delete notes
      - [ ] Attach slurs

## Editor Usage

### Start editing

Click on the staff to enter edit mode.

### Navigate the cursor

Use keyboard <kbd>←</kbd>/<kbd>→</kbd> arrow keys to navigate the cursor around the staff.

### Insert a note

#### Insert a pitch note

Type number <kbd>1</kbd>~<kbd>7</kbd> to insert a pitch note. The corresponding sing notes are:

| *jianpu* note | sing note |
| --- | --- |
| 1 | Do |
| 2 | Re |
| 3 | Mi |
| 4 | Fa |
| 5 | Sol |
| 6 | La |
| 7 | Si |

#### Change the octave of a pitch note

The default octave of a pitch note is the octave that the Middle C is in (the 4th group). Note that *jianpu* is a relative staff notation, so `1` is not always equal to `C4`, but you can see it as a shifted `C4`.

> e.g. When a note in standard notation is `G4` and the key of the song is in G, the note in *jianpu* is written as `1`.

If you want to shift the octave of a pitch note higher or lower, put the cursor next to the note, and press <kbd>h</kbd> to shift an octave **h**igher, or <hbd>l</kbd> to shift an octave **l**ower. These can be applied multiple times and they add dots to the top or bottom of the note.

> e.g. `2h` means `D5` and `6ll` means `A2`.

#### Change the duration of a pitch note

The default duration of a pitch note is a quarter.

To shorten a note, put the cursor next to it and press <kbd>/</kbd> to divide it by 2. It can be applied multiple times. So `/` makes it an eighth note, and `//` makes it a sixteenth note, and so on. Each `/` will add an underline (a *half (duration) line*) to the note.

In the current version, a note with half lines are treated as a whole when deleting.

To lengthern a note, put the cursor next to it and press <kbd>-</kbd> to stretch it by a quarter. In *jianpu*, `1-`, `1--`, `1---` are the ways to represent a half note, a dotted half note, and a whole note. And it does visually add a hyphen next to a note.

> You can add `-` after a pitch note, a rest note (introduced later), and another `-`. You can not add `-` after a dot `.` or another thing.
> In the current version, you can add `-` after a eighth or minor duration note, which generally is not used in *jianpu*.

#### Attach an accidental to a pitch note

You can add a sharp (♯), flat (♭), or natural (♮) accidental to a pitch note.

To add any of these, put the cursor next to the note, and press:

- <kbd>#</kbd> for ♯
- <kbd>b</kbd> for ♭
- <kbd>n</kbd> for ♮

In the current version, a note with an accidental are treated as a whole when deleting.

#### Insert a rest note

Type number <kbd>0</kbd> to insert a rest note.

You can use half lines and dash lines to change the duration of a rest note, but you can not use accidentals or octave dots on it.

#### Insert a bar line

Despite there is a time signature that can be configured, bar lines are manually inserted so that you can freely control them.

To insert a bar line, put the cursor at the position where you want to insert it, and press <kbd>|</kbd> (<kbd>Shift</kbd>+<kbd>\\</kbd>).

If you press <kbd>|</kbd> next to a bar line, it will change to a final bar line.

If you press <kbd>|</kbd> next to a `:` text note, it will change to a repeat bar line, and press <kbd>|</kbd> again will change it to a final repeat bar line.

#### Delete a note, or a thing

Put the cursor next to the thing you want to delete, and press <kbd>Backspace</kbd>.
