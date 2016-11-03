import * as React from 'react';
import './oncoprint-bundle';

interface IOncoprintProps {
    exampleProp:Array<any>;
}

interface IOncoprintState {

}

export default class HomePage extends React.Component<IOncoprintProps, IOncoprintState> {
    public render() {

        // we have window.Oncoprint available
        // our initial goal is

        return <div class="oncoprintTarget">{ this.props.exampleProp.toString() }</div>;
    }
};
