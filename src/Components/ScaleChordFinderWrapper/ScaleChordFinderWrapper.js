// @flow

import React from 'react'
import './ScaleChordFinderWrapper.css'
import NoteSelector from './NoteSelector/NoteSelector.js'
import NoteDisplayer from './NoteSelector/NoteDisplayer.js'
import type {Note} from './../../Scales/Notes.js'
import {Notes} from './../../Scales/Notes.js'
import {Scale} from './../../Scales/Scales.js'
import ScaleDisplayDialog from './ScaleDisplayDialog/ScaleDisplayDialog.js'
// import _ from 'lodash'
import RaisedButton from 'material-ui/RaisedButton'

type State = {
  selectedNotes: Note[],
  selectedRoot: ?Note,
  scaleDisplayDialog: ?React$Element<any>,
  scaleDisplayer: ?React$Element<any>,
  noteSelectorTuning: Note[]
}

export default class ScaleChordFinderWrapper extends React.Component {
  state: State

  constructor (props: any) {
    super(props);
    (this: any).btnClicked = this.btnClicked.bind(this);
    (this: any).getSelectedNotes = this.getSelectedNotes.bind(this);
    (this: any).showFullScale = this.showFullScale.bind(this)
    this.state = {
      selectedNotes: [],
      selectedRoot: null,
      scaleDisplayDialog: null,
      scaleDisplayer: null,
      noteSelectorTuning: []
    }
  }

  showFullScale ({root, scale}: {root: Note, scale: string}) {
    console.log({root, scale})
    const scaleNotes = Scale.getScaleNotesFromName(scale, root)
    console.log(scaleNotes)
    if (scaleNotes.length > 0) {
      const scaleDisplayer = <div> Showing: {Notes.toString(root)} {scale}
        <NoteDisplayer
          rootNote={root}
          selectedNotes={scaleNotes}
          showAllNotes={true}
          showAllRootNotes={true}
          tuning={this.state.noteSelectorTuning}
        />
      </div>
      this.setState({scaleDisplayer})
    }
  }

  generateScaleDisplayDialog () {
    if (this.state.selectedNotes.length === 0) {
      this.setState({scaleDisplayDialog: null})
      return
    }
    const scales = Scale.getScalesFromNotes(this.state.selectedNotes, this.state.selectedRoot)
    const scaleDisplayDialog = <ScaleDisplayDialog scales={scales} passShowScale={this.showFullScale}/>
    this.setState({scaleDisplayDialog})
  }
  btnClicked () {
    this.generateScaleDisplayDialog()
  }

  getSelectedNotes ({rootNote, selectedNotes, tuning}: {
    rootNote: ?Note, selectedNotes: Note[], tuning: Note[]}): void {
    this.setState({selectedRoot: rootNote,
      selectedNotes,
      noteSelectorTuning: tuning})
  }

  render () {
    return <div className='ScaleChordFinderWrapper'>
      <NoteSelector getSelectedNotes={this.getSelectedNotes}/>
      <RaisedButton
        onClick={this.btnClicked}
        className='ScaleChordFinderWrapper-Btn'>
        Search Scales
      </RaisedButton>

      {this.state.scaleDisplayDialog}
      {this.state.scaleDisplayer}

    </div>
  }
}
