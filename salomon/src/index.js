import ReactDOM from "react-dom/client";
import React from 'react';
import {BrowserRouter, Routes, Route, Link, useLocation} from 'react-router-dom';

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>
        {' '}
        No Match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

class App extends React.Component {
    render() {
      return(
        <BrowserRouter>
        <div>
          <ul>
            <li>
              {' '}
              <Link to="/">Home</Link>{' '}
            </li>
            <li>
              {' '}
              <Link to="/search">Search</Link>{' '}
            </li>
          </ul>
        </div>
        <hr/>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
      )
    }
}

class Home extends React.Component {
    render() {
        return (
            <>
            <h2>home</h2>
            </>
        )
    }
}

class Search extends React.Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this)
    this.state = {results: [ {
      locationID: 0,
      location: 'Failed to fetch data from the database',
      latitude: 0,
      longitude: 0 }]}
  }

  handleChange(results) {
    this.setState({results: results}) //state lifted from <SearchBar/>
  }

  render() {
    return (
      <div> 
      <SearchBar onResultsChange={this.handleChange /*by passing this function as para, allowing the lifting of state from <SearchBar/> up to <Search/>*/}/> 
      <SearchResults results={this.state.results}/>
      </div>
    )
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {isValid: 1};
  }

  componentDidMount(){
    this.handleSearch()
  }

  handleChange(results) {
    this.props.onResultsChange(results) //Lifting state up step 2 
  }

  handleSearch() {
      let target = document.getElementById("locationSearch").value; 
      //console.log(target)
      const validExpression = /^[A-Za-z()\ ]*$/;
      if (validExpression.test(target)) {
        this.setState({isValid: 1});
        this.getLocations(target).then((data) => {
          const results = data;
          this.handleChange(results);//Lifting state up step 1 (go to step 2)
        });
      }else{
        this.setState({isValid: 0})
        
      }
    };
    

 async getLocations(target) { //accepts a string, outputs a json of location results
      const param = {"name": target};
      const response = await fetch("http://localhost:5000/locations", { 
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
        <p  id="invalidMessage" style={{visibility: this.state.isValid ? "hidden" : "visible", color: "red"} }> Allowed Characters: A-Z, a-z, (, ), space </p>
        </div>
        //onChange: when the content of the search box changes, we update the search results accordingly [DONE]
        //to do: make a list that shows [Below, <SearchResults/>] [DONE]
    )
}
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {contents: []}
  }
  static getDerivedStateFromProps(props, state){ //this function gets called when there is a change in the props of this component
    let tempContents = [];
    if (props.results[0]){ //when the search keywords have match, then true; if no match, the props.results will be empty, so props.results[0] will be undefined = false
    let results = props.results
    //console.log(results)
      results.forEach(element => {
        tempContents.push(
          <tr>
            <td>{element.location}</td>
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
  
  //TODO: Display results
  render() {
    return(
    <div name="searchResults" onClick={() => console.log(this.state.results)}>
    <table>
      <tr>
        <th style={{width: '500px'}}>
          Location
        </th>
        <th style={{width: '100px'}}>
          Latitude
        </th>
        <th style={{width: '100px'}}>
          Longitude
        </th>
      </tr>
      {this.state.contents}
    </table>
  </div>
    );
  }
}


const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App name="test"/>);