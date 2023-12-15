import React, { Component } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';

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
      const response = await fetch('http://localhost:5001/users');
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
      const response = await fetch('http://localhost:5001/users', {
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
      const response = await fetch(`http://localhost:5001/users/${username}`, {
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
      const response = await fetch(`http://localhost:5001/users/${username}`, {
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
      <div class="container">
        <div class="row">
        </div>
        <div class="row">
          <div class="col-4">
            <UserForm addUserEvent={this.addUserEvent} />
          </div>
          <div class="col-6">
            <UserList userEvents={this.state.userEvents} deleteUserEvent={this.deleteUserEvent} updateUser={this.updateUserEvent}/>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default UserBox;