// @flow

import React from 'react'

// Libraries
import _ from 'lodash'

// Components
import Metronome from './../../Metronome/Metronome.js'
import RaisedButton from 'material-ui/RaisedButton'

type State = {
  metronome: Metronome,
  isMetronomePlaying: boolean
}

type Props = {}

export default class MetronomeWrapper extends React.Component {
  state: State

  constructor (props: Props) {
    super(props);
    (this: any).playMetronome = this.playMetronome.bind(this);
    (this: any).metronomeCallback = this.metronomeCallback.bind(this);
    (this: any).flashMetronomeLight = this.flashMetronomeLight.bind(this)

    const metronome = new Metronome(120, 4, this.metronomeCallback)
    this.state = {
      metronome,
      isMetronomePlaying: false,
      bpm: 120,
      beatResolutions: [1, 2, 4, 8, 16],
      beatResolution: 4,
      metronomeLight: {
        width: '20px',
        height: '20px',
        backgroundColor: 'black',
        margin: 'auto'
      }
    }
  }

  playMetronome () {
    this.setState((prevState, props) => {
      return {
        isMetronomePlaying: !prevState.isMetronomePlaying
      }
    },
    () => this.state.metronome.play(this.state.isMetronomePlaying))
  }

  setMetronomeBpm (bpm) {
    this.setState((old, props) => { return {bpm} }, () => this.state.metronome.setTempo({bpm: this.state.bpm, beatResolution: this.state.beatResolution}))
  }

  setMetronomeRes (res) {
    this.setState((old, props) => { return {beatResolution: res} }, () => this.state.metronome.setTempo({bpm: this.state.bpm, beatResolution: this.state.beatResolution}))
  }

  metronomeCallback ({click, type}: {click: number}) {
    setTimeout(() => this.flashMetronomeLight(parseInt(type, 10) === 0 ? 'green' : 'red'), click - performance.now())
  }

  // setMetronomeSetting (res) {
  //   this.setState((old, props) => { return {beatResolution: res} }, () => this.state.metronome.setTempo({bpm: this.state.bpm, beatResolution: this.state.beatResolution}))
  // }

  flashMetronomeLight (color: string) {
    const metronomeHighlight = Object.assign({}, this.state.metronomeLight)
    metronomeHighlight.backgroundColor = color
    const metronomeBlack = Object.assign({}, this.state.metronomeLight)
    metronomeBlack.backgroundColor = 'black'
    this.setState({metronomeLight: metronomeHighlight})
    setTimeout(() => {
      this.setState({metronomeLight: metronomeBlack})
    },
     200)
  }

  render () {
    return <div className='MetronomeWrapepr'>
      <RaisedButton onClick={this.playMetronome}>{!this.state.isMetronomePlaying ? 'Start' : 'Stop'} Metronome</RaisedButton>
      <div style={this.state.metronomeLight}/>
      <div> bpm: <input type='number' value={this.state.bpm} onChange={(event) => this.setMetronomeBpm(event.target.value)}/></div>
      <div> beatResolution:
        <form>{_.map(this.state.beatResolutions, res => {
          return (
           <div><input
            type='radio'
            value={res}
            checked={res === this.state.beatResolution}
            onChange={(e) => this.setMetronomeRes(parseInt(e.target.value, 10))}
            /> {res}</div>)
        }
            )}
        </form>
      </div>

    </div>
  }
}
