import type { MaybePromise } from '../utils/types'
import { ChangeEvent, useRef, useState } from 'react'
import MenuButton from './MenuButton'
import MenuPanel, { MenuAction } from './MenuPanel'
import { useClickAway, useMemoizedFn } from 'ahooks'

export default function Menu({
  beforeSelectFileToImport,
  onFileImported,
  onFileImportError,
  onExportRequest,
  onAddTitle,
  onAddComposer,
}: {
  /** Returns `cancel` to cancel file selection. */
  beforeSelectFileToImport?: () => MaybePromise<'cancel' | undefined>
  onFileImported?: (fileType: 'markdown' | 'json', content: string) => void
  onFileImportError?: (errorMessage: string) => void
  onExportRequest?: (format: 'markdown' | 'json') => void
  onAddTitle?: () => void
  onAddComposer?: () => void
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const handleMenuButtonClick = useMemoizedFn((open: boolean) => {
    setMenuIsOpen(open)
  })

  const handleMenuAction = useMemoizedFn(async (action: MenuAction) => {
    switch (action) {
      case MenuAction.ImportMarkdown:
        if ((await beforeSelectFileToImport?.()) === 'cancel') {
          return
        }
        markdownFileInputRef.current?.click()
        break
      case MenuAction.ImportJson:
        if ((await beforeSelectFileToImport?.()) === 'cancel') {
          return
        }
        jsonFileInputRef.current?.click()
        break
      case MenuAction.ExportMarkdown:
        onExportRequest?.('markdown')
        break
      case MenuAction.ExportJson:
        onExportRequest?.('json')
        break
    }

    setMenuIsOpen(false)
  })

  const menuButtonRef = useRef<HTMLDivElement>(null)
  const menuPanelRef = useRef<HTMLUListElement>(null)

  useClickAway(() => {
    if (!menuIsOpen) {
      return
    }
    setMenuIsOpen(false)
  }, [menuButtonRef, menuPanelRef])

  const markdownFileInputRef = useRef<HTMLInputElement>(null)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      return
    }

    const file = e.target.files[0]
    e.target.value = ''

    const fileReader = new FileReader()

    fileReader.onload = () => {
      const text = fileReader.result as string
      onFileImported?.(
        file.name?.endsWith('.jianpu.json') ? 'json' : 'markdown',
        text,
      )
    }

    fileReader.onerror = () => {
      onFileImportError?.(`${fileReader.error}`)
    }

    fileReader.readAsText(file, 'utf-8')
  })

  return (
    <>
      <MenuButton
        ref={menuButtonRef}
        isActive={menuIsOpen}
        onClick={handleMenuButtonClick}
        onAddTitle={onAddTitle}
        onAddComposer={onAddComposer}
      />
      <MenuPanel
        ref={menuPanelRef}
        isOpen={menuIsOpen}
        onAction={handleMenuAction}
      />
      <input
        ref={markdownFileInputRef}
        style={{ display: 'none' }}
        type='file'
        multiple={false}
        accept='.jianpumd'
        onChange={handleFileChange}
      />
      <input
        ref={jsonFileInputRef}
        style={{ display: 'none' }}
        type='file'
        multiple={false}
        accept='.json'
        onChange={handleFileChange}
      />
    </>
  )
}
