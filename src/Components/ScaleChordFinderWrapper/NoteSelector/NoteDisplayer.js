// @flow

import React from 'react'
// import {Notes} from '../../../Scales/Notes.js'
import type {Note} from '../../../Scales/Notes.js'
import Fretboard from './FretBoard/Fretboard.js'
import _ from 'lodash'

type Props = {
    rootNote: Note,
    selectedNotes: Note[],
    tuning: Note[],
    showAllNotes: boolean,
    showAllRootNotes: boolean
}

class NoteDisplayer extends React.Component {
  props: Props

  render () {
    return <div>
      <Fretboard
        tuning={this.props.tuning}
        numFrets={24}
        selectedNotes={_.map(this.props.selectedNotes, (note) => { return {note: note, stringID: ''} })}
        rootNote={{note: this.props.rootNote, stringID: ''}}
        onSelectNote={(note: Note, stringID: string, isSelected: boolean, isRoot: boolean) => {}}
        onSelectRoot={(note: Note, stringID: string, isSelected: boolean) => {}}
        showAllRootNotes={this.props.showAllRootNotes}
        showAllNotes={this.props.showAllNotes}/>

    </div>
  }

}

export default NoteDisplayer
