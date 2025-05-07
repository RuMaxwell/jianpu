import { ChangeEvent, useRef, useState } from 'react'
import MenuButton from './MenuButton'
import MenuPanel, { MenuAction } from './MenuPanel'
import { useClickAway } from 'ahooks'

export default function Menu({
  onFileImported,
  onFileImportError,
}: {
  onFileImported?: (fileType: 'markdown' | 'json', content: string) => void
  onFileImportError?: (errorMessage: string) => void
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  function handleMenuButtonClick(open: boolean) {
    setMenuIsOpen(open)
  }

  function handleMenuAction(action: MenuAction) {
    switch (action) {
      case MenuAction.ImportMarkdown:
        markdownFileInputRef.current?.click()
        break
      case MenuAction.ImportJson:
        jsonFileInputRef.current?.click()
        break
      case MenuAction.ExportMarkdown:
        break
      case MenuAction.ExportJson:
        break
    }

    setMenuIsOpen(false)
  }

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

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
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
  }

  return (
    <>
      <MenuButton
        ref={menuButtonRef}
        isActive={menuIsOpen}
        onClick={handleMenuButtonClick}
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
