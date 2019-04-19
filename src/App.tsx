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
      setStateHandler: this.setThings.bind(this),
      isToolManager: this.isToolManager(),
      contactGroups: [],
      contactGroupDetails: undefined,
      apiSearchUsers: this.apiSearchUsers.bind(this),
      apiSearchContactsLegal: this.apiSearchContactsLegal.bind(this),
      apiContactGroups: this.apiContactGroups.bind(this),
      apiToolManagers: this.apiToolManagers.bind(this),
      apiContactGroupsIDAlias: this.apiContactGroupsIDAlias.bind(this),
      apiContactGroupsIDDisplayName: this.apiContactGroupsIDDisplayName.bind(this),
      apiToolManagersIDAlias: this.apiToolManagersIDAlias.bind(this),
      apiToolManagersIDDisplayName: this.apiToolManagersIDDisplayName.bind(this),
      post: ({ id, data, endpoint, method }: any) => {
        console.log('post', { id, data })
        endpoints({
          id,
          endpoint,
          method,
          data,
          thenFunc: () => {
            this.apiContactGroups()
            this.apiToolManagers()
          }

        })
      },
      toolManagers: [this.apiToolManagers()],
      delayResults: true,
      peopleList: [],
      mostRecentlyUsed: [],
      currentSelectedItems: [],
      contactList: undefined,
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
    this.apiContactGroups()
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
    this.apiSearchUsers(authContext._user.profile.name)
      .then(people => {
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

    console.log({ authContext })
    // const apiToolManagersResult = () =>
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  setThings(state: any) {
    console.log('=====setThingssetThingssetThings', { state })
    this._isMounted && this.setState(state);
  }
  async apiSearchUsers(contact: any) {
    return await endpoints({
      contact,
      endpoint: 'apiSearchUser',
      thenFunc: (response: any) => {
        const people = response.data.map((m: any) => ({
          ...m,
          text: m.displayname,
          secondaryText: m.jobtitle,
          imageUrl: m.picture
        }));
        return people;
      }
    })
  }

  async apiContactGroupsIDDisplayName({ id }: any) {
    this.setThings({
      contactGroupDetails: []
    });
    return await endpoints({
      id,
      endpoint: 'apiContactGroupsIDDisplayName',
      thenFunc: (response: { data: any; }) => {
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
      }
    })
  }
  async apiContactGroupsIDAlias({ id }: any) {
    return await endpoints({
      id,
      endpoint: 'apiContactGroupsIDAlias',
      thenFunc: (response: { data: any; }) => {
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
      }
    })
  }

  async apiSearchContactsLegal(contact: any) {
    return await endpoints({
      contact,
      endpoint: 'apiSearchContactsLegal',
      thenFunc: (response: { data: any; }) => {
        const people = [response.data].map(m => ({
          ...m,
          text: m.displayname,
          secondaryText: m.jobtitle,
          imageUrl: m.picture
        }));
        return people;
      }
    })
  }

  async apiContactGroups() {
    return await endpoints({
      alias: authContext._user.userName,
      endpoint: 'apiContactGroups',
      thenFunc: (response: { data: any; }) => {
        console.log({ response })
        this.setState({
          contactGroups: response.data
        });
        return response.data;
      }
    })
  }

  async apiToolManagers() {
    return await endpoints({
      alias: authContext._user.userName,
      endpoint: 'apiToolManagers',
      thenFunc: (response: { data: any; }) => {
        console.log('apiToolManagers', { response })
        this.setState({
          toolManagers: response.data
        });
        return response.data;
      }
    })
  }
  async isToolManager() {
    return await endpoints({
      alias: authContext._user.userName,
      endpoint: 'apiToolManagersAliasToolManager',
      thenFunc: (response: { data: { filter: (arg0: (m: any) => boolean) => { length: any; }; }; }) => {
        console.log('apiToolManagersAliasToolManager', { authContext, response })
        //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
        this.setState({
          isToolManager: response.data
        });
        return response.data;
      }
    })
  }
  async apiToolManagersIDAlias({ id }: any) {
    return await endpoints({
      id, endpoint: 'apiToolManagersIDAlias',
      thenFunc: (response: any) => {
        console.log('apiToolManagersIDAlias', { authContext, response })
        //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
        const contactGroupDetails = [response.data].map(m => ({
          ...m,
          'Tool Manager': m.toolManager,
          'Added By': m.addedBy,
          'Last Updated': m.lastUpdated,
          'Last Updated By': m.lastUpdatedBy
        }))[0];
        this.setThings({
          contactGroupDetails
        });
        return response.data;
      }
    })
  }
  async apiToolManagersIDDisplayName({ id }: any) {
    return await endpoints({
      id,
      endpoint: 'apiToolManagersIDDisplayName',
      thenFunc: (response: any) => {
        console.log('apiToolManagersIDDisplayName', { authContext, response })
        //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
        const contactGroupDetails = [response.data].map(m => ({
          ...m,
          'Tool Manager': m.toolManager,
          'Added By': m.addedBy,
          'Last Updated': m.lastUpdated,
          'Last Updated By': m.lastUpdatedBy
        }))[0];
        this.setThings({
          contactGroupDetails
        });
        return response.data;
      }
    })
  }
  render() {
    const { route } = this.state;
    console.log('=========route', { route })
    return (
      <ErrorBoundary>
        {
          {
            FindYourContact: (
              <FindYourContact
                {...this.state}
                apiSearchUsers={this.apiSearchUsers.bind(this)}
                apiSearchContactsLegal={this.apiSearchContactsLegal.bind(this)}
                onRemoveItem={() => {
                  this.state.setStateHandler({
                    currentSelectedItems: [],
                  })
                }}
                onItemSelected={(({ name }: { name?: any }) => (selectedItem?: any | undefined) => {

                  this.state.setStateHandler({ contactList: undefined })
                  selectedItem && this.state.setStateHandler({ currentSelectedItems: [selectedItem] })
                  selectedItem && this.state.apiSearchContactsLegal((selectedItem as any)['mail']).then((data: any) => {

                    console.log('onItemSelected', { name, selectedItem, props: this.state })
                    this.state.setStateHandler({
                      contactList: data,
                      contactGroupDetails: {
                        ...this.props.contactGroupDetails,
                        [name]: data.mail

                        // ...{
                        //   "id": ADD ? uuidv1() : data.id,
                        //   "name": data["Name"],
                        //   "primaryContact": data["Primary Contact"],
                        //   "secondaryContact": data["Secondary Contact"],
                        //   "ossName": data["OSS Name"],
                        //   "ossContact": data["OSS Contact"],
                        //   "leader": data["Leader"],
                        //   "lastUpdated": data["Last Updated"],
                        //   "owner": data["Owner"],
                        //   "lastUpdatedUser": data["Last Updated User"],
                        // }
                      }

                      //             contactGroupDetails: {
                      //                 ...this.props.contactGroupDetails,
                      //                 ...{
                      //     "primaryContact": data["Primary Contact"],
                      //     "secondaryContact": data["Secondary Contact"],
                      //     "ossName": data["OSS Name"],
                      //     "ossContact": data["OSS Contact"],
                      //     "leader": data["Leader"],
                      //     "lastUpdated": new Date(),
                      //     "owner": data["Owner"],
                      //     "lastUpdatedUser": data["Last Updated User"],
                      // },
                      // ...{
                      //     displayname: "Josh McCall",
                      //     id: "96e741e8-17fa-4808-b50b-d3fc6fbbdabe",
                      //     imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA…",
                      //     jobtitle: "SOFTWARE ENGINEER",
                      //     mail: "jomccal@microsoft.com",
                      //     officelocation: "MILLENNIUM A/1181",
                      //     picture: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA…",
                      //     secondaryText: "SOFTWARE ENGINEER",
                      //     text: "Josh McCall",
                      // }

                    })

                  })
                  return selectedItem ? selectedItem : null
                })({})}
              />
            ),
            TOOL_MANAGERS: [
              <ToolManagers
                {...this.state}
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
                title={"Contact Groups"}
                {...this.state}
                links={{
                  ...this.state.links,
                  // ADD: this.state.links.ADD('_CONTACT_GROUP')
                }}
                columns={
                  [
                    { fieldName: "Name", key: "Name", minWidth: 70, maxWidth: 70, name: "Name" },
                    { fieldName: "Primary", key: "Primary", minWidth: 70, name: "Primary" },
                    { fieldName: "Lead", key: "Lead", minWidth: 70, maxWidth: 70, name: "Lead" },
                    { fieldName: "Actions", key: "Actions", minWidth: 90, name: "Actions" }
                  ]
                }
                contactList={
                  this.state.contactGroups && this.state.contactGroups.map((m: { name: any; primaryContact: any; secondaryContact: any; leader: any; ossName: any; ossContact: any; }) => ({
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
                {...this.state}
                title={'New Contact Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.GROUP_DETAILS,
                  EDIT: this.state.links.GROUP_DETAILS,
                }}
                textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
                CONTACT
                ADD
              />
            ],
            EDIT_CONTACT_GROUP: [
              <Group
                {...this.state}
                title={'Edit Contact Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.GROUP_DETAILS,
                  EDIT: () => {

                    this.state.apiContactGroupsIDAlias({ id: this.state.contactGroupDetails.id })
                    this.state.links.GROUP_DETAILS()
                  },
                }}

                textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
                groupDetails={this.state.contactGroupDetails}
                hasGroupDetails
                CONTACT
                ADD
              />],

            VIEW_CONTACT_GROUP: [
              <Group
                {...this.state}
                title={'View Contact Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.GROUP_DETAILS,
                  EDIT: () => {
                    this.state.links.EDIT('_CONTACT_GROUP')()
                    this.state.apiContactGroupsIDDisplayName({ id: this.state.contactGroupDetails.id })
                  }
                }}
                textFields={[
                  'Name',
                  'Primary Contact',
                  'Secondary Contact',
                  'OSS Name',
                  'OSS Contact',
                  'Leader',
                  'Last Updated',
                  'Owner',
                  'Last Updated User',
                ]}
                groupDetails={this.state.contactGroupDetails}
                hasGroupDetails
                viewOnly
              />
            ],
            ADD_TOOL_MANAGER: [
              <Group
                {...this.state}
                title={'New Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.TOOL_MANAGERS,
                  EDIT: this.state.links.TOOL_MANAGERS
                }}
                textFields={[
                  'Tool Manager'
                ]}
                ADD
              />],

            EDIT_TOOL_MANAGER: [
              <Group
                {...this.state}
                title={'Edit Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.TOOL_MANAGERS,
                  EDIT: () => {
                    this.state.links.TOOL_MANAGERS()
                    this.state.apiToolManagersIDAlias({ id: this.state.contactGroupDetails.id })
                  }
                }}
                textFields={[
                  'Tool Manager'
                ]}
                groupDetails={this.state.contactGroupDetails}
                ADD
              />],
            VIEW_TOOL_MANAGER: [
              <Group
                {...this.state}
                title={'View Group'}
                links={{
                  ...this.state.links,
                  BACK: this.state.links.TOOL_MANAGERS,
                  EDIT: () => {
                    this.state.links.EDIT('_TOOL_MANAGER')()
                    this.state.apiToolManagersIDAlias({ id: this.state.contactGroupDetails.id })
                  }
                }}
                textFields={[
                  'Tool Manager',
                  'Added By',
                  'Last Updated',
                  'Last Updated By'
                ]}
                groupDetails={this.state.contactGroupDetails}
                viewOnly
              />]
          }[route]
        }
      </ErrorBoundary>
    );
  }
}

export default App;

export const endpoints = ({ alias, id, endpoint, contact, thenFunc, method, data }: any) => {
  const config = {
    method: method ? method : 'GET',
    data
  }; //enpointConfig({ method: 'GET' })
  console.log(' ===== endpoints', { alias, id, endpoint, config })
  return adalApiFetch(
    axios,
    ({
      apiContactGroups: `${endpointBaseUrl}/api/ContactGroups/`,
      apiContactGroupsIDAlias: `${endpointBaseUrl}/api/ContactGroups/${id}/alias`,
      apiContactGroupsIDDisplayName: `${endpointBaseUrl}/api/ContactGroups/${id}/DisplayName`,
      apiSearchContactsLegal: `${endpointBaseUrl}/api/Search/Contacts/Legal/${contact}`,
      apiSearchUser: `${endpointBaseUrl}/api/Search/Users/${contact}`,
      apiToolManagers: `${endpointBaseUrl}/api/ToolManagers`,
      apiToolManagersAliasToolManager: `${endpointBaseUrl}/api/ToolManagers/${alias}/ToolManager`,
      apiToolManagersIDAlias: `${endpointBaseUrl}/api/ToolManagers/${id}/Alias`,
      apiToolManagersIDDisplayName: `${endpointBaseUrl}/api/ToolManagers/${id}/DisplayName`,
    })[endpoint],
    config
  )
    .then(thenFunc)
    .catch((error: any) => {
      // thenFunc()
      // this.state.apiContactGroups()
      // this.state.apiToolManagers()
      console.log({ error });
    });
};

export const endpointBaseUrl = `https://fyc-dev.azurewebsites.net`;
// window.location.hostname === 'localhost'
//   ? `https://cors-anywhere.herokuapp.com/fyc-dev.azurewebsites.net`
//   : `https://fyc-dev.azurewebsites.net`;

export const enpointConfig = ({ method }: any) => { method };
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please refresh the page. </h1>;
    }

    return this.props.children;
  }
}