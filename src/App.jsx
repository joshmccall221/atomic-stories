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
      contactList: []
    };
    this.setThings = this.setThings.bind(this);
    this._isMounted = false;
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
  componentWillMount() {
    // this.getStuff();
    this.apiSearchContactsLegal(authContext._user.userName);
  }
  getStuff() {
    console.log({authContext});
  }
  apiSearchUsers(contact) {
    adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiSearchUser}${contact}`, enpointConfig)
      .then(function(response) {
        console.log({response});

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
        this.setThings({
          peopleList: [...people]
          // peopleList: [...people, ...this.state.peopleList]
          // mostRecentlyUsed: people
          // currentSelectedItems: people
          // peopleList: people
        });
        console.log('apiSearchUsers', {people});
      })
      .catch(function(error) {
        console.log({error});
      });
  }
  apiSearchContactsLegal(contact) {
    adalApiFetch(axios, `${endpointBaseUrl}${endpoints.apiSearchContactsLegal}${contact}`, enpointConfig)
      .then(function(response) {
        console.log({response});

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
          peopleList: people,
          currentSlectedItems: people,
          mostRecentlyUsed: people,
          contactList: people
        });
        console.log({people});
      })
      .catch(function(error) {
        console.log({error});
      });
  }
  render() {
    const {peopleList, currentSlectedItems, mostRecentlyUsed, contactList} = this.state;
    return (
      <FindYourContact
        {...this.state}
        setStateHandler={this.setThings}
        apiSearchUsers={this.apiSearchUsers.bind(this)}
      />
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
  window.location.hostname == 'localhost'
    ? `https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net`
    : `https://fyc-dev.azurewebsites.net`;

export const enpointConfig = {method: 'GET'};
