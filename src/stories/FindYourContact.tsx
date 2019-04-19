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

                <Layout title={'CELA Contacts'} >
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
                                    !this.props.contactList && <Spinner style={{ height: 465 }} size={SpinnerSize.large} />,
                                ].filter(f => f)
                                // component: !contactList.length  ? [<ShimmerLoadDataExample />] : contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                            },
                            {
                                type: 'DOUBLE_SHADOW',
                                component: [
                                    this.props.contactList && this.props.contactList.length && this.props.contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
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
                                            this.props.apiContactGroups()
                                            this.props.apiToolManagers()
                                            links.GROUP_DETAILS()
                                        }}
                                    />
                                ]

                            }
                        ]}

                    />
                </Layout>
            </>
        );
    }
}