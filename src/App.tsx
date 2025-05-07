import './App.css'
import type { IStaff } from './music/staff/staff'
import type { IMusicScore } from './music/music'
import Stage from './stage/Stage'
import _exampleMusic from './example-musics/example.jianpu.json'
import { useState } from 'react'

const App = () => {
  const [music, setMusic] = useState<IMusicScore>(_exampleMusic as IMusicScore)

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
      <Stage
        titleHtml={music.title}
        keySignature={music.meta.key}
        timeSignature={music.meta.tempo}
        composerHtml={music.meta.composer}
        staff={music.staff as IStaff}
        onTitleChange={handleTitleChange}
        onComposerChange={handleComposerChange}
      />
    </div>
  )
}

export default App
