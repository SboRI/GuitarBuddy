import React from 'react'

import type {Note} from './../../../../../../Scales/Notes.js'
import {Notes} from './../../../../../../Scales/Notes.js'

// Stylesheet
import './TuningSelector.css'

type Props = {
  baseNote: Note,
  passTuning: (note: Note) => any
}

export default function TuningSelector ({baseNote, passTuning}: Props) {
  const retune = function (note: Note, halfsteps: number) {
    return Notes.transpose(halfsteps)(note)
  }

  return <div className='TuningSelector'>
    <div className='tuneDown-btn' onClick={() => passTuning(retune(baseNote, -1))}>
      <i className="material-icons">keyboard_arrow_down</i>
    </div>
    <div className='tuneUp-btn'onClick={() => passTuning(retune(baseNote, 1))}>
      <i className="material-icons">keyboard_arrow_up</i>
    </div>
  </div>
}
