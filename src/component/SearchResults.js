import React, { Component } from 'react';
import '../style.css';

class SearchResults extends Component {
    constructor(props) {
      super(props);
      this.state = {contents: []}
    }
    static getDerivedStateFromProps(props){ //this function gets called when there is a change in the props of this component
      let tempContents = [];
      if (props.results[0]){ //when the search keywords have match, then true; if no match, the props.results will be empty, so props.results[0] will be undefined = false
      let results = props.results
      //console.log(results)
        results.forEach(element => {
          tempContents.push(
            <tr>
              <td><a href={"/locations/" + element.locationID}>{element.location}</a></td>
              <td>{element.latitude}</td>
              <td>{element.longitude}</td>
            </tr>
          )
          //console.log(element.location)
        })}else{
          tempContents.push(
          <tr>
            <td style={{color: "red"}}>No Match</td>
            <td></td>
            <td></td>
          </tr>)
        }
          return {contents: tempContents}
    }
    
    render() {
      return(
      <div name="searchResults" onClick={() => console.log(this.state.results)}>
        <table class="table">
        <thead>
          <tr>
            <th>
              Location
            </th>
            <th>
              Latitude
            </th>
            <th>
              Longitude
            </th>
          </tr>
          </thead>
          <tbody>
            {this.state.contents}
          </tbody>
        </table>
      </div>
      );
    }
  }

  export default SearchResults;