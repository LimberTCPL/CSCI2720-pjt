import React from 'react';
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, Link, useLocation, useParams} from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {Icon} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

import "leaflet/dist/leaflet.css";
import "./style.css"

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>
        {' '}
        No Match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

class App extends React.Component {
    render() {
      return(
        <BrowserRouter>
        <div>
          <ul>
            <li>
              {' '}
              <Link to="/">Home</Link>{' '}
            </li>
            <li>
              {' '}
              <Link to="/map">Map</Link>{' '}
            </li>
            <li>
              {' '}
              <Link to="/locations">Locations</Link>{' '}
            </li>
            <li>
              {' '}
              <Link to="/search">Search</Link>{' '}
            </li>
            
          </ul>
        </div>
        <hr/>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map/>} />
          <Route path="/locations" element={<Locations/>} />
          <Route path="/locations/:locationID" element={<ParticularLocation/>} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
      )
    }
}

class Home extends React.Component {
    render() {
        return (
            <>
            <h2>Home</h2>
            </>
        )
    }
}

const customIcon = new Icon({
  iconUrl: require("./img/marker.png"),
  iconSize: [38, 38]
})
  
class Map extends React.Component {
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
  const response = await fetch("http://localhost:5000/map", { 
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
      <>
        <h2>Map</h2>
        <MapContainer center={[22.35092361814064, 114.12882020299067]} zoom={12}>
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
      </>
    )
  }
}

class Locations extends React.Component {//Table of the locations (task 1,6) => have clickable feature that redirects the user to the separate view for one single location
  render() {
    return (
      <>Table</>
    )
  }
}

class ParticularLocation extends React.Component {
  constructor() {
    super();
    this.state = {
      location:{
        locationID: 0,
        location: 'Failed to fetch data from the database',
        latitude: 22.35092361814064,
        longitude: 114.12882020299067
      },
      comments:{}
    }
  }
  async getMapData(locationID) {
    const response = await fetch("http://localhost:5000/particularLocation", { 
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

  componentDidMount() {
    const locationID = window.location.pathname.split('/')[2] //gets entry 2 of {'', 'location, :locationID}
    this.getMapData(locationID).then((data) => {
      console.log(data)
      this.setState({location: {
        locationID: data.locationID,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude
      }})
    })
  }

  render() {
    return (
      <>
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
                  <h3><a href={"/locations/" + this.state.location.locationID}>Click here for more</a></h3>
                </Popup>
            </Marker>
          </MarkerClusterGroup>
        </MapContainer>
        <table class="table table-bordered">
          <thead>
            <tr>
              <td>Location:</td>
              <td>{this.state.location.location}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Latitude:</td>
              <td>{this.state.location.latitude}</td>
            </tr>
            <tr>
              <td>Longitude:</td>
              <td>{this.state.location.longitude}</td>
            </tr>
          </tbody>
        </table>
      </>
    )
  }
}

class Search extends React.Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this)
    this.state = {results: [ {
      locationID: 0,
      location: 'Failed to fetch data from the database',
      latitude: 0,
      longitude: 0 }]}
  }

  handleChange(results) {
    this.setState({results: results}) //state lifted from <SearchBar/>
  }

  render() {
    return (
      <div>
        <h2>Search</h2>
        <SearchBar onResultsChange={this.handleChange /*by passing this function as para, allowing the lifting of state from <SearchBar/> up to <Search/>*/}/> 
        <SearchResults results={this.state.results}/>
      </div>
    )
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {isValid: 1};
  }

  componentDidMount(){
    this.handleSearch()
  }

  handleChange(results) {
    this.props.onResultsChange(results) //Lifting state up step 2 
  }

  handleSearch() {
      let target = document.getElementById("locationSearch").value; 
      //console.log(target)
      const validExpression = /^[A-Za-z()\ ]*$/;
      if (validExpression.test(target)) {
        this.setState({isValid: 1});
        this.getLocations(target).then((data) => {
          const results = data;
          this.handleChange(results);//Lifting state up step 1 (go to step 2)
        });
      }else{
        this.setState({isValid: 0})
        
      }
    };
    
 async getLocations(target) { //accepts a string, outputs a json of location results
      const param = {"name": target};
      const response = await fetch("http://localhost:5000/search", { 
        method: "POST", 
        mode: "cors", 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        }, 
        body: JSON.stringify(param)
      });
      let data = await response.json();
      return data;
  } 

  //add functionality to display all locations upon load [DONE]
   
  
  render() {
    return (
        <div name="">
        <label for="locationSearch">Search for location: &nbsp; </label>
        <input  type="search" id="locationSearch" name="locationSearch" onChange={this.handleSearch}></input>
        <p  id="invalidMessage" style={{visibility: this.state.isValid ? "hidden" : "visible", color: "red"} }> Allowed Characters: A-Z, a-z, (, ), space </p>
        </div>
        //onChange: when the content of the search box changes, we update the search results accordingly [DONE]
        //to do: make a list that shows [Below, <SearchResults/>] [DONE]
    )
}
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {contents: []}
  }
  static getDerivedStateFromProps(props){ //this function gets called when there is a change in the props of this component
    let tempContents = [];
    if (props.results[0]){ //when the search keywords have match, then true; if no match, the props.results will be empty, so props.results[0] will be undefined = false
    let results = props.results
    //console.log(results)
      results.forEach(element => {
        tempContents.push(
          <tr>
            <td><a href={"/locations/" + element.locationID}>{element.location}</a></td>
            <td>{element.latitude}</td>
            <td>{element.longitude}</td>
          </tr>
        )
        //console.log(element.location)
      })}else{
        tempContents.push(
        <tr>
          <td style={{color: "red"}}>No Match</td>
          <td></td>
          <td></td>
        </tr>)
      }
        return {contents: tempContents}
  }
  
  //TODO: Display results
  render() {
    return(
    <div name="searchResults" onClick={() => console.log(this.state.results)}>
      <table class="table">
      <thead>
        <tr>
          <th>
            Location
          </th>
          <th>
            Latitude
          </th>
          <th>
            Longitude
          </th>
        </tr>
        </thead>
        <tbody>
          {this.state.contents}
        </tbody>
      </table>
    </div>
    );
  }
}


const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App name="test"/>);