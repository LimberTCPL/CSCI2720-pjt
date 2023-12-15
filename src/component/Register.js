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
                alert('User created successfully');
                this.fetchUserEvents();
            } else {
                throw new Error('Failed to create user event');
            }
        } catch (error) {
            console.error(error);
            alert('The username has been registered');
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

    refresh = (e) => {
        window.location.reload();
    };

    render() {
        return (
            <div id='login' className="row d-flex justify-content-center ">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-0 border">
                        <div className="card-body p-4">
                            <div className="form-outline mb-4">
                                <form onSubmit={this.handleSubmit}>
                                    <h2>New User</h2>
                                    <div >
                                        <label htmlFor="username">Username:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div >
                                        <label htmlFor="password">Password:</label>
                                        <input
                                            type="text"
                                            id="password"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <button type="submit" style={{ display: 'block', padding: '5px', margin: '5px' }}>
                                        Create
                                    </button>
                                    <button type="button" onClick={this.refresh} style={{ padding: '5px', margin: '5px' }}>
                                        Back
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;