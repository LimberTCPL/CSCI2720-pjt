import React, { Component } from 'react';

import '../style.css';
class FilterEventBar extends Component {
    constructor(props) {
      super(props);
      this.handleFilter = this.handleFilter.bind(this);
      this.state = { isValid: 1 };
    }
  
    componentDidMount(){
      this.handleFilter();
    }
  
    handleChange(results) {
      this.props.onResultsChange(results); // Lifting state up step 2 
    }
  
    handleFilter() {
      let price = document.getElementById("eventFilter").value;
      //console.log(target);
  
      const validExpression = /^\d*$/;
  
      if (validExpression.test(price)) {
        this.setState({ isValid: 1 });
        this.getEvents(price).then((data) => {
          const results = data;
          this.handleChange(results); // Lifting state up step 1 (go to step 2)
        });
      } else {
        this.setState({ isValid: 0 });
      }
    }
  
    async getEvents(price) { // accepts a number, outputs a json of event results
      const param = {"price": price};
      const response = await fetch("http://localhost:5001/events", { 
        method: "POST",
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(param)
      });
  
      let data = await response.json();
      return data;
    }
  
    render() {
      return (
        <div name="" style={{ display: 'flex', alignItems: 'center' }}>
          <label for="eventFilter">Filter for Events with Price Under $ &nbsp; </label>
          <input  type="search" id="eventFilter" name="eventFilter" onChange={this.handleFilter}></input>
          <p id="invalidMessage" style={{visibility: this.state.isValid ? "hidden" : "visible", color: "red"} }> Only numbers are allowed </p>
        </div>
        // onChange: when the content of the filter box changes, we update the filtered results accordingly
      )
    }
  }

  export default FilterEventBar;