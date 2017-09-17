// @flow

import _ from 'lodash'
import {Notes} from './Notes.js'

// Flow Types
import type {Note} from './Notes.js'

const Chords = (function () {
  const chord = function (name: string, intervals: number[]) {
    return {name, intervals}
  }

  const chords = [
    chord('major', [0, 4, 7]),
    chord('minor', [0, 3, 7]),
    chord('diminished', [0, 3, 6]),
    chord('augmented', [0, 4, 8])
  ]

  const containsIntervals = function (container: number[], testIntervals: number[]): {doesContain: false} | {
      doesContain: true, isExactMatch: boolean} {
    let result = {}
    if (_.difference(testIntervals, container).length !== 0) {
      result.doesContain = false
    } else {
      result.doesContain = true
      if (_.difference(container, testIntervals).length === 0) {
        result.isExactMatch = true
      } else {
        result.isExactMatch = false
      }
    }
    return result
  }

  return {
    findChord: function ({notes, root}: {notes: Note[], root: Note}) {
      const unsrtIntvls = _.map(notes, note => Notes.findInterval(root, note))
      const intervals = _.sortBy(unsrtIntvls, intvl => intvl)
      console.log(intervals)

      const chordResults = _.map(chords, chord => { return { ...containsIntervals(chord.intervals, intervals), chord } })
      return _.filter(chordResults, chordRes => chordRes.doesContain)
    }
  }
}())

export default Chords
