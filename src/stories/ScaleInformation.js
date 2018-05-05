// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { addDecorator } from '@storybook/react'

import ScaleInformation from '../Components/ScaleChordFinderWrapper/ScaleDisplayDialog/ScaleInformation/ScaleInformation.js'
import ScaleChordFinderWrapper from '../Components/ScaleChordFinderWrapper/ScaleChordFinderWrapper.js'

import '../index.css'
import 'semantic-ui-css/semantic.min.css'
import '../App.css'

const AppDecorator = (storyFn) => (
  <div className="App">
    <div>
      { storyFn() }
    </div>
  </div>
)

addDecorator(AppDecorator)

storiesOf('Scaleinformation', module)
  .add('default', () => <ScaleInformation/>)
