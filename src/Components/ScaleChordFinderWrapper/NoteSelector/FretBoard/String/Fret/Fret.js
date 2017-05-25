// @flow

import React from 'react'

// Stylesheet
import './Fret.css'

// Components
import FretDisplayer from './FretDisplayer/FretDisplayer.js'

import {Notes} from '../../../../../../Scales/Notes.js'
import type {Note} from '../../../../../../Scales/Notes.js'

import classnames from 'classnames'

export type SelectableFret = {
      selectable: true,
      onClick: (note: Note, isSelected: boolean, isRoot: boolean) => void,
      onDoubleClick: (note: Note, isSelected: boolean) => void
    } | {
      selectable: false
    }

type Props = {
    note: Note,
    rootNote: boolean,
    selected: boolean,
    selectableFret: SelectableFret,
    classNames: string
}

export default class Fret extends React.PureComponent {
  longPress: boolean
  props: Props

  constructor (props: Props) {
    super(props)
    this.longPress = false
  }

  cssClasses () {
    return classnames(
      this.props.classNames,
      'Fret',
      {FretSelectable: this.props.selectableFret.selectable},
      {NoteSelected: this.props.selected || this.props.rootNote},
      {Root: this.props.rootNote},
      this.props.scaleDegree ? this.props.scaleDegree.name : ''
    )
  }

  render () {
    return this.props.selectableFret.selectable
      ? <div
        className={this.cssClasses()}
        onClick={() => {
          this.props.selectableFret.onClick(this.props.note, this.props.selected, this.props.rootNote)
        }}
        onDoubleClick={() => {
          this.props.selectableFret.onDoubleClick(this.props.note, this.props.selected)
        }}
        onTouchStart={() => {
          this.props.selectableFret.onClick(this.props.note, this.props.selected, this.props.rootNote)
          this.longPress = true
          setTimeout(() => {
            if (this.longPress) {
              this.props.selectableFret.onDoubleClick(this.props.note, this.props.selected)
            }
          }, 300)
        }}

        onTouchEnd={(e) => {
          e.preventDefault()
          this.longPress = false
        }}
      >
        <FretDisplayer fretText={Notes.toString(this.props.note)}/>
      </div>
      : <div
        className={this.cssClasses()}
        >
        <FretDisplayer fretText={Notes.toString(this.props.note)}/>
      </div>
  }
}

