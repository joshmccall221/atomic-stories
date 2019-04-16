import React, {Component} from 'react';
import './App.css';
import FindYourContact from './stories/FindYourContact';
import axios from 'axios';
import {adalApiFetch} from './adalConfig';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleList: [],
      currentSlectedItems: [],
      mostRecentlyUsed: [],
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
    adalApiFetch(
      axios,
      window.location.hostname
        ? 'https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net/api/search/users/josh'
        : 'https://fyc-dev.azurewebsites.net/api/search/users/josh',
      {method: 'GET'}
    )
      .then(function(response) {
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
          peopleList: people,
          currentSlectedItems: people,
          mostRecentlyUsed: people,
          contactList: people
        });
        console.log({people});
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    const {peopleList, currentSlectedItems, mostRecentlyUsed, contactList} = this.state;
    return (
      <FindYourContact
        peopleList={peopleList}
        currentSlectedItems={currentSlectedItems}
        mostRecentlyUsed={mostRecentlyUsed}
        contactList={contactList}
      />
    );
  }
}

export default App;
