# Change log

## Version 0.0.5-alpha

### Features

+ Slurs (curved lines above notes) (single layer only)

### Fixes

- Fix a bug where the editor could not be focused to start edit when there was no note.

## Version 0.0.4-alpha

### Features

+ Pitch shifting of the whole score (a half note at a time).

### Fixes

- Fix a bug where extra commas appeared between `h`, `l`, and `/` symbols when exporting music as Jianpu Markdown file.
- Fix a bug where notes were still in the oldest version even though they had been modified when exporting music as Jianpu Markdown file.

## Version 0.0.3-alpha

### Features

+ Now you can edit title and composer in the editor (in HTML)

+ Import music from Jianpu Markdown file
+ Import music from Jianpu JSON file
+ Export music as Jianpu Markdown file
+ Export music as Jianpu JSON file

## Version 0.0.2-alpha

### Features

+ Support custom HTML content in text properties (currently only `title`, `meta.composer`)

+ Jianpu Markdown
  + Support parsing HTML script in `title` and `meta.composer` property values

## Version 0.0.1-alpha

### Features

+ Jianpu Markdown parser

### Examples

+ Added the first Jianpu Markdown example.

## Version 0.0.0-alpha

### Features

+ WYSIWYG staff editor
  + Display music title, key and time signature, and the author
  + Display *jianpu* staff
    + Display pitch notes
      + Display octave dots
      + Display half duration lines
      + Display accidentals
    + Display rest notes
    + Display dots and dashes
    + Display bar lines
  + Edit *jianpu* staff
    + Navigation
      + Display cursor position
      + Keyboard Left/Right arrow as the basic method to navigate the cursor
    + Input and change
      + Insert pitch notes
      + Insert octave dots
      + Insert half duration lines
      + Insert accidentals
      + Insert rest notes
      + Insert dots and dashes
      + Insert bar lines
      + Delete notes

### Examples

+ Added the first JSON example.
