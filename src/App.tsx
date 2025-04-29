import './App.css'
import type { IKeySignature } from './music/meta/musicMeta'
import type { IStaff } from './music/staff/staff'
import Stage from './stage/Stage'
import exampleMusic from './example-musics/example.jianpu.json'

const App = () => {
  return (
    <div className='content'>
      <Stage
        title={exampleMusic.title}
        keySignature={exampleMusic.meta.keySignature as IKeySignature}
        timeSignature={exampleMusic.meta.timeSignature}
        composer={exampleMusic.meta.composer}
        staff={exampleMusic.staff as IStaff}
      />
    </div>
  )
}

export default App
