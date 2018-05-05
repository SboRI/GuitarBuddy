import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';






function loadStories() {
  require.context('../src/stories', true).keys().forEach(require.context('../src/stories', true));
}



configure(loadStories, module);

