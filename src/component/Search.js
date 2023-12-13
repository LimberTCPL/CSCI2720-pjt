import React, { Component } from 'react';
import '../style.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

class Search extends Component {
    constructor() {
      super();
      this.handleChange = this.handleChange.bind(this)
      this.state = {results: [ {
        locationID: 0,
        location: 'Failed to fetch data from the database',
        latitude: 0,
        longitude: 0 }]}
    }
  
    handleChange(results) {
      this.setState({results: results}) // state lifted from <SearchBar/>
    }
  
    render() {
      return (
        <div>
          <h2>Search</h2>
          <SearchBar onResultsChange={this.handleChange /*by passing this function as para, allowing the lifting of state from <SearchBar/> up to <Search/>*/}/> 
          <SearchResults results={this.state.results}/>
        </div>
      )
    }
  }

  export default Search;