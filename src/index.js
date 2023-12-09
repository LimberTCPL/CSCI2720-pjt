import React from 'react';
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, Link, useLocation, useParams} from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {Icon} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import $ from 'jquery';
import 'datatables.net';

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
  constructor(){
    super()
    this.navBarCollapseControl = this.navBarCollapseControl.bind(this)
    this.state = {
      navBarCollapse: 'collapse',
      navBarIndex: 1
  }
  }

  navBarCollapseControl(){
    if (this.state.navBarIndex){
      this.setState({navBarCollapse: '', navBarIndex: 0})
    }else{
      this.setState({navBarCollapse: 'collapse', navBarIndex: 1})
    }
  }
    render() {
      return(
        <BrowserRouter>
        <nav class="navbar navbar-expand-lg bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">App</a>
            <button class="navbar-toggler" type="button" onClick={this.navBarCollapseControl} >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class={ this.state.navBarCollapse + " navbar-collapse"} id="navbarNavAltMarkup">
              <div class="navbar-nav">
              <Link class="nav-link" to="/">Home</Link>
              <Link class="nav-link" to="/map">Map</Link>
              <Link class="nav-link" to="/locations">Locations</Link>
              <Link class="nav-link" to="/search">Search</Link>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home/>} />
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
      </>
    )
  }
}

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
    };
  }

  componentDidMount() {
    this.fetchLocations();
  }

  componentWillUnmount() {
    $('#locationTable').DataTable().destroy();
  }
  
  async fetchLocations() {
    fetch('http://localhost:5000/locations')
    .then((response) => response.json())
    .then((data) => {
      this.setState({ locations: data }, () => {
        $('#locationTable').DataTable({
          data: this.state.locations,
          columns: [
            { data: 'location',
              render: function (data, type, row) {
                if (type === "display") {
                  return `<a href="/locations/${row.locationID}">${data}</a>`; // Insert links to single locations
                }
                return data;
              }
            },
            { data: 'eventCount', className: "text-center" }
          ]
        });
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  render() {
    return (
      <div class="m-5">
        <h1> Location List </h1>
        <table id="locationTable" class="p-2 table table-bordered table-striped table-sm table-primary">
          <thead>
            <tr>
              <th class="text-center">Locations</th>
              <th class="text-center">Number of Events</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
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
        longitude: 114.12882020299067,
        eventCount: 0
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
        longitude: data.longitude,
        eventCount: data.eventCount
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
        <br/>
        <Commentlist locationID={this.state.location.locationID}/>
        <Commentform locationID={this.state.location.locationID}/>
      </>
    )
  }
}

class Commentform extends React.Component{
  constructor(props){
    super(props);
    this.state={
      comment: '',
      user: '',//wait for props.userid
      locID: 0,
      date: '',
      //loc: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })      
  }

  async handleSubmit(e) {
    e.preventDefault();
    await this.setState({locID: this.props.locationID});
    await this.setState({date: new Date().toLocaleString(),});
    const newcomment = {
      comment: this.state.comment,
      username: this.state.username,
      locID: this.state.locID,
      date: this.state.date
    }
    console.log(newcomment)
    
    try {
    const response = await fetch('http://localhost:5000/comment',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newcomment)
    });
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  }
  render(){
    return(
      <>
      <h6>Leave your comment:</h6>
      <form id="comment" onSubmit={this.handleSubmit} >
      <div className="mb-3">
        <label htmlFor="username" className="form-label">User: </label>
        <input type="text" className="form-control" value={this.state.username} name="username" onChange={this.handleChange}></input>
        </div>
        <div className="mb-3">
        <label htmlFor="comment" className="form-label">Comment: </label>
        <textarea type="text" className="form-control" name="comment" onChange={this.handleChange} placeholder="Share your thought" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      </>
    )
  }
}

class Commentlist extends React.Component{
  constructor(props){
    super(props);
    this.state={
      commentset: []
    }
  }
  componentDidMount() {
    console.log('start')
    this.fetchComment();
  }

  fetchComment = async () => {
    try {
      let tempcomment = [];
      //this.setState({locID: this.props.locationID});
      const locationID = window.location.pathname.split('/')[2]
      console.log(locationID)
      const response = await fetch(`http://localhost:5000/listcomment/${locationID}`,{
      method: 'GET',
      });
        let data = await response.json();
        console.log(data)
        data.forEach(element => {
          tempcomment.push(
            <>
            <div class="card">
              <div class="card-body">
              <p>{element.comment}</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex flex-row align-items-center">
                <p class="small mb-0 ms-2">{element.user}</p>
                </div>
              <div class="d-flex flex-row align-items-center">
              <p class="small text-muted mb-0">{element.date}</p>
              </div>
            </div>
          </div>
        </div>
            <br />
            </>
          )
        })
        this.setState({commentset: tempcomment})
    } catch (error) {
      console.error(error);
      alert('any');
    }
  };

  render(){
    const { commentset } = this.state;
    return(
      <>
      <div class="row d-flex justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-0 border">
            <div class="card-body p-4">
              <div class="form-outline mb-4">
                <label class="form-label"><h1>Comment</h1></label>
              </div>
              {this.state.commentset}
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
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
root.render(<App name="Map for Cultural Programmes"/>);
