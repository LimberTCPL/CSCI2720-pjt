import React, { Component } from 'react';
import UserBox from './component/UserBox';
import EventBox from './component/EventBox';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import './style.css';

class Admin extends Component {

  render() {
    const {username,handleLogout} = this.props;
    return (
      <>
        <h1>Admin Management System</h1>
        <BrowserRouter>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <Link class="nav-link" to="/">Event</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/user">User</Link>
              </li>
            </ul>
            <hr />
          </div>
          <div style = {{ position : "absolute", top: 0, right: 0 }}>
                <div>Hello, {username}. Welcome Back!</div>
                <button onClick = { handleLogout }>Logout</button>
              </div>
        </nav>

        <Routes>
          <Route path="/" element={<EventBox />} />
          <Route path="/user" element={<UserBox />} />
        </Routes>
      </BrowserRouter>
      </>
    );
  }
}

export default Admin;