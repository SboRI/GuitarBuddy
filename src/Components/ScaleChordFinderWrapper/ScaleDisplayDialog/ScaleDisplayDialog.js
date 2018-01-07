// @flow

import * as React from 'react'
import type {Note} from '../../../Scales/Notes.js'
import {Notes} from '../../../Scales/Notes.js'
import _ from 'lodash'
import './ScaleDisplayDialog.css'
import {Button, Dropdown, Table} from 'semantic-ui-react'

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

            <Table.HeaderCell className='ScaleDisplayText'>
              <div className='ScaleDisplayText'>Root Note</div>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='ScaleDisplayText'>Scale</div>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='ScaleDisplayText'>Show Full Scale</div>
            </Table.HeaderCell>

            {// </TableRow>
            }
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {_.map(this.props.scales,
            (scale, key) => {
              return <Table.Row className='Scale Scale-table' key={key} >
                <Table.Cell className='Scale-Root ScaleDisplayText'>
                  <div className="inline-flex" >
                    {Notes.toString(scale.root)}
                    <Button size='mini'>
                      <Dropdown text='' pointing='left'>
                        <Dropdown.Menu>
                          {_.map(scale.correspondingModes, (el, key) =>
                            <Dropdown.Item onClick={() => this.showFullScale({root: scale.root, scale: el})} key={key}>
                              {el}
                            </Dropdown.Item>)}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Button>

                  </div>
                </Table.Cell>
                <Table.Cell className='Scale-Name'>
                  {scale.scale}
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => this.showFullScale({root: scale.root, scale: scale.scale})}>
                    <div className="inline-flex" style={{'justifyContent': 'center'}}>

                      <i className="material-icons">queue_music</i>
                    </div>
                  </Button>
                </Table.Cell>
              </Table.Row>
            })}
        </Table.Body>
      </Table>
    </div>
  }
}
