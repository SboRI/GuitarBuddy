// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { addDecorator } from '@storybook/react'

import { Button, Welcome } from '@storybook/react/demo'

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

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
