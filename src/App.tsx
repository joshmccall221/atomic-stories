import React, { Component } from 'react';
import './App.css';
import FindYourContact from './stories/FindYourContact';
import axios from 'axios';
import ContactGroup, { } from './stories/TableView';
const { authContext, adalApiFetch } = require('./adalConfig');

class App extends Component<any, any>{
  _isMounted: boolean;
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      isToolManager: this.isToolManager(),
      groupDetails: [],
      delayResults: true,
      peopleList: [],
      mostRecentlyUsed: [],
      currentSelectedItems: [],
      contactList: [],
      route: 'FindYourContact',
      links: {
        HOME: () => this.setState({ route: 'FindYourContact' }),
        ADD: () => this.setState({ route: 'ADD' }),
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
        console.log('=======thenPeople', { people });
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
      console.log('people', { people });
      const uniquePeople = people.map((m: { mail: any; }) => {
        return { [m.mail]: m };
      });
      const peopleList = Object.values({ ...this.state.peopleListObject, ...uniquePeople }).map(m => {
        console.log({ m });
        // Object.keys({'a': {'a':'b'}})[0]
        return m[Object.keys(m)[0]];
      });
      console.log('============people', { people, uniquePeople });
      this.setThings({
        // peopleList: [...people]
        peopleListObject: { ...this.state.peopleListObject, ...uniquePeople },
        peopleList,
        mostRecentlyUsed: peopleList
      });
      this.setThings({
        currentSelectedItems: Object.values({ ...this.state.peopleListObject, ...uniquePeople }).map(m => {
          console.log('setCurrentSelectedItems', { m });
          // Object.keys({'a': {'a':'b'}})[0]
          return m[Object.keys(m)[0]];
        })
      });
      console.log('apiSearchUsers', { people });
    });
    this.apiToolManagers()
      .then((response: { data: any; }) => {
        this.setState({
          groupDetails: response.data
        });
        return response.data;
      })
      .catch(function (error: any) {
        console.log({ error });
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
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiSearchUser}${contact}`, enpointConfig)
      .then(function (response: { data: { map: (arg0: (m: any) => any) => void; }; }) {
        console.log('apiSearchUsers', { response });
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
    console.log('apiSearchContactsLegal', { contact });
    return await adalApiFetch(
      axios,
      `${endpointBaseUrl}${endpoints.apiSearchContactsLegal}${contact}`,
      enpointConfig
    ).then(function (response: { data: any; }) {
      console.log('apiSearchUsers', { response });
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
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiToolManagers}`, enpointConfig)
  }
  async isToolManager() {
    return await adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiToolManagers}`, enpointConfig)
      .then(function (response: { data: { filter: (arg0: (m: any) => boolean) => { length: any; }; }; }) {
        const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.name).length;
        console.log('constructor ===========', { authContext, isToolManager });
        // this.setThings({
        //   isToolManager
        // });
        console.log('constructor ===========', { authContext, isToolManager });
        return isToolManager;
      })
      .catch(function (error: any) {
        console.log({ error });
      });
  }

  render() {
    const { route } = this.state;
    console.log('!!!!!!!!!!!!!!!  State', { state: this.state });
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
                  this.state.groupDetails.map((m: { toolManager: any; }) => ({
                    Name: m.toolManager || 'Name',
                    Primary: 'Primary',
                    Secondary: 'Secondary',
                    Lead: 'Lead',
                    OSS_NAME: 'OSS_NAME',
                    OSS_CONTACT: 'OSS_CONTACT'

                  }))

                }
              />
            ]
          }[route]
        }
      </>
    );
  }
}

export default App;

export const endpoints = {
  apiSearchContactsLegal: '/api/Search/Contacts/Legal/',
  apiSearchContactsOSS: '/api/Search/Contacts/OSS/',
  apiSearchUser: '/api/Search/Users/',
  apiToolManagers: '/api/ToolManagers'
};

export const endpointBaseUrl =
  window.location.hostname === 'localhost'
    ? `https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net`
    : `https://fyc-dev.azurewebsites.net`;

export const enpointConfig = { method: 'GET' };
