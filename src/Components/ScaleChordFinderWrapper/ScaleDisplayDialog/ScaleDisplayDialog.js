// @flow

import * as React from 'react'
import type {Note} from '../../../Scales/Notes.js'
import {Notes} from '../../../Scales/Notes.js'
import _ from 'lodash'
import './ScaleDisplayDialog.css'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import SelectorPopup from './SelectorPopup/SelectorPopup.js'
import FlatButton from 'material-ui/FlatButton'

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
      <Table
        className=''
        selectable={false}
      >
        <TableHeader className='ScaleDisplayText' displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow className='ScaleDisplayText'>

            <TableHeaderColumn className='ScaleDisplayText'>
              <div className='ScaleDisplayText'>Root Note</div>
            </TableHeaderColumn>
            <TableHeaderColumn>
              <div className='ScaleDisplayText'>Scale</div>
            </TableHeaderColumn>
            <TableHeaderColumn>
              <div className='ScaleDisplayText'>Show Full Scale</div>
            </TableHeaderColumn>

          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {_.map(this.props.scales,
            (scale, key) => {
              return <TableRow className='Scale Scale-table' key={key}>
                <TableRowColumn className='Scale-Root ScaleDisplayText'>
                  <div className="inline-flex">
                    {/* <i className="material-icons Scale-dropdown-icon">menu</i>
                    <div>{Notes.toString(scale.root)} </div> */}
                    <SelectorPopup
                      // correspondingModes={}
                      note={{name: Notes.toString(scale.root), key}}
                      showFullScale={() => this.showFullScale(scale)}
                      // passModeKey={}
                    />
                  </div>
                </TableRowColumn>
                <TableRowColumn className='Scale-Name'>
                  {scale.scale}
                </TableRowColumn>
                <TableRowColumn>
                  <FlatButton>
                    <div className="inline-flex" onClick={() => this.showFullScale({root: scale.root, scale: scale.scale})} style={{'justifyContent': 'center'}}>

                      <i className="material-icons">queue_music</i>
                    </div>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
            })}
        </TableBody>
      </Table>
    </div>
  }
}
