import React from 'react';
import UserBox from './UserBox';
import EventBox from './EventBox';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import '../style.css';

class Admin extends ReactComponent {

  render() {
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