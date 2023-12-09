import React, { Component } from 'react';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedEvents: [],
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
      const { location, quota } = editedEvent;
      this.props.updateEvent(event._id, { location, quota });
      this.setState((prevState) => ({
        editedEvents: prevState.editedEvents.filter((e) => e._id !== event._id),
      }));
    }
  };

  render() {
    const { events, deleteEvent } = this.props;
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
                    Location:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.location}
                        onChange={(e) => this.handleChange(event, 'location', e)}
                      />
                    ) : (
                      event.location
                    )}
                    <br/> 
                    Quota:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.quota}
                        onChange={(e) => this.handleChange(event, 'quota', e)}
                      />
                    ) : (
                      event.quota
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