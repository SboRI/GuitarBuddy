// @flow

import * as React from 'react'
import type {Note} from '../../../Scales/Notes.js'
import {Notes} from '../../../Scales/Notes.js'
import _ from 'lodash'
import './ScaleDisplayDialog.css'
// import SelectorPopup from './SelectorPopup/SelectorPopup.js'

type Props = {
  scales: {root: Note, scale: string}[],
  passShowScale: (scale: {root: Note, scale: string}) => any
}

export default class ScaleDisplayDialog extends React.Component<Props> {
  constructor (props: Props) {
    super(props);
    (this: any).showFullScale = this.showFullScale.bind(this)
  }

  showFullScale (scale: {root: Note, scale: string}) {
    this.props.passShowScale(scale)
  }

  render () {
    return <div className='ScaleDisplayDialog'>
      <table
        className=''
        // selectable={false}
      >
        <tr className='ScaleDisplayText' displaySelectAll={false} adjustForCheckbox={false}>
          {// <TableRow className='ScaleDisplayText'>
          }

          <td className='ScaleDisplayText'>
            <div className='ScaleDisplayText'>Root Note</div>
          </td>
          <td>
            <div className='ScaleDisplayText'>Scale</div>
          </td>
          <td>
            <div className='ScaleDisplayText'>Show Full Scale</div>
          </td>

          {// </TableRow>
          }
        </tr>
        {_.map(this.props.scales,
          (scale, key) => {
            return <tr className='Scale Scale-table' key={key}>
              <td className='Scale-Root ScaleDisplayText'>
                <div className="inline-flex">
                  name: {Notes.toString(scale.root)} {}
                  {/* <i className="material-icons Scale-dropdown-icon">menu</i>
                    <div>{Notes.toString(scale.root)} </div> }
                    <SelectorPopup
                      // correspondingModes={}
                      note={{name: Notes.toString(scale.root), key}}
                      showFullScale={() => this.showFullScale(scale)}
                      // passModeKey={}
                      /> */}
                </div>
              </td>
              <td className='Scale-Name'>
                {scale.scale}
              </td>
              <td>
                <button onClick={() => this.showFullScale({root: scale.root, scale: scale.scale})}>
                  <div className="inline-flex" style={{'justifyContent': 'center'}}>

                    <i className="material-icons">queue_music</i>
                  </div>
                </button>
              </td>
            </tr>
          })}
      </table>
    </div>
  }
}
