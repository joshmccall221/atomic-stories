import * as React from 'react';
import { ShimmeredDetailsList, IDetailsRowProps, IDetailsRowStyles, DetailsRow, getTheme, IconButton, TextField, Button } from 'office-ui-fabric-react';
import { PersonProps } from './FindYourContact';

export type Props = { contactList: PersonProps[]; } & any;

export class Shadow extends React.PureComponent<Props>{
    render() {
        const { childrenComponents, children, type, width } = this.props;
        const renderChildrenComponents = childrenComponents && childrenComponents.map((m: any) => {
            console.log({ m })
            return ({
                SHADOW: () =>

                    <div style={{ ...{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' } }} >
                        <div style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', padding: 20, width: width ? width : 260, ...{ margin: "auto", display: 'inline-block', textAlign: 'center' } }} >
                            {m.component}
                        </div>
                    </div>,
                DOUBLE_SHADOW: () =>
                    <>
                        {/* {m.component} */}
                        {m.component.map((m: any) => {
                            console.log("mmmmmm", { m })
                            return <>
                                <div style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', padding: 20, margin: '2em', width: 260, display: 'inline-block', textAlign: 'center' }}>
                                    <div style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', }}>
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

                    <div style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' }}>
                        {m.component}
                    </div>
            })[type || m.type]()
        })
        console.log({ debugChild: renderChildrenComponents })
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
        const { contactList, links } = this.props;
        console.log({ contactList })
        const actionOnclick = (actionType: string, row: any) => () => {
            console.log(actionType, { row })
        }
        return (
            <Layout

                title={'Search Contacts'}
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
                                            items={[...contactList.map(
                                                (m: any) => ({
                                                    ...m,
                                                    Actions: [
                                                        <ActionButtons m={m} actionOnclick={actionOnclick} links={links} />,
                                                    ],
                                                }))
                                            ]}
                                            columns={[
                                                { fieldName: "Name", key: "Name", minWidth: 70, maxWidth: 70, name: "Name" },
                                                { fieldName: "Primary", key: "Primary", minWidth: 70, name: "Primary" },
                                                { fieldName: "Lead", key: "Lead", minWidth: 70, maxWidth: 70, name: "Lead" },
                                                { fieldName: "Actions", key: "Actions", minWidth: 90, name: "Actions" }
                                            ]}
                                            enableShimmer={false}
                                            onRenderRow={this._onRenderRow}
                                        />
                                    </>]
                            },
                            {
                                type: 'NO_SHADOW',
                                component: < NavButtons links={links} />
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
        console.log({ contactList })
        const actionOnclick = (actionType: string, row: any) => () => {
            console.log(actionType, { row })
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
                                                        <ActionButtons m={m} actionOnclick={actionOnclick} links={links} />,
                                                    ],
                                                }))
                                            ]}
                                            columns={[
                                                { fieldName: "TOOL_MANAGERS", key: "TOOL_MANAGERS", minWidth: 170, name: "Tool Managers" },
                                                { fieldName: "Actions", key: "Actions", minWidth: 90, name: "Actions" }
                                            ]}
                                            enableShimmer={false}
                                            onRenderRow={this._onRenderRow}
                                        />]
                                },
                                { type: 'NO_SHADOW', component: < NavButtons links={links} /> }
                            ]}
                        />
                    }
                />
                {/* <div style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center', marginTop: 50 }}>
                    <div style={{ margin: "auto", display: 'inline-block', marginBottom: 20, textAlign: 'center', maxWidth: '400px', }}>
                        <h1 style={{ margin: "auto", display: 'inline-block', marginBottom: 20, textAlign: 'center', width: '100%' }}>Tool Managers</h1>
                        <ShimmeredDetailsList
                            selectionMode={0}
                            setKey="items"
                            styles={{
                                root: {
                                    // height: 32,
                                    // backgroundColor: 'rgb(0, 120, 212)',
                                    // color: 'white',
                                    // padding: 0
                                }
                            }}
                            items={[...contactList.map(
                                (m: any) => ({
                                    ...m,
                                    Actions: [
                                        <ActionButtons m={m} actionOnclick={actionOnclick} links={links} />,
                                    ],
                                }))
                            ]}
                            columns={[
                                {
                                    fieldName: "TOOL_MANAGERS",
                                    key: "TOOL_MANAGERS",
                                    minWidth: 170,
                                    name: "Tool Managers"
                                },
                                {
                                    fieldName: "Actions",
                                    key: "Actions",
                                    minWidth: 90,
                                    name: "Actions"
                                }
                            ]}
                            enableShimmer={false}
                            onRenderRow={this._onRenderRow}
                        />
                        <NavButtons links={links} />
                    </div>
                </div> */}
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
                        actionOnclick('edit', m)
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
                        actionOnclick('read', m)
                        links.GROUP_DETAILS()
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
                        actionOnclick('delete', m)
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
                    title="ContactGroups"
                    ariaLabel="ContactGroups"
                    onClick={links.TOOL_MANAGERS}
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
export class NewGroup extends React.PureComponent<Props>{
    render() {
        const { links, textFields, viewOnly, groupDetails, title } = this.props;
        return (
            <div style={{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center', marginTop: 50 }}>
                <h1 style={{ margin: "auto", display: 'inline-block', marginBottom: 20, textAlign: 'center', width: '100%' }}>{title}</h1>

                <div style={{ ...{ width: '100%', margin: "auto", display: 'inline-block', textAlign: 'center' } }} >
                    <div style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', padding: 20, width: 260, ...{ margin: "auto", display: 'inline-block', textAlign: 'center' } }} >

                        {textFields.map((m: string) => <TextField label={m} disabled={viewOnly} defaultValue={groupDetails && groupDetails[m].value} />)}


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
                            onClick={links.OK}
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
                            onClick={links.OK}
                        />
                    </div>


                </div>
            </div>
        )
    }
}
