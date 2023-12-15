import React, { Component } from 'react';
import EventForm from './EventForm';
import EventList from './EventList';
import '../style.css';

class EventBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      locations:[],
    };
  }

  componentDidMount() {
    this.fetchEvents();
    this.fetchLocations();
  }

  fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5001/locations');
      if (response.ok) {
        const data = await response.json();
        this.setState({ locations: data });
      } else {
        throw new Error('Failed to fetch locationss');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/adminevents');
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

  addEvent = async (eventData) => {
    console.log("addEvent:",eventData);
    console.log("type:",typeof(eventData));
    try {
      const response = await fetch('http://localhost:5001/adminevents', {
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

  deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5001/adminevents/${eventId}`, {
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

  updateEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`http://localhost:5001/adminevents/${eventId}`, {
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

  render() {
    return (
      <>
        <EventForm locations={this.state.locations} addEvent={this.addEvent} />
        <EventList events={this.state.events} deleteEvent={this.deleteEvent} updateEvent={this.updateEvent}/>
      </>
    );
  }
}

export default EventBox;