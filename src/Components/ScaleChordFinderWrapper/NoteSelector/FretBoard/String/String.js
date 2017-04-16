// @flow

import React from 'react'
import Fret from './Fret/Fret.js'
import _ from 'lodash'
import {Notes} from '../../../../../Scales/Notes.js'
import type {Note}
from '../../../../../Scales/Notes.js'
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
    showAllRootNotes: boolean
}

function String ({numFrets, classNames, tuning, selectedNotes, rootNote, onSelectNote, onSelectRoot, StringId, showAllRootNotes, showAllNotes}: Props) {
  const notes = []
  for (var i = 0; i <= numFrets; i++) {
    notes.push(Notes.transpose(i)(tuning))
  }
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

  return <div className={'String ' + classNames} >
    {_.map(notes, (note) => (<Fret
      note={note}
      onClick={onClickFret}
      onDoubleClick={onDoubleClickRoot}
      selected={isNoteSelected(note)}
      rootNote={isRootSelected(note)}
      key={'' + note.noteValue + note.pitch}/>))}

    </div>
}

export default String
