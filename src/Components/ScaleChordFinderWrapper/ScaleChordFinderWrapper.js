// @flow

import * as React from 'react'

// Stylesheet
import './ScaleChordFinderWrapper.css'

import {Notes} from './../../Scales/Notes.js'
import {Scale} from './../../Scales/Scales.js'
import Chords from './../../Scales/Chords.js'
import type {Chord} from './../../Scales/Chords.js'
import {Label, Button, Radio} from 'semantic-ui-react'

import _ from 'lodash'

// Components
import ScaleDisplayDialog from './ScaleDisplayDialog/ScaleDisplayDialog.js'
import NoteSelector from './NoteSelector/NoteSelector.js'
import NoteDisplayer from './NoteSelector/NoteDisplayer.js'

// Flow types

import type {Note} from './../../Scales/Notes.js'

type State = {
  selectedNotes: Note[],
  selectedRoot: ?Note,
  scaleDisplayDialog: ?React.Element<any>,
  noteSelectorTuning: Note[],
  scaleToShow: ?{root: Note, scale: string},
  chordToShow: Chord[],
  modeRootToShow: ?Note,
  displayIntervals: boolean
}

export default class ScaleChordFinderWrapper extends React.Component<any, State> {
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
      chordToShow: [],
      modeRootToShow: null,
      displayIntervals: false
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
    const scalesWithModes = _.map(scales, (scale) => Object.assign({}, scale, {correspondingModes: Scale.getMajorModeNames()}))
    const scaleDisplayDialog = <ScaleDisplayDialog scales={scalesWithModes} passShowScale={this.getScaleToShow} />
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
          selectedNotesWithIntervals={_.map(Scale.getScaleNotesWithIntervalsFromName(scale, root), intvl => { return {...intvl, hasInterval: this.state.displayIntervals} })}
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
      <Button
        onClick={this.btnClicked}
        className='ScaleChordFinderWrapper-Btn'>
        Search Scales
      </Button>

      <Button
        onClick={this.searchChords}
        className='ScaleChordFinderWrapper-Btn-searchChords'>
        Search Chords
      </Button>
      <Label horizontal>
        <Radio toggle label='Display all Intervals' onClick={() => this.setState((prev, props) => {
          return {displayIntervals: !prev.displayIntervals}
        })}/>
      </Label>

      {this.state.scaleDisplayDialog}
      {this.displaySelectedScale()}
      {this.state.chordToShow.length > 0 ? _.map(this.state.chordToShow,
        chords => <div>
          <p>{Notes.toString(chords.root)}-{chords.chord.name}</p>
          <p> Notes missing: {_.map(chords.notesMissing, note => Notes.toString(note))} </p>
        </div>
      )
        : null}

    </div>
  }
}
