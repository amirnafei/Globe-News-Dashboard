import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GlobeComponent from './GlobeComponent';
import TwitterComponent from './TwitterComponent';
import axios from 'axios';
import config from './CONFIG.js';

const GND_SERVER_URL = config.api;
const TOP_TRENDS_LOCATIONS_PATH = '/top-trends-locations';

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentLocation: '',
      currentLatitude: 0,
      currentLongitude: 0,
      currentWOEID: 0,
    }

    this.updateLocation = this.updateLocation.bind(this);
  }

  componentWillMount() {
    console.log((GND_SERVER_URL + TOP_TRENDS_LOCATIONS_PATH + `?latitude=${this.props.latitude}&longitude=${this.props.longitude}`))
    axios.get(TOP_TRENDS_LOCATIONS_PATH + `?latitude=${this.props.latitude}&longitude=${this.props.longitude}`)
    .then(result=>{
      console.log(result.data);
        this.setState({
            trends: result.data,
        })
    })
    .catch(error=>{
        console.log(error);
    })
  }

  updateLocation(location) {
    if (!location) {
      return;
    }
    let lat = Math.round(location.y/(Math.PI/2)*90*10000)/10000;
    let OLX=location.x+Math.PI/2;
    let NOLX = OLX-Math.floor(OLX/(Math.PI*2))*Math.PI*2;
    let long = Math.floor(NOLX/(2*Math.PI)*360*10000)/10000;
    if (long > 180) long = long-360;
    // console.log(`long, lat: (${long}, ${lat})`)
    // let lat = Math.round(location.x/(Math.PI*2)*180*10000)/10000;
    // let long =  Math.round(location.y/(Math.PI/2)*90*10000)/10000;

    axios.get(`http://ws.geonames.org/countryCodeJSON?lat=${lat}&lng=${long}&username=amirnafei`)
    .then(result=>{
      let country = result.data.countryName;
      //axios.get(`https://developer.yahoo.com/yql/console/#h=select+woeid+from+geo.places+where+text%3D%22#${country}%22`)
      axios.get(`https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%3D%22%23${country}%22&format=json&diagnostics=true&callback=`)
      .then(result2=>{
        if (result2.data.query.results && result2.data.query.results.place && result2.data.query.results.place.length > 0) {
          let woeid = result2.data.query.results.place[0].woeid;
          this.setState({
            currentLatitude: lat,
            currentLongitude: long,
            currentCountry: result.data.countryName,
            currentWOEID: woeid,
          })
        }
      })
    })
    .catch(error=>{
      console.log(error);
    })
  }

  render() {
    return (
      <div className="App">
        <TwitterComponent locationHandler={this.updateLocation} latitude={this.state.currentLatitude} longitude={this.state.currentLongitude} location={this.state.currentLocation} />
        <GlobeComponent locationHandler={this.updateLocation} location={this.state.currentCountry} />
      </div>
    );
  }
}

export default App;
