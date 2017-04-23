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

function Fret ({
    note,
    rootNote = false,
    selected = false,
    onClick,
    onDoubleClick,
    classNames
}: Props) {
  const cssClasses = classnames(classNames, 'Fret',
    {NoteSelected: selected},
    {RootSelected: rootNote}
  )

  return <div
    className={cssClasses}
    onClick={() => onClick(note, selected, rootNote)}
    onDoubleClick={() => onDoubleClick(note, selected)}>

    <div className={'Line'}> </div>
    <div className={'FretText'}>{Notes.toString(note)}</div>
  </div>
}

export default Fret
