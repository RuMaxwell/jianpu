# Jianpu Markdown Tutorial

Jianpu Markdown is a Markdown-like language that uses an intuitive grammar to represent Jianpu music scores. The grammar is both intuitive in reading and writing, just like the Markdown language.

Jianpu Markdown files are compiled to JSON representations. To know what the properties do in the editor, you should check the documentations of the editor components that use those properties.

Take an example from [the examples](../../src/example-musics/) (pick a file ends with `.jianpumd`) to grab some feeling of the Jianpu Markdown language.

## Structure

A Jianpu Markdown file consists of many properties, each of which has two components:

- Property name
- Property value

so it is basically a configuration file. You have several ways to write a property:

1. write property name and value within a line;
2. write property name in a line, and spread property value across multiple lines.

Let's use some examples from [example.jianpumd](../../src/example-musics/example.jianpumd):

The first line,

```
# Version: 0.0.0-alpha
```

is a property `Version` with value `0.0.0-alpha`. If written in JSON, it would be `"Version": "0.0.0-alpha"`. Note that property names are case-insensitive, so `version`, `Version`, `VERSION` refer to the same property.

> A property name can only contain English letters (`A-Z`, `a-z`), number digits (`0-9`), underscores (`_`), and hyphens (`-`). It can start with any of these symbols.

The leading `#` symbol is the key to know that this line defines a property. Instead of `#`, you can also use `-` to define a property, but in a nested layer. We say `#` leads a *main* property, and `-` leads a *sub* property. In the current version, Jianpu Markdown only have these two layers.

The next (non-empty) line,

```
# Title
```

declares the name of a main property. It does not have a `:` within the line so we know its value should come after this line. When we have this kind of main property, the lines below until the next main property or the end of file are all *children* of this main property. By saying chilren, a main property can have many sub properties and only one value (but can spread to multiple lines). If a child line is not a sub property, that it belongs to the value.

> If you happen to have a line of value that have an embedded `:` symbol, you can use `::` to escape it. If you are writing the value in the same line with the property name (with a former `:` indicating the separation between name and value), you do not have to escape the `:`s in the value.

For the `Title` property, because in line 7 there is another main property, the only child of it is a line of value, i.e. `天空之城（bB调单簧管）`, so the value of `Title` is literally the string content.

For the `Meta` main property, we have three sub properties, `key`, `tempo`, and `composer`. Every sub property resembles with the `Version` main property, they directly have the value in the line. Thus it basically represents the following JSON property:

```json
"Meta": {
  "key": "B b",
  "tempo": "4 / 4",
  "composer": "作曲：久石让"
}
```

But this is not the end. Before being used by the Jianpu editor, the values are parsed to dedicated structures to let the editor understand them. The final structure matches the correponding points in [the JSON example](../../src/example-musics/example.jianpu.json). This brings us the concept of *predefined properties*, properties that the Jianpu Markdown parser knows to be special. In fact, currently all meaningful properties are predefined, and using undefined property name does not do anything and triggers a warning. In the future, plugins may make use of custom property names and supply their own parser for the values.

> Usually, a main property either has only sub properties or only a string value, because a JSON value also can not be a string and an object at the same time. However, the syntax of Jianpu Markdown actually allows this by mixing them. You should expect that this will be properly transformed into JSON format in a predictable way in the future.

Let's move on to the `Staff` main property, which only has the `Notes` sub property. Below it, we have many lines of values. These values belong to the `Notes` sub property instead of the `Staff` main property, so they are the children of the sub property. They will be joined together (ignoring empty lines if there are some) and form a single string value. Then, because our parser knows how to parse notes, they will become the notes and barlines that we can see in the editor.
 
## Syntax of the Predefined Values

In Jianpu Markdown, whitespaces (except for line breaks) are ignored whenever removing it does not stick things together. This also applies to some predefined property values. Predefined properties like `version` are plain text and whitespaces are preserved. Properties like `title` and `meta.composer` (the `composer` sub property of `meta` property) have HTML values so whitespaces follow the rule of the browser that renders the HTML. Other properties (currently) ignore insignificant whitespaces. e.g. For `meta.key` property, both `B b` and `Bb` means the same; for `meta.tempo` property, both `4 / 4` and `4/4` means the same.

What really determines the behavior is the parser used to parse the value. For `version`, we use the plain text parser (no parser). For `title` and `meta.composer`, we use the `HTML` parser. For `meta.key`, we use the `KeySignature` parser. For `meta.tempo`, we use the `TimeSignature` parser. To remove the barrier, a table of the predefined properties with their parsers are provided below:

| Property Name | Parser | Whitespace |
| --- | --- | --- |
| version | plain text | significant |
| title | HTML | HTML |
| meta.key | KeySignature | insignificant |
| meta.tempo | TimeSignature | insignificant |
| meta.composer | HTML | HTML |
| staff.notes | StaffNotes | insignificant |

> In the current version, `meta` and `staff` does not allow a direct value, so they are not on the list.

> For people who also reads the source code of this project: the parser names listed above do not have to be the same with the names of the functions used to implement the parser.

Now let's dig into the syntax of the special parsers.

### HTML parser

Only a set of HTML tags and attributes are allowed and will affect the output. Those are:

- Tags
  - `b`
  - `code`
  - `div`
  - `i`
  - `span`
  - `strong`
  - `sub`
  - `sup`
- Tags that are not allowed to have children
  - `br`
- Attributes
  - `style`

### KeySignature syntax for `meta.key` property

The syntax of a key signature is like writing a quarter note. You can specify the pitch, the accidental, and the octave. The syntax is:

```
<pitch> [accidental] [octave]
```

e.g. `A`, `Bb`, `C#3`.

Whitespaces are insignificant between the components.

### TimeSignature syntax for `meta.tempo` property

The syntax of a time signature is like this:

```
<numerator> / <denominator>
```

Both the numerator and the denominator are integer numbers. For a music that have 6 eighth notes in a bar, you can write `6 / 8`.

Whitespaces are insignificant between the components.

### StaffNotes syntax for `staff.notes` property

Writing staff notes is the same as entering the notes from the editor. So you can use `1`-`7` to input pitches, `#`, `b`, and `n` to attach accidentals, `l` and `h` to shift octaves, `0` to input rests, `/` to halve the note before, `.` and `-` to lengthen the note, `:` and `|` to set bar lines, etc.

All whitespaces are insignificant, including the line breaks because all value lines are joined together.

The examples often write the notes in a clear pattern that aligns the bar lines in columns (only when in a monospaced font). You don't have to do this, but if you want to gain the benefit that the notes in Jianpu Markdown can also be easily readable, it worth some time to do this. (Or use a formatter, who knows?)
