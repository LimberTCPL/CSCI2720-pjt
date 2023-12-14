import React, { Component } from 'react';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    addUserEvent = async (eventData) => {
        try {
            const response = await fetch('http://localhost:5001/register', {
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

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        if (username.trim() && password.trim()) {
            this.addUserEvent({ username, password });
            this.setState({ username: '', password: '' });
        } else {
            alert('Please fill in all the fields');
        }
    };

    render() {
        return (
            <form className="event-form" onSubmit={this.handleSubmit}>
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
                <button type="submit" style={{ display: 'block' }} >Create</button>
            </form>
        );
    }
}

export default Register;