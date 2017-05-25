// @flow

import React from 'react'

// Stylesheet
import './NoteSelector.css'

// import {Notes} from '../../../Scales/Notes.js'
import type {Note} from '../../../Scales/Notes.js'
import Fretboard from './FretBoard/Fretboard.js'
import _ from 'lodash'
import uuid from 'uuid/v4.js'

type Props = {
    rootNote: Note,
    selectedNotes: Note[],
    tuning: Note[],
    showAllNotes: boolean,
    showAllRootNotes: boolean,
    selectedNotesWithIntervals: []
}

type State = {
  strings: {baseNote: Note, stringId: string}[]
}

class NoteDisplayer extends React.Component {
  props: Props
  state: State

  render () {
    const selectedNotes = _.map(this.props.selectedNotesWithIntervals, (note) => { return {...note, stringID: ''} })

    return <div className='NoteDisplayer'>
      <Fretboard
        strings={_.map(this.props.tuning, baseNote => { return {baseNote, stringId: uuid()} })}
        numFrets={24}
        selectedNotes={selectedNotes}
        rootNote={{note: this.props.rootNote, stringID: ''}}
        showAllRootNotes={this.props.showAllRootNotes}
        showAllNotes={this.props.showAllNotes}
        changeTuning={obj => {}}
        selectableFret={{selectable: false}}
        selectedNotesWithIntervals= {selectedNotes}/>

    </div>
  }

}

export default NoteDisplayer
