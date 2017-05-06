// @flow

import React from 'react'
import './Fret.css'
import {Notes} from '../../../../../../Scales/Notes.js'
import type {Note} from '../../../../../../Scales/Notes.js'

import classnames from 'classnames'

type Props = {
    note: Note,
    rootNote: boolean,
    selected: boolean,
    onClick: (note: Note, isSelected: boolean, isRoot: boolean) => void,
    onDoubleClick: (note: Note, isSelected: boolean) => void,
    classNames: string
}

export default class Fret extends React.PureComponent {
  constructor (props: Props) {
    super(props)
    this.longPress = false
  }

  cssClasses () {
    if (this.props.rootNote) Notes.toString(this.props.note)
    return classnames(this.props.classNames, 'Fret',
      {NoteSelected: this.props.selected},
      {RootSelected: this.props.rootNote}
    )
  }

  render () {
    return <div
    className={this.cssClasses()}
    onClick={() => this.props.onClick(this.props.note, this.props.selected, this.props.rootNote)}
    onDoubleClick={() => {
      console.log('double onClick')
      this.props.onDoubleClick(this.props.note, this.props.selected)
    }}
    onTouchStart={() => {
      this.longPress = false
      console.log('touchSTart')
      setTimeout(() => this.longPress = true, 200)
    }}
    onTouchEnd={() => {
      console.log('Touchend' + this.longPress)
      this.longPress
      ? this.props.onDoubleClick(this.props.note, this.props.selected)
      : null
    }}>

    <div className={'Line'}> </div>
    <div className={'FretText'}>{Notes.toString(this.props.note)}</div>
  </div>
  }
}

