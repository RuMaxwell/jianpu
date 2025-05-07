import type { IMusicScore } from './music/music'

import { useState } from 'react'
import './App.css'
import Stage from './stage/Stage'
import Menu from './menu/Menu'
import _exampleMusic from './example-musics/example.jianpu.json'
import { JianpuMarkdownParser } from './jianpu-markdown/parser'
import { createAndDownloadFile } from './utils/download'
import { HtmlParser } from './jianpu-markdown/htmlParser'
import { jianpuJsonObjectToMarkdown } from './jianpu-markdown/jsonToMarkdown'

const App = () => {
  const [music, setMusic] = useState<IMusicScore>(_exampleMusic as IMusicScore)

  function handleFileImported(fileType: 'markdown' | 'json', content: string) {
    if (fileType === 'markdown') {
      const importedMusic = JianpuMarkdownParser.instance.parse(content)
      console.log('Markdown imported:', importedMusic)
      setMusic(importedMusic)
    } else {
      try {
        const importedMusic: IMusicScore = JSON.parse(content)
        console.log('JSON imported:', importedMusic)
        setMusic(importedMusic)
      } catch (e) {
        console.error(e)
        handleFileImportError(`${e}`)
      }
    }
  }

  function handleFileImportError(errorMessage: string) {
    console.error(errorMessage)
  }

  function handleExportRequest(format: 'markdown' | 'json') {
    const titleText = music.title
      ? new HtmlParser(music.title).parseToDom().textContent
      : `music-${Date.now()}`
    if (format === 'json') {
      const json = JSON.stringify(music)
      createAndDownloadFile(
        json,
        'application/json',
        `${titleText}.jianpu.json`,
      )
    } else {
      // format === markdown
      const markdown = jianpuJsonObjectToMarkdown(music)
      createAndDownloadFile(markdown, 'text/plain', `${titleText}.jianpumd`)
    }
  }

  function handleAddTitle() {
    if (music.title) {
      return
    }
    setMusic({
      ...music,
      title: 'Edit Title',
    })
  }

  function handleAddComposer() {
    if (music.meta?.composer) {
      return
    }
    setMusic({
      ...music,
      meta: {
        ...music.meta,
        composer: 'Composer: Edit Composer',
      },
    })
  }

  function handleTitleChange(value: string) {
    setMusic({
      ...music,
      title: value,
    })
  }

  function handleComposerChange(value: string) {
    setMusic({
      ...music,
      meta: {
        ...music.meta,
        composer: value,
      },
    })
  }

  return (
    <div className='content'>
      <Menu
        onFileImported={handleFileImported}
        onFileImportError={handleFileImportError}
        onExportRequest={handleExportRequest}
        onAddTitle={handleAddTitle}
        onAddComposer={handleAddComposer}
      />

      <Stage
        titleHtml={music.title}
        keySignature={music.meta.key}
        timeSignature={music.meta.tempo}
        composerHtml={music.meta.composer}
        staff={music.staff}
        onTitleChange={handleTitleChange}
        onComposerChange={handleComposerChange}
      />
    </div>
  )
}

export default App
