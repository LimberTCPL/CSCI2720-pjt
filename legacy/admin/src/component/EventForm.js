import React,  { Component } from 'react';

class EventForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      eventID: '',
      location: '',
      quota: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { eventID, location, quota } = this.state;
    if (eventID.trim() && location.trim() && quota.trim()) {
      this.props.addEvent({ eventID, location, quota });
      this.setState({ eventID: '', location: '', quota: '' });
    } else {
      alert('Please fill in all the fields');
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Create Event</h2>
        <div>
          <label htmlFor="eventID">eventID:</label>
          <input
            type="text"
            id="eventID"
            name="eventID"
            value={this.state.eventID}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="quota">Quota:</label>
          <input
            type="text"
            id="quota"
            name="quota"
            value={this.state.quota}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    );
  }
}

export default EventForm;