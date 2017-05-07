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
    showAllRootNotes: boolean
}

type State = {
  strings: {baseNote: Note, stringId: string}[]
}

class NoteDisplayer extends React.Component {
  props: Props
  state: State

  render () {
    return <div className='NoteDisplayer'>
      <Fretboard
        strings={_.map(this.props.tuning, baseNote => { return {baseNote, stringId: uuid()} })}
        numFrets={24}
        selectedNotes={_.map(this.props.selectedNotes, (note) => { return {note: note, stringID: ''} })}
        rootNote={{note: this.props.rootNote, stringID: ''}}

        noteNotInStringRange={(obj: {note: Note, stringID: string}[]) => {}}
        rootNotInStringRange={(obj: {note: Note, stringID: string}) => {}}
        showAllRootNotes={this.props.showAllRootNotes}
        showAllNotes={this.props.showAllNotes}
        changeTuning={obj => {}}
        selectableFret={{selectable: false}}/>

    </div>
  }

}

export default NoteDisplayer
