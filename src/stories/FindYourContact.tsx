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
        const { currentSelectedItems, mostRecentlyUsed, peopleList, groups } = this.props
        return (
            <>
                {[
                    groups && < >
                        <Shadow
                            childrenComponents={[
                                {
                                    type: groups ? 'NO_SHADOW' : 'SHADOW',
                                    component:
                                        < ContactPicker
                                            peopleList={peopleList}
                                            mostRecentlyUsed={mostRecentlyUsed}
                                            currentSelectedItems={currentSelectedItems}
                                            {...this.props}
                                            groups
                                        />

                                }
                            ]}

                        />
                    </>,
                    !groups && <Layout title={'CELA Contacts'} >
                        <Shadow
                            childrenComponents={[
                                {
                                    type: groups ? 'NO_SHADOW' : 'SHADOW',
                                    component:
                                        <ContactPicker
                                            peopleList={peopleList}
                                            mostRecentlyUsed={mostRecentlyUsed}
                                            currentSelectedItems={currentSelectedItems}
                                            {...this.props}
                                            groups
                                        />
                                },
                                {
                                    type: 'NO_SHADOW',
                                    component: [
                                        !this.props.contactList && <Spinner style={{ height: 465 }} size={SpinnerSize.large} />,
                                    ].filter(f => f).map((m, i) => <div key={i}>{m}</div>)
                                    // component: !contactList.length  ? [<ShimmerLoadDataExample />] : contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                                },
                                {
                                    type: 'DOUBLE_SHADOW',
                                    component: [
                                        !groups && this.props.contactList && this.props.contactList.length && this.props.contactList.map((c: IPersonaSharedProps | undefined, i: any) => (<PersonaBadge key={i} person={c} />))
                                    ].filter(f => f)
                                    // component: !contactList.length  ? [<ShimmerLoadDataExample />] : contactList.map((c: IPersonaSharedProps | undefined) => (<PersonaBadge person={c} />))
                                },
                                {
                                    type: 'FOOTER',
                                    component: [
                                        !groups && this.props.isToolManager && <IconButton
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

                                                !this.props.contactGroups.length && this.props.apiContactGroups()
                                                !this.props.toolManagers && this.props.apiToolManagers()
                                                this.props.links.GROUP_DETAILS()
                                            }}
                                        />
                                    ].map((m, i) => <div key={i}>{m}</div>)

                                }
                            ]}

                        />
                    </Layout>

                ].filter(f => f).map((m, i) => <div key={i}>{m}</div>)}
            </>
        );
    }
}