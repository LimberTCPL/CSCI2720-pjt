import React, { Component } from 'react';
import UserEventForm from './UserForm';
import UserEventList from './UserList';

class UserBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEvents: [],
    };
  }

  componentDidMount() {
    this.fetchUserEvents();
  }

  fetchUserEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/userevents');
      if (response.ok) {
        const data = await response.json();
        this.setState({ userEvents: data });
      } else {
        throw new Error('Failed to fetch user events');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  addUserEvent = async (eventData) => {
    try {
      const response = await fetch('http://localhost:3001/userevents', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('User event created successfully');
        this.fetchUserEvents();
      } else {
        throw new Error('Failed to create user event');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  deleteUserEvent = async (username) => {
    try {
      const response = await fetch(`http://localhost:3001/userevents/${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('User event deleted successfully');
        this.fetchUserEvents();
      } else {
        throw new Error('Failed to delete user event');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  updateUserEvent = async (username, UsereventData) => {
    try {
      const response = await fetch(`http://localhost:3001/userevents/${username}`, {
        method: 'PUT',
        body: JSON.stringify(UsereventData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('User event updated successfully');
        this.fetchUserEvents();
      } else {
        throw new Error('Failed to update user event');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  render() {
    return (
      <>
        <UserEventForm addUserEvent={this.addUserEvent} />
        <UserEventList userEvents={this.state.userEvents} deleteUserEvent={this.deleteUserEvent} updateUser={this.updateUserEvent}/>
      </>
    );
  }
}

export default UserBox;