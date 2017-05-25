// @flow

/* let note = {
  pitch,
  noteValue
} */

// const _ = require('lodash')
import _ from 'lodash'
import {Notes} from './Notes'
import type {Note} from './Notes'
import rotateArray from '../Utils/rotateArray'

type Scale = {name: string, intervals: number[]}

const scaleGenerator = (function () {
  const modesfromScale = function (mode: number[], modeNr: number) {
    return rotateArray(modeNr - 1)(mode)
  }

  // Modes relative to major: [[Tonic relative to major, 'Modename']]
  // const modes = [[1], [2], [3], [4], [5], [6], [7]]
//  const majorModeNames = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']

  // Intervals of the scales
  const major = [2, 2, 1, 2, 2, 2, 1]
  const minorNatural = modesfromScale(major, 6)
  const minorHarmonic = [2, 1, 2, 2, 1, 3, 1]
  const minorMelodicAsc = [2, 1, 2, 2, 2, 2, 1]
  // const minorMelodicDesc = [2, 1, 2, 2, 1, 2, 2]
  const blues = [3, 2, 1, 1, 3, 2]
  const majorPentatonic = [2, 2, 3, 2, 3]
  const minorPentatonic = [3, 2, 2, 3, 2]

  const scaleIntervals:Scale[] = [
    {name: 'Major', intervals: major},
    {name: 'Minor (Natural)', intervals: minorNatural},
    {name: 'Minor (Harmonic)', intervals: minorHarmonic},
    {name: 'Minor (Melodic, ascending)', intervals: minorMelodicAsc},
    // {name: 'minorMelodicDesc', intervals: minorMelodicDesc},
    {name: 'Blues (Hexatonic/Minor)', intervals: blues},
    {name: 'Major (Pentatonic)', intervals: majorPentatonic},
    {name: 'Minor (Pentatonic)', intervals: minorPentatonic}
  ]

  // Modes that can be built from the major scale

  // const scaleInterval = function (name: string) {
  //   if (modes.filter(
  //             (mode) =>
  //               mode.filter(
  //                 (modeName) =>
  //                   modeName === name)
  //             .reduce(
  //               (acc, val) => acc || val, false)
  //           ).length !== 0) {
  //     return modesfromMajor(name)
  //   }
  //   return 'MathaFUCKA'
  // }

  const toIntegerIntervals = function (relativeIntervals: number[]): number[] {
    const intervalNotes = [0]
    for (let i = 0; i < relativeIntervals.length; i++) {
      intervalNotes.push(intervalNotes[intervalNotes.length - 1] + relativeIntervals[i])
    }
    return intervalNotes
  }

  const scaleIntervalsToNotes = function (intervals: number[], root: Note): Note[] {
    return _.map(toIntegerIntervals(intervals), (relNote: number) => Notes.transpose(relNote)(root))
  }

  const scaleIntervalsToNoteIntervals = function (intervals: number[], root: Note) {
    return _.map(toIntegerIntervals(intervals), (relNote: number) => Object.assign({note: Notes.transpose(relNote)(root)}, {interval: Notes.fromIntegerIntervals(relNote)}))
  }

  const areAllNotesInScale = function (notes: Note[], scale: Note[]) {
    const noteInScale = function (note: Note) {
      return _.some(_.map(scale, (scaleNote) => {
        return Notes.equalsValue(scaleNote, note)
      }))
    }
    return _.every(_.map(notes, (note) => noteInScale(note)))
  }

  const getScaleNotes = function (scaleIntervals: Scale[], rootNotes: Note[]) {
    return _.map(scaleIntervals, ({name, intervals}: {
        name: string,
        intervals: number[]
    }) => {
      return {
        name,
        scales: _.map(rootNotes, (rootNote: Note) => {
          return {
            rootNote,
            notes: scaleIntervalsToNotes(intervals, rootNote)
          }
        })
      }
    })
  }

  return {

    // // scale: function (scaleName: string, tonic: Note) {
    // //   const scaleNotes = _.flow(
    // //     scaleInterval,
    // //     intervalsToNoteValues
    // //   )(scaleName)
    //   return scaleNotes.map((notevalue) =>
    //     _.flow(
    //       Notes.fromString,
    //       Notes.transpose(notevalue)
    //     )(tonic)
    //   )
    // },

    getScalesFromNotes: function (selectedNotes: Note[], rootNote: ?Note): {root: Note, scale: string}[] {
      if (!rootNote && selectedNotes.length === 0) {
        return []
      }

      const scaleNotes = rootNote
      // Get only scales with specified rootNote
      ? getScaleNotes(scaleIntervals, [rootNote])
      : getScaleNotes(scaleIntervals, Notes.getAllNotes(0))

      const filteredByNote = _.map(scaleNotes, (scale) => {
        return {name: scale.name, scales: _.filter(scale.scales, ({rootNote, notes}) => areAllNotesInScale(selectedNotes, notes))}
      })
      const filteredByScale = _.filter(filteredByNote, scale => scale.scales.length > 0)
      // _.filter(scaleNotes, (scale) =>
      //   _.filter(scale.scales, ({rootNote, notes}) => areAllNotesInScale(selectedNotes, notes)).length > 0)
      const scale = _.map(filteredByScale, (scale) => _.map(scale.scales, (toneScale) => { return {scale: scale.name, root: toneScale.rootNote} }))
      return _.flatten(scale)
    },

    // notesToIntervalsSmallest: function (notes: Note[]): number[] {
    //   // TODO: implement
    // },

    intervalsToText: function (intervals: number[]) {
      return intervals.map((interval) => interval === 2 ? 'whole' : interval === 1 ? 'half' : 'UNDEFINED INTERVAL')
    },

    getScaleNotesFromName: function (name: string, root: Note): Note[] {
      // TODO real implementation

      const intervals = _.first(_.filter(scaleIntervals, (scale) => scale.name === name)).intervals
      return scaleIntervalsToNotes(intervals, root)
    },

    getScaleNotesWithIntervalsFromName: function (name: string, root: Note) {
      const intervals = _.first(_.filter(scaleIntervals, (scale) => scale.name === name)).intervals
      return scaleIntervalsToNoteIntervals(intervals, root)
    }
  }
}())

// var a5 = Notes.fromString('c1')

export {scaleGenerator as Scale}
