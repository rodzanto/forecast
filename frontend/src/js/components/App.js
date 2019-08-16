import React, { Component } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../../aws-exports';
Amplify.configure(aws_exports);

class App extends Component {

    componentDidMount () {
        const script = document.createElement("script");
        script.src = "js/forecast.js";
        script.async = true;
        document.body.appendChild(script);
    }

    render() {
        return (
            <div className="row">
                <div className="col-10 offset-1">
                    <div className="row mb-5">
                        <div className="col-3 form-group">
                            <label className="font-weight-bold" htmlFor="start-date">Start date</label>
                            <input type="text" id="start-date" tabIndex="1" className="form-control" defaultValue="2015-01-01 01:00 AM" required />
                        </div>
                        <div className="col-3 form-group">
                            <label className="font-weight-bold" htmlFor="end-date">End date</label>
                            <input type="text" id="end-date" tabIndex="2" className="form-control" defaultValue="2015-01-02 00:00 AM" required />
                        </div>
                        <div className="col-3 form-group">
                            <label className="font-weight-bold" htmlFor="forecast-key">Forecast Key (item_id)</label>
                            <input type="text" id="forecast-key" tabIndex="3" className="form-control" defaultValue="client_10" required />
                        </div>
                        <div className="col-3 text-center m-auto">
                            <button id="get-forecast" type="button" className="btn btn-success">Get Forecast</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
  
export default withAuthenticator(App, true);