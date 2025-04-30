import './App.css'
import type { IStaff } from './music/staff/staff'
import type { IMusicScore } from './music/music'
import Stage from './stage/Stage'
import _exampleMusic from './example-musics/example.jianpu.json'
const exampleMusic = _exampleMusic as IMusicScore

const App = () => {
  return (
    <div className='content'>
      <Stage
        title={exampleMusic.title}
        keySignature={exampleMusic.meta.key}
        timeSignature={exampleMusic.meta.tempo}
        composer={exampleMusic.meta.composer}
        staff={exampleMusic.staff as IStaff}
      />
    </div>
  )
}

export default App
