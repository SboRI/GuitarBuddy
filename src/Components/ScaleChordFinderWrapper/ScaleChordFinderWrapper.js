// @flow

import React from 'react'

// Stylesheet
import './ScaleChordFinderWrapper.css'

import type {Note} from './../../Scales/Notes.js'
import {Notes} from './../../Scales/Notes.js'
import {Scale} from './../../Scales/Scales.js'

// import _ from 'lodash'

// Components
import ScaleDisplayDialog from './ScaleDisplayDialog/ScaleDisplayDialog.js'
import RaisedButton from 'material-ui/RaisedButton'
import NoteSelector from './NoteSelector/NoteSelector.js'
import NoteDisplayer from './NoteSelector/NoteDisplayer.js'

// Flow types
type State = {
  selectedNotes: Note[],
  selectedRoot: ?Note,
  scaleDisplayDialog: ?React$Element<any>,
  noteSelectorTuning: Note[],
  scaleToShow: ?{root: Note, scale: string}
}

export default class ScaleChordFinderWrapper extends React.Component {
  state: State

  constructor (props: any) {
    super(props);
    (this: any).btnClicked = this.btnClicked.bind(this);
    (this: any).getSelectedNotes = this.getSelectedNotes.bind(this);
    (this: any).getScaleToShow = this.getScaleToShow.bind(this)
    this.state = {
      selectedNotes: [],
      selectedRoot: null,
      scaleDisplayDialog: null,
      noteSelectorTuning: [],
      scaleToShow: null
    }
  }

  getScaleToShow ({root, scale}: {root: Note, scale: string}) {
    this.setState((prevState, props) => { return {scaleToShow: {root, scale}} })
  }

  generateScaleDisplayDialog () {
    if (!this.state.selectedRoot && this.state.selectedNotes.length === 0) {
      this.setState({scaleDisplayDialog: null})
      return
    }
    const scales = Scale.getScalesFromNotes(this.state.selectedNotes, this.state.selectedRoot)
    const scaleDisplayDialog = <ScaleDisplayDialog scales={scales} passShowScale={this.getScaleToShow}/>
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

  displaySelectedScale () {
    if (this.state.scaleToShow) {
      const root = this.state.scaleToShow.root
      const scale = this.state.scaleToShow.scale
      return <div>
        Showing: {Notes.toString(root)} {scale}
        <NoteDisplayer
          rootNote={root}
          selectedNotes={Scale.getScaleNotesFromName(scale, root)}
          showAllNotes={true}
          showAllRootNotes={true}
          tuning={this.state.noteSelectorTuning}
        />
      </div>
    }
    return null
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
      {this.displaySelectedScale()}

        </div>
  }
}
