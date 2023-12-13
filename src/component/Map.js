import React, { Component } from 'react';
import '../style.css';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"

const customIcon = new Icon({
    iconUrl: require("../img/marker.png"),
    iconSize: [38, 38]
})

class Map extends Component {
    
    constructor(){
      super() ;
      this.state = {markers: [
        {locationID: 0,
          location: 'Failed to fetch data from the database',
          latitude: 22.35092361814064,
          longitude: 114.12882020299067 
        }]
    }
  }
  
    async getMapData() {
      const response = await fetch("http://localhost:5001/map", { 
        method: "POST", 
        mode: "cors", 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        }, 
      });
      let data = await response.json();
      return data;
    }
  
    componentDidMount() {
      this.getMapData().then((data => {this.setState({markers: data})}))
      console.log(this.state.markers)
    }
  
    render() {
      return (
        <div class="m-4">
          <h2>Map</h2>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MapContainer center={[22.35092361814064, 114.12882020299067]} zoom={12} style={{position: 'center', height: '80vh', width: '80vw' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <MarkerClusterGroup
                chunkedLoading
              >
                {this.state.markers.map((marker)=> (
                  <Marker position={[marker.latitude, marker.longitude]} icon={customIcon}>
                    <Popup>
                      <h2>{marker.location}</h2>
                      <h3><a href={"/locations/" + marker.locationID}>Click here for more</a></h3>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </div>
      )
    }
  }

  export default Map;