// @flow

import React from 'react'

import _ from 'lodash'

import {Notes} from '../../../../../Scales/Notes.js'
import type {Note} from '../../../../../Scales/Notes.js'

// Components
import Fret from './Fret/Fret.js'
import TuningSelector from './TuningSelector/TuningSelector.js'

// Styles
import './String.css'

type Props = {
    numFrets: number,
    classNames: string,
    tuning: {
        noteValue: number,
        pitch: number
    },
    selectedNotes: {note: Note, stringID: string}[],
    rootNote: ?{note: Note, stringID: string},

    onSelectNote: (note: Note, stringID: string, isSelected: boolean, isRoot: boolean) => void,
    onSelectRoot: (note: Note, stringID: string, isSelected: boolean) => void,
    StringId: string,
    showAllNotes: boolean,
    showAllRootNotes: boolean,
    changeTuning: (obj: {note: Note, stringId: string}) => any,

}

function String ({
  numFrets,
  classNames,
  tuning,
  selectedNotes,
  rootNote,
  onSelectNote,
  onSelectRoot,
  StringId,
  showAllRootNotes,
  showAllNotes,
  changeTuning

}: Props) {
  const notes = []
  for (var i = 0; i <= numFrets; i++) {
    notes.push(Notes.transpose(i)(tuning))
  }


  // In case Tuning was changed: Check if all selectedNotes for thi string are still in the range of notes it can display
  // do it for the selectedNotes

  const onClickFret = function (note, isSelected: boolean, isRoot: boolean) {
    return onSelectNote(note, StringId, isSelected, isRoot)
  }

  const onDoubleClickRoot = function (note, isSelected: boolean) {
    return onSelectRoot(note, StringId, isSelected)
  }

  const isNoteSelected = function (note: Note) {
    if (!showAllNotes) {
      return _.reduce(selectedNotes, (result, selectedNote) => (Notes.equalsStrict(selectedNote.note, note) && selectedNote.stringID === StringId) || result, false)
    }

    return _.reduce(selectedNotes, (result, selectedNote) => Notes.equalsValue(selectedNote.note, note) || result, false)
  }

  const isRootSelected = function (note: Note) {
    if (!rootNote) { return false }
    if (!showAllRootNotes) {
      return Notes.equalsStrict(note, rootNote.note) && rootNote.stringID === StringId
    }
    return Notes.equalsValue(note, rootNote.note)
  }

  const passTuning = function (note: Note) {
    changeTuning({note, stringId: StringId})
  }

  return <div className={'String ' + classNames}>
    <TuningSelector
      baseNote={tuning}
      passTuning={passTuning}/>
    {_.map(notes, (note, index, collection) => (<Fret
      note={note}
      onClick={onClickFret}
      onDoubleClick={onDoubleClickRoot}
      selected={isNoteSelected(note)}
      rootNote={isRootSelected(note)}
      key={'' + note.noteValue + note.pitch}
      classNames={index === 0
        ? 'Fret-zeroFret'
        : index === collection.length - 1
        ? 'Fret-last'
        : ''
      }/>))
    }

  </div>
}

export default String
