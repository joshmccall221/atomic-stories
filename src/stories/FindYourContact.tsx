import * as React from 'react';
import { BaseComponent, IPersonaSharedProps, IconButton } from 'office-ui-fabric-react';
import { PersonaBadge } from './Personas';
import ContactPicker, { IPeoplePickerExampleProps } from './ContactPicker';
import { Shadow, Layout } from './TableView';


export type PersonListProps = { personList: PersonProps[]; };
export type PersonProps = { person?: IPersonaSharedProps; };
export type FindYourContactProps = {
    delayResults: boolean;
    contactList: PersonProps[];
    settingsOnclick: () => void;
} & PersonProps & IPeoplePickerExampleProps & any;

// () => 
export class Test extends React.PureComponent {
    render() {
        return < div > test 123!!! </div >
    }
}
export default class extends BaseComponent<FindYourContactProps> {
    // renderPersonBadge(cl: { length: any; map: (arg0: (m: IPersonaSharedProps) => JSX.Element) => void; }) {
    //     if (cl.length) {
    //         return cl.map((c) => <PersonaBadge person={c} />)
    //     }
    //     return <PersonaBadge />

    // }
    getStyle = (optStyles: any) => ({
        display: "inline-block",
        margin: "auto",
        marginTop: 50,
        textAlign: "center",
        width: "100%",
        ...optStyles
    });
    render() {
        console.log('FindYourContacts', { ...this.props })
        const { currentSelectedItems, mostRecentlyUsed, peopleList, contactList, settingsOnclick, setStateHandler } = this.props
        return (
            <>

                <Layout title={'Search Contacts'} >
                    <Shadow
                        childrenComponents={[
                            {
                                type: 'SHADOW',
                                component:
                                    < ContactPicker
                                        peopleList={peopleList}
                                        mostRecentlyUsed={mostRecentlyUsed}
                                        currentSelectedItems={currentSelectedItems}
                                        setStateHandler={setStateHandler}
                                        {...this.props}
                                    />

                            },
                            {
                                type: 'DOUBLE_SHADOW',
                                component:
                                    contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                            },
                            {
                                type: 'FOOTER',
                                component:
                                    <IconButton
                                        styles={{
                                            root: {
                                                height: 32,
                                                padding: 0,
                                            }
                                        }}
                                        iconProps={{ iconName: 'settings' }}
                                        title="search"
                                        ariaLabel="search"
                                        onClick={settingsOnclick}
                                    />

                            }
                        ]}

                    />
                </Layout>

                {/* <div style={{ ...this.getStyle({}) }}>
                    <h1 style={{ ...this.getStyle({ marginBottom: 20 }), }} > Search Contacts</h1>
                    <ContactPicker
                        peopleList={peopleList}
                        mostRecentlyUsed={mostRecentlyUsed}
                        currentSelectedItems={currentSelectedItems}
                    />
                    {this.renderPersonBadge(contactList)}
                </div>
                <div style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' }}>
                    <IconButton
                        styles={{
                            root: {
                                // width: '15%',
                                height: 32,
                                // backgroundColor: 'rgb(0, 120, 212)',
                                // color: 'white',
                                padding: 0,
                            }
                        }}
                        iconProps={{ iconName: 'settings' }}
                        title="search"
                        ariaLabel="search"
                        onClick={settingsOnclick}
                    />

                </div> */}
            </>
        );
    }
}