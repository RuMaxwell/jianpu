import { forwardRef } from 'react'
import './MenuPanel.css'
import { useMemoizedFn } from 'ahooks'

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
  const handleClickImportMarkdown = useMemoizedFn(() => {
    onAction?.(MenuAction.ImportMarkdown)
  })

  const handleClickImportJson = useMemoizedFn(() => {
    onAction?.(MenuAction.ImportJson)
  })

  const handleClickExportMarkdown = useMemoizedFn(() => {
    onAction?.(MenuAction.ExportMarkdown)
  })

  const handleClickExportJSON = useMemoizedFn(() => {
    onAction?.(MenuAction.ExportJson)
  })

  return isOpen ? (
    <ul ref={ref} className='menu-panel'>
      <li className='menu-item' onClick={handleClickImportMarkdown}>
        Import from Jianpu Markdown...
      </li>
      <li className='menu-item' onClick={handleClickImportJson}>
        Import from Jianpu JSON...
      </li>
      <li className='menu-item' onClick={handleClickExportMarkdown}>
        Export as Jianpu Markdown...
      </li>
      <li className='menu-item' onClick={handleClickExportJSON}>
        Export as Jianpu JSON...
      </li>
    </ul>
  ) : (
    <></>
  )
})

export default MenuPanel
