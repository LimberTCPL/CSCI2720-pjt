import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';
import icon from '../img/icon.png';

class NavBar extends Component {
    constructor(){
      super()
      this.navBarCollapseControl = this.navBarCollapseControl.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.state = {
        navBarCollapse: 'collapse',
        navBarIndex: 1
      }
    }
  
    handleChange() {
      this.props.handleChange();
      console.log('hi')
    }
  
    navBarCollapseControl(){
      if (this.state.navBarIndex){
        this.setState({navBarCollapse: '', navBarIndex: 0})
      }else{
        this.setState({navBarCollapse: 'collapse', navBarIndex: 1})
      }
    }

    componentDidMount() {
      this.setUpdatedTime();
    }

    setUpdatedTime() {
      const date = new Date();
      const time = `${date.getHours().toString()}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

      this.setState( { updatedTime: time });
    }

    render() {
      const {username,handleLogout} = this.props;
      return (
        <nav id='verNav' class="navbar navbar-expand-lg bg-light" style={{position: 'sticky', top: '0px', 'z-index': '100', width: '100vw', height: "70px", display: this.props.display}}>
            <div class="container-fluid">
              <a class="navbar-brand" href="/" onClick={this.handleChange}><img src={icon}  width="35px" height="auto" style={{margin: 0}}/></a>
              <button class="navbar-toggler" type="button" onClick={this.navBarCollapseControl} >
                <span class="navbar-toggler-icon"></span>
                </button>
            <div class={ this.state.navBarCollapse + " navbar-collapse"} id="navbarNavAltMarkup">
              <div class="navbar-nav">
              <Link class="nav-link" to="/map">Map</Link>
              <Link class="nav-link" to="/locations">Locations</Link>
              <Link class="nav-link" to="/events">Events</Link>
              <div style = {{ position : "absolute", top: 0, right: '60pt', maxWidth: '50vw', display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div>Last Updated Time: {this.state.updatedTime}</div>
                <div style={{ display: "flex", alignmItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ marginRight: "10px"}}>Welcome Back!</div>
                    <div>{username} </div>
                  </div>
                  <button onClick = { handleLogout } style={{ marginLeft: "auto", padding: "3px", margin: "3px", height: "80%", backgroundColor: '#e89c3f'}}>Logout</button>
                </div>
              </div>
              {/*<Link class="nav-link" to="/search">Search</Link>*/}
              </div>
            </div>
          </div>
          
        </nav>
    )
  }
  }
  export default NavBar;
