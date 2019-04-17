import React, {Component} from 'react';
import './App.css';
import FindYourContact from './stories/FindYourContact';
import axios from 'axios';
import {authContext, adalApiFetch} from './adalConfig';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delayResults: true,
      peopleList: [],
      mostRecentlyUsed: [],
      currentSelectedItems: [],
      contactList: [],
      route: 'FindYourContact',
      links: {
        HOME: () => this.setState({route: 'FindYourContact'}),
        ADD: () => this.setState({route: 'ADD'}),
        OK: () => this.setState({route: 'OK'}),
        TOOL_MANAGERS: () => this.setState({route: 'TOOLS_MANAGER'}),
        GROUP_DETAILS: () => this.setState({route: 'GROUP_DETAILS'}),
        EDIT: () => this.setState({route: 'EDIT'}),
        DELETE: () => console.log('DELETE'),
        SETTINGS: () => console.log('SETTINGS')
      }
    };
    this.setThings = this.setThings.bind(this);
    this._isMounted = false;
    this.apiSearchContactsLegal(authContext._user.userName);
    this.apiSearchUsers(authContext._user.profile.name, true);

    console.log({authContext});
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  setThings(state) {
    this._isMounted && this.setState(state);
  }
  apiSearchUsers(contact, setCurrentSelectedItems) {
    adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiSearchUser}${contact}`, enpointConfig)
      .then(function(response) {
        console.log('apiSearchUsers', {response});
        const people = response.data.map(m => ({
          ...m,
          text: m.displayname,
          secondaryText: m.jobtitle,
          imageUrl: m.picture
        }));
        return people;
      })
      .then(people => {
        console.log('people', {people});
        const uniquePeople = people.map(m => {
          return {[m.mail]: m};
        });
        const peopleList = Object.values({...this.state.peopleListObject, ...uniquePeople}).map(m => {
          console.log({m});
          // Object.keys({'a': {'a':'b'}})[0]
          return m[Object.keys(m)[0]];
        });
        console.log('============people', {people, uniquePeople});
        this.setThings({
          // peopleList: [...people]
          peopleListObject: {...this.state.peopleListObject, ...uniquePeople},
          peopleList,
          mostRecentlyUsed: peopleList
        });
        setCurrentSelectedItems &&
          this.setThings({
            currentSelectedItems: Object.values({...this.state.peopleListObject, ...uniquePeople}).map(m => {
              console.log('setCurrentSelectedItems', {m});
              // Object.keys({'a': {'a':'b'}})[0]
              return m[Object.keys(m)[0]];
            })
          });
        console.log('apiSearchUsers', {people});
      })
      .catch(function(error) {
        console.log({error});
      });
  }
  apiSearchContactsLegal(contact) {
    console.log('apiSearchContactsLegal', {contact});
    adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiSearchContactsLegal}${contact}`, enpointConfig)
      .then(function(response) {
        console.log('apiSearchContactsLegal', {response});
        const people = [response.data].map(m => ({
          ...m,
          text: m.displayname,
          secondaryText: m.jobtitle,
          imageUrl: m.picture
        }));
        return people;
      })
      .then(people => {
        this.setThings({
          // peopleList: people,
          // currentSelectedItems: people,
          // mostRecentlyUsed: people,
          contactList: people
        });
        console.log({people});
      })
      .catch(function(error) {
        console.log({error});
      });
  }
  render() {
    const {route} = this.state;
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
            )
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
  apiSearchUser: '/api/Search/Users/'
};

export const endpointBaseUrl =
  window.location.hostname === 'localhost'
    ? `https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net`
    : `https://fyc-dev.azurewebsites.net`;

export const enpointConfig = {method: 'GET'};
