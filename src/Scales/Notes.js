// @flow

import _ from 'lodash'

export type Note = {noteValue: number; pitch: number}

const Notes = (function () {
  const noteValues = [['C', 1], ['D', 3], ['E', 5], ['F', 6], ['G', 8], ['A', 10], ['B', 12]]
  const noteNames = _.map(noteValues, (noteValue) => _.reverse([...noteValue]))

  const integerIntervals = {
    '0': { name: 'prime', quality: 'perfect', short: 'P1', roman: 'I', number: 1, diatonFunc: 'tonic' },
    '1': { name: 'second', quality: 'minor', short: 'm2', roman: 'II', number: 2, diatonFunc: 'supertonic' },
    '2': { name: 'second', quality: 'major', short: 'M2', roman: 'II', number: 2, diatonFunc: '' },
    '3': { name: 'third', quality: 'minor', short: 'm3', roman: 'III', number: 3, diatonFunc: '' },
    '4': { name: 'third', quality: 'major', short: 'M3', roman: 'III', number: 3, diatonFunc: '' },
    '5': { name: 'fourth', quality: 'perfect', short: 'P4', roman: 'IV', number: 4, diatonFunc: '' },
    '6': { name: 'tritone', quality: 'augemented/diminished', short: 'TT', roman: 'aIV/dV', number: 5, diatonFunc: '' },
    '7': { name: 'fifth', quality: 'perfect', short: 'P5', roman: 'V', number: 5, diatonFunc: '' },
    '8': { name: 'sixth', quality: 'minor', short: 'm6', roman: 'VI', number: 6, diatonFunc: '' },
    '9': { name: 'sixth', quality: 'major', short: 'M6', roman: 'VI', number: 6, diatonFunc: '' },
    '10': { name: 'seventh', quality: 'minor', short: 'm7', roman: 'VII', number: 7, diatonFunc: '' },
    '11': { name: 'seventh', quality: 'major', short: 'M7', roman: 'VII', number: 7, diatonFunc: '' },
    '12': { name: 'octave', quality: 'perfect', short: 'P8', roman: 'I', number: 8, diatonFunc: '' }
  }

  type NoteLiteral = {fullTone: string; accidentals: string[], pitch: number}

  return {
    fromString: function (string: string): Note {
      return _.flow(
      Notes.parseNoteString,
      Notes.toNoteValue
    )(string)
    },

    toString: function (note: Note, includePitch: boolean = false): string {
      const _noteNames = _.fromPairs(noteNames)
      return (_noteNames[note.noteValue]
        ? _noteNames[note.noteValue]
        : _noteNames[note.noteValue - 1 > 0 ? note.noteValue - 1 : 12] +
        '♯/' + _noteNames[note.noteValue + 1 < 13 ? note.noteValue + 1 : 1] + '♭') + (includePitch ? note.pitch : '')
    },

    parseNoteString: function (string: string): NoteLiteral {
      // $FlowFixMe
      const [fullTone, ...tail] = string
      const pitch = tail.pop()
      const accidentals = tail
      return {fullTone, accidentals, pitch}
    },

    parseAccidentals: function (accidentals: string[]) {
      return accidentals.reduce((acc, val) => val === '#' ? (acc + 1) : val === 'b' ? (acc - 1) : acc, 0)
    },

    create: function (noteValue: number, pitch: number = -1): Note {
    // const _noteValue = this.toNoteValue(fullTone, accidentals
      if (noteValue < 1 || noteValue > 12) {
        throw new Error('notValue out of bounds')
      }

      const note = {
        noteValue: noteValue,
        pitch: pitch
      }
      return Object.freeze(note)
    },

    transpose: function (halfsteps: number) {
      return function (note: Note): Note {
        let _noteValue = note.noteValue
        let _pitch = note.pitch
        const direction = halfsteps / Math.abs(halfsteps)

        let counter = Math.abs(halfsteps)
        while (counter-- > 0) {
          _noteValue += direction

          if (_noteValue < 1) {
            _noteValue = 12
            _pitch--
          }

          if (_noteValue > 12) {
            _noteValue = 1
            _pitch++
          }
        }
        if (_noteValue === 0) { console.log(note) }
        return _.flow(
      Notes.create,
      Object.freeze
    )(_noteValue, _pitch)
      }
    },

    toNoteValue: function ({fullTone, accidentals, pitch}: NoteLiteral): Note {
      const fullToneValue = noteValues.filter(x => x[0].toLowerCase() === fullTone.toLowerCase())[0][1]

      const halfsteps = Notes.parseAccidentals(accidentals)

      return _.flow(
      Notes.create,
      Notes.transpose(halfsteps)
    )(fullToneValue, pitch)
    },

    equalsValue: function (note1: Note, note2: Note): boolean {
      return note1.noteValue === note2.noteValue
    },

    equalsPitch: function (note1: Note, note2: Note): boolean {
      return note1.pitch === note2.pitch
    },

    equalsStrict: function (note1: Note, note2: Note): boolean {
      return note1.noteValue === note2.noteValue && note1.pitch === note2.pitch
    },

    getAllNotes: function (pitch: number = 0): Note[] {
      let notes = []
      for (var i = 1; i <= 12; i++) {
        notes.push(Notes.create(i, pitch))
      }
      return notes
    },

    fromIntegerIntervals: function (integerInterval: number) {
      if (integerInterval > 12) {
        integerInterval = integerInterval % 12
      }
      return integerIntervals[integerInterval.toString()]
    },

    findInterval: function (from: Note, to: Note): number {
      switch (true) {
        case (from.noteValue <= to.noteValue):
          return to.noteValue - from.noteValue

        case (from.noteValue > to.noteValue):
          return to.noteValue - from.noteValue + 12

        default:
          throw new Error('findInterval should not reach default case')
      }
    }

  }
}())

export {Notes}
