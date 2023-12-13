import React, { Component } from 'react';
import '../style.css';
import FilterEventBar from './FilterEventBar';
import EventList2 from './EventList2';

class Events extends Component {
    constructor() {
      super();
      this.handleChange = this.handleChange.bind(this);
      this.state = { results: [] };
    }
  
    handleChange(results) {
      if (this.props.venueID == "") {
        this.setState({ results: results }); // state lifted from <FilterEventBar/>
        //console.log(this.state.results);
      } else {
        const filteredResults = results.filter(event => event.venueID.locationID == this.props.venueID);
        this.setState({ results: filteredResults });
      }
    }
  
    render() {
      return (
        <div class="m-4">
          <h2>{this.props.title}</h2>
          <FilterEventBar venueID={this.props.venueID} onResultsChange={this.handleChange /*by passing this function as para, allowing the lifting of state from <FilterEventBar/> up to <EventList/>*/}/> 
          <hr />
          <EventList2 venueID={this.props.venueID} results={this.state.results}/>
        </div>
      )
    }
  }

  export default Events;