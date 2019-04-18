import React, { Component } from 'react';
import './App.css';
import FindYourContact from './stories/FindYourContact';
import axios from 'axios';
import ContactGroup, { NewGroup } from './stories/TableView';
const { authContext, adalApiFetch } = require('./adalConfig');

class App extends Component<any, any>{
  _isMounted: boolean;
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      isToolManager: this.isToolManager(),
      groupDetails: [this.apiToolManagers()],
      delayResults: true,
      peopleList: [],
      mostRecentlyUsed: [],
      currentSelectedItems: [],
      contactList: [],
      route: 'FindYourContact',
      links: {
        HOME: () => this.setState({ route: 'FindYourContact' }),
        ADD: (param: any) => () => this.setState({ route: `ADD${param}` }),
        OK: () => this.setState({ route: 'OK' }),
        TOOL_MANAGERS: () => this.setState({ route: 'TOOLS_MANAGER' }),
        GROUP_DETAILS: () => this.setState({ route: 'GROUP_DETAILS' }),
        // GROUP_DETAILS: () => this.setState({ route: 'GROUP_DETAILS' }),
        EDIT: () => this.setState({ route: 'EDIT' }),
        DELETE: () => console.log('DELETE'),
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
  setThings(state: { contactList?: any; peopleListObject?: any; peopleList?: any[]; mostRecentlyUsed?: any[]; currentSelectedItems?: any[]; }) {
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

  async apiToolManagers() {
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints({}).apiContactGroups}`, enpointConfig)
      .then((response: { data: any; }) => {
        console.log({ response })
        this.setState({
          groupDetails: response.data
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
    return (
      <>
        {
          {
            FindYourContact: (
              <FindYourContact
                {...this.state}
                setStateHandler={this.setThings}
                apiSearchUsers={this.apiSearchUsers.bind(this)}
                apiSearchContactsLegal={this.apiSearchContactsLegal.bind(this)}
              />
            ),
            GROUP_DETAILS: [
              <ContactGroup

                links={{
                  ...this.state.links
                }}
                contactList={
                  this.state.groupDetails.map((m: { name: any; primaryContact: any; secondaryContact: any; leader: any; ossName: any; ossContact: any; }) => ({
                    Name: m.name,
                    Primary: m.primaryContact,
                    Secondary: m.secondaryContact,
                    Lead: m.leader,
                    OSS_NAME: m.ossName,
                    OSS_CONTACT: m.ossContact

                  }))

                }
              />
            ],
            "ADD_CONTACT_GROUP": [<NewGroup
              title={'New Group'}
              links={this.state.links}
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
  const { alias } = params;
  return ({
    apiContactGroups: '/api/ContactGroups/',
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
