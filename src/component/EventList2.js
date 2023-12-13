import React, { Component } from 'react';
import $ from 'jquery';
import '../style.css';

class EventList2 extends Component {
    constructor(props) {
      super(props);
      this.state = { results: props.results };
    }
  
    static getDerivedStateFromProps(props){ // this function gets called when there is a change in the props of this component
      return { results: props.results };
    }
  
    componentDidUpdate() {
      $('#eventTable').DataTable().destroy();
      
      console.log(this.state.results);
  
      $('#eventTable').DataTable({
        data: this.state.results,
        columns: [
          { data: 'title' },
          { data: 'venueID.location',
            render: function (data, type, row) {
              if (type === "display") {
                return `<a href="/locations/${row.venueID.locationID}">${data}</a>`; // Insert links to single locations
              }
              return data;
            },
            visible: this.props.venueID == "" ? true : false
          },
          { data: 'date' },
          { data: 'description' },
          { data: 'presenter'},
          { data: 'priceInStr' }
        ]
      });
    }
    
    render() {
      return (
        <div>
          <table id="eventTable" class="table table-bordered table-striped table-sm table-primary">
            <thead>
              <tr>
                <th class="text-center">Event Name</th>
                <th class="text-center">Venue</th>
                <th class="text-center">Date and Time</th>
                <th class="text-center">Description</th>
                <th class="text-center">Presenter</th>
                <th class="text-center">Price</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      )
    }
  }

  export default EventList2;