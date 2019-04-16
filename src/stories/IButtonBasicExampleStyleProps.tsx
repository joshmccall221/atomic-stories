import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IStyle } from 'office-ui-fabric-react';
import React from 'react';
// import { IStyle } from 'office-ui-fabric-react/lib/Label';
// import { IStyle } from '../office-ui-fabric-react/packages/charting/src/Styling';
export type IButtonBasicExampleStyleProps = {};
export interface IButtonBasicExampleStyles {
    example?: IStyle;
    twoup?: IStyle;
}
export function getStyles(): IButtonBasicExampleStyles {
    return {
        example: [
            'ms-BasicButtonsExample',
            {
                selectors: {
                    '.ms-Button': {
                        margin: '10px 0'
                    }
                }
            }
        ],
        twoup: [
            'ms-BasicButtonsTwoUp',
            {
                display: 'flex',
                selectors: {
                    '& > *': {
                        flexGrow: 1
                    },
                    '.ms-Label': {
                        marginBottom: '10px'
                    }
                }
            }
        ]
    };
}
export class ButtonDefaultExample extends React.Component<{
    primary: boolean;
    text: string;
} & IButtonProps, {}> {
    public render(): JSX.Element {
        const { disabled, checked } = this.props;
        return (<div>
            {!this.props.primary && <div>
                <DefaultButton data-automation-id="test" allowDisabledFocus={true} disabled={disabled} checked={checked} text={this.props.text} style={{ width: 400 }} onClick={this._alertClicked} />
            </div>}
            {this.props.primary && <div>
                <PrimaryButton data-automation-id="test" disabled={disabled} checked={checked} text={this.props.text} onClick={this._alertClicked} allowDisabledFocus={true} style={{ width: 400 }} />
            </div>}
        </div>);
    }
    private _alertClicked(): void {
        alert('Clicked');
    }
}
