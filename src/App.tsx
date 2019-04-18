import React, { Component } from 'react';
import './App.css';
import FindYourContact from './stories/FindYourContact';
import axios from 'axios';
import ContactGroup, { Group, ToolManagers } from './stories/TableView';
const { authContext, adalApiFetch } = require('./adalConfig');

class App extends Component<any, any>{
  _isMounted: boolean;
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      setStateHandler: this.setThings,
      isToolManager: this.isToolManager(),
      contactGroups: [this.apiContactGroups()],
      contactGroupDetails: undefined,
      apiContactGroupsIDAlias: this.apiContactGroupsIDAlias.bind(this),
      apiContactGroupsIDDisplayName: this.apiContactGroupsIDDisplayName.bind(this),
      toolManagers: [this.apiToolManagers()],
      delayResults: true,
      peopleList: [],
      mostRecentlyUsed: [],
      currentSelectedItems: [],
      contactList: [],
      route: 'FindYourContact',
      links: {
        HOME: () => this.setState({ route: 'FindYourContact' }),
        ADD: (param: any) => () => this.setState({ route: `ADD${param}` }),
        // OK: () => this.setState({ route: 'OK' }),
        TOOL_MANAGERS: () => this.setState({ route: 'TOOL_MANAGERS' }),
        GROUP_DETAILS: () => this.setState({ route: 'GROUP_DETAILS' }),
        VIEW: (param: any) => () => this.setState({ route: `VIEW${param}` }),
        EDIT: (param: any) => () => this.setState({ route: `EDIT${param}` }),
        DELETE: (param: any) => () => console.log('DELETE'),
      }
    };
    this.setThings = this.setThings.bind(this);
    this._isMounted = false;
    this.apiSearchContactsLegal(authContext._user.userName)
      .then(people => {
        this.setThings({
          // peopleList: people,
          // currentSelectedItems: people,
          // mostRecentlyUsed: people,
          contactList: people
        });
        return people;
      })
      .catch(function (error) {
        console.log({ error });
      });
    this.apiSearchUsers(authContext._user.profile.name).then(people => {
      const uniquePeople = people && people.map((m: { mail: any; }) => {
        return { [m.mail]: m };
      });
      const peopleList = Object.values({ ...this.state.peopleListObject, ...uniquePeople }).map(m => {
        return m[Object.keys(m)[0]];
      });
      this.setThings({
        // peopleList: [...people]
        peopleListObject: { ...this.state.peopleListObject, ...uniquePeople },
        peopleList,
        mostRecentlyUsed: peopleList
      });
      this.setThings({
        currentSelectedItems: Object.values({ ...this.state.peopleListObject, ...uniquePeople }).map(m => {
          // Object.keys({'a': {'a':'b'}})[0]
          return m[Object.keys(m)[0]];
        })
      });
    });

    // const apiToolManagersResult = () =>
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  setThings(state: any) {
    this._isMounted && this.setState(state);
  }
  async apiSearchUsers(contact: any) {
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints({}).apiSearchUser}${contact}`, enpointConfig)
      .then(function (response: { data: { map: (arg0: (m: any) => any) => void; }; }) {
        const people = response.data.map(m => ({
          ...m,
          text: m.displayname,
          secondaryText: m.jobtitle,
          imageUrl: m.picture
        }));
        return people;
      })
      .catch(function (error: any) {
        console.log({ error });
      });
  }

  async apiContactGroupsIDDisplayName({ id }: any) {
    return await adalApiFetch(
      axios,
      `${endpointBaseUrl}${endpoints({ id }).apiContactGroupsIDDisplayName}`,
      enpointConfig
    ).then((response: { data: any; }) => {
      const contactGroupDetails = [response.data].map(m => ({
        ...m,
        'Name': m.name,
        'Primary Contact': m.primaryContact,
        'Secondary Contact': m.secondaryContact,
        'Leader': m.leader,
        'OSS Name': m.ossName,
        'OSS Contact': m.ossContact,
        'Last Updated User': m.lastUpdatedUser,
      }))[0];
      this.setThings({
        contactGroupDetails
      });
      console.log('contactGroupDetails', { contactGroupDetails })
      return contactGroupDetails;
    });
  }
  async apiContactGroupsIDAlias({ id }: any) {
    return await adalApiFetch(
      axios,
      `${endpointBaseUrl}${endpoints({ id }).apiContactGroupsIDAlias}`,
      enpointConfig
    ).then((response: { data: any; }) => {
      const contactGroupDetails = [response.data].map(m => ({
        ...m,
        'Name': m.name,
        'Primary Contact': m.primaryContact,
        'Secondary Contact': m.secondaryContact,
        'OSS Name': m.ossName,
        'OSS Contact': m.ossContact,
        'Leader': m.leader,
        'Last Updated': m.lastUpdated,
        'Owner': m.owner,
        'Last Updated User': m.lastUpdatedUser,
      }))[0];
      this.setThings({
        contactGroupDetails
      });
      console.log('contactGroupDetails', { contactGroupDetails })
      return contactGroupDetails;
    });
  }

  async apiSearchContactsLegal(contact: any) {
    return await adalApiFetch(
      axios,
      `${endpointBaseUrl}${endpoints({}).apiSearchContactsLegal}${contact}`,
      enpointConfig
    ).then(function (response: { data: any; }) {
      const people = [response.data].map(m => ({
        ...m,
        text: m.displayname,
        secondaryText: m.jobtitle,
        imageUrl: m.picture
      }));
      return people;
    });
  }

  async apiContactGroups() {
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints({}).apiContactGroups}`, enpointConfig)
      .then((response: { data: any; }) => {
        console.log({ response })
        this.setState({
          contactGroups: response.data
        });
        return response.data;
      })
      .catch(function (error: any) {
        console.log({ error });
      });
  }

  async apiToolManagers() {
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints({}).apiToolManagers}`, enpointConfig)
      .then((response: { data: any; }) => {
        console.log('apiToolManagers', { response })
        this.setState({
          toolManagers: response.data
        });
        return response.data;
      })
      .catch(function (error: any) {
        console.log({ error });
      });
  }
  async isToolManager() {
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints({ alias: authContext._user.userName }).apiToolManagersAliasToolManager}`, enpointConfig)
      .then((response: { data: { filter: (arg0: (m: any) => boolean) => { length: any; }; }; }) => {
        console.log('apiToolManagersAliasToolManager', { authContext, response })
        //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
        this.setState({
          isToolManager: response.data
        });
        return response.data;
      })
      .catch(function (error: any) {
        console.log({ error });
      });
  }

  render() {
    const { route } = this.state;
    console.log('=========route', { route })
    return (
      <>
        {
          {
            FindYourContact: (
              <FindYourContact
                {...this.state}
                apiSearchUsers={this.apiSearchUsers.bind(this)}
                apiSearchContactsLegal={this.apiSearchContactsLegal.bind(this)}
              />
            ),
            TOOL_MANAGERS: [
              <ToolManagers
                links={{
                  ...this.state.links,
                  // ADD: linkTo('office-ui-fabric-react: Screens', 'New Tool Manager Group'),
                  // EDIT: linkTo('office-ui-fabric-react: Screens', 'Edit Tool Manager Group'),
                  // GROUP_DETAILS: linkTo('office-ui-fabric-react: Screens', 'Tool Manager Group Details')
                }}
                contactList={
                  this.state.toolManagers.map((m: { toolManager: any; }) =>
                    ({
                      TOOL_MANAGERS: m.toolManager,
                      ...m
                    })
                  )
                }
              />
            ],
            GROUP_DETAILS: [
              <ContactGroup
                {...{ ...this.state }}
                links={{
                  ...this.state.links,
                  // ADD: this.state.links.ADD('_CONTACT_GROUP')
                }}
                contactList={
                  this.state.contactGroups.map((m: { name: any; primaryContact: any; secondaryContact: any; leader: any; ossName: any; ossContact: any; }) => ({
                    Name: m.name,
                    Primary: m.primaryContact,
                    Secondary: m.secondaryContact,
                    Lead: m.leader,
                    OSS_NAME: m.ossName,
                    OSS_CONTACT: m.ossContact,
                    ...m
                  }))

                }
              />
            ],
            ADD_CONTACT_GROUP: [
              <Group
                title={'New Contact Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.GROUP_DETAILS,
                  EDIT: this.state.links.GROUP_DETAILS,
                }}
                textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']} />
            ],
            EDIT_CONTACT_GROUP: [
              <Group
                title={'Edit Contact Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.GROUP_DETAILS,
                  EDIT: this.state.links.GROUP_DETAILS,
                }}

                textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
                groupDetails={this.state.contactGroupDetails}
                hasGroupDetails
              />],

            VIEW_CONTACT_GROUP: [
              <Group
                title={'View Contact Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.GROUP_DETAILS,
                  EDIT: this.state.links.EDIT('_CONTACT_GROUP')
                }}
                textFields={[
                  'Name',
                  'Primary Contact',
                  'Secondary Contact',
                  'Leader',
                  'OSS Name',
                  'OSS Contact'
                ]}
                groupDetails={this.state.contactGroupDetails}
                hasGroupDetails
                viewOnly
              />
            ],
            ADD_TOOL_MANAGER: [
              <Group
                title={'New Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.TOOL_MANAGERS,
                  EDIT: this.state.links.TOOL_MANAGERS
                }}
                textFields={['Tool Manager']}
              />],

            EDIT_TOOL_MANAGER: [
              <Group
                title={'Edit Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.TOOL_MANAGERS,
                  EDIT: this.state.links.TOOL_MANAGERS
                }}
                textFields={['Tool Manager']}
                groupDetails={this.state.contactGroups}
              />],
            VIEW_TOOL_MANAGER: [
              <Group
                title={'View Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.TOOL_MANAGERS,
                  EDIT: this.state.links.EDIT('_TOOL_MANAGER')
                }}
                textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
              />]
          }[route]
        }
      </>
    );
  }
}

export default App;

export const endpoints = (params: any) => {
  const { alias, id } = params;
  return ({
    apiContactGroups: '/api/ContactGroups/',
    apiContactGroupsIDAlias: `/api/ContactGroups/${id}/alias`,
    apiContactGroupsIDDisplayName: `/api/ContactGroups/${id}/DisplayName`,
    apiSearchContactsLegal: '/api/Search/Contacts/Legal/',
    apiSearchContactsOSS: '/api/Search/Contacts/OSS/',
    apiSearchUser: '/api/Search/Users/',
    apiToolManagers: '/api/ToolManagers',
    apiToolManagersAliasToolManager: `/api/ToolManagers/${alias}/ToolManager`,
  });
};

export const endpointBaseUrl = `https://fyc-dev.azurewebsites.net`;
// window.location.hostname === 'localhost'
//   ? `https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net`
//   : `https://fyc-dev.azurewebsites.net`;

export const enpointConfig = { method: 'GET' };
