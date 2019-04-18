import * as React from 'react';
import { BaseComponent, IPersonaSharedProps, IconButton, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import ContactPicker, { IPeoplePickerExampleProps } from './ContactPicker';
import { Shadow, Layout } from './TableView';
import { PersonaBadge } from './Personas';


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
    render() {
        const { currentSelectedItems, mostRecentlyUsed, peopleList, setStateHandler, links } = this.props
        console.log({ FindYourContactProps: this.props, isToolManager: this.props.isToolManager })
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
                                type: 'NO_SHADOW',
                                component: [
                                    !this.props.contactList.length && <Spinner style={{ height: 465 }} size={SpinnerSize.large} />,
                                ].filter(f => f)
                                // component: !contactList.length  ? [<ShimmerLoadDataExample />] : contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                            },
                            {
                                type: 'DOUBLE_SHADOW',
                                component: [
                                    this.props.contactList.length && this.props.contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                                ].filter(f => f)
                                // component: !contactList.length  ? [<ShimmerLoadDataExample />] : contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                            },
                            {
                                type: 'FOOTER',
                                component: [
                                    this.props.isToolManager && <IconButton
                                        styles={{
                                            root: {
                                                height: 32,
                                                padding: 0,
                                            }
                                        }}
                                        iconProps={{ iconName: 'settings' }}
                                        title="Management"
                                        ariaLabel="Management"
                                        onClick={() => {
                                            console.log('settings onclick')
                                            links.GROUP_DETAILS()
                                        }}
                                    />
                                ]

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