// @flow

import React from 'react'

import _ from 'lodash'
// import fp from 'lodash/fp'
import {Notes} from '../../../../Scales/Notes.js'
import type {Note} from '../../../../Scales/Notes.js'
// Stylesheet
import './Fretboard.css'

// Components
import String from './String/String.js'
import Fretmarker from './Fretmarker/Fretmarker.js'

type Props = {
    numFrets: number,
    tuning: Note[],
    rootNote: ?{note: Note, stringID: string},
    selectedNotes: {note: Note, stringID: string}[],
    onSelectNote: (note: Note, stringID: string, isSelected: boolean, isRoot: boolean) => void,
    onSelectRoot: (note: Note, stringID: string, isSelected: boolean)=>void,
    showAllRootNotes: boolean,
    showAllNotes: boolean

}

class Fretboard extends React.Component {

  props: Props

  render () {
    const tuningTopToBottom:Note[] = [...this.props.tuning].reverse()

    const classNames = function (baseNote) {
      return Notes.equalsStrict(baseNote, _.first(tuningTopToBottom))
    ? 'String-first' : Notes.equalsStrict(baseNote, _.last(tuningTopToBottom))
    ? 'String-last' : ''
    }

    const strings = _.map(tuningTopToBottom, (baseNote, index) => {
      return <String
        numFrets={this.props.numFrets}
        classNames={classNames(baseNote)}
        tuning={baseNote}
        selectedNotes={this.props.selectedNotes}
        rootNote={this.props.rootNote}
        onSelectNote={this.props.onSelectNote}
        onSelectRoot={this.props.onSelectRoot}
        key={'' + baseNote.noteValue + baseNote.pitch}
        StringId={'' + baseNote.noteValue + baseNote.pitch}
        showAllRootNotes={this.props.showAllRootNotes}
        showAllNotes={this.props.showAllNotes}/>
    })

    return <div className={'Fretboard'}>
      {strings}
      <Fretmarker numFrets={this.props.numFrets}/>
    </div>
  }

}

export default Fretboard
