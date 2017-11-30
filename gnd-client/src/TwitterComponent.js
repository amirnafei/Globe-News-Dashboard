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
        axios.get(GND_SERVER_URL + TOP_TRENDS_PATH + `?latitude=${this.props.latitude}&longitude=${this.props.longitude}`)
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
                <li key={trendItem.name}><a target="_blank" href={trendItem.url}>{trendItem.name}</a></li>
            )
        })
        return (
            <div className="TwitterTrends">
                <div className="LocationInfo">
                    <h1>{this.props.location}</h1>
                    <select className="TweetsFilter" onChange={(event)=>this.filterLocation(event.target.value)}>
                        {locationsJSX}
                    </select>
                    <Button waves='light'>EDIT ME<Icon left>save</Icon></Button>
                </div>
                <div className="TweetsList">
                    {trendsJSX}
                </div>
            </div>
        )
    }
}

export default TwitterComponent;