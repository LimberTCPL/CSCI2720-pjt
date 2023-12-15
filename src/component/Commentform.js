import React, { Component } from 'react';
import '../style.css';

class Commentform extends Component{
    constructor(props){
      super(props);
      this.state={
        comment: '',
        locID: 0,
        date: '',
        //loc: 0
        commentset: []
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
      this.setState({ [e.target.name]: e.target.value })      
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      this.setState({locID: this.props.locationID});
      this.setState({date: new Date().toLocaleString(),});
      const newcomment = {
        comment: this.state.comment,
        username: this.props.username,
        locID: this.state.locID,
        date: this.state.date
      }
      
      try {
      const response = await fetch('http://localhost:5001/comment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newcomment)
      });

      this.fetchComment();
      } catch (error) {
        console.error(error);
        alert('Something went wrong');
      }
      
    }

    componentDidMount() {
      this.fetchComment();
    }
  
    fetchComment = async () => {
      try {
        let tempcomment = [];
        //this.setState({locID: this.props.locationID});
        const locationID = window.location.pathname.split('/')[2]
        //console.log(locationID)
        const response = await fetch(`http://localhost:5001/listcomment/${locationID}`,{
        method: 'GET',
        });
          let data = await response.json();
          data.forEach(element => {
            tempcomment.push(
              <>
              <div class="card">
                <div class="card-body">
                <p>{element.comment}</p>
                <div class="d-flex justify-content-between">
                  <div class="d-flex flex-row align-items-center">
                  <p class="small mb-0 ms-2">{element.user}</p>
                  </div>
                <div class="d-flex flex-row align-items-center">
                <p class="small text-muted mb-0">{element.date}</p>
                </div>
              </div>
            </div>
          </div>
              <br />
              </>
            )
          })
          this.setState({commentset: tempcomment})
      } catch (error) {
        console.error(error);
        alert('any');
      }
    };
    render(){
      return(
        <>
        <div class="row d-flex justify-content-center">
          <div class="col-md-8 col-lg-6">
              <div class="card-body p-4">
                <div class="form-outline mb-4">
                  <label class="form-label"><h2>Comment</h2></label>
                </div>
                {this.state.commentset}
              </div>
          </div>
        </div>
        
        <hr></hr>
        <h6>Leave your comment:</h6>
        <form id="comment" onSubmit={this.handleSubmit} >
          <div className="mb-3">
          <textarea type="text" className="form-control" name="comment" onChange={this.handleChange} placeholder="Share your thought" required/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </>
      )
    }
  }

  export default Commentform;
