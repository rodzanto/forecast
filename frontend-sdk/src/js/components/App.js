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
        const script2 = document.createElement("script");
        script2.src = "js/aws-sdk-2.554.0.min.js";
        script2.async = true;
        document.body.appendChild(script2);
    }

    render() {
        return (
            <div className="row">
                <div className="col-10 offset-1">
                    <div className="row mb-5">
                    <div className="col-2 form-group">
                        <label className="font-weight-bold" htmlFor="start-date">Start date</label>
                        <input type="text" id="start-date" tabIndex="1" className="form-control" defaultValue="2019-07-30 00:00 AM" required />
                    </div>
                    <div className="col-2 form-group">
                        <label className="font-weight-bold" htmlFor="end-date">End date</label>
                        <input type="text" id="end-date" tabIndex="2" className="form-control" defaultValue="2019-10-04 00:00 AM" required />
                    </div>
                    <div className="col-2 form-group">
                        <label className="font-weight-bold" htmlFor="forecast-key">Forecast Key (item_id)</label>
                        <input type="text" id="forecast-key" tabIndex="3" className="form-control" defaultValue="38177" required />
                    </div>
                    <div className="col-3 form-group">
                        <label className="font-weight-bold" htmlFor="forecast-key2">Forecast Key (location)</label>
                        <input type="text" id="forecast-key2" tabIndex="3" className="form-control" defaultValue="Cedar Rapids" required />
                    </div>
                    <div className="col-2 text-center m-auto">
                        <button id="get-forecast" type="button" className="btn btn-success">Get Forecast</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

}
  
export default withAuthenticator(App, true);