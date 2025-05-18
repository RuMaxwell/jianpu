import { useState } from 'react'
import './App.css'
import { Note, type IMusicScore } from './music/music'
import { type INote, type IStaff } from './music/staff/staff'
import Stage from './stage/Stage'
import Menu from './menu/Menu'
import _exampleMusic from './example-musics/example.jianpu.json'
import { JianpuMarkdownParser } from './jianpu-markdown/parser'
import { createAndDownloadFile } from './utils/download'
import { HtmlParser } from './jianpu-markdown/htmlParser'
import { jianpuJsonObjectToMarkdown } from './jianpu-markdown/jsonToMarkdown'
import { useMemoizedFn } from 'ahooks'
import Dialog from './dialog/Dialog'
import { useDialog } from './dialog/useDialog'

const App = () => {
  const [music, setMusic] = useState<IMusicScore>(_exampleMusic as IMusicScore)
  const [newStaff, setNewStaff] = useState<IStaff>(
    _exampleMusic.staff as IStaff,
  )

  const { isOpen, open: openDialog, close: closeDialog, message } = useDialog()
  const [dialogPendingOn, setDialogPendingOn] = useState<
    | null
    | 'replace-title'
    | 'replace-composer'
    | { type: 'import'; resolve: (should: 'cancel' | undefined) => void }
  >(null)

  const handleStaffNotesChange = useMemoizedFn((value: INote[]) => {
    setMusic({
      ...music,
      staff: {
        ...music.staff,
        notes: value,
      },
    })
  })

  const beforeSelectFileToImport = useMemoizedFn(
    () =>
      new Promise<'cancel' | undefined>((resolve) => {
        if (
          music.title.trim() ||
          music.meta.composer?.trim() ||
          music.meta.key ||
          music.meta.tempo ||
          music.staff.notes.length
        ) {
          openDialog('Replacing the music score, continue?')
          setDialogPendingOn({ type: 'import', resolve })
          return
        }
      }),
  )

  const continueSelectFileToImport = useMemoizedFn(() => {
    ;(
      dialogPendingOn as { resolve: (should: 'cancel' | undefined) => void }
    ).resolve(undefined)
  })

  const cancelSelectFileToImport = useMemoizedFn(() => {
    ;(
      dialogPendingOn as { resolve: (should: 'cancel' | undefined) => void }
    ).resolve('cancel')
  })

  const handleFileImported = useMemoizedFn(
    (fileType: 'markdown' | 'json', content: string) => {
      if (fileType === 'markdown') {
        const importedMusic = JianpuMarkdownParser.instance.parse(content)
        console.log('Markdown imported:', importedMusic)
        setMusic(importedMusic)
        setNewStaff(importedMusic.staff)
      } else {
        try {
          const importedMusic: IMusicScore = JSON.parse(content)
          console.log('JSON imported:', importedMusic)
          setMusic(importedMusic)
          setNewStaff(importedMusic.staff)
        } catch (e) {
          console.error(e)
          handleFileImportError(`${e}`)
        }
      }
    },
  )

  const handleFileImportError = useMemoizedFn((errorMessage: string) => {
    console.error(errorMessage)
  })

  const handleExportRequest = useMemoizedFn((format: 'markdown' | 'json') => {
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
  })

  const handleAddTitle = useMemoizedFn(() => {
    if (music.title.trim()) {
      openDialog('Replacing current title, continue?')
      setDialogPendingOn('replace-title')
      return
    }
    replaceWithDefaultTitle()
  })

  const replaceWithDefaultTitle = useMemoizedFn(() => {
    setMusic({
      ...music,
      title: 'Edit Title',
    })
  })

  const handleAddComposer = useMemoizedFn(() => {
    if (music.meta.composer?.trim()) {
      openDialog('Replacing current composer, continue?')
      setDialogPendingOn('replace-composer')
      return
    }
    replaceWithDefaultComposer()
  })

  const replaceWithDefaultComposer = useMemoizedFn(() => {
    setMusic({
      ...music,
      meta: {
        ...music.meta,
        composer: 'Composer: Edit Composer',
      },
    })
  })

  const handleTitleChange = useMemoizedFn((value: string) => {
    setMusic({
      ...music,
      title: value,
    })
  })

  const handleComposerChange = useMemoizedFn((value: string) => {
    setMusic({
      ...music,
      meta: {
        ...music.meta,
        composer: value,
      },
    })
  })

  const handleDialogConfirm = useMemoizedFn(() => {
    closeDialog()
    switch (dialogPendingOn) {
      case 'replace-title':
        replaceWithDefaultTitle()
        break
      case 'replace-composer':
        replaceWithDefaultComposer()
        break
      default:
        if (dialogPendingOn?.type === 'import') {
          continueSelectFileToImport()
        }
    }
  })

  const handleDialogCancel = useMemoizedFn(() => {
    closeDialog()
    if ((dialogPendingOn as any)?.type === 'import') {
      cancelSelectFileToImport()
    }
  })

  return (
    <div className='content'>
      <Menu
        beforeSelectFileToImport={beforeSelectFileToImport}
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
        newStaff={newStaff}
        onTitleChange={handleTitleChange}
        onComposerChange={handleComposerChange}
        onNotesChange={handleStaffNotesChange}
      />

      <Dialog
        isOpen={isOpen}
        message={message}
        onClose={handleDialogCancel}
        onConfirm={handleDialogConfirm}
      />
    </div>
  )
}

export default App
