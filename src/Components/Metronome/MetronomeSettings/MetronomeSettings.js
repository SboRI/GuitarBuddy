import * as React from 'react';
import _ from 'lodash'

export default class MetronomeSettings extends React.PureComponent<{}, $FlowFixMeState> {
  render () {
    return <div className='MetronomeSettings'>
      <div>
        bpm:
        <input
          type='number'
          value={this.state.bpm}
          onChange=
          { (event) => this.setMetronomeBpm(event.target.value) }/></div >
      <div >
        beatResolution:
        <form >
          {_.map(this.state.beatResolutions, res => {
            return (< div > < input type = 'radio' value = {
              res
            }
            checked = {
              res === this.state.beatResolution
            }
            onChange = {
              (e) => this.setMetronomeRes(parseInt(e.target.value))
            } /> {
              res
            } < /div >)
          })}
        </form>
      </div>
    </div>
  }
}
