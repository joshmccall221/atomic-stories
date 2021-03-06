import React, { Component } from 'react';
import './App.css';
import FindYourContact from './stories/FindYourContact';
import axios from 'axios';
import ContactGroup, { Group, ToolManagers } from './stories/TableView';
const { authContext, adalApiFetch } = require('./adalConfig');
const uuid = require('uuid');

class App extends Component<any, any>{
  _isMounted: boolean;
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      contactGroups: [],
      contactGroupDetails: undefined,
      toolManagers: [],
      delayResults: true,
      peopleList: [],
      mostRecentlyUsed: [],
      currentSelectedItems: [],
      contactList: undefined,
      route: 'FindYourContact',
      links: {
        HOME: () => {
          this.setState({
            route: 'FindYourContact',
            currentSelectedItems: undefined,
            contactList: undefined,
            toolManagers: undefined,
            contactGroupDetails: undefined,
            contactGroups: undefined,
            groupDetails: undefined,
          })
          this.state.apiToolManagers();
          this.state.apiContactGroups();
          this.state.apiSearchUsers(authContext._user.profile.name)
            .then((people: any) => {
              const peopleListObject = { ...this.state.peopleListObject, ...people && people.map((m: { mail: any; }) => ({ [m.mail]: m })) }
              const peopleList = Object.values(peopleListObject).map(m => m[Object.keys(m)[0]]);
              this.setState({
                peopleListObject,
                peopleList,
                mostRecentlyUsed: peopleList,
                currentSelectedItems: {
                  main: peopleList
                }
              });
            });
          this.state.apiSearchContactsLegal(authContext._user.userName);
        },
        // OK: () => this.setState({ route: 'OK' }),
        TOOL_MANAGERS: () => {
          this.setState({
            route: 'TOOL_MANAGERS',
            currentSelectedItems: [],
            contactList: [],
            toolManagers: []
          })
          this.state.apiToolManagers();
          this.state.apiContactGroups();
        },
        GROUP_DETAILS: () => {
          this.setState({
            route: 'GROUP_DETAILS',
            currentSelectedItems: [],
            contactList: [],
            toolManagers: []
          })
          this.state.apiToolManagers();
          this.state.apiContactGroups();
        },
        ADD: (param: any) => () => {
          this.setState({
            route: `ADD${param}`,
            currentSelectedItems: [],
            contactList: undefined,
            toolManagers: undefined,
            contactGroupDetails: undefined,
            contactGroups: undefined,
            groupDetails: undefined,
          })
          this.state.apiToolManagers();
          this.state.apiContactGroups();
        },
        VIEW: (param: any) => (row: any) => {
          this.setState({
            route: `VIEW${param}`,
            currentSelectedItems: [],
            contactList: [],
            toolManagers: [],
            contactGroupDetails: undefined
          })

          if (param === "_CONTACT_GROUP") {

            this.state.apiContactGroupsIDDisplayName({ id: row.id })
          }
          if (param === "_TOOL_MANAGER") {
            this.state.apiToolManagersIDDisplayName({ id: row.id })
          }
          // EDIT: () => this.props.apiContactGroupsIDAlias({ id: row.id })
          // this.props.apiContactGroupsIDDisplayName({ id: row.id })
        },
        EDIT: (param: any) => (row: any) => {
          this.setState({
            route: `EDIT${param}`,
            currentSelectedItems: undefined,
            contactList: [],
            toolManagers: []
          })
          if (param === "_CONTACT_GROUP") {
            this.state.apiContactGroupsIDAlias({ id: row.id })
              .then((contactGroupsIDAlias: any) => {
                [
                  'Primary Contact',
                  'Secondary Contact',
                  'Leader',
                ].map((m: any) => {

                  this.state.apiSearchUsers(contactGroupsIDAlias[m])
                    .then((people: any) => {
                      const peopleListObject = {
                        ...this.state.peopleListObject,
                        ...people && people.map((m: { mail: any; }) => ({ [m.mail]: m }))
                      }
                      const peopleList = Object.values(peopleListObject).map(m => m[Object.keys(m)[0]]);
                      this.setState({
                        peopleListObject,
                        peopleList,
                        mostRecentlyUsed: peopleList,
                        currentSelectedItems: {
                          ...this.state.currentSelectedItems,
                          [m]: peopleList
                        }
                      });
                    });
                })
              });

          }
          if (param === "_TOOL_MANAGER") {
            // this.state.apiToolManagersIDDisplayName({ id: row.id })

            // this.state.apiToolManagersIDAlias({ id: this.state.contactGroupDetails.id });

            this.state.apiToolManagersIDAlias({ id: row.id })
              .then((apiToolManagersIDAlias: any) => {
                [
                  'Tool Manager',
                ].map((m: any) => {

                  this.state.apiSearchUsers(apiToolManagersIDAlias.toolManager)
                    .then((people: any) => {
                      const peopleListObject = {
                        ...this.state.peopleListObject,
                        ...people && people.map((m: { mail: any; }) => ({ [m.mail]: m }))
                      }
                      const peopleList = Object.values(peopleListObject).map(m => m[Object.keys(m)[0]]);
                      this.setState({
                        peopleListObject,
                        peopleList,
                        mostRecentlyUsed: peopleList,
                        currentSelectedItems: {
                          ...this.state.currentSelectedItems,
                          [m]: peopleList
                        }
                      });
                    });
                })
              });

          }
          // this.state.apiToolManagersIDAlias({ id: this.state.contactGroupDetails.id });
        },
        DELETE: (param: any) => (row: any) => {

          this.setState({
            contactGroups: [],
            groupDetails: [],
            toolManagers: []
          })
          if (param === "_CONTACT_GROUP") {
            this.state.post({
              id: row.id,
              method: 'DELETE',
              endpoint: 'apiContactGroups',

            })
          }
          if (param === "_TOOL_MANAGER") {
            this.state.post({
              id: row.id,
              method: 'DELETE',
              endpoint: 'apiToolManagers',

            })
          }
        }
      },
      setState: (state: any) => this.setState(state),
      // isToolManager: this.isToolManager(),
      isToolManager:
        async () => {
          return await endpoints({
            alias: authContext._user.userName,
            endpoint: 'apiToolManagersAliasToolManager',
            thenFunc: (response: { data: { filter: (arg0: (m: any) => boolean) => { length: any; }; }; }) => {
              //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
              this.setState({
                isToolManager: response.data
              });
              return response.data;
            }
          })
        },
      // apiSearchUsers: this.apiSearchUsers.bind(this),
      apiSearchUsers:
        async (contact: any, key: any) => {
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

        },
      // apiSearchContactsLegal: this.apiSearchContactsLegal.bind(this),
      apiSearchContactsLegal:
        async (contact: any) => {
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
            .then((people: any) => {
              this.setState({
                contactList: people
              });
              return people;
            })
            .catch((error: any) => {
              console.log({ error });
            })
        },
      // apiContactGroups: this.apiContactGroups.bind(this),
      apiContactGroups:
        async () => {
          return await endpoints({
            alias: authContext._user.userName,
            endpoint: 'apiContactGroups',
            thenFunc: (response: { data: any; }) => {
              this.setState({
                contactGroups: response.data
              });
              return response.data;
            }
          })
        },
      // apiToolManagers: this.apiToolManagers.bind(this),
      apiToolManagers:
        async () => {
          return await endpoints({
            alias: authContext._user.userName,
            endpoint: 'apiToolManagers',
            thenFunc: (response: { data: any; }) => {
              this.setState({
                toolManagers: response.data
              });
              return response.data;
            }
          })
        },
      // apiContactGroupsIDAlias: this.apiContactGroupsIDAlias.bind(this),
      apiContactGroupsIDAlias:
        async ({ id }: any) => {
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
              this.setState({
                contactGroupDetails
              });
              return contactGroupDetails;
            }
          })
        },
      apiContactGroupsIDDisplayName:
        async ({ id }: any) => {
          this.setState({
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
              this.setState({
                contactGroupDetails
              });
              return contactGroupDetails;
            }
          })
        },
      // apiToolManagersIDAlias: this.apiToolManagersIDAlias.bind(this),
      apiToolManagersIDAlias:
        async ({ id }: any) => {
          return await endpoints({
            id, endpoint: 'apiToolManagersIDAlias',
            thenFunc: (response: any) => {
              //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
              const contactGroupDetails = [response.data].map(m => ({
                ...m,
                'Tool Manager': m.toolManager,
                'Added By': m.addedBy,
                'Last Updated': m.lastUpdated,
                'Last Updated By': m.lastUpdatedBy
              }))[0];
              this.setState({
                contactGroupDetails
              });
              return response.data;
            }
          })
        },
      // apiToolManagersIDDisplayName: this.apiToolManagersIDDisplayName.bind(this),
      apiToolManagersIDDisplayName:
        async ({ id }: any) => {
          return await endpoints({
            id,
            endpoint: 'apiToolManagersIDDisplayName',
            thenFunc: (response: any) => {
              //   const isToolManager = !!response.data.filter((m: { toolManager: any; }) => m.toolManager === authContext._user.profile.mail).length;
              const contactGroupDetails = [response.data].map(m => ({
                ...m,
                'Tool Manager': m.toolManager,
                'Added By': m.addedBy,
                'Last Updated': m.lastUpdated,
                'Last Updated By': m.lastUpdatedBy
              }))[0];
              this.setState({
                contactGroupDetails
              });
              return response.data;
            }
          })
        },
      post:
        async ({ id, data, endpoint, method }: any) => {
          await endpoints({
            id,
            endpoint,
            method,
            data,
            thenFunc: () => {
              this.state.apiContactGroups()
              this.state.apiToolManagers()
            }
          })
        },
    };
    this._isMounted = false;
    this.state.links.HOME()
    // const apiToolManagersResult = () =>
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    const { route } = this.state;
    return (
      <ErrorBoundary>
        <>
          {[

            route === 'FindYourContact' && <FindYourContact
              {...this.state}
              apiSearchUsers={this.state.apiSearchUsers.bind(this)}
              apiSearchContactsLegal={this.state.apiSearchContactsLegal.bind(this)}
              onRemoveItem={() => {
                this.setState({
                  currentSelectedItems: { main: [] },
                });
              }}
              currentSelectedItems={this.state.currentSelectedItems && this.state.currentSelectedItems.main}
              onItemSelected={
                (selectedItem?: any | undefined) => {
                  this.setState({ contactList: undefined });
                  selectedItem && this.setState({
                    currentSelectedItems: {
                      main: [selectedItem]
                    }
                  });
                  selectedItem && this.state.apiSearchContactsLegal((selectedItem as any)['mail'])
                    .then((data: any) => {
                      this.setState({
                        contactList: data,
                        contactGroupDetails: {
                          ...this.state.contactGroupDetails,
                          [name]: data.mail
                        }
                      });
                    });
                  return selectedItem ? selectedItem : null;
                }
              }
            />,
            route === 'GROUP_DETAILS' &&
            <ContactGroup
              {...this.state}
              title={"Contact Groups"}
              links={{
                ...this.state.links,
              }}
              columns={[
                { fieldName: "Name", key: "Name", minWidth: 70, maxWidth: 70, name: "Name" },
                { fieldName: "Primary", key: "Primary", minWidth: 70, name: "Primary" },
                { fieldName: "Lead", key: "Lead", minWidth: 70, maxWidth: 70, name: "Lead" },
                { fieldName: "Actions", key: "Actions", minWidth: 90, name: "Actions" }
              ]}
              contactList={this.state.contactGroups && this.state.contactGroups
                .map((m: {
                  name: any;
                  primaryContact: any;
                  secondaryContact: any;
                  leader: any;
                  ossName: any;
                  ossContact: any;
                }) => ({
                  Name: m.name,
                  Primary: m.primaryContact,
                  Secondary: m.secondaryContact,
                  Lead: m.leader,
                  OSS_NAME: m.ossName,
                  OSS_CONTACT: m.ossContact,
                  ...m
                }))} />,
            route === 'ADD_CONTACT_GROUP' &&
            <Group
              {...this.state}
              title={'New Contact Group'}
              links={{
                ...this.state.links,
                BACK: this.state.links.GROUP_DETAILS,
                EDIT: (data: any) => {
                  this.state.post(
                    {
                      id: uuid(),
                      data: {
                        id: uuid(),
                        "name": data["Name"],
                        "primaryContact": data["Primary Contact"],
                        "secondaryContact": data["Secondary Contact"],
                        "ossName": data["OSS Name"],
                        "ossContact": data["OSS Contact"],
                        "leader": data["Leader"],
                        "lastUpdated": new Date(),
                        "owner": authContext._user.userName,
                        "lastUpdatedUser": authContext._user.userName
                      },
                      endpoint: 'apiContactGroups',
                      method: 'POST'
                    });
                  //     data: {
                  //         "id": ADD ? uuid() : data.id,
                  //         "name": data["Name"],
                  //         "primaryContact": data["Primary Contact"],
                  //         "secondaryContact": data["Secondary Contact"],
                  //         "ossName": data["OSS Name"],
                  //         "ossContact": data["OSS Contact"],
                  //         "leader": data["Leader"],
                  //         "lastUpdated": ADD ? new Date() : data["Last Updated"],
                  //         "owner": data["Owner"],
                  //         "lastUpdatedUser": ADD ? authContext._user.userName : data["Last Updated User"],
                  // }, 
                  // data: 
                  //     {
                  //     }
                  // ,
                  // endpoint: CONTACT ? 'apiContactGroups' : 'apiToolManagers', method: ADD ? 'POST' : 'PUT'
                  this.setState({
                    contactGroups: [],
                    groupDetails: undefined,
                    toolManagers: undefined,
                    currentSelectedItems: undefined,
                    contactList: []
                  })
                  // this.props.apiContactGroups()
                  // this.props.apiToolManagers()
                  this.state.links.GROUP_DETAILS()
                }
              }}
              textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
              CONTACT
              ADD
            />,
            route === 'TOOL_MANAGERS' &&
            <ToolManagers
              {...this.state}
              links={{
                ...this.state.links,
              }}
              contactList={
                this.state.toolManagers
                  .map((m: { toolManager: any; }) =>
                    ({ TOOL_MANAGERS: m.toolManager, ...m }))
              }
            />,
            route === 'EDIT_CONTACT_GROUP' &&
            <Group
              {...this.state}
              title={'Edit Contact Group'}
              links={{
                ...this.state.links,
                BACK: this.state.links.GROUP_DETAILS,
                EDIT: (data: any) => {
                  // this.state.apiContactGroupsIDAlias({ id: this.state.contactGroupDetails.id });
                  this.state.post(
                    {
                      id: data.id,
                      data: {
                        id: data.id,
                        "name": data["Name"],
                        "primaryContact": data["Primary Contact"],
                        "secondaryContact": data["Secondary Contact"],
                        "ossName": data["OSS Name"],
                        "ossContact": data["OSS Contact"],
                        "leader": data["Leader"],
                        "lastUpdated": new Date(),
                        "owner": authContext._user.userName,
                        "lastUpdatedUser": authContext._user.userName
                      },
                      endpoint: 'apiContactGroups',
                      method: 'PUT'
                    });
                  this.setState({
                    contactGroups: [],
                    groupDetails: undefined,
                    toolManagers: undefined,
                    currentSelectedItems: undefined,
                    contactList: []
                  })
                  this.state.links.GROUP_DETAILS();
                },
              }}
              textFields={['Name', 'Primary Contact', 'Secondary Contact', 'Leader', 'OSS Name', 'OSS Contact']}
              groupDetails={this.state.contactGroupDetails}
              hasGroupDetails
              CONTACT
              ADD
            />,
            route === 'VIEW_CONTACT_GROUP' &&
            <Group
              {...this.state}
              title={'View Contact Group'}
              links={{
                ...this.state.links,
                BACK: this.state.links.GROUP_DETAILS,
                EDIT: () => {
                  this.state.links.EDIT('_CONTACT_GROUP')(this.state.contactGroupDetails);
                  this.state.apiContactGroupsIDDisplayName({ id: this.state.contactGroupDetails.id });
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
            />,
            route === 'ADD_TOOL_MANAGER' &&
            <Group
              {...this.state}
              title={'New Group'}
              links={{
                ...this.state.links,
                BACK: this.state.links.TOOL_MANAGERS,
                EDIT: (data: any) => {
                  this.state.post(
                    {
                      id: uuid(),
                      data: {
                        "id": uuid(),
                        "toolManager": data['Tool Manager'],
                        "addedBy": authContext._user.userName,
                        "lastUpdated": new Date(),
                        "lastUpdatedBy": authContext._user.userName
                      },
                      endpoint: 'apiToolManagers',
                      method: 'POST'
                    });
                  //     data: {
                  //         "id": ADD ? uuid() : data.id,
                  //         "name": data["Name"],
                  //         "primaryContact": data["Primary Contact"],
                  //         "secondaryContact": data["Secondary Contact"],
                  //         "ossName": data["OSS Name"],
                  //         "ossContact": data["OSS Contact"],
                  //         "leader": data["Leader"],
                  //         "lastUpdated": ADD ? new Date() : data["Last Updated"],
                  //         "owner": data["Owner"],
                  //         "lastUpdatedUser": ADD ? authContext._user.userName : data["Last Updated User"],
                  // }, 
                  // ,
                  // endpoint: CONTACT ? 'apiContactGroups' : 'apiToolManagers', method: ADD ? 'POST' : 'PUT'
                  this.setState({
                    contactGroups: undefined,
                    groupDetails: undefined,
                    toolManagers: undefined
                  })
                  // this.props.apiContactGroups()
                  // this.props.apiToolManagers()
                  this.state.links.TOOL_MANAGERS();
                }
              }}
              textFields={[
                'Tool Manager'
              ]}
              ADD
            />,
            route === 'EDIT_TOOL_MANAGER' &&
            <Group
              {...this.state}
              title={'Edit Group'}
              links={{
                ...this.state.links,
                BACK: this.state.links.TOOL_MANAGERS,
                EDIT: (data: any) => {
                  this.state.post(
                    {
                      id: data.id,
                      data: {
                        "id": data.id,
                        "toolManager": data['Tool Manager'],
                        "addedBy": authContext._user.userName,
                        "lastUpdated": new Date(),
                        "lastUpdatedBy": authContext._user.userName
                      },
                      endpoint: 'apiToolManagers',
                      method: 'PUT'
                    });
                  //     data: {
                  //         "id": ADD ? uuid() : data.id,
                  //         "name": data["Name"],
                  //         "primaryContact": data["Primary Contact"],
                  //         "secondaryContact": data["Secondary Contact"],
                  //         "ossName": data["OSS Name"],
                  //         "ossContact": data["OSS Contact"],
                  //         "leader": data["Leader"],
                  //         "lastUpdated": ADD ? new Date() : data["Last Updated"],
                  //         "owner": data["Owner"],
                  //         "lastUpdatedUser": ADD ? authContext._user.userName : data["Last Updated User"],
                  // }, 
                  // ,
                  // endpoint: CONTACT ? 'apiContactGroups' : 'apiToolManagers', method: ADD ? 'POST' : 'PUT'
                  this.setState({
                    contactGroups: undefined,
                    groupDetails: undefined,
                    toolManagers: undefined
                  })
                  // this.props.apiContactGroups()
                  // this.props.apiToolManagers()
                  this.state.links.TOOL_MANAGERS();
                }
              }}
              textFields={[
                'Tool Manager'
              ]}
              groupDetails={this.state.contactGroupDetails}
              ADD
            />,
            route === 'VIEW_TOOL_MANAGER' &&
            <Group
              {...this.state}
              title={'View Group'}
              links={{
                ...this.state.links,
                BACK: this.state.links.TOOL_MANAGERS,
                EDIT: () => {
                  this.state.links.EDIT('_TOOL_MANAGER')(this.state.contactGroupDetails);
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
            />

          ].map((m, i) => <div key={i}>{m}</div>)}
        </>
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
  const endpointUri = ({
    apiContactGroups: (method === 'PUT' || method === 'DELETE') ? `${endpointBaseUrl}/api/ContactGroups/${id}` : `${endpointBaseUrl}/api/ContactGroups/`,
    apiContactGroupsIDAlias: `${endpointBaseUrl}/api/ContactGroups/${id}/alias`,
    apiContactGroupsIDDisplayName: `${endpointBaseUrl}/api/ContactGroups/${id}/DisplayName`,
    apiSearchContactsLegal: `${endpointBaseUrl}/api/Search/Contacts/Legal/${contact}`,
    apiSearchUser: `${endpointBaseUrl}/api/Search/Users/${contact}`,
    apiToolManagers: (method === 'PUT' || method === 'DELETE') ? `${endpointBaseUrl}/api/ToolManagers/${id}` : `${endpointBaseUrl}/api/ToolManagers`,
    apiToolManagersAliasToolManager: `${endpointBaseUrl}/api/ToolManagers/${alias}/ToolManager`,
    apiToolManagersIDAlias: `${endpointBaseUrl}/api/ToolManagers/${id}/alias`,
    apiToolManagersIDDisplayName: `${endpointBaseUrl}/api/ToolManagers/${id}/DisplayName`,
  })[endpoint];
  return adalApiFetch(
    axios,
    endpointUri,
    config
  )
    .then(thenFunc)
    .catch((error: any) => {
      console.log({ error });
    });
};

export const endpointBaseUrl = `https://fyc-dev.azurewebsites.net`;

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