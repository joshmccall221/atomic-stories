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
  }
  setThings(state) {
    this.setState(state);
  }
  componentDidMount() {
    this.getStuff();
  }
  getStuff() {
    console.log({authContext});

    adalApiFetch(axios, `${endpointBaseUrl}${endpoints.searchLegalContact}${authContext._user.userName}`, enpointConfig)
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
    return <FindYourContact {...this.state} setStateHandler={this.setThings} />;
  }
}

export default App;

export const endpoints = {
  searchLegalContact: '/api/Search/Contacts/Legal/'
};

export const endpointBaseUrl =
  window.location.hostname == 'localhost'
    ? `https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net`
    : `https://fyc-dev.azurewebsites.net`;

export const enpointConfig = {method: 'GET'};
