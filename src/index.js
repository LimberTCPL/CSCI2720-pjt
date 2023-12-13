
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Admin from './Admin';
import User from './User';
import ReactDOM from 'react-dom'; 

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get the access token from the cookies when the page loads
    const token = Cookies.get('accessToken');
    if (token) {
      setAccessToken(token);
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      setUsername(payload.username);
      if (payload.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []); // The empty array means this effect runs once when the component mounts


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/login', {
        username: e.target.username.value,
        password: e.target.password.value,
      });
      
      var responseData = response.data;

      setAccessToken(responseData.accessToken);
      setRefreshToken(responseData.refreshToken);

      const base64Url = responseData.accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      setUsername(payload.username);
      if (payload.role === 'admin') {
        setIsAdmin(true);
      }
      Cookies.set('accessToken', responseData.accessToken, { expires: 1 }); // The token will expire after 7 days
    } catch (err) {
        alert("Wrong username or password")
        e.target.username.value ='';
        e.target.password.value ='';
    }

    
  };

  const handleRefresh = async () => {
    const { responseData } = await axios.post('http://localhost:5001/refresh', {
      token: refreshToken,
    });

    setAccessToken(responseData.accessToken);
    
    const base64Url = responseData.accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    setUsername(payload.username);
    if (payload.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:5001/logout', {
      token: refreshToken,
    });

    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setIsAdmin(false);

    Cookies.remove('accessToken');
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
  });

  return (
    <div>
      {!accessToken ? (
            <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Type your username" />
          <input type="password" name="password" placeholder="Type your password" />
          <button type="submit">Login</button>
        </form>

      ) : (
        <>
          {isAdmin ? (

            <Admin username={username} handleLogout={handleLogout} />
          ) : (
            <User name="Map for Cultural Programmes" username={username} handleLogout={handleLogout} />
          )}
        </>
      )}
    </div>
  );
};


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);