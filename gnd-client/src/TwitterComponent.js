import React from 'react';
import Twitter from 'twitter';
import axios from 'axios';
import config from './CONFIG.js';

import { Button, Icon, Card, Row, Col } from 'react-materialize';

const GND_SERVER_URL = config.api;
const TOP_TRENDS_PATH = '/top-trends';

let content = '';
class TwitterComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            trends: [],
        }

        this.updateTweets = this.updateTweets.bind(this);
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.latitude != this.props.latitude || previousProps.longitude != this.props.longitude) {
            this.updateTweets();
        }        
    }

    componentWillMount() {
        //this.updateTweets();
    }

    updateTweets() {
        // const location = `/${this.props.location}`;
        axios.get(TOP_TRENDS_PATH + `?latitude=${this.props.latitude}&longitude=${this.props.longitude}`)
        .then(result=>{
            this.setState({
                trends: result.data,
            })
        })
        .catch(error=>{
            console.log(error);
        })
    }

    filterLocation(location) {
        // this.setState({
        //     currentLocation: location,
        // })
        this.props.locationHandler(location);
    }

    render() {
        let locations = this.state.trends.map(trendItem => trendItem.country);
        let uniqueLocations = locations.filter(function (value, index, self) { 
            return self.indexOf(value) === index;
        });
        let locationsJSX = uniqueLocations.map(location => <option value={location} key={location}>{location}</option>);
        let trendsJSX = this.state.trends.map(trendItem => {
            return (
                <li key={trendItem.name} onClick={()=>{window.open(trendItem.url, 'targetWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, top=150px, left=400px, width=700px, height=500px'); return false;}}>
                    {trendItem.name}
                </li>
            )
        })
        return (
            <div className="TwitterTrends">
                <div className="LocationInfo">
                    <select className="TweetsFilter" onChange={(event)=>this.filterLocation(event.target.value)}>
                        {locationsJSX}
                    </select>
                    {/* <Button waves='light'>EDIT ME<Icon left>save</Icon></Button> */}
                </div>
                <div className="TweetsList">
                    {trendsJSX}
                </div>
            </div>
        )
    }
}

export default TwitterComponent;