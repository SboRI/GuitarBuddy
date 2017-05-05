// @flow
import _ from 'lodash'

type BeatResolution = 1 | 2 | 4 | 8 | 16

export default class Metronome {
  audioContext: AudioContext
  bpm: number
  beatResolution: BeatResolution
  isPlaying: boolean
  _scheduledClick: ?{scheduled: number}
  _clickLength: {
    '1': number,
    '2': number,
    '4': number,
    '8': number,
    '16': number
  }
  _clickFreq: {
    '0': number,
    '1': number,
    '2': number,
    '4': number,
    '8': number,
    '16': number
  }
  _clickCount: number
  _clickCounter: {
      get: () => number,
      next: () => void,
      reset: () => void,
    }
  _lookAheadTime: number
  _lookAheadInterval: number
  _notifyNextClickScheduled: (obj: {click: number}) => any

  constructor (bpm: number,
    beatResolution: BeatResolution,
    notifyNextClickScheduled: ?(obj: {click: number}) => any,
    settings: {
      lookAheadTime: number,
      lookAheadInterval: number} = {
        lookAheadTime: 100,
        lookAheadInterval: 25}
    ) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContext()
    this.bpm = bpm
    this.beatResolution = beatResolution
    this._scheduledClick = null
    this._lookAheadTime = settings.lookAheadTime
    this._lookAheadInterval = settings.lookAheadInterval
    this._clickLength = {
      '1': 0.075,
      '2': 0.075,
      '4': 0.075,
      '8': 0.075,
      '16': 0.075
    }
    this._clickFreq = {
      '0': 660,
      '1': 440,
      '2': 440,
      '4': 440,
      '8': 440,
      '16': 440
    }
    this._notifyNextClickScheduled = notifyNextClickScheduled || (({click}) => {})

    // Setup for ClickCounter
    this._clickCount = 0
    this._clickCounter = {

      get: () => this._clickCount,
      next: () => {
        this._clickCount++
        if (this._clickCount >= this.beatResolution) {
          this._clickCount = 0
        }
      },
      reset: () => { this._clickCount = 0 }
    }
  }

  play (isPlaying: boolean) {
    this.isPlaying = isPlaying
    this._scheduleNextClick()
  }

  setTempo ({
    bpm = this.bpm,
    beatResolution = this.beatResolution
  }: {
    bpm?: number,
    beatResolution?: BeatResolution
  }) {
    this.bpm = bpm
    this.beatResolution = beatResolution
    console.log(bpm + ' ' + this.beatResolution)
  }

  _scheduleNextClick () {
    let i = 1
    if (this.isPlaying) {
      // first call after Play:
      if (!this._scheduledClick) {
        i = 2
        this._clickCounter.reset()
        const nextClick = this.audioContext.currentTime
        this._setScheduledClickAndCallback(
          this._playOscillator(nextClick, this._clickLength['4'],
            this._clickCounter.get() === 0 ? this._clickFreq['0'] : this._clickFreq['4']), {when: performance.now(), clicktype: this._clickCounter.get()})
        this._clickCounter.next()
      }
      // subsequent clicks
      else if (this._scheduledClick && this._scheduledClick.scheduled < this.audioContext.currentTime) {
        let nextClick = this._scheduledClick.scheduled + this._secondsBetweenClicks(this.beatResolution)
        const nextClickAbs = performance.now() + (nextClick - this.audioContext.currentTime) * 1000
        this._setScheduledClickAndCallback(
          this._playOscillator(nextClick, this._clickLength['4'],
            this._clickCounter.get() === 0 ? this._clickFreq['0'] : this._clickFreq['4']), {when: nextClickAbs, clicktype: this._clickCounter.get()})
        this._clickCounter.next()
      }

      setTimeout(() => this._scheduleNextClick(), 25)
    }

    if (!this.isPlaying) {
      this._scheduledClick = null
    }
  }
  _setScheduledClickAndCallback (click: {scheduled: number}, {when, clicktype}) {
    this._scheduledClick = click
    this._notifyNextClickScheduled({click: when, type: clicktype})
  }

  _playOscillator (start: number, length: number, freq: number) {
    let osc = this.audioContext.createOscillator()
    osc.connect(this.audioContext.destination)
    osc.frequency.value = freq
    osc.start(start)
    osc.stop(start + length)

    return {scheduled: start}
  }

  _secondsBetweenClicks (resolution: number) {
    const bps = this.bpm / 60
    const spb = 1 / bps
    // bpm = quarters, divide resolution by 4 to account for that
    return spb / (resolution / 4)
  }

}
