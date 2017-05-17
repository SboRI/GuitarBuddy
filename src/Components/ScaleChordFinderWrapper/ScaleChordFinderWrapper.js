// @flow

import React from 'react'

// Stylesheet
import './ScaleChordFinderWrapper.css'

import {Notes} from './../../Scales/Notes.js'
import {Scale} from './../../Scales/Scales.js'
import Chords from './../../Scales/Chords.js'

import _ from 'lodash'

// Components
import ScaleDisplayDialog from './ScaleDisplayDialog/ScaleDisplayDialog.js'
import RaisedButton from 'material-ui/RaisedButton'
import NoteSelector from './NoteSelector/NoteSelector.js'
import NoteDisplayer from './NoteSelector/NoteDisplayer.js'

// Flow types

import type {Note} from './../../Scales/Notes.js'

type State = {
  selectedNotes: Note[],
  selectedRoot: ?Note,
  scaleDisplayDialog: ?React$Element<any>,
  noteSelectorTuning: Note[],
  scaleToShow: ?{root: Note, scale: string},
  chordToShow: []
}

export default class ScaleChordFinderWrapper extends React.Component {
  state: State

  constructor (props: any) {
    super(props);
    (this: any).btnClicked = this.btnClicked.bind(this);
    (this: any).getSelectedNotes = this.getSelectedNotes.bind(this);
    (this: any).getScaleToShow = this.getScaleToShow.bind(this);
    (this: any).searchChords = this.searchChords.bind(this)
    this.state = {
      selectedNotes: [],
      selectedRoot: null,
      scaleDisplayDialog: null,
      noteSelectorTuning: [],
      scaleToShow: null,
      chordToShow: []
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

  searchChords () {
    this.setState({chordToShow: Chords.findChord({notes: this.state.selectedNotes, root: this.state.selectedRoot})})
    console.log(Chords.findChord({notes: this.state.selectedNotes, root: this.state.selectedRoot}))
  }

  render () {
    return <div className='ScaleChordFinderWrapper'>
      <NoteSelector getSelectedNotes={this.getSelectedNotes}/>
      <RaisedButton
        onClick={this.btnClicked}
        className='ScaleChordFinderWrapper-Btn'>
        Search Scales
      </RaisedButton>
      <div/>
      <RaisedButton
        onClick={this.searchChords}
        className='ScaleChordFinderWrapper-Btn-searchChords'>
        Search Chords
      </RaisedButton>

      {this.state.scaleDisplayDialog}
      {this.displaySelectedScale()}
      {this.state.chordToShow.length > 0 ? _.map(this.state.chordToShow, chords => <div> {chords.chord.name} </div>) : null}

        </div>
  }
}
