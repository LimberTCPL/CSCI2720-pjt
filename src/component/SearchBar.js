import React, { Component } from 'react';
import '../style.css';

class SearchBar extends Component {
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this);
      this.state = {isValid: 1};
    }
  
    componentDidMount(){
      this.handleSearch();
    }
  
    handleChange(results) {
      this.props.onResultsChange(results); // Lifting state up step 2 
    }
  
    handleSearch() {
      let target = document.getElementById("locationSearch").value; 
      //console.log(target)
      const validExpression = /^[A-Za-z()\ ]*$/;
      if (validExpression.test(target)) {
        this.setState({isValid: 1});
        this.getLocations(target).then((data) => {
          const results = data;
          this.handleChange(results); // Lifting state up step 1 (go to step 2)
        });
      } else {
        this.setState({isValid: 0});
      }
    };
      
   async getLocations(target) { //accepts a string, outputs a json of location results
        const param = {"name": target};
        const response = await fetch("http://localhost:5001/search", { 
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
  
    //add functionality to display all locations upon load [DONE]
    
    render() {
      return (
          <div name="">
          <label for="locationSearch">Search for location: &nbsp; </label>
          <input  type="search" id="locationSearch" name="locationSearch" onChange={this.handleSearch}></input>
          <p id="invalidMessage" style={{visibility: this.state.isValid ? "hidden" : "visible", color: "red"} }> Allowed Characters: A-Z, a-z, (, ), space </p>
          </div>
          //onChange: when the content of the search box changes, we update the search results accordingly [DONE]
          //to do: make a list that shows [Below, <SearchResults/>] [DONE]
      )
  }
  }
  export default SearchBar;