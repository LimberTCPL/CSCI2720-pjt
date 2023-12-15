import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../style.css';

class FavoriteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          locations: [],
          username: this.props.username,
        }
    }
    componentDidMount() {
      this.fetchLocations();
    }
  
    componentWillUnmount() {
      $('#locationTable').DataTable().destroy();
    }
    
    async fetchLocations() {
      fetch('http://localhost:5001/favoriteLocations', { 
        method: "POST", 
        mode: "cors", 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        }, 
        body: JSON.stringify({
          'username': this.state.username,
        })
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ locations: data }, () => {
          $('#locationTable').DataTable({
            data: this.state.locations,
            columns: [
              { data: 'location',
                render: function (data, type, row) {
                  if (type === "display") {
                    return `<a href="/locations/${row.locationID}">${data}</a>`; // Insert links to single locations
                  }
                  return data;
                }
              },
              { data: 'eventCount', className: "text-center" }
            ],
            paging: false
          });
        })
      })
      .catch((error) => {
        console.log(error);
      })
    }
    
    render() {
      return (
        <div class="m-4">
          <h2>My Favorite Locations</h2>
          <hr /><Link style={{display:'inline-block', position:'absolute', zIndex:'1'}} to="/locations" ><button type="button" style={{backgroundColor: '#3c8cba', zIndex:'-1'}}><i class="bi bi-box-arrow-left"></i></button></Link>
          <table id="locationTable" class="p-2 table table-bordered table-striped table-sm table-light">
            <thead>
              <tr>
                <th class="text-center">Locations</th>
                <th class="text-center">Number of Events</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      )
    }
}



export default FavoriteList;