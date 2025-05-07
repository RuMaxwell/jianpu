export function createAndDownloadFile(
  content: string,
  mimetype: string,
  filename: string,
): void {
  const blob = new Blob([content], {
    type: mimetype,
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
