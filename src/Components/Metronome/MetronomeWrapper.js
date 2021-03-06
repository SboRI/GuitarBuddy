// @flow

import * as React from 'react'

// Libraries
import _ from 'lodash'

// Components
import Metronome from './../../Metronome/Metronome.js'
import type {BeatResolution} from './../../Metronome/Metronome.js'

type State = {
  metronome: Metronome,
  isMetronomePlaying: boolean,
  bpm: number,
  beatResolutions: BeatResolution[],
  beatResolution: BeatResolution,
  metronomeLight: {
    width: string,
    height: string,
    margin: string,
    backgroundColor: string}
}

type Props = {}

export default class MetronomeWrapper extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    (this: any).playMetronome = this.playMetronome.bind(this);
    (this: any).metronomeCallback = this.metronomeCallback.bind(this);
    (this: any).flashMetronomeLight = this.flashMetronomeLight.bind(this);
    (this: any).setBeatResolution = this.setBeatResolution.bind(this)

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

  setMetronomeBpm (bpm: number) {
    this.setState((old, props) => { return {bpm} }, () => this.state.metronome.setTempo({bpm: this.state.bpm, beatResolution: this.state.beatResolution}))
  }

  setMetronomeRes (res: BeatResolution) {
    console.log('hahahaha')
    this.setState((old, props) => { return {beatResolution: res} }, () => this.state.metronome.setTempo({bpm: this.state.bpm, beatResolution: this.state.beatResolution}))
  }

  metronomeCallback ({click, type}: {click: number, type: number}) {
    setTimeout(() => this.flashMetronomeLight(parseInt(type, 10) === 0 ? 'green' : 'red'), click - performance.now())
  }

  // setMetronomeSetting (res) {
  //   this.setState((old, props) => { return {beatResolution: res} }, () => this.state.metronome.setTempo({bpm: this.state.bpm, beatResolution: this.state.beatResolution}))
  // }

  flashMetronomeLight (color: string) {
    const metronomeHighlight = {...this.state.metronomeLight}
    metronomeHighlight.backgroundColor = color
    const metronomeBlack = {...this.state.metronomeLight}
    metronomeBlack.backgroundColor = 'black'
    this.setState({metronomeLight: metronomeHighlight})
    setTimeout(() => {
      this.setState({metronomeLight: metronomeBlack})
    }, 200)
  }

  setBeatResolution (res: number) {
    this.setMetronomeRes(_.first(_.filter(this.state.beatResolutions, ress => ress === res)) ||
                          _.first(this.state.beatResolutions))
  }

  render () {
    return <div className='MetronomeWrapepr'>
      <button onClick={this.playMetronome}>{!this.state.isMetronomePlaying ? 'Start' : 'Stop'} Metronome</button>
      <div style={this.state.metronomeLight}/>
      <div> bpm: <input type='number' value={this.state.bpm} onChange={(event) => this.setMetronomeBpm(event.target.value)}/></div>
      <div> beatResolution:
        <form>{_.map(this.state.beatResolutions, res => {
          return (
            <div>
              <input
                type='radio'
                value={res}
                checked={res === this.state.beatResolution}
                onChange={(e) => this.setBeatResolution(parseInt(e.target.value, 10)) }
              />
              {res}
            </div>)
        }
        )}
        </form>
      </div>

    </div>
  }
}
