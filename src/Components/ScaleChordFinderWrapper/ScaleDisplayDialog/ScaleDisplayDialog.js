// @flow

import * as React from 'react'
import type {Note} from '../../../Scales/Notes.js'
import {Notes} from '../../../Scales/Notes.js'
import _ from 'lodash'
import './ScaleDisplayDialog.css'
import {Label, Button, Dropdown, Table} from 'semantic-ui-react'

// import SelectorPopup from './SelectorPopup/SelectorPopup.js'

type Props = {
  scales: {root: Note, scale: string, correspondingModes: string[]}[],
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
    return <div className='ScaleDisplayDialog' >
      <Table
        className=''
        // selectable={false}

      >
        <Table.Header>
          <Table.Row className='ScaleDisplayText'>

            <Table.HeaderCell textAlign='center'>
              <div >Root Note</div>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div >Scale</div>
            </Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>
              <div >Show Full Scale</div>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div >Corresponding Mode</div>
            </Table.HeaderCell>

            {// </TableRow>
            }
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {_.map(this.props.scales,
            (scale, key) => {
              return <Table.Row className='Scale Scale-table' key={key} >
                <Table.Cell textAlign='center' className='Scale-Root ScaleDisplayText'>

                  {Notes.toString(scale.root)}
                </Table.Cell>
                <Table.Cell className='Scale-Name'>
                  {scale.scale}
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  <Button onClick={() => this.showFullScale({root: scale.root, scale: scale.scale})}>
                    <div className="inline-flex" style={{'justifyContent': 'center'}}>

                      <i className="material-icons">queue_music</i>
                    </div>
                  </Button>
                </Table.Cell>
                <Table.Cell>

                  <Dropdown button='true' text={['Modes with root ', <b>{Notes.toString(scale.root)}</b>]} pointing='left' >

                    <Dropdown.Menu>
                      {_.map(scale.correspondingModes, (el, key) =>
                        <Dropdown.Item onClick={() => this.showFullScale({root: scale.root, scale: el})} key={key}>
                          {el}
                        </Dropdown.Item>)}
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            })}
        </Table.Body>
      </Table>
    </div>
  }
}
