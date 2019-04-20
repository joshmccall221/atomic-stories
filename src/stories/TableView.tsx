import * as React from 'react';
import { ShimmeredDetailsList, IDetailsRowProps, IDetailsRowStyles, DetailsRow, getTheme, IconButton, TextField, Button, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import FindYourContact, { PersonProps } from './FindYourContact';
const uuidv1 = require('uuid/v1');
const { authContext } = require('../adalConfig');

export type Props = { contactList: PersonProps[]; } & any;

export class Shadow extends React.PureComponent<Props>{
    render() {
        const { childrenComponents, children, type, width } = this.props;
        const renderChildrenComponents = childrenComponents && childrenComponents.map((m: any) => {
            return ({
                SHADOW: () =>

                    <div key={'shadowComponent'} style={{ ...{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' } }} >
                        <div style={{
                            border: '1px solid #e5e5e5',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            padding: 20,
                            width: width ? width : 260, ...{ margin: "auto", display: 'inline-block', textAlign: 'center' }
                        }} >
                            {m.component}
                        </div>
                    </div>,
                DOUBLE_SHADOW: () =>
                    <>
                        {/* {m.component} */}
                        {m.component.map((m: any) => {
                            return <>
                                <div key={`doubleShadowComponent-${m.id}`} style={{ border: '1px solid #e5e5e5', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', padding: 20, margin: '2em', width: 260, display: 'inline-block', textAlign: 'center' }}>
                                    <div style={{ border: '1px solid #e5e5e5', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', }}>
                                        <div style={{ textAlign: 'center', paddingTop: 20 }}>
                                            {m}
                                        </div>
                                    </div>
                                </div>
                            </>;
                        })}
                    </>
                ,
                NO_SHADOW: () => m.component,
                FOOTER: () =>

                    <div key={`noShadowComponent-${m.id}`} style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' }}>
                        {m.component}
                    </div>
            })[type || m.type]()
        })
        return (

            <>
                {children}
                {renderChildrenComponents}
            </>

        );
    }
}
export class Layout extends React.PureComponent<Props>{
    render() {
        const { children, title, maxWidth } = this.props;
        return (<>
            <div style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center', marginTop: 50 }}>
                <div style={{ margin: "auto", display: 'inline-block', marginBottom: 20, textAlign: 'center', maxWidth: '400px', ...{ maxWidth: maxWidth } }}>
                    <h1 style={{ margin: "auto", display: 'inline-block', marginBottom: 20, textAlign: 'center', width: '100%' }}>{title}</h1>
                    {children}
                </div>

            </div>
        </>)
    }
}
export default class extends React.PureComponent<Props>{
    render() {
        const { contactList, links, title, columns } = this.props;
        console.log('contact group', this.props)
        const actionOnclick = ({ actionType, row }: { actionType: string, row: any }) => () => {
            console.log('actionOnclick', { props: this.props, actionType, row, id: row.id })
            this.props.setStateHandler({ contactGroupDetails: undefined })
            return ({
                VIEW: () => this.props.apiContactGroupsIDDisplayName({ id: row.id }),
                EDIT: () => this.props.apiContactGroupsIDAlias({ id: row.id }),
                DELETE: () => {
                    this.props.setStateHandler({
                        contactGroups: [],
                        groupDetails: [],
                        toolManagers: []
                    })
                    this.props.post({
                        id: row.id, method: 'DELETE',
                        endpoint: 'apiContactGroups',

                    })
                },
            })[actionType]();
        }
        return (
            <Layout
                title={title}
                children={

                    <Shadow

                        // type={'SHADOW'}
                        width={400}
                        childrenComponents={[
                            {
                                type: 'SHADOW',
                                component: [
                                    <>
                                        <ShimmeredDetailsList
                                            selectionMode={0}
                                            setKey="items"
                                            styles={{
                                                root: {
                                                }
                                            }}
                                            items={[...contactList && contactList.map(
                                                (m: any) => ({
                                                    ...m,
                                                    Actions: [
                                                        <ActionButtons
                                                            {...{ ...this.props }}
                                                            m={m}
                                                            actionOnclick={actionOnclick}
                                                            links={{
                                                                ...links,
                                                                ...{ VIEW: links.VIEW('_CONTACT_GROUP') },
                                                                ...{ EDIT: links.EDIT('_CONTACT_GROUP') },
                                                                ...{ DELETE: links.DELETE('_CONTACT_GROUP') }
                                                            }} />,
                                                    ],
                                                }))
                                            ]}
                                            columns={columns}
                                            enableShimmer={!contactList.length}
                                            onRenderRow={this._onRenderRow}
                                        />
                                    </>]
                            },
                            {
                                type: 'NO_SHADOW',
                                component: < NavButtons links={{
                                    ...links,
                                    ...{ ADD: links.ADD('_CONTACT_GROUP') }
                                }} />
                            }

                        ]
                        }
                    />
                }
            />)
    }
    private _onRenderRow = (props: IDetailsRowProps | undefined): JSX.Element => {
        const customStyles: Partial<IDetailsRowStyles> = {};
        if (props) {

            if (props.itemIndex % 2 === 0) {
                // Every other row renders with a different background color
                customStyles.root = { backgroundColor: getTheme().palette.themeLighterAlt };
                return <DetailsRow {...props} styles={customStyles} />;
            }
            return <DetailsRow {...props} />;
        }

        return <div></div>;
    };
}

export class ToolManagers extends React.PureComponent<Props>{
    render() {
        const { contactList, links } = this.props;
        const actionOnclick = ({ actionType, row }: { actionType: string, row: any }) => () => {
            console.log('ToolManagersactionOnclick', { props: this.props, actionType, row, id: row.id })
            this.props.setStateHandler({ contactGroupDetails: undefined })
            return ({
                VIEW: () => this.props.apiToolManagersIDDisplayName({ id: row.id }),
                EDIT: () => this.props.apiToolManagersIDAlias({ id: row.id }),
                DELETE: () => {
                    this.props.setStateHandler({
                        contactGroups: [],
                        groupDetails: [],
                        toolManagers: []
                    })
                    this.props.post({
                        id: row.id, method: 'DELETE',
                        endpoint: 'apiToolManagers',

                    })
                },
            })[actionType]();
        }
        return (
            <>
                <Layout
                    title={'Tool Managers'}
                    children={
                        <Shadow
                            width={400}
                            childrenComponents={[
                                {
                                    type: 'SHADOW',
                                    component: [
                                        <ShimmeredDetailsList
                                            selectionMode={0}
                                            setKey="items"
                                            styles={{ root: {} }}
                                            items={[...contactList.map(
                                                (m: any) => ({
                                                    ...m,
                                                    Actions: [
                                                        <ActionButtons m={m} actionOnclick={actionOnclick} links={{
                                                            ...links,
                                                            ...{ VIEW: links.VIEW('_TOOL_MANAGER') },
                                                            ...{ EDIT: links.EDIT('_TOOL_MANAGER') },
                                                            ...{ DELETE: links.DELETE('_TOOL_MANAGER') }
                                                        }} />,
                                                    ],
                                                }))
                                            ]}
                                            columns={[
                                                { fieldName: "TOOL_MANAGERS", key: "TOOL_MANAGERS", minWidth: 170, name: "Tool Managers" },
                                                { fieldName: "Actions", key: "Actions", minWidth: 90, name: "Actions" }
                                            ]}
                                            enableShimmer={!contactList.length}
                                            onRenderRow={this._onRenderRow}
                                        />]
                                },
                                {
                                    type: 'NO_SHADOW', component: < NavButtons links={{
                                        ...links,
                                        ...{ ADD: links.ADD('_TOOL_MANAGER') }
                                    }} />
                                }
                            ]}
                        />
                    }
                />

            </>
        )
    }
    private _onRenderRow = (props: IDetailsRowProps | undefined): JSX.Element => {
        const customStyles: Partial<IDetailsRowStyles> = {};
        if (props) {

            if (props.itemIndex % 2 === 0) {
                // Every other row renders with a different background color
                customStyles.root = { backgroundColor: getTheme().palette.themeLighterAlt };
                return <DetailsRow {...props} styles={customStyles} />;
            }
            return <DetailsRow {...props} />;
        }

        return <div></div>;
    };
}
export class ActionButtons extends React.PureComponent<Props>{
    render() {
        const { actionOnclick, m, links } = this.props;
        console.log('ActionButtons', this.props)
        return (
            <section >
                <IconButton
                    styles={{
                        root: {
                            // width: '15%',
                            // height: 32,
                            // backgroundColor: 'rgb(0, 120, 212)',
                            // color: 'white',
                            // padding: 0
                        }
                    }}
                    iconProps={{ iconName: 'edit' }}
                    title="edit"
                    ariaLabel="edit"
                    onClick={() => {
                        actionOnclick({ actionType: 'EDIT', row: m })()
                        links.EDIT()
                    }}
                />
                <IconButton
                    styles={{
                        root: {
                            // width: '15%',
                            // height: 32,
                            // backgroundColor: 'rgb(0, 120, 212)',
                            // color: 'white',
                            // padding: 0
                        }
                    }}
                    iconProps={{ iconName: 'RedEye' }}
                    title="read"
                    ariaLabel="read"
                    onClick={() => {
                        // actionOnclick('read', m)
                        actionOnclick({ actionType: 'VIEW', row: m })()
                        links.VIEW()
                    }}
                />
                <IconButton
                    styles={{
                        root: {
                            // width: '15%',
                            // height: 32,
                            // backgroundColor: 'rgb(0, 120, 212)',
                            // color: 'white',
                            // padding: 0
                        }
                    }}
                    iconProps={{ iconName: 'Delete' }}
                    title="delete"
                    ariaLabel="delete"
                    onClick={() => {
                        // actionOnclick('delete', m)
                        actionOnclick({ actionType: 'DELETE', row: m })()
                        links.DELETE()
                    }}
                />
            </section>
        )
    }
}
export class NavButtons extends React.PureComponent<Props>{
    render() {
        const { links } = this.props;
        return (
            <section style={{ marginTop: 50 }}>

                <IconButton
                    iconProps={{ iconName: 'home' }}
                    title="home"
                    ariaLabel="home"
                    onClick={links.HOME}
                />
                <IconButton
                    iconProps={{ iconName: 'add' }}
                    title="add"
                    ariaLabel="add"
                    onClick={links.ADD}
                />
                <IconButton
                    iconProps={{ iconName: 'lock' }}
                    title="ToolsManager"
                    ariaLabel="ToolsManager"
                    onClick={links.TOOL_MANAGERS}
                // onClick={actionOnclick('edit', m)}
                />
                <IconButton
                    iconProps={{ iconName: 'people' }}
                    title="groupDetails"
                    ariaLabel="groupDetails"
                    onClick={links.GROUP_DETAILS}
                // onClick={actionOnclick('edit', m)}
                />
                <IconButton
                    iconProps={{ iconName: 'help' }}
                    title="help"
                    ariaLabel="help"
                    // onClick={actionOnclick('edit', m)}
                    onClick={links.HOME}
                />
            </section>
        )
    }
}
export class Group extends React.PureComponent<Props>{
    render() {
        const { links, textFields, viewOnly, groupDetails, title, hasGroupDetails, ADD, CONTACT } = this.props;
        console.log('!!!!!!!!!!!!!!Group', this.props)
        const onChange = (label: any) => (m: any) => {
            console.log('onChange', { label, m, groupDetails })
            this.props.setStateHandler({
                contactGroupDetails: {
                    // ...groupDetails,
                    ...this.props.contactGroupDetails,
                    [label]: m
                }
            })
        }
        const onSave = ({ data }: any) => {
            console.log('onClick', { data })
            this.props.post(
                {
                    id: ADD ? uuidv1() : data.id,
                    data: CONTACT ? {
                        "id": ADD ? uuidv1() : data.id,
                        "name": data["Name"],
                        "primaryContact": data["Primary Contact"],
                        "secondaryContact": data["Secondary Contact"],
                        "ossName": data["OSS Name"],
                        "ossContact": data["OSS Contact"],
                        "leader": data["Leader"],
                        "lastUpdated": data["Last Updated"],
                        "owner": data["Owner"],
                        "lastUpdatedUser": data["Last Updated User"],
                    } :
                        {
                            id: ADD ? uuidv1() : data.id,
                            "toolManager": "harezk@microsoft.com",
                            "addedBy": authContext._user.userName,
                            "lastUpdated": new Date(),
                            "lastUpdatedBy": authContext._user.userName
                        }
                    ,
                    endpoint: CONTACT ? 'apiContactGroups' : 'apiToolManagers', method: ADD ? 'POST' : 'PUT'
                })
            this.props.setStateHandler({
                contactGroups: [],
                groupDetails: [],
                toolManagers: []
            })
            // this.props.apiContactGroups()
            // this.props.apiToolManagers()
        }
        return (
            <div style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center', marginTop: 50 }}>
                <h1 style={{ margin: "auto", display: 'inline-block', marginBottom: 20, textAlign: 'center', width: '100%' }}>{title}</h1>

                <div style={{ ...{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' } }} >
                    <div style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', padding: 20, width: 260, ...{ margin: "auto", display: 'inline-block', textAlign: 'center' } }} >
                        {[

                            hasGroupDetails && groupDetails === undefined && <Spinner key={'spinner'} style={{ height: 335 }} size={SpinnerSize.large} />,
                            (!hasGroupDetails || hasGroupDetails && groupDetails) && textFields.map((m: string) => {
                                return [
                                    ADD
                                    && [!![
                                        'Primary Contact',
                                        'Secondary Contact',
                                        'Leader',
                                        'Owner',
                                        'Tool Manager',

                                    ].filter(f => f === m).length

                                        &&
                                        <div style={{ margin: 5 }}>
                                            <div style={{ width: '100%', margin: 5 }}>
                                                {m}
                                            </div>
                                            <FindYourContact
                                                {...this.props}
                                                apiSearchUsers={this.props.apiSearchUsers}
                                                apiSearchContactsLegal={this.props.apiSearchContactsLegal}
                                                groups
                                                title={m}
                                                currentSelectedItems={this.props.currentSelectedItems && this.props.currentSelectedItems[m]}
                                                onRemoveItem={(({ name }: any) => (selectedItem?: any | undefined) => {

                                                    console.log('onRemoveItem', { name, selectedItem, props: this.props })
                                                    selectedItem && this.props.setStateHandler({
                                                        currentSelectedItems: { [name]: [] },
                                                        contactGroupDetails: {
                                                            ...this.props.contactGroupDetails,
                                                            [name]: null
                                                        }
                                                    })

                                                    return selectedItem ? selectedItem : null
                                                })({ name: m })

                                                }
                                                onItemSelected={
                                                    (({ name }: any) => (selectedItem?: any | undefined) => {

                                                        // this.props.setStateHandler({ contactList: undefined })
                                                        console.log('onItemSelected', { name, selectedItem, props: this.props })
                                                        selectedItem && this.props.setStateHandler({
                                                            currentSelectedItems: { [name]: [selectedItem] },
                                                            contactGroupDetails: {
                                                                ...this.props.contactGroupDetails,
                                                                [name]: selectedItem.mail
                                                            }
                                                        })

                                                        return selectedItem ? selectedItem : null
                                                    })({ name: m })
                                                }
                                            />
                                        </div>,

                                    ![
                                        'Primary Contact',
                                        'Secondary Contact',
                                        'Leader',
                                        'Owner',
                                        'Tool Manager',
                                    ].filter(f => f === m).length &&
                                    <TextField
                                        styles={{
                                            root: { width: 235, margin: 'auto' }
                                        }}
                                        key={`TextField-${m}`}
                                        label={m}
                                        disabled={viewOnly}
                                        onChange={(e, v) => onChange(m)(v)}
                                        {...viewOnly && { placeholder: groupDetails && groupDetails[m] }}
                                        {...!viewOnly && { defaultValue: groupDetails && groupDetails[m] }}
                                    />,
                                    ],
                                    !ADD && <TextField
                                        styles={{
                                            root: { width: 235, margin: 'auto' }
                                        }}
                                        key={`TextField-${m}`}
                                        label={m}
                                        disabled={viewOnly}
                                        onChange={(e, v) => onChange(m)(v)}
                                        {...viewOnly && { placeholder: groupDetails && groupDetails[m] }}
                                        {...!viewOnly && { defaultValue: groupDetails && groupDetails[m] }}
                                    />,
                                ]
                            })
                        ]}


                        <Button
                            primary
                            styles={{
                                root: {
                                    width: '15%',
                                    height: 32,
                                    // backgroundColor: 'rgb(0, 120, 212)',
                                    color: 'white',
                                    padding: 0,
                                    margin: 5,
                                    marginTop: 20
                                }
                            }}
                            // iconProps={{ iconName: 'zoom' }}
                            iconProps={viewOnly && { iconName: 'edit' }}
                            text={viewOnly ? '' : 'OK'}
                            title={viewOnly ? 'EDIT' : "OK"}
                            ariaLabel={viewOnly ? 'EDIT' : "OK"}
                            onClick={() => {
                                console.log('onClick', this.props.contactGroupDetails)
                                // this.props.post({ id: groupDetails.id, data: groupDetails })

                                onSave({ data: this.props.contactGroupDetails })
                                links.EDIT()

                            }}
                        />
                        <Button
                            styles={{
                                root: {
                                    width: '15%',
                                    height: 32,
                                    // backgroundColor: 'rgb(220, 53,69)',
                                    // color: 'white',
                                    padding: 0,
                                    margin: 5,
                                    marginTop: 20
                                }
                            }}
                            iconProps={{ iconName: 'back' }}
                            title="back"
                            ariaLabel="back"
                            onClick={links.BACK}
                        />
                    </div>


                </div>
            </div>
        )
    }
}