import React, { Component } from 'react';

class UserList extends Component {
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
      if (editedEvent.username === event.username) {
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
    const editedEvent = editedEvents.find((editedEvent) => editedEvent.username === event.username);

    if (editedEvent) {
      const { username, password,role } = editedEvent;
      this.props.updateUser(event.username, { username, password,role });
      this.setState((prevState) => ({
        editedEvents: prevState.editedEvents.filter((e) => e.username !== event.username),
      }));
    }
  };

  render() {
    const { userEvents, deleteUserEvent } = this.props;
    const { editedEvents } = this.state;

    return (
      userEvents && userEvents.length > 0 && (
        <div class="evet-list" style={{width: '50vw', position: 'absolute'}}>
          <h2 style={{ textAlign: 'center' }}>User:</h2>
          <ul class="list-group">
            {userEvents.map((event) => {
              const editedEvent = editedEvents.find((editedEvent) => editedEvent.username === event.username);

              return (
                <li class="list-group-item" key={event.username} style={{width: '45vw'}}>
                  <span>
                    Username: {event.username}
                    <br/>
                    Password:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.password}
                        onChange={(e) => this.handleChange(event, 'password', e)}
                      />
                    ) : (
                      event.password
                    )}
                    <br/>
                    Role:{' '}
                    {editedEvent && editedEvent.isEditing ? (
                      <input
                        type="text"
                        value={editedEvent.role}
                        onChange={(e) => this.handleChange(event, 'role', e)}
                      />
                    ) : (
                      event.role
                    )}
                  </span>
                  {editedEvent && editedEvent.isEditing ? (
                    <button onClick={() => this.handleSave(event)}>Save & Update</button>
                  ) : (
                    <button  style={{ display: 'inline-block' }} onClick={() => this.handleEdit(event)}>Edit</button>
                  )}
                  <button  style={{ display: 'inline-block' }} onClick={() => deleteUserEvent(event.username)}>Delete</button>
                </li>
              );
            })}
          </ul>
        </div>
      )
    );
  }
}

export default UserList;