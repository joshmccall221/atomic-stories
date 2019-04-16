import {configure} from '@storybook/react';
import '@storybook/addon-console';
import {addDecorator} from '@storybook/react';
import {withConsole} from '@storybook/addon-console';
import {configure as enzymeConfigure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {describe, it} from 'storybook-addon-specifications';
import expect from 'expect';

window.describe = describe;
window.it = it;
window.expect = expect;

enzymeConfigure({adapter: new Adapter()});

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
