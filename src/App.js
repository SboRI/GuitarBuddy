import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
// import 'reset-css/reset.css'

import ScaleChordFinderWrapper from './Components/ScaleChordFinderWrapper/ScaleChordFinderWrapper.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import getMuiTheme from 'material-ui/styles/getMuiTheme'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
// import AppBar from 'material-ui/AppBar'
import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

class App extends Component {

  render () {
    return (
      <div className="App">
        <MuiThemeProvider >
          <div>
            {/* <AppBar title='GuitarBuddy'/> */}
            <ScaleChordFinderWrapper />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
