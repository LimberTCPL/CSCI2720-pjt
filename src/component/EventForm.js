import React, { Component } from 'react';
import '../style.css';

class EventForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      date: '',
      description: '',
      presenter: '',
      priceInNum: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {title, date, description, presenter, priceInNum } = this.state;
    if (title.trim() && date.trim() && description.trim() && presenter.trim() && priceInNum.trim()) {
      this.props.addEvent({title, date, description, presenter, priceInNum });
      this.setState({
        title: '',
        date: '',
        description: '',
        presenter: '',
        priceInNum: ''
      });
    } else {
      alert('Please fill in all the fields');
    }
  };

  render() {
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
          <label htmlFor="priceInNum">Price:</label>
          <input
            type="text"
            id="priceInNum"
            name="priceInNum"
            value={this.state.priceInNum}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    );
  }
}

export default EventForm;