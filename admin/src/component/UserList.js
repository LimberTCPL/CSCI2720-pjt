import React, { Component } from 'react';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedUsers: [],
    };
  }

  handleEdit = (user) => {
    const editedUser = { ...user };
    editedUser.isEditing = true;

    this.setState((prevState) => ({
      editedUsers: [...prevState.editedUsers, editedUser],
    }));
  };

  handleChange = (user, field, e) => {
    const updatedValue = e.target.value;
    const { editedUsers } = this.state;
    const updatedUsers = editedUsers.map((editedUser) => {
      if (editedUser._id === user._id) {
        return { ...editedUser, [field]: updatedValue };
      }
      return editedUser;
    });

    this.setState({
      editedUsers: updatedUsers,
    });
  };

  handleSave = (user) => {
    const { editedUsers } = this.state;
    const editedUser = editedUsers.find((editedUser) => editedUser._id === user._id);

    if (editedUser) {
      const { username, password} = editedUser;
      this.props.updateUser(user._id, { username, password});
      this.setState((prevState) => ({
        editedUsers: prevState.editedUsers.filter((u) => u._id !== user._id),
      }));
    }
  };

  render() {
    const { users, deleteUser } = this.props;
    const { editedUsers } = this.state;

    return (
      users && users.length > 0 && (
        <div>
          <h2>Users:</h2>
          <ul>
            {users.map((user) => {
              const editedUser = editedUsers.find((editedUser) => editedUser._id === user._id);

              return (
                <li key={user._id}>
                  <span>
                    User ID: {user.username}, Name:{' '}
                    {editedUser && editedUser.isEditing ? (
                      <input
                        type="text"
                        value={editedUser.username}
                        onChange={(e) => this.handleChange(user, 'username', e)}
                      />
                    ) : (
                      user.username
                    )}, Password:{' '}
                    {editedUser && editedUser.isEditing ? (
                      <input
                        type="password"
                        value={editedUser.password}
                        onChange={(e) => this.handleChange(user, 'password', e)}
                      />
                    ) : (
                      user.password
                    )}
                  </span>
                  {editedUser && editedUser.isEditing ? (
                    <button onClick={() => this.handleSave(user)}>Save & Update</button>
                  ) : (
                    <button onClick={() => this.handleEdit(user)}>Edit</button>
                  )}
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
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