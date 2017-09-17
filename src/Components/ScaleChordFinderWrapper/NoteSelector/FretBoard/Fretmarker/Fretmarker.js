// @flow

import * as React from 'react'
import _ from 'lodash'

// Components
import TuningSelectorDummy from './../String/TuningSelector/TuningSelectorDummy.js'

// Stylesheet
import './Fretmarker.css'

export default function Fretmarker ({numFrets}: {numFrets: number}) {
  const singleFretmarkPositions = [3, 5, 7, 9, 15, 17, 19, 21]
  return <div className='Fretmarker'>
    <TuningSelectorDummy/>
    {_.times(numFrets + 1, (index) => <div
      className={'Fretmark ' +
        (_.includes(singleFretmarkPositions, index)
          ? 'singleFretmark'
          : index === 12 || index === 24
          ? 'doubleFretmark'
        : '') +
        (index === 0 ? ' Fretmark-zero-fret' : '')
          }
      key={index + 1}> <div className='fretDot'/></div>
    )
    }
  </div>
}
