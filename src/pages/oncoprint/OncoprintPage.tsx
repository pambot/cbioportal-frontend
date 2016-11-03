import * as React from 'react';
import Oncoprint from './Oncoprint';

interface IOncoprintProps {
}

interface IOncoprintState {
}

export default class OncoprintPage extends React.Component<any, any> {

    constructor(){
        super();
        this.state = { data:null };
    }

    private fetchData(){
        return Promise.resolve([1,2,3]);
    }

    componentDidMount(){
       this.fetchData().then((data)=> this.setState({ data: data }));
    }

    public render() {
        if (this.state.data === null) {
            return <div>loading</div>;
        } else {
            return <Oncoprint exampleProp={this.state.data} />;
        }
    }
};
