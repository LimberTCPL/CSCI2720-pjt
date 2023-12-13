import React, { Component } from 'react';
import '../style.css';

class Commentlist extends Component{
    constructor(props){
      super(props);
      this.state={
        commentset: []
      }
    }
    componentDidMount() {
      console.log('start')
      this.fetchComment();
    }
  
    fetchComment = async () => {
      try {
        let tempcomment = [];
        //this.setState({locID: this.props.locationID});
        const locationID = window.location.pathname.split('/')[2]
        console.log(locationID)
        const response = await fetch(`http://localhost:5001/listcomment/${locationID}`,{
        method: 'GET',
        });
          let data = await response.json();
          console.log(data)
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
      const { commentset } = this.state;
      return(
        <>
        <div class="row d-flex justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card shadow-0 border">
              <div class="card-body p-4">
                <div class="form-outline mb-4">
                  <label class="form-label"><h2>Comment</h2></label>
                </div>
                {this.state.commentset}
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        </>
      )
    }
  }
  
  export default Commentlist;