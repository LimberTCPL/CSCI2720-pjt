import React, { Component } from 'react';
import '../style.css';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedEvents: []
    };
  }

  handleEdit = (event) => {
    const editedEvent = { ...event };
    editedEvent.isEditing = true;

    this.setState((prevState) => ({
      editedEvents: [...prevState.editedEvents, editedEvent],
    }));
  };

  handleChange = (event, field, e) => {
    const updatedValue = e.target.value;
    const { editedEvents } = this.state;
    const updatedEvents = editedEvents.map((editedEvent) => {
      if (editedEvent._id === event._id) {
        return { ...editedEvent, [field]: updatedValue };
      }
      return editedEvent;
    });

    this.setState({
      editedEvents: updatedEvents,
    });
  };

  handleSave = (event) => {
    const { editedEvents } = this.state;
    const editedEvent = editedEvents.find((editedEvent) => editedEvent._id === event._id);

    if (editedEvent) {
      const { title,venueID,date,description,presenter,priceInStr,priceInNum } = editedEvent;
      this.props.updateEvent(event._id, { title,venueID,date,description,presenter,priceInStr,priceInNum });
      this.setState((prevState) => ({
        editedEvents: prevState.editedEvents.filter((e) => e._id !== event._id),
      }));
    }
  };

  render() {
    const { events, deleteEvent} = this.props;
    const { editedEvents } = this.state;

    return (
      
      events && events.length > 0 && (
        <div class="evet-list">
          <h2 style={{ textAlign: 'center' }}>Events:</h2>
          <br/>
          <ul class="list-group">
            {events.map((event) => {
              const editedEvent = editedEvents.find((editedEvent) => editedEvent._id === event._id);

              return (
                <li key={event._id}>
                  <span>
                    Event ID: {event.eventID}
                    <br/> 
                    Event Name:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.title}
                        onChange={(e) => this.handleChange(event, 'title', e)}
                      />
                    ) : (
                      event.title
                    )}
                    <br/> 
                    Date and Time:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.date}
                        onChange={(e) => this.handleChange(event, 'date', e)}
                      />
                    ) : (
                      event.date
                    )}
                    <br/> 
                    Description:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.description}
                        onChange={(e) => this.handleChange(event, 'description', e)}
                      />
                    ) : (
                      event.description
                    )}
                    <br/> 
                    Presenter:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.presenter}
                        onChange={(e) => this.handleChange(event, 'presenter', e)}
                      />
                    ) : (
                      event.presenter
                    )}
                    <br/> 
                    Price:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.priceInNum}
                        onChange={(e) => this.handleChange(event, 'priceInNum', e)}
                      />
                    ) : (
                      event.priceInNum
                    )}
                  </span>
                  {editedEvent && editedEvent.isEditing ? (
                    <button style={{ display: 'inline-block' }}  onClick={() => this.handleSave(event)}>Save & Update</button>
                  ) : (
                    <button style={{ display: 'inline-block' }} onClick={() => this.handleEdit(event)}>Edit</button>
                  )}
                  <button  style={{ display: 'inline-block' }} onClick={() => deleteEvent(event._id)}>Delete</button>
                </li>
              );
            })}
          </ul>
        </div>
      )
    );
  }
}

export default EventList;