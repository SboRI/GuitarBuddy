import React from 'react'

import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'

type State = {
  isPopoverOpen: boolean,
  anchorEl: ?EventTarget
}

type Props = {
  note: {name: string, key: string},
  correspondingModes: {name: string, key: string},
  passModeKey: (key: string) => any,
  showFullScale: ()=>any
}

export default class SelectorPopup extends React.Component {
  props: Props
  constructor (props: Props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.state = {
      isPopoverOpen: false,
      anchorEl: null
    }
  }

  handleClick (event: SyntheticEvent) {
    this.setState({isPopoverOpen: true, anchorEl: event.currentTarget})
  }

  handleRequestClose () {
    this.setState({
      isPopoverOpen: false
    })
  }

  state: State
  render () {
    return <div>
      <FlatButton >
        <div className='inline-flex' onClick={this.handleClick}>
          <i className="material-icons Scale-dropdown-icon">menu</i>
          {this.props.note.name}
        </div>
      </FlatButton>
      <Popover open={this.state.isPopoverOpen}
        anchorEl={this.state.anchorEl}
        onRequestClose={this.handleRequestClose}>
        <Menu>
          <MenuItem><div> my test text</div></MenuItem>
            <MenuItem primaryText="Help &amp; feedback" />
            <MenuItem primaryText="Settings" />
            <MenuItem primaryText="Sign out" />
          </Menu>
      </Popover>
    </div>
  }
}