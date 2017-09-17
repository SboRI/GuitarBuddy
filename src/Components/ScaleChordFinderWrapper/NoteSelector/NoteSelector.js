// @flow

import * as React from 'react';

// Stylesheet
import './NoteSelector.css'

// Libraries
import _ from 'lodash'
import uuid from 'uuid/v4.js'

// Models/Business logic
import {Notes} from '../../../Scales/Notes.js'
import type {Note} from '../../../Scales/Notes.js'
// import {Scale} from '../../../Scales/Scales.js'

// Components
import Fretboard from './FretBoard/Fretboard.js'
import FretboardConfig from './FretboardConfig/FretboardConfig.js'
// import NoteDisplayer from './NoteDisplayer.js'

// Flow types
type Props = {
  getSelectedNotes: (obj: {
    rootNote: ?Note,
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
    tuning: Note[],
    strings: {baseNote: Note, stringId: string}[]
}

// Defaults
const defaultTuning = _.map(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'], note => Notes.fromString(note))

class NoteSelector extends React.Component<Props, State> {
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
      tuning: defaultTuning,
      strings: _.map(defaultTuning, note => { return {baseNote: note, stringId: uuid()} })
    };

    // bindings
    (this: any).onSelectNote = this.onSelectNote.bind(this);
    (this: any).onSelectRoot = this.onSelectRoot.bind(this);
    (this: any).onChangeTuning = this.onChangeTuning.bind(this);
    (this: any).onChangeStringNumber = this.onChangeStringNumber.bind(this)
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    this.props.getSelectedNotes({
      rootNote: this.state.rootNote ? this.state.rootNote.note : null,
      selectedNotes: _.map(this.state.selectedNotes, note => note.note),
      tuning: this.state.tuning
    })
  }

  shouldComponentUpdate (nextProps: Props, nextState: State) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState))
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
    this.setState({
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

    this.setState({
      selectedNotes,
      rootNote: {note: root, stringID}
    })
  }

  onChangeTuning ({note, stringId}: {note: Note, stringId: string}) {
    const newStrings = _.map(this.state.strings,
      (string) => {
        return string.stringId === stringId
      ? {baseNote: note, stringId}
    : string
      })
    this.setState({rootNote: null, selectedNotes: [], strings: newStrings, tuning: _.map(newStrings, string => string.baseNote)})
  }

  onChangeStringNumber (action: 'INC' | 'DEC'): void {
    let newState = {}
    switch (action) {
      case 'INC':
        const lowestStringNote = _.head(this.state.strings).baseNote
        const baseNote = Notes.transpose(-5)(lowestStringNote)
        const newString = {baseNote, stringId: uuid()}
        newState = {
          strings: [newString, ...this.state.strings],
          tuning: _.map([newString, ...this.state.strings], (string) => string.baseNote)
        }
        break
      case 'DEC':
        const [stringToRemove, ...remainingStrings] = this.state.strings
        const removedSelectedNotes = _.filter(this.state.selectedNotes,
          (note) => note.stringID !== stringToRemove.stringId)
        newState = {
          selectedNotes: removedSelectedNotes,
          strings: remainingStrings,
          tuning: _.map(remainingStrings, (string) => string.baseNote)
        }
        break
      default:
        console.log(Error)
    }
    this.setState(newState)
  }

  render () {
    return <div className='NoteSelector'>
      <FretboardConfig onIncDec={this.onChangeStringNumber}/>
      <Fretboard
        strings={this.state.strings}
        numFrets={this.state.numFrets}
        changeTuning={this.onChangeTuning}
        selectedNotes={this.state.selectedNotes}
        rootNote={this.state.rootNote}
        showAllRootNotes={this.state.showAllRootNotes}
        showAllNotes={this.state.showAllNotes}
        selectableFret={{
          selectable: true,
          onClick: this.onSelectNote,
          onDoubleClick: this.onSelectRoot
        }}

      />

    </div>
  }
}

export default NoteSelector
