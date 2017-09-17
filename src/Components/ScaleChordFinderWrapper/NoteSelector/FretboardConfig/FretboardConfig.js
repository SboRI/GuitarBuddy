// @flow

import * as React from 'react'
// Flow types

type Props = {
  onIncDec: (action: 'INC' | 'DEC') => any
}

export default function FretboardConfig ({onIncDec}: Props) {
  return <div>
    <button onClick={() => onIncDec('DEC')}><i className="material-icons">remove</i></button>
    String
    <button onClick={() => onIncDec('INC')}><i className="material-icons">add</i></button>
  </div>
}
