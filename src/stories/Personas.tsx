import * as React from 'react';
import { PersonaCoin } from 'office-ui-fabric-react/lib/Persona';
import { ShimmerLoadDataExample } from './ShimmerLoadDataExample';
import { PrimaryButton } from 'office-ui-fabric-react';
import { PersonProps } from './FindYourContact';
import { Shadow } from './TableView';

export class PersonaBadge extends React.Component<PersonProps> {

    public render(): JSX.Element {
        const { person } = this.props;
        return (
            <>
                {/* <div style={{ marginBottom: 10 }} /> */}
                {!person ?
                    <ShimmerLoadDataExample /> :

                    <Shadow type={'DOUBLE_SHADOW'}>
                        <PersonaCoin
                            imageUrl={person.imageUrl}
                            coinSize={200}
                            style={{
                                width: 200,
                                margin: 'auto'
                            }}
                        />
                        <h1 style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.2, fontFamily: 'arial', }}>{person.text}</h1>
                        <p style={{ color: 'grey', fontSize: 13, fontFamily: 'arial' }} >{person.secondaryText}</p>
                        <PrimaryButton data-automation-id="test" allowDisabledFocus={true} text={"Contact"} style={{ width: '100%', marginTop: 10, marginBottom: 16 }} onClick={() => console.log('clicked')} />
                    </Shadow>}
            </>
        );
    }

}