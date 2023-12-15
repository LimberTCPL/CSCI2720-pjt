import React, { Component } from 'react';

class UserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      role: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, role } = this.state;
    if (username.trim() && password.trim() && role.trim()) {
      this.props.addUserEvent({ username, password, role });
      this.setState({ username: '', password: '', role: '' });
    } else {
      alert('Please fill in all the fields');
    }
  };

  render() {
    return (
      <form className="event-form" onSubmit={this.handleSubmit} style={{width: '20vw'}}>
        <h2>Edit User</h2>
        <div className='form-group'>
          <label htmlFor="username">username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="password">password:</label>
          <input
            type="text"
            id="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </div>
        <div className='form-group' style={{display: 'inline-block',padding: '5px'}}>
          <input
            type="radio"
            id="admin"
            name="role"
            value="Admin"
            checked={this.state.role === "Admin"}
            onChange={this.handleChange}
          />
          <label htmlFor="admin">Admin</label>
        </div>

        <div className='form-group' style={{display: 'inline-block'}}>
          <input
            type="radio"
            id="user"
            name="role"
            value="User"
            checked={this.state.role === "User"}
            onChange={this.handleChange}
          />
          <label htmlFor="user">User</label>
        </div>
        <button type="submit" style={{display: 'block'}} >Create</button>
      </form>
    );
  }
}

export default UserForm;