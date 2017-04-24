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
    strings: {baseNote: Note, stringId: string}[],
    rootNote: ?{note: Note, stringID: string},
    selectedNotes: {note: Note, stringID: string}[],
    onSelectNote: (note: Note, stringID: string, isSelected: boolean, isRoot: boolean) => void,
    onSelectRoot: (note: Note, stringID: string, isSelected: boolean)=>void,
    showAllRootNotes: boolean,
    showAllNotes: boolean,

    changeTuning: (obj: {note: Note, stringId: string}) => any
}

class Fretboard extends React.Component {

  props: Props

  // constructor (props: Props) {
  //   super(props)
  // }

  render () {
    const stringsTopToBottom = [...this.props.strings].reverse()

    const classNames = function (baseNote) {
      return Notes.equalsStrict(baseNote, _.first(stringsTopToBottom).baseNote)
    ? 'String-first' : Notes.equalsStrict(baseNote, _.last(stringsTopToBottom).baseNote)
    ? 'String-last' : ''
    }

    const strings = _.map(stringsTopToBottom, ({baseNote, stringId}, index) => {
      return <String
        numFrets={this.props.numFrets}
        classNames={classNames(baseNote)}
        tuning={baseNote}
        selectedNotes={this.props.selectedNotes}
        rootNote={this.props.rootNote}
        onSelectNote={this.props.onSelectNote}
        onSelectRoot={this.props.onSelectRoot}
        key={stringId}
        StringId={stringId}
        showAllRootNotes={this.props.showAllRootNotes}
        showAllNotes={this.props.showAllNotes}
        changeTuning={this.props.changeTuning}/>
    })

    return <div className={'Fretboard'}>
      {strings}
      <Fretmarker numFrets={this.props.numFrets}/>
    </div>
  }

}

export default Fretboard
