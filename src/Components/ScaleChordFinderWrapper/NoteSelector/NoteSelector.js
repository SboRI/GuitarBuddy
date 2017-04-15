// @flow

import React from 'react'
import {Notes} from '../../../Scales/Notes.js'
import type {Note} from '../../../Scales/Notes.js'
import Fretboard from './FretBoard/Fretboard.js'
import _ from 'lodash'
// import {Scale} from '../../../Scales/Scales.js'
// import NoteDisplayer from './NoteDisplayer.js'

type Props = {
  getSelectedNotes: (obj: {
    rootNote: Note,
    selectedNotes: Note[],
    tuning: Note[]
  }) => any,
}

type NoteWithID = {note: Note, stringID: string}

type State = {
    numFrets: number,

    rootNote: ?NoteWithID,
    selectedNotes: NoteWithID[],
    showAllRootNotes: boolean,
    showAllNotes: boolean,
    tuning: Note[]
}

const defaultTuning = _.map(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'], note => Notes.fromString(note))

class NoteSelector extends React.Component {

  state: State

  constructor (props: Props) {
    // real stuff
    super(props)
    this.state = {
      numFrets: 24,

      rootNote: null,
      selectedNotes: [],
      // Determines if selection of a note marks all note swith the same notevalue (tone, e.g. C, D, A#) as selected
      showAllRootNotes: false,
      showAllNotes: false,
      tuning: defaultTuning
    }
  }

  isNoteInArray (noteArray: NoteWithID[], {note, stringID}: NoteWithID): boolean {
    return _.reduce(noteArray, (acc, noteFromArray) => _.isEqual(noteFromArray, {note, stringID}) || acc, false)
  }

  addSelectedNoteUnique (noteArray: NoteWithID[], {note, stringID}: NoteWithID): NoteWithID[] {
    const isInArray = this.isNoteInArray(noteArray, {note, stringID})
    if (isInArray) {
      return noteArray
    } else {
      return [...noteArray, {note, stringID}]
    }
  }

  removeSelectedNote (noteArray: NoteWithID[], {note, stringID}: NoteWithID): NoteWithID[] {
    return _.filter(noteArray, (noteInArray) => !_.isEqual(noteInArray, {note, stringID}))
  }

  onSelectNote (note: Note, stringID: string, isSelected: boolean, isRoot: boolean) {
    let rootNote = this.state.rootNote
    let selectedNotes = this.state.selectedNotes
    switch (true) {
      case (isRoot === false && isSelected === false):
        selectedNotes = this.addSelectedNoteUnique(this.state.selectedNotes, {note, stringID})
        break
      case (isRoot === false && isSelected === true):
        selectedNotes = this.removeSelectedNote(this.state.selectedNotes, {note, stringID})
        break
      case (isRoot === true):
        rootNote = null
        selectedNotes = this.removeSelectedNote(this.state.selectedNotes, {note, stringID})
        break
      default:
        break
    }
    this.setStateAndPassToParent({
      selectedNotes,
      rootNote
    })
  }

  onSelectRoot (root: Note, stringID: string, isSelected: boolean) {
    // remove the old root note from the selectedNotes
    let selectedNotes = this.state.rootNote
      ? this.removeSelectedNote(this.state.selectedNotes, this.state.rootNote)
      : this.state.selectedNotes

    // remove the new root note from the selectedNotes
    selectedNotes = this.removeSelectedNote(selectedNotes, {note: root, stringID})

    this.setStateAndPassToParent({
      selectedNotes,
      rootNote: {note: root, stringID}
    })
  }

  setStateAndPassToParent ({rootNote, selectedNotes, tuning}: {rootNote: ?NoteWithID, selectedNotes: NoteWithID[], tuning?: Note[]}) {
    this.setState({
      rootNote,
      selectedNotes,
      tuning: tuning || this.state.tuning
    },
    this.props.getSelectedNotes({
      rootNote: rootNote ? rootNote.note : null,
      selectedNotes: _.map(selectedNotes, (noteWithID) => noteWithID.note),
      tuning: this.state.tuning
    })
  )
  }

  render () {
    return <div>
      <Fretboard
        tuning={this.state.tuning}
        numFrets={24}
        selectedNotes={this.state.selectedNotes}
        rootNote={this.state.rootNote}
        onSelectNote={this.onSelectNote.bind(this)}
        onSelectRoot={this.onSelectRoot.bind(this)}
        showAllRootNotes={this.state.showAllRootNotes}
        showAllNotes={this.state.showAllNotes}
      />

    </div>
  }
}

export default NoteSelector
