import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'datatables.net';
import Home from './component/Home';
import Map from './component/Map';
import Locations from './component/Locations';
import ParticularLocation from './component/ParticularLocation';
import Events from './component/Event';
import Search from './component/Search';
import NavBar from './component/NavBar';


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

class User extends React.Component {
  constructor(){
    super()
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      navDisplayIndex: 0,
      navDisplay: ''
  }
  }

  handleChange () {
    console.log('1')
    if (this.state.navDisplayIndex){
      this.setState({navDisplay: 'none', navBarIndex: 0})
    }else{
      this.setState({navDisplay: 'block', navBarIndex: 1})
    }
  }
  static getDerivedStateFromProps(){
    const route = window.location.pathname
    console.log(route)
    if (route == '/'){
      return {navDisplay: 'none', navBarIndex: 0}
    }else{
      return {navDisplay: 'block', navBarIndex: 1}
    }
  }
  
    render() {
      const {username,handleLogout} = this.props;
      return (
        <BrowserRouter>
        <NavBar display={this.state.navDisplay} handleChange={this.handleChange}/>
        <Routes>
          <Route path="/" element={<Home handleChange={this.handleChange} />}/>
          <Route path="/map" element={<Map/>}/>
          <Route path="/locations" element={<Locations/>} />
          <Route path="/locations/:locationID" element={<ParticularLocation username={username}/>} />
          <Route path="/events" element = {<Events title={"Event List"} venueID={""}/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="*" element={<NoMatch/>} />
        </Routes>
      </BrowserRouter>
      );
    }
  }
  
  export default User;
