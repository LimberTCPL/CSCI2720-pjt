import React, { Component } from 'react';
import '../style.css';

class Commentform extends Component{
    constructor(props){
      super(props);
      this.state={
        comment: '',
        user: '',//wait for props.userid
        locID: 0,
        date: '',
        //loc: 0
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
      this.setState({ [e.target.name]: e.target.value })      
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      await this.setState({locID: this.props.locationID});
      await this.setState({date: new Date().toLocaleString(),});
      const newcomment = {
        comment: this.state.comment,
        username: this.state.username,
        locID: this.state.locID,
        date: this.state.date
      }
      console.log(newcomment)
      
      try {
      const response = await fetch('http://localhost:5001/comment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newcomment)
      });
      } catch (error) {
        console.error(error);
        alert('Something went wrong');
      }
    }
    render(){
      return(
        <>
        <h6>Leave your comment:</h6>
        <form id="comment" onSubmit={this.handleSubmit} >
        <div className="mb-3">
          <label htmlFor="username" className="form-label">User: </label>
          <input type="text" className="form-control" value={this.state.username} name="username" onChange={this.handleChange}></input>
          </div>
          <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment: </label>
          <textarea type="text" className="form-control" name="comment" onChange={this.handleChange} placeholder="Share your thought" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </>
      )
    }
  }

  export default Commentform;