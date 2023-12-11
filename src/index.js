import React from 'react';
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, Link, useLocation, useParams} from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {Icon} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import $ from 'jquery';
import 'datatables.net';
import UserBox from './component/UserBox';
import EventBox from './component/EventBox';

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
              <Link class="nav-link" to="/admin">Admin</Link>
              <Link class="nav-link" to="/map">Map</Link>
              <Link class="nav-link" to="/locations">Locations</Link>
              <Link class="nav-link" to="/events">Events</Link>
              {/*<Link class="nav-link" to="/search">Search</Link>*/}
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/map" element={<Map/>} />
          <Route path="/locations" element={<Locations/>} />
          <Route path="/locations/:locationID" element={<ParticularLocation/>} />
          <Route path="/events" element = {<Events title={"Event List"} venueID={""}/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="*" element={<NoMatch/>} />
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

class Admin extends React.Component {
  render() {
      return (
          <>
          <h2>Admin Management System</h2>
          <EventBox/>
          <UserBox/>
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
          ],
          paging: false
        });
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  render() {
    return (
      <div class="m-4">
        <h2>Location List</h2>
        <hr />
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
      events:[],
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

  /*
  async getEventData(venueID) {
    const response = await fetch("http://localhost:5000/eventForLocation", { 
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
          <table class="table table-bordered table-striped table-sm table-primary">
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
                <label class="form-label"><h2>Comment</h2></label>
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

class Events extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = { results: [] };
  }

  handleChange(results) {
    if (this.props.venueID == "") {
      this.setState({ results: results }); // state lifted from <FilterEventBar/>
      //console.log(this.state.results);
    } else {
      const filteredResults = results.filter(event => event.venueID.locationID == this.props.venueID);
      this.setState({ results: filteredResults });
    }
  }

  render() {
    return (
      <div class="m-4">
        <h2>{this.props.title}</h2>
        <FilterEventBar venueID={this.props.venueID} onResultsChange={this.handleChange /*by passing this function as para, allowing the lifting of state from <FilterEventBar/> up to <EventList/>*/}/> 
        <hr />
        <EventList venueID={this.props.venueID} results={this.state.results}/>
      </div>
    )
  }
}

class FilterEventBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilter = this.handleFilter.bind(this);
    this.state = { isValid: 1 };
  }

  componentDidMount(){
    this.handleFilter();
  }

  handleChange(results) {
    this.props.onResultsChange(results); // Lifting state up step 2 
  }

  handleFilter() {
    let price = document.getElementById("eventFilter").value;
    //console.log(target);

    const validExpression = /^\d*$/;

    if (validExpression.test(price)) {
      this.setState({ isValid: 1 });
      this.getEvents(price).then((data) => {
        const results = data;
        this.handleChange(results); // Lifting state up step 1 (go to step 2)
      });
    } else {
      this.setState({ isValid: 0 });
    }
  }

  async getEvents(price) { // accepts a number, outputs a json of event results
    const param = {"price": price};
    const response = await fetch("http://localhost:5000/events", { 
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

  render() {
    return (
      <div name="" style={{ display: 'flex', alignItems: 'center' }}>
        <label for="eventFilter">Filter for Events with Price Under $ &nbsp; </label>
        <input  type="search" id="eventFilter" name="eventFilter" onChange={this.handleFilter}></input>
        <p id="invalidMessage" style={{visibility: this.state.isValid ? "hidden" : "visible", color: "red"} }> Only numbers are allowed </p>
      </div>
      // onChange: when the content of the filter box changes, we update the filtered results accordingly
    )
  }
}

class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { results: props.results };
  }

  static getDerivedStateFromProps(props){ // this function gets called when there is a change in the props of this component
    return { results: props.results };
  }

  componentDidUpdate() {
    $('#eventTable').DataTable().destroy();
    
    console.log(this.state.results);

    $('#eventTable').DataTable({
      data: this.state.results,
      columns: [
        { data: 'title' },
        { data: 'venueID.location',
          render: function (data, type, row) {
            if (type === "display") {
              return `<a href="/locations/${row.venueID.locationID}">${data}</a>`; // Insert links to single locations
            }
            return data;
          },
          visible: this.props.venueID == "" ? true : false
        },
        { data: 'date' },
        { data: 'description' },
        { data: 'presenter'},
        { data: 'priceInStr' }
      ]
    });
  }
  
  render() {
    return (
      <div>
        <table id="eventTable" class="table table-bordered table-striped table-sm table-primary">
          <thead>
            <tr>
              <th class="text-center">Event Name</th>
              <th class="text-center">Venue</th>
              <th class="text-center">Date and Time</th>
              <th class="text-center">Description</th>
              <th class="text-center">Presenter</th>
              <th class="text-center">Price</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    )
  }
}

class Search extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this)
    this.state = {results: [ {
      locationID: 0,
      location: 'Failed to fetch data from the database',
      latitude: 0,
      longitude: 0 }]}
  }

  handleChange(results) {
    this.setState({results: results}) // state lifted from <SearchBar/>
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
    this.handleSearch();
  }

  handleChange(results) {
    this.props.onResultsChange(results); // Lifting state up step 2 
  }

  handleSearch() {
    let target = document.getElementById("locationSearch").value; 
    //console.log(target)
    const validExpression = /^[A-Za-z()\ ]*$/;
    if (validExpression.test(target)) {
      this.setState({isValid: 1});
      this.getLocations(target).then((data) => {
        const results = data;
        this.handleChange(results); // Lifting state up step 1 (go to step 2)
      });
    } else {
      this.setState({isValid: 0});
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
        <p id="invalidMessage" style={{visibility: this.state.isValid ? "hidden" : "visible", color: "red"} }> Allowed Characters: A-Z, a-z, (, ), space </p>
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
