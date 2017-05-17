// @flow

import _ from 'lodash'

export type Note = {noteValue: number; pitch: number}

const Notes = (function () {
  const noteValues = [['C', 1], ['D', 3], ['E', 5], ['F', 6], ['G', 8], ['A', 10], ['B', 12]]
  const noteNames = _.map(noteValues, (noteValue) => _.reverse([...noteValue]))

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
