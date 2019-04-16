import React from 'react';
import {storiesOf, setAddon} from '@storybook/react';
import {Shimmer, Button, people} from 'office-ui-fabric-react';
import {ShimmerLoadDataExample} from './ShimmerLoadDataExample';
import {PersonaBadge} from './Personas';
import ContactGroup, {NewGroup, ToolManagers, Shadow} from './TableView';
import {ButtonDefaultExample} from './IButtonBasicExampleStyleProps';
import FindYourContact from './FindYourContact';
import {boolean, withKnobs, text, object, number} from '@storybook/addon-knobs';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';
import {linkTo} from '@storybook/addon-links';
import JSXAddon, {jsxDecorator} from 'storybook-addon-jsx';
import {initializeIcons} from '@uifabric/icons';
import {specs, describe, it} from 'storybook-addon-specifications';
import {mount} from 'enzyme';
import expect from 'expect';
import any from '@travi/any';

initializeIcons();
setAddon(JSXAddon);

// example files :  https://github.com/OfficeDev/office-ui-fabric-react/tree/43e45d90f0c5cad56cf1b35c8a41361176a30b40/packages/office-ui-fabric-react/src

const numberOfRows = any.fromList([1, 2, 7, 10]);
const numOfPeople = any.fromList([1, 2, 3, 4]);
const peopleWithImages = people.filter(f => f.imageUrl && f.imageUrl.indexOf('./'));
const mockPeople = (num, fun) => peopleWithImages.slice(0, num ? num : people.length - 1).map(m => fun(m));

const links = {
  HOME: linkTo('office-ui-fabric-react: Screens', 'Search Contacts'),
  ADD: linkTo('office-ui-fabric-react: Screens', 'New Group'),
  OK: linkTo('office-ui-fabric-react: Screens', 'Contact Groups'),
  TOOL_MANAGERS: linkTo('office-ui-fabric-react: Screens', 'Tool Managers'),
  GROUP_DETAILS: linkTo('office-ui-fabric-react: Screens', 'Group Details'),
  EDIT: linkTo('office-ui-fabric-react: Screens', 'Edit Group'),
  DELETE: () => console.log('DELETE')
  // GROUP_DETAILS: linkTo('office-ui-fabric-react: Screens', 'Group Details')
};
storiesOf('office-ui-fabric-react: Screens', module)
  .addDecorator(withKnobs)
  .addDecorator(
    withInfo({
      info: 'PeoplePicker (https://developer.microsoft.com/en-us/fabric#/components/peoplepicker)',
      inline: false,
      header: true,
      source: false
    })
  )
  .add('Search Contacts', () => (
    <FindYourContact
      {...{
        peopleList: boolean('loaded', peopleWithImages) ? peopleWithImages : [],
        currentSelectedItems: [],
        ...any.objectWithKeys(['contactList', 'mostRecentlyUsed'], {
          factory: () => mockPeople(number('number of people', numOfPeople), m => object(m.text, m))
        })
      }}
      settingsOnclick={linkTo('office-ui-fabric-react: Screens', 'Contact Groups')}
    />
  ))
  .add('Contact Groups', () => (
    <ContactGroup
      links={{
        ...links
      }}
      contactList={any.listOf(
        () => ({
          Name: any.word(),
          Primary: any.word(),
          Secondary: any.word(),
          Lead: any.word(),
          OSS_NAME: any.word(),
          OSS_CONTACT: any.word()
        }),
        {size: number('number of rows', numberOfRows)}
      )}
    />
  ))
  .add('New Group', () => (
    <NewGroup
      title={'New Group'}
      links={links}
      textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
    />
  ))
  .add('Group Details', () => (
    <NewGroup
      links={links}
      title={'Group Details'}
      textFields={[
        'Name',
        'Primary Contact',
        'Secondary Contact',
        'OSS Name',
        'OSS Contact',
        'Leader',
        'Last Updated',
        'Owner',
        'Last Upadated User'
      ]}
      groupDetails={any.objectWithKeys(
        [
          'Name',
          'Primary Contact',
          'Secondary Contact',
          'OSS Name',
          'OSS Contact',
          'Leader',
          'Last Updated',
          'Owner',
          'Last Upadated User'
        ],
        {
          factory: () => ({value: any.word()})
        }
      )}
      viewOnly
    />
  ))
  .add('Edit Group', () => (
    <NewGroup
      title={'Edit Group'}
      links={links}
      textFields={['Name', 'Primary Contact', 'Secondary Contact', 'OSS Name', 'OSS Contact', 'Leader']}
      groupDetails={any.objectWithKeys(
        ['Name', 'Primary Contact', 'Secondary Contact', 'OSS Name', 'OSS Contact', 'Leader'],
        {
          factory: () => ({value: any.word()})
        }
      )}
    />
  ))
  .add('Tool Managers', () => (
    <ToolManagers
      links={{
        ...links,
        ADD: linkTo('office-ui-fabric-react: Screens', 'New Tool Manager Group'),
        EDIT: linkTo('office-ui-fabric-react: Screens', 'Edit Tool Manager Group'),
        GROUP_DETAILS: linkTo('office-ui-fabric-react: Screens', 'Tool Manager Group Details')
      }}
      contactList={any.listOf(
        () => ({
          TOOL_MANAGERS: any.word()
        }),
        {size: number('number of rows', numberOfRows)}
      )}
    />
  ))
  .add('New Tool Manager Group', () => <NewGroup title={'New Group'} links={links} textFields={['ToolManager']} />)
  .add('Tool Manager Group Details', () => (
    <NewGroup
      links={links}
      title={'Group Details'}
      textFields={['ToolManager', 'AddedBy', 'LastUpdated', 'LastUpdatedBy']}
      groupDetails={any.objectWithKeys(['ToolManager', 'AddedBy', 'LastUpdated', 'LastUpdatedBy'], {
        factory: () => ({value: any.word()})
      })}
      viewOnly
    />
  ))
  .add('Edit Tool Manager Group', () => (
    <NewGroup
      title={'Edit Tool Manager'}
      links={{
        ...links
      }}
      textFields={['ToolManager']}
      groupDetails={any.objectWithKeys(['ToolManager'], {
        factory: () => ({value: any.word()})
      })}
    />
  ));

// storiesOf('office-ui-fabric-react: Screens', module)
//   .addDecorator(withKnobs)
//   .addDecorator(
//     withInfo({
//       info: 'PeoplePicker (https://developer.microsoft.com/en-us/fabric#/components/peoplepicker)',
//       inline: true,
//       header: true,
//       source: false
//     })
//   )
//   .add('SeachCardExample', () => (
//     <SeachCardExample {...{preSelected: false, image: false, presence: false, hidePersonaDetails: true}} />
//   ))
//   .add('SeachCardExample - populated', () => (
//     <div
//       style={{
//         width: '1000px',
//         paddingLeft: '150px'
//       }}
//     >
//       <SeachCardExample
//         {...{
//           preSelected: boolean('preSelected', true),
//           image: boolean('image', true),
//           presence: boolean('presence', true),
//           hidePersonaDetails: boolean('hidePersonalDetails', false)
//         }}
//       />
//     </div>
//   ));

storiesOf('office-ui-fabric', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo({inline: true, header: true, source: false}))
  .add('Button - default view', () => (
    <Button onClick={action('button-click')}>{text('Button Text', 'Click it or ticket!', 'Search Contacts')}</Button>
  ))
  .add('shimmershimmer', () => (
    <>
      <Shimmer />
    </>
  ))
  // .add('PeoplePickerTypesExampleLocal', () => (
  //   <>
  //     <PeoplePickerTypesExample />
  //   </>
  // ))
  // .add('PeoplePicker w/ delayed results', () => (
  //   <PeoplePickerTypesExample delayResults={boolean('DelayedResults', true, 'Search Contacts')} />
  // ))
  // .add('PeoplePicker w/ delayed results + options', () => <PeoplePickerTypesExample delayResults={true} options />)
  .add('Persona', () => <ShimmerLoadDataExample />)
  .add('Persona basic', () => <PersonaBadge hidePersonaDetails />)
  .add('Persona w/ image', () => <PersonaBadge hidePersonaDetails image />)
  .add('Persona w/ image + details', () => <PersonaBadge image />)
  .add('Persona w/ image + details + presence', () => <PersonaBadge presence image />)
  .add('Button Standard', () => <ButtonDefaultExample text={'Button'} primary={false} />)
  .add('Button Primary', () => <ButtonDefaultExample primary text={'Button'} />)
  .add('Contact Groups', () => <ShimmerApplicationExample />)
  .add('Contact Groups - loading', () => <ShimmerApplicationExample />)
  .add('Contact Groups - loaded', () => <ShimmerApplicationExample isDataLoaded />);

storiesOf('ButtonLinkTo', module)
  .addDecorator(jsxDecorator)
  .add('First', () => <button onClick={linkTo('ButtonLinkTo', 'Second')}>Go to "Second"</button>)
  .add('Second', () => <button onClick={linkTo('ButtonLinkTo', 'First')}>Go to "First"</button>);

storiesOf('Stories viewport', module)
  // To set a default viewport for all the stories for this component
  .addParameters({viewport: {defaultViewport: 'iphone6'}})
  .add('story - iphone6', () => <></>)
  .add('story - iphonex', () => <></>, {viewport: {defaultViewport: 'iphonex'}});

const stories = storiesOf('Button /Jest', module);

stories.add('Hello World', function() {
  const story = <button onClick={action('Hello World')}>Hello World</button>;

  specs(() =>
    describe('Hello World', function() {
      it('Should have the Hello World label', function() {
        let output = mount(story);
        expect(output.text()).toContain('Hello World');
      });
    })
  );

  return story;
});
