import React, { Component } from 'react';
import '../style.css';

class EventForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      date: '',
      venueID: '',
      description: '',
      presenter: '',
      priceInStr: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, date, venueID, description, presenter, priceInStr } = this.state;

    // Check if all fields are filled
    if (title.trim() && date.trim() && venueID.trim() && description.trim() && presenter.trim() && priceInStr.trim()) {
      this.props.addEvent({
        title,
        date,
        venueID,
        description,
        presenter,
        priceInStr,
      });
      this.setState({
        title: '',
        date: '',
        venueID: '',
        description: '',
        presenter: '',
        priceInStr: '',
      });
    } else {
      alert('Please fill in all the fields');
    }
  };

  render() {
    const { locations } = this.props;
    return (
      <form className="event-form" onSubmit={this.handleSubmit}>
        <h2>Create Event</h2>
        <div className='form-group'>
          <label htmlFor="title">Event Name:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="date">Date and Time:</label>
          <input
            type="text"
            id="date"
            name="date"
            value={this.state.date}
            onChange={this.handleChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="venueID">Venue:</label>
          <select id="venueID" name="venueID" value={this.state.venueID} onChange={this.handleChange} style={{ width: "95%" }}>
            <option value="">Select Venue</option>
            {locations.map(location => (
              <option key={location.locationID} value={location.locationID}>{location.location}</option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="presenter">Presenter:</label>
          <input
            type="text"
            id="presenter"
            name="presenter"
            value={this.state.presenter}
            onChange={this.handleChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="priceInStr">Price (e.g., $100, $200, $300):</label>
          <input
            type="text"
            id="priceInStr"
            name="priceInStr"
            value={this.state.priceInStr}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    );
  }
}

export default EventForm;
