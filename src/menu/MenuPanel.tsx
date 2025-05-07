import { forwardRef } from 'react'
import './MenuPanel.css'

export enum MenuAction {
  ImportMarkdown,
  ImportJson,
  ExportMarkdown,
  ExportJson,
}

const MenuPanel = forwardRef<
  HTMLUListElement,
  {
    isOpen?: boolean
    onAction?: (action: MenuAction) => void
  }
>(({ isOpen, onAction }, ref) => {
  function handleClickImportMarkdown() {
    onAction?.(MenuAction.ImportMarkdown)
  }

  function handleClickImportJson() {
    onAction?.(MenuAction.ImportJson)
  }

  function handleClickExportMarkdown() {
    onAction?.(MenuAction.ExportMarkdown)
  }

  function handleClickExportJSON() {
    onAction?.(MenuAction.ExportJson)
  }

  return isOpen ? (
    <ul ref={ref} className='menu-panel'>
      <li className='menu-item' onClick={handleClickImportMarkdown}>
        Import from Jianpu Markdown...
      </li>
      <li className='menu-item' onClick={handleClickImportJson}>
        Import from Jianpu JSON...
      </li>
      <li className='menu-item' onClick={handleClickExportMarkdown}>
        Export to Jianpu Markdown...
      </li>
      <li className='menu-item' onClick={handleClickExportJSON}>
        Export to Jianpu JSON...
      </li>
    </ul>
  ) : (
    <></>
  )
})

export default MenuPanel
