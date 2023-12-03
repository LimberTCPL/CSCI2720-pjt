import React, { Component } from 'react';
import EventForm from './component/EventForm';
import EventList from './component/EventList';
import UserEventForm from './component/UserForm';
import UserEventList from './component/UserList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      userEvents: [],
    };
  }

  componentDidMount() {
    this.fetchEvents();
    this.fetchUserEvents();
  }

  fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events');
      if (response.ok) {
        const data = await response.json();
        this.setState({ events: data });
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

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

  addEvent = async (eventData) => {
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('Event created successfully');
        this.fetchEvents();
      } else {
        throw new Error('Failed to create event');
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

  deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3001/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('Event deleted successfully');
        this.fetchEvents();
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  deleteUserEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3001/userevents/${eventId}`, {
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

  updateEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`http://localhost:3001/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('Event updated successfully');
        this.fetchEvents();
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  updateUserEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`http://localhost:3001/userevents/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
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
        <h1>Admin Management System</h1>
        <EventForm addEvent={this.addEvent} />
        <EventList events={this.state.events} deleteEvent={this.deleteEvent} updateEvent={this.updateEvent}/>
        <UserEventForm addUserEvent={this.addUserEvent} />
        <UserEventList userEvents={this.state.userEvents} deleteUserEvent={this.deleteUserEvent} updateUser={this.updateUserEvent}/>
      </>
    );
  }
}

export default App;