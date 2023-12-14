import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Events from './Event';
import Commentform from './Commentform';
import Commentlist from './Commentlist';
import '../style.css';

const customIcon = new Icon({
    iconUrl: require("../img/marker.png"),
    iconSize: [38, 38]
})

class ParticularLocation extends Component {
    constructor() {
      super();
      this.state = {
        location:{
          locationID: 0,
          location: 'Failed to fetch data from the database',
          latitude: 22.35092361814064,
          longitude: 114.12882020299067,
          eventCount: 0
        },
        events:[],
        comments:{}
      }
    }
  
    async getMapData(locationID) {
      const response = await fetch("http://localhost:5001/particularLocation", { 
        method: "POST", 
        mode: "cors", 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        }, 
        body: JSON.stringify({"locationID": locationID})
      });
      let data = await response.json();
      return data;
    }

    async handleClick() {
      const response = await fetch("http://localhost:5001/addToFavorite", { 
        method: "POST", 
        mode: "cors", 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        }, 
        body: JSON.stringify({"locationID": locationID})
      });
      let data = await response.json();
      return data;
    }
  
    /*
    async getEventData(venueID) {
      const response = await fetch("http://localhost:5001/eventForLocation", { 
        method: "POST", 
        mode: "cors", 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        }, 
        body: JSON.stringify({"venueID": venueID})
      });
      let data = await response.json();
      return data;
    }
    */
  
    componentDidMount() {
      const locationID = window.location.pathname.split('/')[2] //gets entry 2 of {'', 'location, :locationID}
      this.getMapData(locationID).then((data) => {
        this.setState({location: {
          locationID: data.locationID,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          eventCount: data.eventCount
        }})
  
        /*
        this.getEventData(data._id).then((eventsInVenue) => {
          //want to process the event data to display in the particular event
          let tempContents = [];
          
          events.forEach(event => {
            tempContents.push(
              <tr>
                <td>{event.title}</td> 
                <td><p>{event.date.replaceAll('^', '^ \n')}</p></td>
                <td>{event.description}</td>
                <td>{event.priceInStr}</td>
              </tr>
            )
          })
  
          this.setState({events: tempContents})
        })
        */
      })
    }
  
    render() {
      return (
        <div class="m-4">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MapContainer center={[this.state.location.latitude, this.state.location.longitude]} zoom={10} style={{height: '40vh', width: '60vw'}}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <MarkerClusterGroup
                chunkedLoading
              >
                <Marker position={[this.state.location.latitude, this.state.location.longitude]} icon={customIcon}>
                    <Popup>
                      <h2>{this.state.location.location}</h2>
                    </Popup>
                </Marker>
              </MarkerClusterGroup>
            </MapContainer>
          </div>
  
          <div class="m-4">
            <h2>Location Details</h2>
            <table class="table table-bordered table-striped table-sm table-light">
              <tbody>
                <tr>
                  <th scope="row">Location:</th>
                  <td>{this.state.location.location}</td>
                </tr>
                <tr>
                  <th scope="row">Latitude:</th>
                  <td>{this.state.location.latitude}</td>
                </tr>
                <tr>
                  <th scope="row">Longitude:</th>
                  <td>{this.state.location.longitude}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={this.handleClick}>Add to Favorite</button>
          </div>
  
          <Events title={`Event List for ${this.state.location.location}`} venueID={this.state.location.locationID} />
  
          {/*
          <table class="table table-bordered table-striped table-sm table-primary">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date and Time</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {this.state.events}
            </tbody>
          </table>
          */}
          
          <Commentlist locationID={this.state.location.locationID}/>
          <Commentform locationID={this.state.location.locationID}/>
        </div>
      )
    }
  }

  export default ParticularLocation;