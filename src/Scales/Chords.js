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

  const _findChord = function ({notes, root}: {notes: Note[], root: Note}) {
    const unsrtIntvls = _.map([root, ...notes], note => Notes.findInterval(root, note))
    const intervals = _.sortBy(unsrtIntvls, intvl => intvl)

    const chordResultsAny = _.map(chords, chord => { return { ...containsIntervals(chord.intervals, intervals), chord } })
    const chordResults = _.filter(chordResultsAny, chord => chord.doesContain)

    return _.map(
        chordResults,
        chord => Object.assign({}, {root, chord: chord.chord, isExactMatch: chord.isExactMatch}))
  }

  return {
    findChord: function ({notes, root}: {notes: Note[], root: Note}) {
      if (root) {
        return _findChord({notes, root})
      }

      if (!root) {
        const uniqueNotes = _.uniqWith(notes, Notes.equalsValue)
        const chordPermutations = _.map(uniqueNotes,
          (note) => {
            return {
              root: note,
              notes: _.filter(uniqueNotes,
                el => !Notes.equalsValue(el, note))
            }
          })
        return _.flatten(_.map(chordPermutations, perm => _findChord(perm)))
      }
    }
  }
}())

export default Chords
