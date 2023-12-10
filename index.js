import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favouriteLocations, setFavouriteLocations] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { responeData } = await axios.post('http://localhost:3001/login', {
      username: e.target.username.value,
      userpassword: e.target.userpassword.value,
    });

    setAccessToken(responeData.accessToken);
    setRefreshToken(responeData.refreshToken);
    setUsername(user.username);
    setIsAdmin(user.role === 'admin');
  };

  const handleRefresh = async () => {
    const { responeData } = await axios.post('http://localhost:3001/refresh', {
      token: refreshToken,
    });

    setAccessToken(responeData.accessToken);
    setUsername(user.username);
    setIsAdmin(user.role === 'admin');
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:3001/logout', {
      token: refreshToken,
    });

    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    // process this every 5 min
    const interval = setInterval(async () => {
      try {
        await handleRefresh();
      } 
      catch (err) {
        console.error(err);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [accessToken]);

  const addLocation = () => {
    const location = prompt("Enter a location into your favourite list");
    if (location) {
      setFavouriteLocations(prevLocations => [...prevLocations, location]);
    }
  };

  return (
    <div>
      {!accessToken ? (
        <form onSubmit = { handleLogin }>
        <input type="text" name="username" placeholder="Type your username" />
        <input type="password" name="userpassword" placeholder="Tyoe your password" />
        <button type="submit">Login</button>
        </form>
      ) : (
        <div style = {{ position : "absolute", top: 0, right: 0 }}>
          <div>Hello, {username}. Welcome Back!</div>
          <button onClick = { handleLogout }>Logout</button>
        </div>
      )}
      {isAdmin && <div>Admin Function Page</div>}
      {!isAdmin && 
      <div>
        <div>Main Page</div>
        <div>
          <button onClick={ addLocation }>Add Location</button> 
          <h2>Favourite Locations</h2>
          <ul>
            {favouriteLocations.map((location, index) => (
            <li key={index}>{location}</li>))}
          </ul>
        </div>
      </div>}
    </div>
  );
};

export default App;