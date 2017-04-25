import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
// Flow types

type Props = {
  onIncDec: (action: 'INC' | 'DEC') => any
}

export default function FretboardConfig ({onIncDec}: Props) {
  return <div>
    <RaisedButton onClick={() => onIncDec('DEC')}><i className="material-icons">remove</i></RaisedButton>
    String
    <RaisedButton onClick={() => onIncDec('INC')}><i className="material-icons">add</i></RaisedButton>
  </div>
}
