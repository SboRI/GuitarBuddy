// @flow

import * as React from 'react';

import _ from 'lodash'

import {Notes} from '../../../../../Scales/Notes.js'
import type {Note} from '../../../../../Scales/Notes.js'

// Components
import Fret from './Fret/Fret.js'
import type {SelectableFret} from './Fret/Fret.js'
export type {SelectableFret}
import TuningSelector from './TuningSelector/TuningSelector.js'
import TuningSelectorDummy from './TuningSelector/TuningSelectorDummy.js'

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
    StringId: string,
    showAllNotes: boolean,
    showAllRootNotes: boolean,
    changeTuning: (obj: {note: Note, stringId: string}) => void,
    selectableFret: {
      selectable: true,
      onClick: (note: Note, stringID: string, isSelected: boolean, isRoot: boolean) => void,
      onDoubleClick: (root: Note, stringID: string, isSelected: boolean) => void
    } | {
      selectable: false
    }
}

export default function String ({
      numFrets,
      classNames,
      tuning,
      selectedNotes,
      rootNote,
      StringId,
      showAllRootNotes,
      showAllNotes,
      changeTuning,
      selectableFret
    }: Props) {
  const notes = []
  for (var i = 0; i <= numFrets; i++) {
    notes.push(Notes.transpose(i)(tuning))
  }

  if (selectableFret.selectable) {
    var onClickFret = function (note: Note, isSelected: boolean, isRoot: boolean) {
      if (selectableFret.selectable) return selectableFret.onClick(note, StringId, isSelected, isRoot)
    }

    var onDoubleClickRoot = function (note: Note, isSelected: boolean) {
      if (selectableFret.selectable) return selectableFret.onDoubleClick(note, StringId, isSelected)
    }
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

  const passTuning = function (note: Note): void {
    changeTuning({note, stringId: StringId})
  }

  const getScaleDegreeInfo = function (fretNote) {
    const note = _.filter(selectedNotes, (sel) => Notes.equalsValue(sel.note, fretNote))[0]
    return note && note.hasOwnProperty('interval') ? note.interval : null
  }

  return <div
    className={'String ' + classNames}>
      {selectableFret.selectable
      ? <TuningSelector
        baseNote={tuning}
        passTuning={passTuning}
      />
      : <TuningSelectorDummy/>}

      {selectableFret.selectable
        ? _.map(notes, (note, index, collection) => (<Fret
        note={note}
        selectableFret={{
          selectable: true,
          onClick: onClickFret,
          onDoubleClick: onDoubleClickRoot
        }}

        selected={isNoteSelected(note)}
        rootNote={isRootSelected(note)}
        key={'' + note.noteValue + note.pitch}
        classNames={index === 0
          ? 'Fret-zeroFret'
          : index === collection.length - 1
          ? 'Fret-last'
          : ''
        }/>))
      : _.map(notes, (note, index, collection) => (<Fret
        note={note}
        selected={isNoteSelected(note)}
        rootNote={isRootSelected(note)}
        scaleDegree={showAllNotes ? getScaleDegreeInfo(note) : null}
        key={'' + note.noteValue + note.pitch}
        classNames={index === 0
          ? 'Fret-zeroFret'
          : index === collection.length - 1
          ? 'Fret-last'
          : ''
        }
        selectableFret={{selectable: false}}/>))
    }

  </div>
}

