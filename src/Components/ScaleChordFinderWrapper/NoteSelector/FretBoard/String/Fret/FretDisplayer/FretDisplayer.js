// @flow

import * as React from 'react'

// Stylesheet
import './../Fret.css'

// Flow types

type Props = {
  fretText: string,
}

export default class FretDisplayer extends React.PureComponent<Props> {
  render () {
    return <div
      className='FretDisplayer'>

        <div className={'Line'}/>
        <div className={'FretText'}>
          {this.props.fretText}
        </div>
      </div>
  }
}
